# Uncapped Design

Design and prototyping work for the Uncapped lending portal — the app where e-commerce founders apply for working capital, view offers, draw down funds, and manage repayments.

## What's in here

- **`Prototype-Library/`** — Reference prototypes with notes. Start here if you're browsing.
- **`docs/`** — Design system audit and Figma ↔ code mismatch notes.
- **`research/`** — Competitor UX teardowns and screenshots (Stripe, Shopify, Wayflyer, Parafin, iwoca, etc.).
- **`Assets-Uncapped/front-portal-develop/src/domains/prototypes/`** — Source `.tsx` for each prototype.
- **`CLAUDE.md`** — Full project guide.
- **`.claude/`** — Claude Code agents, skills, and slash commands used to build prototypes.

## Viewing vs running prototypes

The prototype source files in this repo are intended for **reading**. To actually **run** a prototype in the browser you need a local checkout of `front-portal-develop` (Uncapped's portal app — not included here). Once you have it:

```bash
cd front-portal-develop
pnpm install
pnpm dev
# open → http://localhost:3000/prototypes/<prototype-name>
```

> Prototypes never connect to live Uncapped servers. The sandbox flag (`REACT_APP_PROTOTYPE_MODE=true` in `.env.local`) blocks every `*.weareuncapped.com` URL. Always run with it on.

## Working with the AI agents

The repo ships with six specialised Claude Code agents (UX strategy, UI build, copy, motion, design system review, accessibility) and two slash commands:

- `/uncapped-build` — design + build a new prototype end-to-end
- `/uncapped-review` — review an existing prototype across all four review angles

Full setup and usage details are in [`CLAUDE.md`](./CLAUDE.md).
