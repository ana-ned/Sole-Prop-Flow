---
description: Review an existing Uncapped prototype across design system, copy, motion, and accessibility
argument-hint: <prototype file path or name (e.g. "offer-screen")>
---

Review an existing Uncapped prototype using the `uncapped-orchestrator` agent in **REVIEW mode**.

The orchestrator runs all four reviewers in parallel:

- **design-keeper** — token compliance against the foundation
- **ui-copy** (review role) — voice, tone, clarity, and missing copy
- **ux-motion** — hover, focus, press, transitions, and entrance moments
- **accessibility-edge-reviewer** — WCAG checks (contrast, keyboard, screen readers) and edge-case states (empty, loading, error, decline)

It combines the four reports into a single prioritised summary — sorted by severity, deduped, grouped by theme — with critical / should-fix / polish, plus auto-applied fixes and items needing your input. Top 3 priorities are called out at the end.

Invoke the `uncapped-orchestrator` agent now with mode = REVIEW and the prototype below.

**Prototype to review:**
$ARGUMENTS
