# Uncapped Design Tokens — exact values

Use these values directly (inline styles or a `<style>` block). Never substitute
"close enough" colours.

## Fonts (only two, from Google Fonts)

| Font | Used for | Weights |
|---|---|---|
| **Commissioner** | Headings, financial amounts | 600, 700, 800 |
| **Sora** | Body, labels, buttons, all UI copy | 400, 600, 700 |

```html
<link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@400;600;700;800&family=Sora:wght@400;600;700&display=swap" rel="stylesheet">
```

## Typography scale (the real DS scale — `h1`–`h6`)

These are the exact sizes from the Uncapped `Typography` component. Headings are
Commissioner; everything else is Sora.

| Token | Font | Size / weight | Where it's actually used |
|---|---|---|---|
| h1 | Commissioner | 56px / 600 | **The hero amount INSIDE a gradient card** (white, centred), e.g. "£100,000". Not a page title; not on every screen — see below |
| h2 | Commissioner | 48px / 600 | Large hero figure (alt) — still **only inside a gradient card** |
| h3 | Commissioner | 40px / 600 | Rare |
| h4 | Commissioner | **32px / 600** | **In-app page title** ("Bank accounts", "Discover your funding potential") — when a title is shown at all |
| h5 | Commissioner | 24px / 600 | Small section heading |
| h6 | Sora | 20px / 600 | |
| Body title | Sora | 16px / 700 | Card header titles, value amounts |
| Body medium | Sora | 16px / 600 | Value row labels |
| Body | Sora | 16px / 400 | Default copy |
| Small title | Sora | 14px / 700 | Legends, emphasised small text |
| Small copy | Sora | 14px / 400 | Helper text, descriptions (`#374d53`) |
| Footnote | Sora | 12px / 400 | Captions, chart axes (`#374d53`) |

Line-height ~1.3 for headings/amounts, 1.5 for body.

### The big number and the page title are CONDITIONAL (important)

- **There is no "one 56px hero per page" rule.** The large figure (h1/h2) appears
  **only inside a teal→blue gradient hero card**, white and centred. **Never a
  large number sitting bare on the canvas.** Screens that have one: offer,
  offer-config, application review, underwriting/processing, dashboard
  (agreement/status), drawdown. **Form screens** (eligibility, connect, applicant
  info, sign-up) have **no large figure at all**.
- **The page title is `h4` = 32px**, not 48px — and it is **frequently omitted**.
  When the screen leads with a gradient hero card or with section cards, there is
  **no separate page title** (e.g. application review, dashboard, underwriting,
  the offer screens). Show a 32px title only on form/connect screens that need
  one ("Bank accounts", "Discover your funding potential").

## Surfaces

| Token | Hex | Use |
|---|---|---|
| Canvas | `#f7f4f2` | Page background — ALWAYS this, never white |
| Surface default | `#ffffff` | Cards, modals, panels |
| Elevated-1 | `#f9f7f6` | Hover states (nav items) |
| Elevated-2 | `#fbfaf9` | Nested-card cream body (card-on-card pattern) |

## Text

| Token | Hex | Use |
|---|---|---|
| Text primary | `#193a43` | Headings + body |
| Text secondary | `#374d53` | Helper, descriptions |
| Text disabled | `#879092` | Disabled, placeholder |
| Text link / success | `#128081` | Links (bold, no underline), success text |
| Text warning | `#9e5700` | Warning text |

## Brand teal scale

| Token | Hex | Use |
|---|---|---|
| brand-900 | `#002829` | Darkest |
| brand-800 | `#004b4d` | Hero gradient base, dark sidebar |
| brand-700 | `#00696b` | Primary button hover |
| brand-600 | `#128081` | Primary button fill, links |
| brand-500 | `#1ebdc0` | Brand cyan — accent icons, gradient end, chart lines |
| brand-400 | `#a5d3d4` | Focus ring, light chart bars |
| brand-300 | `#c1e5e6` | Success borders |
| brand-200 | `#eaf6f6` | Success/brand subtle bg |
| brand-100 | `#f1f9f9` | Lightest tint |

## Buttons (semantic)

| Variant | Fill | Border | Text | Hover fill |
|---|---|---|---|---|
| Primary | `#128081` | `#128081` | `#ffffff` | `#00696b` |
| Secondary | `#ffffff` | `#d7dee0` | `#128081` | border → `#a5d3d4` |
| Tertiary (amber, **rare**) | `#ffc266` | `#ffc266` | `#193a43` | `#ffd68f` |
| Disabled | `#f0f3f4` | `#d7dee0` | `#879092` | — |

**Primary teal is the default CTA** — offer flow, drawdown, dashboards,
applications, everywhere. The amber **tertiary is rare**: reserve it for a
secondary add-on action like "Add Daily Payouts", never for the main
accept/continue action. Text on amber is always `#193a43`, never white.

Height 44px, radius **8px**, padding 0 16px, font Sora 700 16px.
Focus ring on everything interactive: `box-shadow: 0 0 0 1px #a5d3d4`.

## Status triplets (bg + border + text/icon)

| Status | Background | Border | Text / icon |
|---|---|---|---|
| Success / brand | `#eaf6f6` | `#c1e5e6` | `#128081` |
| Warning | `#fff6e5` | `#ffd68f` | `#9e5700` text, `#ffac30` icon |
| Danger | `#fdecec` | `#f6c6c6` | `#c0353a` |
| Info | `#e5f5ff` | `#c0e4fc` | `#1779b8` text, `#37a7f1` icon |

## Accent palette (icon containers, chips, section accents)

Each accent = subtle (bg) + border + contrast (icon/text on subtle bg).

| Accent | Subtle bg | Border | Contrast | Typical use |
|---|---|---|---|---|
| accent-brand | `#eaf6f6` | `#c1e5e6` | `#1ebdc0` | Core feature |
| accent-2 (amber) | `#fff0d6` | `#ffd68f` | `#ffac30` | Flexibility, warning-ish, offer CTA cards |
| accent-3 (blue) | `#e5f5ff` | `#c0e4fc` | `#37a7f1` | Delivery, payments |
| accent-4 (green) | `#e7f8eb` | `#c9e9d0` | `#33c655` | Offer summaries, balance |
| accent-6 (violet) | `#f4f0fe` | `#e0d5fb` | `#9a73f6` | Repayments |
| accent-9 (indigo) | `#f0f2fe` | `#d5dbfb` | `#7286f6` | Understanding/education, invites |
| accent-11 (magenta) | `#fbecfd` | `#f4ccfa` | `#cf5be1` | Comparisons, scale |

Rule: rotate 2–3 accents per screen so sections read as distinct topics —
never all the same, never all seven.

## Neutrals

| Token | Hex | Use |
|---|---|---|
| neutral-100 | `#f0f3f4` | Inside-card dividers, disabled fill |
| neutral-300 | `#d7dee0` | Default borders, dashed grid lines |
| neutral-400 | `#c1cacd` | Chart axis baselines |

## Spacing — 8px grid

4 / 8 / 12 / 16 / 24 / 32 / 40 px. Nothing off-grid (no 13px, no 18px).
Card padding 16px. Page padding 40px. Gap between cards 24px.

## Border radius

| Element | Radius |
|---|---|
| **Buttons, inputs, selects** | **8px** (`radius-lg`) — NOT 12px. This is the real Uncapped value; 12px reads visibly too rounded |
| Notices | 12px (`radius-xl`) |
| Cards, modals | 12px (standard) → 16px (large) |
| Small icon containers (BoxIcon 24px) | 6px |
| Large icon tiles (BoxIcon 40px) / logo / avatar containers | 8px |
| Chips, pills | 9999px (full) |

Nested radii are always smaller than their parent. **Watch the field/button
radius specifically** — the most common drift is rounding inputs and buttons to
12–16px, which makes the whole form look like a different product. They are 8px.

## Shadows (double-layer — exact values)

| Shadow | CSS | Use |
|---|---|---|
| Light/Sm | `box-shadow: 0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)` | Default for ALL cards on canvas |
| Light/Md | `box-shadow: 0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)` | Dropdowns, floating elements, hero card |
| Light/Lg | `box-shadow: 0 2px 10px rgba(0,0,0,.07), 0 0 2px rgba(0,0,0,.08)` | Modals, popovers |
| Focus | `box-shadow: 0 0 0 1px #a5d3d4` | Focused inputs and buttons |

Never use generic CSS shadows (`0 4px 6px rgba(0,0,0,.1)` etc.) — only these.
One shadow per surface, never mixed.

## Gradients

| Gradient | CSS | Use |
|---|---|---|
| Hero teal | `background: radial-gradient(120% 160% at 30% 0%, #1ebdc0 0%, #0a5e60 55%, #004b4d 100%)` | Offer hero banner top zone, white text on top |
| Dark sidebar | `background: linear-gradient(165deg, #004b4d 0%, #00393b 70%, #0d3b50 100%)` | Dark promo panels — must read teal-dominant, never navy |
