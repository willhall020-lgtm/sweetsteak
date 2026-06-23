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

export async function sendPush(deviceToken, { title, subtitle, body, data = {} }) {
  if (!TEAM_ID || !KEY_ID || !PRIVATE_KEY_PEM || !BUNDLE_ID) {
    console.warn('[APNs] Missing env vars — push skipped');
    return { skipped: true };
  }

  const host = PRODUCTION ? 'api.push.apple.com' : 'api.sandbox.push.apple.com';
  const jwt  = await getJwt();
  const rawPayload = JSON.stringify({
    aps: { alert: { title, subtitle: subtitle || undefined, body: body || undefined }, sound: 'default' },
    ...data,
  });

  return new Promise((resolve, reject) => {
    const session = http2.connect(`https://${host}`);
    let settled = false;
    const done = (val) => { if (!settled) { settled = true; session.destroy(); resolve(val); } };
    const fail = (err) => { if (!settled) { settled = true; session.destroy(); reject(err); } };

    session.on('error', fail);

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

    req.on('error', fail);
    req.write(rawPayload);
    req.end();

    // Safety timeout — 8s should be plenty for APNs
    const timer = setTimeout(() => done({ ok: false, status: 0, body: 'timeout' }), 8000);
    req.on('close', () => clearTimeout(timer));

    let status = 0;
    let resBody = '';
    req.on('response', h => { status = h[':status']; });
    req.on('data', chunk => { resBody += chunk; });

    // Defer resolution by one tick so :response always has a chance to set status
    // before close/end resolves — handles the non-deterministic event ordering in Node http2
    const onEnd = () => setImmediate(() =>
      done(status === 200 ? { ok: true } : { ok: false, status, body: resBody })
    );
    req.once('end', onEnd);
    req.once('close', onEnd);
  });
}
