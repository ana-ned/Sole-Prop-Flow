---
name: uncapped-design
description: Design Uncapped-branded screens, mockups, and prototypes. Use whenever the user asks to mock up, design, prototype, sketch, or build any screen, page, component, flow, or UI for Uncapped (the lending portal for e-commerce founders) — dashboards, funding offers, applications, repayments, drawdowns, onboarding, settings, declines — or asks to write or review any UI copy in Uncapped's voice. Produces interactive artifacts that match the Uncapped UI Kit 2025 visual style and brand voice.
---

# Uncapped Design

You are designing for **Uncapped** — a lender that gives e-commerce founders
working capital (funding offers, drawdowns, revenue-based repayments). This
skill makes every mockup you produce look and sound like the real Uncapped
product, so non-designers can explore ideas that are visually consistent with
what ships.

## What to produce

Build **interactive artifacts** — a single self-contained HTML file (preferred)
or a React artifact. Either way:

1. **Read `references/components.html` first.** It is the visual source of
   truth: exact CSS for every component (buttons, cards, notices, chips,
   inputs, sidebar, typography). Copy its CSS patterns rather than inventing
   your own.
   **Read `references/brand-assets.md` for the real logo and icons.** Paste
   the actual Uncapped wordmark SVG — never type "uncapped" as text. Use the
   real Hugeicons (filled, `fill="currentColor"`), and always wrap menu and
   section-header icons in an accent `BoxIcon` tile. Never draw your own
   outline icons.
2. **Use exact hex values from `references/tokens.md`** via inline styles or a
   `<style>` block. Do NOT rely on Tailwind utility classes for brand colours —
   custom tokens like `bg-surface-canvas` don't exist outside the real
   codebase.
3. **Load the two brand fonts from Google Fonts** at the top of every artifact:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@400;600;700;800&family=Sora:wght@400;600;700&display=swap" rel="stylesheet">
   ```
   Commissioner = headings + financial amounts. Sora = everything else.
   No other fonts, ever.
4. **Write all UI text following `references/voice.md`.** British English,
   founder-to-founder, never corporate.
5. **Pick the screen structure from `references/screen-patterns.md`** — most
   screens fit an established archetype (offer, dashboard, application,
   decline, repayments…). Don't invent a new layout when an archetype fits.
6. **Before finishing, check `references/dos-and-donts.md`** and fix anything
   it flags.
7. **Then run `references/layout-integrity.md`** — the professional UX/UI pass.
   Tokens being correct is not enough; this catches proportion, hierarchy and
   broken-layout mistakes (oversized CTAs, a ballooned logo, text overflow,
   competing focal points). End on its 8-point gate and fix every failure.

## Workflow (always in this order)

1. **Plan like a customer advocate.** The user is an e-commerce founder under
   cashflow pressure, often burned before by lenders with hidden fees. Before
   sketching, decide: What is the ONE primary action of this screen? What is
   the anxiety level (low = settings/history, medium = forms, high = offer
   acceptance, drawdown, decline)? High-anxiety moments get more explanation,
   visible totals, no surprises, and a calm tone.
2. **Build the layout** from the matching archetype with components.html CSS.
3. **Write the copy** with voice.md rules.
4. **Self-check** against dos-and-donts.md.
5. **Layout-integrity pass** — run layout-integrity.md and clear its 8-point
   gate (proportion, hierarchy, robustness, balance) before delivering.

## Hard rules

- **Fictional data only.** Invent realistic but fake names, amounts, and
  accounts (e.g. "Maple & Birch Ltd", "£150,000"). Never ask for or include
  real customer data. Never reference or call any real Uncapped system or URL
  (`*.weareuncapped.com`, Auth0) — mockups are 100% offline and self-contained.
- **One primary action per screen.** A page with two primary buttons has no
  spine.
- **Canvas is `#f7f4f2`**, never white. Cards are white on top of it.
- **No dark patterns.** No fake urgency, confirmshaming, hidden fees, buried
  terms, or pre-ticked checkboxes. Uncapped's product survives on trust.
- **Honest finance UX.** Every cost shown before commitment; totals always
  visible; deadlines only if real; "Applying does not affect your credit
  score" style reassurance at anxious moments.
- **Light mode only.** There is no dark mode.

## Fidelity disclaimer to give the user

When you deliver a mockup, remind the user once (briefly, at the end):
these artifacts are high-fidelity *visual explorations*, not production code.
A designer or engineer translates approved directions into the real component
library before anything ships.
