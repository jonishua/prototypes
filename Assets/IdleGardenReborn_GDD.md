# Idle Garden Reborn – Game Design Document (Web Prototype)

## Overview
- **Genre:** Hybrid idle tapper + garden management
- **Platform:** Web (mobile-first responsive layout)
- **Core Fantasy:** Tend a magical pocket garden where a central flower grants instant rewards while surrounding plots grow diverse blooms that can be automated over time.
- **Monetization:** Prototype focuses on core loop only (no IAP/ads yet).

## Pillars
1. **Tap Momentum:** A tactile, central flower yields currency bursts, crit spikes, and combo flow.
2. **Idle Growth:** Surrounding plots deliver steady income, rarity pops, and auto-harvesting.
3. **Automation Mastery:** Layered upgrades unlock sprinklers, drones, and per-plot harvesters that keep the garden alive without micromanagement.
4. **RPG Feedback:** Stats, buffs, and rarity effects are surfaced in an RPG-inspired bonuses sheet.

## Currencies
| Currency | Earned From | Spent On | Notes |
| --- | --- | --- | --- |
| **Credits** | Tapping flower, harvesting plots, global boosters | Seeds, upgrades, decor, plot unlocks | Primary soft currency. |
| **Tickets** | Crit taps, 10-harvest milestones | Boosters, ticket decor | Mid-tier resource for time-limited buffs. |
| **Gems** | 5% chance on taps & harvests, rare drops | High-impact decor (e.g., crit chance) | Premium-like currency; cheat grants +50 for testing. |

## Loop Summary
1. Tap the central flower for instant credits and ticket/gem crit drops.
2. Plant seeds in unlocked plots to grow harvest payouts.
3. Harvest ready plots for credits, tickets, gems, and rarity auras.
4. Spend currencies on upgrades, decor, boosters, and plot harvesters.
5. Automation systems plant/harvest while the bonuses sheet surfaces total buffs.

## Tapping (Central Flower)
- **Base Tap Power:** Starts at 1 credit, modified by Tap Power upgrades and decor/boosters.
- **Crit Chance:** 5% base, +1% per upgrade level, +decor/+boosters, capped at 99% display.
- **Crit Multiplier:** 10x base, +2x per upgrade (max 50x), multiplied by crit decor.
- **Combo Meter:** Base 50 cap; Combo Boost upgrades add +10 (max 100). Combo decays by 1 stack per second.
- **Drops:**
  - Tickets: +1 on crit (3% chance) and +3 every 10 harvests.
  - Gems: 5% chance per tap and per harvest.
- **Visual Feedback:** Popout numbers, crit coloration, combo ring fill.

## Plots (Idle Production)
- **Layout:** Eight surrounding plots (indices 0–7) plus central tap flower.
- **Unlock Cost:** Locked plots require credits (cost = 400 + 300 × plot index). Locked plots show “Unlock?” and cost pill.
- **Seeds:** 14 tiers with 40% profit margin (yield = cost × 1.4) and themed emojis. Grow times span 12–480 seconds.
- **Harvest:**
  - Base yield multiplied by rarity roll (Common×1, Rare×2, Epic×4, Legend×8).
  - Additional bonuses from decor (`tapYield`) and boosters (`globalCredits`).
  - Rare+ harvests trigger sparkle FX and aura recolor.
- **Manual Interaction:** Players can tap growing plots to shave time (2% base, improved by sprinklers).
- **Ready Feedback:** Progress bar fills; plots glow and now feature a shimmering overlay.

## Seeds Table (Excerpt)
| Tier | Cost | Grow (s) | Yield | Emoji |
| --- | --- | --- | --- | --- |
| Daisy | 50 | 12 | 70 | 🌼 |
| Tulip | 110 | 18 | 154 | 🌷 |
| … | … | … | … | … |
| Celestial Lotus | 12,000 | 480 | 16,800 | 🪐 |

## Upgrades
- **Tap Power +1:** +1 base tap damage; cost scales ×2 per level.
- **+1% Crit:** Raises crit chance; scales ×1.5.
- **+2x Crit Mult:** Increases crit multiplier up to 50×; scales ×2.
- **Tap Combo Boost:** +10 combo cap per level (max 100); scales ×2.
- **Plot Expansion +2:** Unlocks two plots per purchase; scales ×2. Requires locked plots.
- **Sprinkler Network:** +5% grow speed per level, affects haste and automation; scales ×2.2.
- **Drone Harvester:** Auto-harvests any ready plot on cadence (3s base → 0.7s floor); scales ×2.4.
- **Plot Harvesters:** Eight distinct upgrades (plots 1–8) that auto-plant highest affordable seed per plot.
  - Base costs escalate per plot (≈3000 × 1.3ⁿ) and scale ×2.3 per level.
  - Each level increases accessible seed tier (Level 1 = Daisy, Level 2 = Tulip, etc.).
  - Uses credits; will fallback to cheaper seed if funds insufficient.

## Decor (Permanent Buffs)
- **Gnome of Fortune (250 gems):** +5% crit chance.
- **Butterfly Shrine (1,000 credits):** +10% grow speed.
- **Crystal Fountain (5,000 credits):** +10% tap yield.
- **Lantern Tree (200 tickets):** +1% crit multiplier per purchase.
- Decor is stackable; tracked in inventory and summarized in bonuses panel.

## Boosters (Time-Limited)
- **Bloom Burst (25 tickets, 30s):** +50% tap power, +2% crit chance.
- **Seed Rush (20 tickets, 60s):** +30% grow speed.
- **Fortune Aura (40 tickets, 45s):** +50% rarity weight.
- **Golden Popups (30 tickets, 30s):** +25% credits from all sources.
- Boosters show timers and active state; bonuses panel lists remaining durations.

## Automation Systems
- **Drone Harvester:** Global auto-harvest; cadence improves via upgrades.
- **Plot Harvesters 1–8:** Per-plot auto-planters; replicate gardener logic for each slot.
- **Grow Modifier:** Combines decor, boosters, and sprinkler levels; floor at 30% grow time.
- **Save Persistence:** LocalStorage sync on every plant/harvest/tap, with reset button in Settings.
- **Cheat Button:** Settings includes +50 gems/tickets for iteration.

## UI & UX Notes
- **Layout:** 3×3 grid with central flower, modular panels, dock nav.
- **Top Bar:** Wallet counters, settings, bonuses button.
- **Bonuses Sheet:** RPG-style stats sections summarizing tap offense, mastery, boosters, decor, automation, and drop chances.
- **Dialogs:** Seed picker, settings, bonuses; use native `<dialog>` for modals.
- **Feedback:** Popups for taps/harvests, shimmer on ready plots, sparkle for rare harvests, popover when plot unlocks or harvester auto-plants.

## Systems TODO & Future Ideas
- Prestige loop / soft reset with meta-currency.
- Expanded decor with set bonuses and visual placement.
- Quest log, achievements, or NPC requests.
- Seasonal events and limited seeds/decor.
- Data persistence beyond localStorage (cloud sync).

