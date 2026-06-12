# Task: Replace tiered sweepstake draw with the "Fair Value Draw"

## Context

There is an existing single-file HTML site (`world-cup-2026-sweepstake.html`) for a World Cup 2026 sweepstake. It currently runs a draw based on fixed tiers (players draw one team per tier, leftovers go to a wildcard pot). This breaks whenever the player count doesn't divide neatly into the tiers.

Replace the draw logic with a value-balancing algorithm that is fair for **any player count from 2 to 24**, while keeping the site's existing visual style, layout, fonts, and tone. Everything stays in one self-contained HTML file with no build step and no external JS dependencies.

## The algorithm

### Team values

All 48 teams are ranked 1–48 (list below). Each team's value is:

```
value = 49 - rank        // Spain (rank 1) = 48 pts, New Zealand (rank 48) = 1 pt
```

Include a single config constant `VALUE_EXPONENT` (default `1`). Value calculation is `Math.pow(49 - rank, VALUE_EXPONENT)` so the group can switch to squared weighting (`2`) later by changing one number.

### Draw procedure

1. **Setup:** the user sets the number of players N (2–24) and enters N names (default `Player 1..N`). Empty inputs fall back to defaults. If N > 24, block the draw and show a message that fairness breaks down above 24 players.
2. **Opening round (the fun bit):** take the top N teams by rank. Shuffle the player order. Assign one of these teams to each player, blind and random. This round is revealed one pick at a time with the existing suspense animation (dots, then team name pop). A "reveal all remaining" escape hatch must exist.
3. **Balancing rounds (automatic):** iterate the remaining teams in rank order (rank N+1 down to 48). Assign each team to the player with the **lowest current total value**. Break ties uniformly at random. These assignments happen instantly after the opening round completes, with a brief staggered animation as they populate the results board (no click-per-pick — there can be 30+ of them).
4. All 48 teams must be assigned exactly once. No wildcard pot, no leftovers.

### Properties to preserve (these are the acceptance criteria)

- Sum of all team values (with exponent 1) is exactly **1176**, and the sum of every player's total equals 1176 after the draw.
- With exponent 1, final player totals must all fall within **one smallest-remaining-team-value** of each other in typical runs — in practice, max(total) − min(total) should be small relative to 1176/N. Write a quick console assertion or test loop (e.g. run the allocation 1,000 times headless for N = 2..24) verifying: every team assigned exactly once, totals sum to 1176, and spread stays tight.
- Player team counts will be **unequal by design** (the Spain holder may end with 2 teams; the Curaçao holder with 5). Do not "fix" this.
- Works for N = 2 (24 teams each, exactly 588 points apiece).

## Ranked team list (rank 1 → 48)

Spain, Argentina, France, England, Brazil, Portugal, Netherlands, Belgium, Germany, Croatia, Morocco, Colombia, Mexico, Uruguay, United States, Switzerland, Senegal, Japan, Iran, South Korea, Ecuador, Austria, Türkiye, Australia, Canada, Norway, Sweden, Panama, Egypt, Algeria, Paraguay, Tunisia, Scotland, Ivory Coast, Czechia, Qatar, Uzbekistan, Saudi Arabia, Iraq, DR Congo, South Africa, Bosnia & Herzegovina, Jordan, Cape Verde, Ghana, Haiti, Curaçao, New Zealand

Store this as a single ordered array; rank is derived from array index. Keep team names exactly as written (including `Türkiye`, `Curaçao`, `Bosnia & Herzegovina`).

## UI changes

- **Setup:** add a player-count control (stepper or number input, 2–24) that regenerates the name inputs. Keep names editable.
- **Results board ("wallchart"):** per-player card showing each team with its rank and value, plus the player's **total value** and team count. Show the pot average (1176 ÷ N to 1dp) somewhere visible so people can see how close the draw landed.
- **Tier display:** replace the old tier breakdown with a collapsible ranked list 1–48 (the draw is rank-based now). Keep it inside a `<details>` element.
- **Rules copy:** update the draw explanation on the page to describe the new mechanism in 3–4 short numbered points, matching the site's existing dry tone. Remove all references to tiers and the wildcard pot.
- **Copy results:** the copy-to-clipboard output should list each player, their teams, and their total value, e.g. `jimbo: Spain (48), Tunisia (17) — 65 pts`.
- **Persistence:** keep the existing localStorage save/restore and the guarded "Redraw" reset.

## Non-goals

- No match-result tracking or live leaderboard (separate task).
- No backend, no frameworks, no build tooling.
- Don't restyle the site — reuse the existing CSS variables, fonts, and components.

## Definition of done

1. Open the file in a browser, run a draw with 14 named players: all 48 teams allocated, totals within a few points of 84.0 average, opening round animates pick-by-pick, balancing rounds fill in automatically.
2. Repeat with N = 2, 15, 23: no leftover teams, no crashes, totals near 1176/N.
3. Refresh mid-draw and post-draw: state restores correctly.
4. Headless allocation test loop passes for all N in 2..24.
