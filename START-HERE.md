# 👋 Start here — Vibe Designing Environment

This is the **Pro approach** from the *Claude Vibe-Designing* page: a safe,
runnable playground for designing Uncapped **product** screens using our real
design system, so results actually look like Uncapped.

You don't need to be a developer. You describe what you want, and the AI helpers
build it for you.

> 💡 Just want to prompt in chat with no setup? Use the **Quick start — Claude
> Skill** path instead (no Figma, works in minutes). This repo is for the
> pixel-perfect, Figma-connected workflow.

**It is completely sandboxed** — it can *never* connect to the real Uncapped
product or touch customer data. Play freely.

---

## What you need (one-time, ~10 min)

1. **Cursor** (or any code editor) to open this folder in.
2. **Claude Code** to run in the editor's terminal — that's your AI helper.
3. **Node.js** and **pnpm** on your computer. Don't have them? Just ask Claude:
   *"Help me install Node and pnpm"* and follow along.
4. **Figma access** — *recommended, not required.* See **"Figma × Claude
   Console MCP: Setup Guide"** on the Notion page to connect Figma once, with
   **your own Figma login** (no token to copy or share). Without it you can
   still design from a written brief — you just won't get pixel-perfect
   matching from a Figma link.

No passwords, no config files to edit. The safe sandbox settings are already
included.

---

## How to start (every time)

1. Open this folder in **Cursor**.
2. In the terminal, start **Claude Code** and say:

   > **"Get the prototyping app running and open the prototypes."**

   Claude installs everything the first time (a few minutes — grab a coffee ☕)
   and starts the app, then gives you a link like
   `http://localhost:3000/prototypes/registration` to open in your browser.

> ⚠️ Always open a link that starts with `/prototypes/...`
> Don't open `http://localhost:3000/` on its own — it tries to log in and breaks.

---

## How to design something

Just describe it in the chat. For example:

- *"Build me a prototype of a repayments dashboard."*
- *"Translate this Figma screen into code: [paste your Figma link]"* (needs Figma connected)
- *"Review my offer screen for accessibility and copy."*

Two shortcuts cover almost everything:

| Type this | What it does |
|---|---|
| `/uncapped-build` | Makes something new (plans → builds → writes copy → adds motion) |
| `/uncapped-review` | Checks something you built (design, copy, motion, accessibility) |

---

## Where things live

- **Your prototypes:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/`
- **Polished examples to copy from:** `Prototype-Library/`
- **The design system rules:** `Assets-Uncapped/front-portal-develop/docs/`
- **Full project guide:** `CLAUDE.md`

---

## Good to know

- **It's safe.** The sandbox blocks every real Uncapped address. Nothing you do
  here can reach live systems or real money.
- **It's yours to break.** Experiment. If something goes wrong, ask Claude to fix
  it — or re-clone a fresh copy.
- **Approved screens get added over time.** As the team blesses new prototypes,
  they're added here so your Claude can build on them instead of starting from
  scratch — faster, cleaner results.

Happy designing. 🎨
