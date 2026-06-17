# Notifications Requirements

All notifications are team-specific — players only receive alerts for their own assigned team(s). No general match spam.

Quiet hours should be respected based on the player's device timezone, since many World Cup games fall overnight for UK/European players.

---

## Match Notifications (your team only)

### Kick-Off
Sent at kick-off for the player's team. Opponent is surfaced naturally in the message — no separate "who are they playing?" notification needed.

- *"🏟️ 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England are playing now — vs 🇪🇸 Spain. Come on!"*
- *"🏟️ 🇲🇦 Morocco vs 🇫🇷 France just kicked off. Can they do it?"*

### Half-Time Score
Optional — sent at half-time for the player's team only.

- *"Half-time: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England 1–0 🇪🇸 Spain"*
- *"Half-time: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England 0–1 🇪🇸 Spain — still 45 to go."* (if losing)

### Full-Time Result
Sent at final whistle. Tone varies by outcome:

**Win (standard)**
- *"Full time: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England 2–1 🇪🇸 Spain. You earned 6pts."*

**Giant Killing**
- 1 tier above: *"Giant Killing! 🪓 🇲🇦 Morocco beat 🇫🇷 France 1–0. Bonus pts incoming."*
- 2+ tiers above: *"GIANT KILLING! 🪓🪓 🇲🇦 Morocco beat 🇧🇷 Brazil. Massive."*

**Draw**
- *"Full time: 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England 1–1 🇪🇸 Spain. A point each."*

**Loss**
- *"Full time: 🇪🇸 Spain 2–0 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England."*

### Knockout Elimination
When the player's team is knocked out.

- *"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England are out — Quarter-Final exit. You earned 34pts from your team."*

---

## Game Notifications

### Draw Completed
Sent to all players when the admin runs the draw.

- *"The draw is done! You've got 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England — check the leaderboard."*

---

## Permission Prompt (Onboarding)

iOS requires explicit user permission before any push notifications can be sent. This should be requested once, at the right moment in the onboarding flow — not too early (before the user has any context), not buried.

### Placement
After the player selects their name on the "Which player are you?" screen and taps "That's me →", show the permission prompt before landing on the leaderboard. At this point the user knows their team and understands what they're signing up for — it's the highest-motivation moment to say yes.

### Pre-prompt screen (recommended)
Show a native-feeling interstitial before triggering the iOS system alert. This gives context so the system prompt doesn't feel cold.

- Heading: *"Know when your team plays"*
- Body: *"We'll notify you when 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England kick off, the score at the whistle, and any giant killings."*
- CTA: *"Turn on notifications"* → triggers iOS permission alert
- Skip link: *"Maybe later"* → proceeds to leaderboard without requesting

Rationale: iOS only lets you ask once. A cold system alert with no context has a high denial rate. The pre-prompt improves acceptance and can be retried later (via the More screen) if the user skips.

### If denied
No retry in the same session. Surface a soft prompt in the More screen instead (see below).

---

## Notifications Settings (More screen)

A dedicated panel in the More tab letting players manage their notification preferences after onboarding.

### States

**Notifications enabled**
- List each notification type with a toggle:
  - Match kick-off — on by default
  - Half-time score — off by default (opt-in)
  - Full-time result — on by default
  - Knockout elimination — on by default
  - Draw completed — on by default (non-toggleable, or always on)
- Brief label under each toggle explaining what it covers.

**Notifications not yet requested / denied**
- Show a single panel: *"You're missing out on match alerts for your team."*
- CTA button: *"Enable notifications"* → deep links to iOS Settings for this app (since the system prompt can only be shown once).
- Don't show individual toggles — there's nothing to configure until permission is granted.

### Design notes
- Panel sits between "Game" and "Admin access" in the More screen hierarchy.
- Heading: *"Notifications"*
- No need for a master on/off toggle — iOS Settings handles that globally. Just surface the per-type controls.
- Quiet hours: consider a single toggle *"Quiet overnight"* that suppresses push between midnight–8am in the device timezone, given many games are overnight for UK players.

---

## Open Questions

- Quiet hours: build a "Quiet overnight" toggle in-app (suppress midnight–8am), or rely on iOS Focus modes doing that for users?
- Half-time — off by default (opt-in) or on by default?
- Giant Killing copy — vary tone by tier gap (one voice for 1-tier upsets, louder for 2-tier+)?
- Multi-team players (wildcard Tier 4 assignments) — one notification per team or batched?
