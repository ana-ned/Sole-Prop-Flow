# Uncapped Design

Welcome — this is the home for all design and prototyping work on the Uncapped lending portal (the app where founders apply for working capital, view offers, draw down funds, and manage repayments).

We use this folder to:

- Build interactive prototypes of new ideas before they go to engineering
- Maintain Uncapped's design system (UI Kit 2025)
- Research how other lenders handle similar flows

Whether you're a designer, a researcher, or an engineer collaborating on a prototype, this guide will get you started in a few minutes.

---

## ⚠️ The most important rule

**Prototypes must never connect to live Uncapped servers.**

That means: no real Auth0 logins, no calls to `*.weareuncapped.com`, no real API requests. Even for read-only data. Even if it "works fine in dev".

**Why:** real customers use the live systems with real money. We never want to risk touching their data while we're playing with ideas.

**How we enforce it:** the prototype repo runs in a sandbox that blocks all live URLs. It's turned on by an environment variable (`REACT_APP_PROTOTYPE_MODE=true` in a `.env.local` file). Always run prototypes with the sandbox on.

If you're ever unsure whether something might reach a live Uncapped server, **stop and ask** before running it.

---

## Where prototypes live

All prototypes are in one folder:

```
Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/
```

Each prototype is a single `.tsx` file. For example: `offer-screen.tsx`.

### How to run them on your laptop

1. Open Terminal and go into the prototype repo:
   ```
   cd Assets-Uncapped/front-portal-develop
   ```
2. The first time only, install the packages:
   ```
   pnpm install
   ```
3. The first time only, get the `.env.development` file from a developer on the team (it's in 1Password) and drop it into the `front-portal-develop` folder. Without it, the app won't start.
4. Start the local server:
   ```
   pnpm dev
   ```
5. Open your browser and go to:
   ```
   http://localhost:3000/prototypes/<name-of-prototype>
   ```

**Important:** always go to `/prototypes/<name>` directly. Don't visit `http://localhost:3000/` on its own — it tries to log you in and breaks.

### Starting a new prototype

Copy `offer-screen.tsx` as your starting point — it's a safe template. Don't copy `hello-world.tsx`; it uses parts of the app that don't work in sandbox mode.

After you create your file, also add a line for it in `routes.tsx` so the browser knows it exists. (If you ask the AI helpers below to build a prototype for you, they'll do this step automatically.)

---

## Working with the AI helpers

This project comes with six AI helpers (called "agents") that know how to do specific design tasks the Uncapped way — building prototypes, reviewing them, writing copy, and so on.

You don't need to remember all six. Two simple commands cover almost everything. Just type them into the chat with Claude.

### `/uncapped-build`

Use this when you want to **make something new**.

Examples:

- "Build me a prototype of a repayment dashboard."
- "Translate this Figma screen into code: [paste Figma link]"

It runs the right helpers in the right order — first the strategist plans the flow, then a builder writes the code, then a writer adds the words, then motion is added on top. You get a finished prototype back, ready to open in your browser.

### `/uncapped-review`

Use this when you've **already built something and want to check it**.

Examples:

- "Review my offer-screen prototype."
- "Audit the new application flow."

It runs four reviewers in parallel — design system, copy, motion, and accessibility — and gives you one combined report with what to fix.

### Want to run just one helper?

If you already know which one you need, ask for it by name. For example:

- "Run the ui-copy agent on my offer screen."
- "Have ux-motion review the hover effects on this page."

---

## What each agent does

| Agent | In one sentence |
|---|---|
| **ux-designer** | Plans flows and screens from the customer's point of view — focused on trust, reducing anxiety around money decisions, and keeping things simple. |
| **ui-designer** | Builds the actual `.tsx` prototype file from a Figma design or a written brief. |
| **ui-copy** | Writes and reviews every piece of text in the prototype using Uncapped's tone of voice. |
| **ux-motion** | Adds smooth transitions, hover effects, and small animations to a built page. |
| **design-keeper** | Checks the prototype follows Uncapped's design system — right colours, fonts, spacing, components. |
| **accessibility-edge-reviewer** | Checks the prototype is accessible (contrast, keyboard, screen readers) and that it handles edge cases (empty states, errors, declined offers). |

All six live in the `.claude/agents/` folder if you want to read what they do in detail.

---

## Known gaps between Figma and code

Four small mismatches you should be aware of. Prototypes will still work, but they'll approximate in these areas until they're fixed in the codebase.

**1. Large button size doesn't exist yet.** The Figma file shows a 56px button as the default for desktop. The code only has 44px (medium) and 38px (small). Prototypes use 44px — slightly smaller than the Figma designs.

**2. Heading sizes are one step off.** Figma's "H1" (48px) is called `h2` in code. Everything is shifted by one level. The agents handle this automatically, but if you compare a prototype side-by-side with Figma, the heading labels look wrong even when the sizes are correct.

**3. Two notice styles aren't built yet.** Figma has six styles of the Notice component. The "Default" (plain grey) and "Elevated" styles aren't in code yet. If a design needs either, the agents will substitute the closest available style.

**4. Dark mode isn't implemented.** Figma is light-mode only at the moment.

---

## Need help?

| If you want… | Look at |
|---|---|
| **Polished prototype examples to copy from** | **`Prototype-Library/README.md`** ← start here when building something new |
| The design system rules (colours, fonts, spacing) | `Assets-Uncapped/front-portal-develop/docs/design-system-foundation.md` |
| How a Figma component maps to code | `Assets-Uncapped/front-portal-develop/docs/DESIGN-TO-CODE.md` |
| Notes on Figma vs code mismatches | `docs/design-system-audit.md` |
| Competitor research | `research/competitors.md` |
| Raw prototype source code | `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/` |
