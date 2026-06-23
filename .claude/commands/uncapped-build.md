---
description: Build a new Uncapped prototype using the full agent chain (strategy → build → copy → motion → light QA)
argument-hint: <Figma URL, written brief, or screenshot reference>
---

Build a new Uncapped prototype using the `uncapped-orchestrator` agent in **BUILD mode**.

The orchestrator runs the full chain in order:

1. **ux-designer** — plan the strategy (customer state, pillar, mental model, biggest risk)
2. **ui-designer** — build the `.tsx` file under `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/` and register the route
3. **ui-copy** — refine every string to Uncapped's voice
4. **ux-motion** — add hover/focus/press transitions and entrance moments
5. **design-keeper** + **accessibility-edge-reviewer** — light parallel QA pass for blockers

It maintains a shared task file so each agent can see prior contributions, skips steps that aren't needed for the input (e.g. structural-only requests skip copy and motion), and produces a single summary at the end with the file path, route URL, and any open questions.

Invoke the `uncapped-orchestrator` agent now with mode = BUILD and the input below.

**Input from user:**
$ARGUMENTS
