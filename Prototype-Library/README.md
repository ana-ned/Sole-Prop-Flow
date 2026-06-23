# Uncapped Prototype Library

A curated collection of polished, reference-quality prototypes. Use these as the starting point when you build something new — don't start from a blank file.

---

## Why this exists

Every prototype here has been:

- Built from a real Figma design (not invented or approximated)
- Run through the full agent chain (`ui-designer` → `design-keeper` → `ui-copy` → `ux-motion` → `accessibility-edge-reviewer`) and refined against each pass
- Compared visually with Figma until it matches
- Made sandbox-safe (no live Uncapped server calls)

These are the screens the team has agreed are *right*. Copy from them instead of starting fresh.

---

## How to use this library

1. **Find a screen close to what you need.** Browse the index below.
2. **Read the entry.** It tells you what the prototype demonstrates, what components it uses, what voice patterns it applies, and any quirks worth knowing.
3. **Open the source file.** Every entry links to the actual `.tsx` in `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/`.
4. **Copy and adapt.** Use the source as your starting point. Change only what differs from your new screen.

If you're using the AI helpers (`/uncapped-build`), they automatically consult this library before building anything new.

---

## Quick links

Open prototypes directly in your browser → **[localhost-links.md](./localhost-links.md)**

---

## Index

### Offer screens
- **[Daily Payouts](./daily-payouts.md)** — Amazon revenue advance offer. 3-column portal layout, 4-layer pattern-fill chart, 3 edge-case state variants (expired / no-connection / loading).

### Application flows
*Coming soon.*

### Repayments
*Coming soon.*

### Dashboards
*Coming soon.*

### Decline / restructure
*Coming soon.*

### Drawdowns
*Coming soon.*

---

## Adding a new prototype to the library

A prototype is library-ready when **all** of these are true:

- [ ] It builds and runs in the sandbox without errors
- [ ] `design-keeper` review: zero blocking issues
- [ ] `ui-copy` review: voice on-brand, no off-voice strings
- [ ] `ux-motion` review: hover/focus/press feedback present, transitions smooth
- [ ] `accessibility-edge-reviewer` review: zero WCAG criticals
- [ ] Visual comparison with Figma: matches at desktop width
- [ ] All edge-case state variants built (where applicable: expired, empty, loading, error, decline)

Then:

1. Create a new entry file in this folder, e.g. `repayment-overview.md`
2. Follow the structure of [daily-payouts.md](./daily-payouts.md): What it is → Variants → Source files → Components used → Patterns demonstrated → Voice notes → Sandbox safety → When to use as a starting point
3. Add a row to the **Index** above under the right category
4. (Optional) Add a screenshot to a `screenshots/` subfolder and link it in the entry

---

## What lives where

| | Path |
|---|---|
| **Prototype source code** | `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/` |
| **Library index + entries** | This folder (`Prototype-Library/`) |
| **Design system foundation** | `Assets-Uncapped/front-portal-develop/docs/design-system-foundation.md` |
| **Figma → code mapping** | `Assets-Uncapped/front-portal-develop/docs/DESIGN-TO-CODE.md` |
| **Reusable patterns & rules** | `.claude/skills/` |
| **Specialist agents** | `.claude/agents/` |
| **Slash commands** | `.claude/commands/` |
