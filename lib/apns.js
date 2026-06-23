import http2 from 'node:http2';
import crypto from 'node:crypto';

const BUNDLE_ID = process.env.APNS_BUNDLE_ID;
const TEAM_ID   = process.env.APNS_TEAM_ID;
const KEY_ID    = process.env.APNS_KEY_ID;
// P8 key stored with literal \n — replace before use
const PRIVATE_KEY_PEM = process.env.APNS_PRIVATE_KEY?.replace(/\\n/g, '\n');
const PRODUCTION = process.env.APNS_PRODUCTION === 'true';

let _cachedJwt = null;
let _cachedAt  = 0;

function pemToDer(pem) {
  const b64 = pem.replace(/-----[^\n]+\n?/g, '').replace(/\s/g, '');
  return Buffer.from(b64, 'base64');
}

async function getJwt() {
  const now = Math.floor(Date.now() / 1000);
  if (_cachedJwt && now - _cachedAt < 2700) return _cachedJwt;

  const header  = Buffer.from(JSON.stringify({ alg: 'ES256', kid: KEY_ID })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ iss: TEAM_ID, iat: now })).toString('base64url');
  const unsigned = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    'pkcs8', pemToDer(PRIVATE_KEY_PEM),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    Buffer.from(unsigned)
  );
  _cachedJwt = `${unsigned}.${Buffer.from(sig).toString('base64url')}`;
  _cachedAt = now;
  return _cachedJwt;
}

export async function sendPush(deviceToken, { title, body, data = {} }) {
  if (!TEAM_ID || !KEY_ID || !PRIVATE_KEY_PEM || !BUNDLE_ID) {
    console.warn('[APNs] Missing env vars — push skipped');
    return { skipped: true };
  }

  const host = PRODUCTION ? 'api.push.apple.com' : 'api.sandbox.push.apple.com';
  const jwt  = await getJwt();
  const rawPayload = JSON.stringify({
    aps: { alert: { title, body: body || undefined }, sound: 'default' },
    ...data,
  });

  return new Promise((resolve, reject) => {
    const session = http2.connect(`https://${host}`);
    session.on('error', err => { session.destroy(); reject(err); });
    // GOAWAY means invalid JWT or connection-level rejection
    session.on('goaway', (code) => {
      session.destroy();
      reject(new Error(`APNs GOAWAY code=${code}`));
    });

    const req = session.request({
      ':method': 'POST',
      ':path': `/3/device/${deviceToken}`,
      'authorization': `bearer ${jwt}`,
      'apns-topic': BUNDLE_ID,
      'apns-push-type': 'alert',
      'apns-priority': '10',
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(rawPayload),
    });

    req.on('error', err => { session.destroy(); reject(err); });
    req.write(rawPayload);
    req.end();

    req.once(':response', headers => {
      const status = headers[':status'];
      let resBody = '';
      req.on('data', chunk => { resBody += chunk; });
      req.on('end', () => {
        session.close();
        if (status === 200) {
          resolve({ ok: true });
        } else {
          console.error(`[APNs] ${status}:`, resBody);
          resolve({ ok: false, status, body: resBody });
        }
      });
    });
  });
}
