# Uncapped Design System — Foundation Skill
**Figma source:** UI Kit 2025 · `yi1vHrojH9MV6AckmROOQx`
**Last extracted:** 2026-04-29
**Purpose:** Rules for Claude Code to generate pixel-perfect Uncapped UI

> All values below are **extracted directly** from the Figma variable collections and text styles. When building any Uncapped screen, always use these tokens — never invent colours, sizes or spacing.

---

## 1. Fonts

Two typefaces only. No substitutions.

| Role | Family | Weights used |
|---|---|---|
| **Headings & financial amounts** | Commissioner | SemiBold (600), Bold (700), ExtraBold (800) |
| **Body, labels, UI copy** | Sora | Regular (400), SemiBold (600), Bold (700) |

**Load in CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=Commissioner:wght@600;700;800&family=Sora:wght@400;600;700&display=swap');
```

---

## 2. Typography Styles

All styles map directly to the Figma text style library. Use the **style name** as a reference, the CSS values below for implementation.

### Line-height rule
- **Headings:** 130% (`line-height: 1.3`)
- **Body / UI:** 150% (`line-height: 1.5`)
- **Amounts:** 100% (`line-height: 1`) — amounts must never wrap

### Paragraph spacing
Figma uses 8px paragraph spacing on all body styles. **In CSS:** wrap consecutive paragraphs in a flex column container with `gap: 8px`. Do not use `margin-bottom` on `<p>` tags — it won't match.

---

### Amount styles — Commissioner, line-height: 1
Financial figures: loan amounts, balances, currency values.

| Style name | Size | Weight | CSS |
|---|---|---|---|
| `Amount/Xl` | 56px | ExtraBold 800 | `font: 800 56px/1 'Commissioner'` |
| `Amount/Lg` | 48px | Bold 700 | `font: 700 48px/1 'Commissioner'` |
| `Amount/Md` | 40px | Bold 700 | `font: 700 40px/1 'Commissioner'` |
| `Amount/Sm` | 32px | Bold 700 | `font: 700 32px/1 'Commissioner'` |
| `Amount/Sub/Xl` | 32px | ExtraBold 800 | `font: 800 32px/1 'Commissioner'` |
| `Amount/Sub/Lg` | 24px | SemiBold 600 | `font: 600 24px/1 'Commissioner'` |
| `Amount/Sub/Md` | 16px | SemiBold 600 | `font: 600 16px/1 'Commissioner'` |
| `Amount/Sub/Sm` | 14px | SemiBold 600 | `font: 600 14px/1 'Commissioner'` |

**When to use:**
- `Amount/Xl` — hero offer amounts on landing/confirmation screens
- `Amount/Lg` / `Amount/Md` — dashboard primary metric
- `Amount/Sm` — card-level amounts, list item values
- `Amount/Sub/*` — currency suffixes, sub-labels next to a larger amount (e.g. `$50,000 .00`)

---

### Heading styles — Commissioner, line-height: 1.3

| Style name | Size | Weight | CSS |
|---|---|---|---|
| `Heading/H1` | 48px | SemiBold 600 | `font: 600 48px/1.3 'Commissioner'` |
| `Heading/H2` | 40px | SemiBold 600 | `font: 600 40px/1.3 'Commissioner'` |
| `Heading/H3` | 32px | SemiBold 600 | `font: 600 32px/1.3 'Commissioner'` |
| `Heading/H4` | 24px | Bold 700 | `font: 700 24px/1.3 'Commissioner'` |
| `Heading/H5` | 20px | Bold 700 | `font: 700 20px/1.3 'Commissioner'` |
| `Heading/H6` | 16px | Bold 700 | `font: 700 16px/1.3 'Commissioner'` |

**When to use:**
- `H1` — page title (one per page)
- `H2` — major section heading
- `H3` — card/panel heading
- `H4` — subsection / prominent label
- `H5` / `H6` — component headings, list group labels

---

### Body styles — Sora, line-height: 1.5

| Style name | Size | Weight | CSS |
|---|---|---|---|
| `Body/Title` | 16px | Bold 700 | `font: 700 16px/1.5 'Sora'` |
| `Body/Medium` | 16px | SemiBold 600 | `font: 600 16px/1.5 'Sora'` |
| `Body/Copy` | 16px | Regular 400 | `font: 400 16px/1.5 'Sora'` |
| `Sm/Title` | 14px | Bold 700 | `font: 700 14px/1.5 'Sora'` |
| `Sm/Medium` | 14px | SemiBold 600 | `font: 600 14px/1.5 'Sora'` |
| `Sm/Copy` | 14px | Regular 400 | `font: 400 14px/1.5 'Sora'` |
| `XS/Title` | 12px | Bold 700 | `font: 700 12px/1.5 'Sora'` |
| `XS/Medium` | 12px | SemiBold 600 | `font: 600 12px/1.5 'Sora'` |
| `XS/Copy` | 12px | Regular 400 | `font: 400 12px/1.5 'Sora'` |

**When to use:**
- `Body/*` — default paragraph text, form labels, input values
- `Sm/*` — secondary labels, helper text, table rows, list item secondary line
- `XS/*` — captions, timestamps, badges, chip labels (Sm mode)
- `*/Title` — labelling a value or section (bold emphasis)
- `*/Medium` — interactive elements that need weight without full bold
- `*/Copy` — running text, descriptions, placeholder text

---

## 3. Colour System

### Architecture
Two layers. **Always use semantic tokens in components** — never use primitive hex values directly in UI.

```
Primitive (raw hex)  →  Semantic (purpose-named)  →  Component applies semantic
e.g. #1ebdc0           color/brand/500              button background-primary
```

### Canvas & surface hierarchy

| Token | Hex | Use |
|---|---|---|
| `color/surface/canvas` | `#f7f4f2` | Page background — warm off-white |
| `color/surface/default` | `#ffffff` | Cards, modals, panels |
| `color/surface/elevated 1` | `#f9f7f6` | Elevated surface above canvas |
| `color/surface/elevated 2` | `#fbfaf9` | Second elevation level |

**Rule:** Canvas is always `#f7f4f2`. White cards sit on top of it. Never use pure white as a page background.

---

### Text colours

| Token | Hex | Use |
|---|---|---|
| `color/text/primary` | `#193a43` | Main body text, headings |
| `color/text/secondary` | `#374d53` | Supporting text, descriptions |
| `color/text/link` | `#128081` | Hyperlinks, clickable text |
| `color/text/disabled` | `#879092` | Disabled labels, placeholder |
| `color/text/error` | `#d92640` | Validation error messages |
| `color/text/success` | `#128081` | Success messages (same as link) |
| `color/text/warning` | `#9e5700` | Warning messages |
| `color/text/info` | `#0a7bc7` | Info messages |

---

### Brand palette (Uncapped — teal family)

| Token | Hex | Note |
|---|---|---|
| `color/brand/900` | `#002829` | Darkest teal |
| `color/brand/800` | `#004b4d` | |
| `color/brand/700` | `#00696b` | Button hover |
| `color/brand/600` | `#128081` | Primary action, links |
| `color/brand/500` | `#1ebdc0` | Brand primary |
| `color/brand/400` | `#a5d3d4` | Focus ring, active borders |
| `color/brand/300` | `#c1e5e6` | |
| `color/brand/200` | `#eaf6f6` | Subtle tint |
| `color/brand/100` | `#f1f9f9` | Lightest tint |
| `color/brand/50` | `#f7fcfc` | |

---

### Status colours

| State | Background token | Hex | Border token | Hex | Text token | Hex |
|---|---|---|---|---|---|---|
| **Success** | `color/status/background-success` | `#f1f9f9` | `color/status/border-success` | `#c1e5e6` | `color/text/success` | `#128081` |
| **Error** | `color/status/background-error` | `#fff5f7` | `color/status/border-error` | `#ffccd4` | `color/text/error` | `#d92640` |
| **Warning** | `color/status/background-warning` | `#fff6e5` | `color/status/border-warning` | `#ffd68f` | `color/text/warning` | `#9e5700` |
| **Info** | `color/status/background-info` | `#eff9ff` | `color/status/border-info` | `#c0e4fc` | `color/text/info` | `#0a7bc7` |
| **Disabled** | `color/status/background-disabled` | `#f5f8f9` | `color/status/border-disabled` | `#d7dee0` | `color/text/disabled` | `#879092` |

Elevated variants (for status panels on non-white backgrounds):
- `color/status/background-success-elevated` → `#eaf6f6`
- `color/status/background-error-elevated` → `#ffeaed`
- `color/status/background-warning-elevated` → `#fff0d6`
- `color/status/background-info-elevated` → `#e5f5ff`

---

### Neutral scale

| Token | Hex |
|---|---|
| `color/neutral/900` | `#0b1d22` |
| `color/neutral/800` | `#193a43` |
| `color/neutral/700` | `#374d53` |
| `color/neutral/600` | `#556468` |
| `color/neutral/500` | `#879092` |
| `color/neutral/400` | `#c1cacd` |
| `color/neutral/300` | `#d7dee0` |
| `color/neutral/200` | `#f0f3f4` |
| `color/neutral/100` | `#f5f8f9` |
| `color/neutral/50` | `#f8fafb` |

---

### Button colours (semantic)

| Token | Hex | Use |
|---|---|---|
| `color/button/background-primary` | `#128081` | Primary button fill |
| `color/button/background-primary-hover` | `#00696b` | Primary button hover |
| `color/button/background-secondary` | `#ffffff` | Secondary button fill |
| `color/button/border-secondary` | `#d7dee0` | Secondary button border |
| `color/button/border-secondary-hover` | `#a5d3d4` | Secondary button border hover |
| `color/button/background-tertiary` | `#ffc266` | Tertiary button fill |
| `color/button/background-tertiary-hover` | `#ffd68f` | Tertiary button hover |
| `color/on-primary` | `#ffffff` | Text/icon on primary button |
| `color/on-secondary` | `#128081` | Text/icon on secondary button |
| `color/on-tertiary` | `#193a43` | Text/icon on tertiary button |
| `color/on-disabled` | `#879092` | Text/icon on disabled button |

---

### Input colours

| Token | Hex | State |
|---|---|---|
| `color/input/background` | `#ffffff` | Default |
| `color/input/border` | `#d7dee0` | Default border |
| `color/input/border-active` | `#a5d3d4` | Focused border |
| `color/input/border-error` | `#d92640` | Error border |
| `color/input/background-disabled` | `#f0f3f4` | Disabled background |
| `color/input/border-disabled` | `#d7dee0` | Disabled border |

---

### Control colours (checkbox, radio, toggle)

| Token | Hex | State |
|---|---|---|
| `color/control/background` | `#ffffff` | Default |
| `color/control/border` | `#c1cacd` | Default border |
| `color/control/border-active` | `#a5d3d4` | Focused |
| `color/control/background-filled` | `#128081` | Checked/on state |
| `color/control/border-filled` | `#128081` | Checked/on border |
| `color/control/disabled` | `#d7dee0` | Disabled state |

---

### Accent colours (for tags, labels, data categories)

11 accent groups × 3 variants each. Use for data visualisation labels, category chips, status tags where the 4 standard status colours don't apply.

| Group | Subtle | Border | Contrast (text/icon) |
|---|---|---|---|
| Brand (teal) | `#eaf6f6` | `#c1e5e6` | `#1ebdc0` |
| Accent 1 | `#eaf6f6` | `#c1e5e6` | `#1ebdc0` |
| Accent 2 (amber) | `#fff0d6` | `#ffd68f` | `#ffac30` |
| Accent 3 (blue) | `#e5f5ff` | `#c0e4fc` | `#37a7f1` |
| Accent 4 (green) | `#e7f8eb` | `#c9e9d0` | `#33c655` |
| Accent 5 (red) | `#ffeaed` | `#ffccd4` | `#fa566f` |
| Accent 6 (purple) | `#f4f0fe` | `#e0d5fb` | `#9a73f6` |
| Accent 7 (yellow) | `#fff5d6` | `#ffe48a` | `#ffc505` |
| Accent 8 (pink) | `#feebf5` | `#fccae3` | `#ff4ba5` |
| Accent 9 (indigo) | `#f0f2fe` | `#d5dbfb` | `#7286f6` |
| Accent 10 (teal-green) | `#e3f7f4` | `#bdebe2` | `#1bc2a4` |
| Accent 11 (violet) | `#fbecfd` | `#f4ccfa` | `#cf5be1` |

**Usage rule:** always pair subtle (background) with border, and use contrast for text/icon on that background. Never mix accent groups.

---

## 4. Spacing Scale

Base grid: **8px**. Never invent a spacing value — always use a token.

| Token | Value | CSS variable |
|---|---|---|
| `spacing/none` | 0px | `--sp-0: 0` |
| `spacing/2` | 2px | `--sp-2: 2px` |
| `spacing/4` | 4px | `--sp-4: 4px` |
| `spacing/6` | 6px | `--sp-6: 6px` |
| `spacing/8` | 8px | `--sp-8: 8px` |
| `spacing/10` | 10px | `--sp-10: 10px` |
| `spacing/12` | 12px | `--sp-12: 12px` |
| `spacing/16` | 16px | `--sp-16: 16px` |
| `spacing/20` | 20px | `--sp-20: 20px` |
| `spacing/24` | 24px | `--sp-24: 24px` |
| `spacing/32` | 32px | `--sp-32: 32px` |
| `spacing/40` | 40px | `--sp-40: 40px` |

**Rules:**
- 2px and 4px — fine adjustments only (icon inner padding, tight chip spacing)
- 6px and 10px — exist but prefer 8/12; use only when component spec requires it
- 8px — minimum meaningful spacing between related elements
- 16px — default padding inside cards and inputs
- 24px — section gap, modal padding
- 32–40px — page-level section separation

---

## 5. Border Radius

### Global scale

| Token | Value | Use |
|---|---|---|
| `radius/none` | 0px | Square corners (rare) |
| `radius/xs` | 2px | Very subtle rounding (dividers, thin elements) |
| `radius/sm` | 4px | Chips (Sm mode), controls |
| `radius/md` | 6px | Small interactive elements |
| `radius/lg` | 8px | Buttons (Md/Sm), inputs (Md/Sm), cards (Sm) |
| `radius/xl` | 12px | Buttons (Lg), inputs (Lg), cards (Md), notices |
| `radius/2xl` | 16px | Cards (Lg), modals |
| `radius/3xl` | 20px | Larger panels |
| `radius/4xl` | 24px | — |
| `radius/5xl` | 32px | — |
| `radius/6xl` | 40px | — |
| `radius/full` | 9999px | Pills, chips, badges (all sizes) |

### Component-specific radius (resolved per size mode)

| Component | Lg | Md | Sm |
|---|---|---|---|
| Button | 12px | 8px | 8px |
| Input | 12px | 8px | 8px |
| Card | 16px | 12px | 8px |
| Modal | 16px | 16px | 12px |
| Notice | 12px | 12px | 12px |
| Control (checkbox/radio) | 4px | 4px | 4px |
| Chip | 9999px | 9999px | 9999px |

---

## 6. Shadows & Elevation

### Rule
Double-layer technique: each shadow style stacks two drop shadows for a natural look. Light shadows for white/light surfaces. Dark shadows for teal/coloured surfaces. **Default: `Light/Sm` for almost everything.**

### Light shadows (on white / off-white backgrounds)

| Style | Layer 1 | Layer 2 | CSS |
|---|---|---|---|
| `Light/Sm` | x:0 y:0 blur:6 · 3% black | x:0 y:1 blur:2 · 7% black | `box-shadow: 0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)` |
| `Light/Md` | x:0 y:1 blur:8 · 5% black | x:0 y:1 blur:2 · 8% black | `box-shadow: 0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)` |
| `Light/Lg` | x:0 y:2 blur:10 · 7% black | x:0 y:0 blur:2 · 8% black | `box-shadow: 0 2px 10px rgba(0,0,0,.07), 0 0 2px rgba(0,0,0,.08)` |

### Dark shadows (on teal / coloured backgrounds)

| Style | Layer 1 | Layer 2 | CSS |
|---|---|---|---|
| `Dark/Sm` | x:0 y:0 blur:6 · 16% black | x:0 y:1 blur:2 · 20% black | `box-shadow: 0 0 6px rgba(0,0,0,.16), 0 1px 2px rgba(0,0,0,.20)` |
| `Dark/Md` | x:0 y:1 blur:8 · 18% black | x:0 y:1 blur:2 · 20% black | `box-shadow: 0 1px 8px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.20)` |
| `Dark/Lg` | x:0 y:2 blur:10 · 15% black | x:0 y:1 blur:2 · 15% black | `box-shadow: 0 2px 10px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.15)` |

### Focus ring

| Style | Value | CSS |
|---|---|---|
| `Focus` | 1px spread, no blur, teal `rgba(165,211,212,1)` | `box-shadow: 0 0 0 1px #a5d3d4` |

**When to use which shadow:**
- `Light/Sm` — default for all cards on `#f7f4f2` canvas
- `Light/Md` — floating elements, dropdowns, date pickers
- `Light/Lg` — modals, popovers above the page layer
- `Dark/*` — white cards on teal/brand-coloured surfaces
- `Focus` — keyboard-focused interactive elements (inputs, buttons, controls)

---

## 7. Component Size System

Three density modes control all component proportions. **Default mode: Lg.**

| Mode | When to use |
|---|---|
| **Lg** | Default desktop layouts, spacious forms |
| **Md** | Compact desktop, data-dense screens, sidebars |
| **Sm** | Mobile, very tight layouts, nested components |

### Button specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Height | 56px | 44px | 38px |
| Padding horizontal | 16px | 16px | 16px |
| Padding vertical | 8px | 8px | 8px |
| Gap (icon + label) | 8px | 8px | 4px |
| Border radius | 12px | 8px | 8px |
| Label font size | 16px | 14px | 14px |
| Label weight | Bold 700 | SemiBold 600 | SemiBold 600 |
| Icon size | 24px | 20px | 16px |
| Icon-only size | 32px | 24px | 20px |

### Button variants & colours

| Variant | Background | Border | Text/icon |
|---|---|---|---|
| **Primary** | `#128081` | `#128081` | `#ffffff` |
| **Primary hover** | `#00696b` | `#00696b` | `#ffffff` |
| **Secondary** | `#ffffff` | `#d7dee0` | `#128081` |
| **Secondary hover** | `#ffffff` | `#a5d3d4` | `#128081` |
| **Tertiary** | `#ffc266` | `#ffc266` | `#193a43` |
| **Tertiary hover** | `#ffd68f` | `#ffd68f` | `#193a43` |
| **Disabled** (all) | `#f0f3f4` | `#d7dee0` | `#879092` |

**Border weight:** 1px for all button variants.

---

### Text Input specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Height | 56px | 44px | 38px |
| Padding horizontal | 16px | 10px | 8px |
| Gap (icon + value) | 8px | 8px | 4px |
| Border radius | 12px | 8px | 8px |
| Text size | 16px | 14px | 14px |
| Icon size | 24px | 20px | 16px |

### Input states

| State | Background | Border |
|---|---|---|
| **Default** | `#ffffff` | `#d7dee0` |
| **Focused** | `#ffffff` | `#a5d3d4` |
| **Filled** | `#ffffff` | `#d7dee0` |
| **Error** | `#ffffff` | `#d92640` |
| **Disabled** | `#f0f3f4` | `#d7dee0` |

**Border weight:** 1px. Label above input uses `Sm/Medium` (14px SemiBold) in Lg/Md modes. Error message below uses `XS/Copy` (12px Regular) in `color/text/error` (#d92640).

---

### Card specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Padding (all sides) | 16px | 8px | 4px |
| Border radius | 16px | 12px | 8px |
| Internal gap | 8px | 8px | 4px |
| Card header padding V | 16px | 12px | 8px |
| Card header padding H | 16px | 16px | 10px |

**Card colours:**
- Background: `color/surface/default` → `#ffffff`
- Shadow: `Light/Sm` → `box-shadow: 0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)`
- Canvas behind cards: `color/surface/canvas` → `#f7f4f2`

---

### Modal specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Width | 600px | 500px | 400px |
| Padding vertical | 40px | 32px | 24px |
| Padding horizontal | 32px | 24px | 20px |
| Border radius | 16px | 16px | 12px |

**Modal colours:**
- Background: `#ffffff`
- Overlay: `rgba(0,0,0,0.4)` (not tokenised — use this value)
- Shadow: `Light/Lg`

---

### Chip specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Height | 24px | 20px | 16px |
| Padding horizontal | 4px | 4px | 4px |
| Gap | 4px | 4px | 2px |
| Border radius | 9999px | 9999px | 9999px |
| Label size | 14px | 12px | 12px |
| Icon size | 16px | 12px | 12px |

---

### Control (checkbox, radio, toggle) specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Size | 24px | 20px | 16px |
| Border radius (checkbox) | 4px | 4px | 4px |
| Toggle track width | 40px | 32px | 24px |
| Toggle handle | 20px | 16px | 12px |
| Label size | 16px | 14px | 14px |
| Vertical padding | 4px | 4px | 4px |

---

### Notice specs

| Property | Lg | Md | Sm |
|---|---|---|---|
| Padding horizontal | 16px | 12px | 8px |
| Padding vertical | 16px | 12px | 8px |
| Border radius | 12px | 12px | 12px |
| Text size | 16px | 14px | 14px |

Notice colours: use Status colour set — background, border, and text tokens per status type.

---

## 8. Layout

### Page structure
```
Page background:  #f7f4f2  (color/surface/canvas)
Content max-width: 1440px  (Desktop) / 1920px (Widescreen)
Mobile breakpoint: ~390px
```

### Surface elevation rules
```
Level 0 — page canvas:    #f7f4f2
Level 1 — cards/panels:   #ffffff  (+ Light/Sm shadow)
Level 2 — elevated 1:     #f9f7f6  (hover states of nav items)
Level 3 — elevated 2:     #fbfaf9  (nav active state background)
Level 4 — modals/popovers: #ffffff (+ Light/Lg shadow, overlay behind)
```

### Nav item colours
| Token | Hex | Use |
|---|---|---|
| `color/nav item/background-active` | `#fbfaf9` | Active nav item background |
| `color/nav item/background-hover` | `#fbfaf9` | Hover nav item background |
| `color/nav item/icon-done` | `#128081` | Completed step icon |
| `color/nav item/icon-todo` | `#ffc266` | Upcoming step icon |

---

## 9. Icons

| Library | Size | Use |
|---|---|---|
| Huge Icons — Solid Standard | 24px frame | Default icons throughout product |
| Huge Icons — Solid Rounded | 24px frame | Alternate style where specified |
| Custom Nav icons | varies | Navigation step indicators only |

**Icon sizing by component size mode:**

| Context | Lg | Md | Sm |
|---|---|---|---|
| Button / Input | 24px | 20px | 16px |
| Chip | 16px | 12px | 12px |
| Control | 24px | 20px | 12px |
| List Item right | 24px | 24px | 20px |
| Standard inline | 24px | 24px | 24px |

---

## 10. CSS Custom Properties — Full Token Sheet

Paste this into a project's global stylesheet to have all tokens available:

```css
:root {
  /* Fonts */
  --font-heading: 'Commissioner', sans-serif;
  --font-body: 'Sora', sans-serif;

  /* Font sizes */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-md: 16px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 40px;
  --text-4xl: 48px;
  --text-5xl: 56px;

  /* Spacing */
  --sp-0: 0;
  --sp-2: 2px;
  --sp-4: 4px;
  --sp-6: 6px;
  --sp-8: 8px;
  --sp-10: 10px;
  --sp-12: 12px;
  --sp-16: 16px;
  --sp-20: 20px;
  --sp-24: 24px;
  --sp-32: 32px;
  --sp-40: 40px;

  /* Radius */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 20px;
  --radius-4xl: 24px;
  --radius-5xl: 32px;
  --radius-6xl: 40px;
  --radius-full: 9999px;

  /* Surfaces */
  --color-canvas: #f7f4f2;
  --color-surface: #ffffff;
  --color-surface-elevated-1: #f9f7f6;
  --color-surface-elevated-2: #fbfaf9;

  /* Text */
  --color-text-primary: #193a43;
  --color-text-secondary: #374d53;
  --color-text-link: #128081;
  --color-text-disabled: #879092;
  --color-text-error: #d92640;
  --color-text-success: #128081;
  --color-text-warning: #9e5700;
  --color-text-info: #0a7bc7;

  /* Brand */
  --color-brand-900: #002829;
  --color-brand-800: #004b4d;
  --color-brand-700: #00696b;
  --color-brand-600: #128081;
  --color-brand-500: #1ebdc0;
  --color-brand-400: #a5d3d4;
  --color-brand-300: #c1e5e6;
  --color-brand-200: #eaf6f6;
  --color-brand-100: #f1f9f9;
  --color-brand-50: #f7fcfc;

  /* Neutral */
  --color-neutral-900: #0b1d22;
  --color-neutral-800: #193a43;
  --color-neutral-700: #374d53;
  --color-neutral-600: #556468;
  --color-neutral-500: #879092;
  --color-neutral-400: #c1cacd;
  --color-neutral-300: #d7dee0;
  --color-neutral-200: #f0f3f4;
  --color-neutral-100: #f5f8f9;
  --color-neutral-50: #f8fafb;

  /* Status */
  --color-success-bg: #f1f9f9;
  --color-success-border: #c1e5e6;
  --color-error-bg: #fff5f7;
  --color-error-border: #ffccd4;
  --color-warning-bg: #fff6e5;
  --color-warning-border: #ffd68f;
  --color-info-bg: #eff9ff;
  --color-info-border: #c0e4fc;

  /* Buttons */
  --color-btn-primary: #128081;
  --color-btn-primary-hover: #00696b;
  --color-btn-secondary-border: #d7dee0;
  --color-btn-secondary-border-hover: #a5d3d4;
  --color-btn-tertiary: #ffc266;
  --color-btn-tertiary-hover: #ffd68f;

  /* Inputs */
  --color-input-border: #d7dee0;
  --color-input-border-focus: #a5d3d4;
  --color-input-border-error: #d92640;
  --color-input-bg-disabled: #f0f3f4;

  /* Shadows */
  --shadow-light-sm: 0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07);
  --shadow-light-md: 0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08);
  --shadow-light-lg: 0 2px 10px rgba(0,0,0,.07), 0 0 2px rgba(0,0,0,.08);
  --shadow-dark-sm: 0 0 6px rgba(0,0,0,.16), 0 1px 2px rgba(0,0,0,.20);
  --shadow-dark-md: 0 1px 8px rgba(0,0,0,.18), 0 1px 2px rgba(0,0,0,.20);
  --shadow-dark-lg: 0 2px 10px rgba(0,0,0,.15), 0 1px 2px rgba(0,0,0,.15);
  --shadow-focus: 0 0 0 1px #a5d3d4;
}
```

---

## 11. Common Patterns (How Designers Apply It)

These patterns are observed directly from production screens in the UI Kit.

### Page layout
```
body { background: var(--color-canvas); } /* #f7f4f2 */
.page-content { max-width: 1440px; margin: 0 auto; }
```

### Card
```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-2xl);   /* 16px for Lg mode */
  padding: var(--sp-16);
  box-shadow: var(--shadow-light-sm);
  gap: var(--sp-8);
}
```

### Primary button
```css
.btn-primary {
  height: 56px;                        /* Lg mode */
  padding: 0 var(--sp-16);
  background: var(--color-btn-primary);
  border: 1px solid var(--color-btn-primary);
  border-radius: var(--radius-xl);     /* 12px */
  color: #ffffff;
  font: 700 16px/1.5 var(--font-body);
  gap: var(--sp-8);
}
.btn-primary:hover {
  background: var(--color-btn-primary-hover);
  border-color: var(--color-btn-primary-hover);
}
.btn-primary:focus-visible {
  box-shadow: var(--shadow-focus);
}
.btn-primary:disabled {
  background: var(--color-neutral-200);
  border-color: var(--color-neutral-300);
  color: var(--color-text-disabled);
}
```

### Text input
```css
.input-wrapper { display: flex; flex-direction: column; gap: var(--sp-4); }
.input-label { font: 600 14px/1.5 var(--font-body); color: var(--color-text-primary); }
.input {
  height: 56px;                        /* Lg mode */
  padding: 0 var(--sp-16);
  background: var(--color-surface);
  border: 1px solid var(--color-input-border);
  border-radius: var(--radius-xl);     /* 12px */
  font: 400 16px/1.5 var(--font-body);
  color: var(--color-text-primary);
}
.input:focus { border-color: var(--color-input-border-focus); outline: none; box-shadow: var(--shadow-focus); }
.input.error { border-color: var(--color-input-border-error); }
.input:disabled { background: var(--color-input-bg-disabled); color: var(--color-text-disabled); }
.input-error-msg { font: 400 12px/1.5 var(--font-body); color: var(--color-text-error); }
```

### Amount display
```css
/* Offer amount e.g. "$150,000" */
.offer-amount {
  font: 800 56px/1 var(--font-heading);  /* Amount/Xl */
  color: var(--color-text-primary);
}
/* On teal/brand background */
.offer-amount.on-brand { color: #ffffff; }
```

### Status notice / banner
```css
.notice {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-12);
  padding: var(--sp-16);
  border-radius: var(--radius-xl);    /* 12px */
  border: 1px solid;
  font: 400 16px/1.5 var(--font-body);
}
.notice.success { background: var(--color-success-bg); border-color: var(--color-success-border); color: var(--color-text-success); }
.notice.error   { background: var(--color-error-bg);   border-color: var(--color-error-border);   color: var(--color-text-error); }
.notice.warning { background: var(--color-warning-bg); border-color: var(--color-warning-border); color: var(--color-text-warning); }
.notice.info    { background: var(--color-info-bg);    border-color: var(--color-info-border);    color: var(--color-text-info); }
```

---

## 12. Do / Don't

| Do | Don't |
|---|---|
| Use `#f7f4f2` as every page background | Use white (#ffffff) as a page background |
| Use `color/text/primary` (#193a43) for all main text | Use black (#000000) for text |
| Apply `Light/Sm` shadow to all cards by default | Leave cards without shadow |
| Use Commissioner for all headings and amounts | Use Sora for headings |
| Use `radius/full` (9999px) for chips and pills | Use a fixed px radius on chips |
| Use semantic colour tokens | Hard-code primitive hex values in components |
| Match button height to component size mode (56/44/38px) | Use an arbitrary button height |
| Apply focus ring (`0 0 0 1px #a5d3d4`) on :focus-visible | Use browser default outline |
| Use `gap` in flex/grid for spacing between elements | Use `margin` for internal layout spacing |
| Keep paragraph spacing as flex `gap: 8px` between `<p>` elements | Use CSS `margin-bottom` on paragraphs |

---

## 13. White-Label Notes

The Brand variable collection has 10 modes. All colour, radius, and spacing tokens swap when the mode changes. When building prototypes:
- **Default to Uncapped mode** — all hex values in this document are Uncapped
- Other brands (Jungle Scout, Avask, eBay, etc.) remap the same token names to their own palette
- Never hardcode Uncapped-specific hex values in component logic — always use the token name so the component is brand-agnostic

---

## 14. Locale Notes

The Locale collection controls formatting — not styling.

| Mode | Currency | Date format | Phone |
|---|---|---|---|
| USA | `$` / USD | MM/DD/YYYY | `+1 (000) 000-0000` |
| UK | `£` / GBP | DD/MM/YYYY | `+44 0000 000000` |
| EU | `€` / EUR | DD/MM/YYYY | varies |
| Canada | `$` / CAD | MM/DD/YYYY | `+1 (000) 000-0000` |

---

## 15. Molecules — How Designers Apply Them

These patterns are extracted directly from the Figma molecule components and observed in production screens.

---

### Amount banner

A full-width header banner used to display a key financial amount — most commonly an offer amount or balance on confirmation/dashboard screens.

**Structure:** centered flex column — Label top → Amount → Label bottom

| Property | Value |
|---|---|
| Background | Teal gradient: `#005570` → `#1ebdc0` (left-to-right or radial) |
| Label top | `XS/Medium` · 12px SemiBold Sora · white · centered |
| Amount | `Amount/Xl` or `Amount/Lg` · Commissioner ExtraBold · white · centered |
| Label bottom | `XS/Medium` · 12px SemiBold Sora · white · centered |
| Padding vertical | 24px top / 24px bottom |
| Border radius | 16px (top corners only when banner is the card header) |

**3 variants:**
- **Default** — solid teal gradient background
- **Confetti** — gradient + animated confetti overlay (celebration state)
- **Flat** — flat `#1ebdc0` (brand/500), no gradient

**Rules:**
- All text is white — never use dark text on the teal banner
- Amount never wraps (`line-height: 1`, `white-space: nowrap`)
- Label top is optional (omit when context is clear from heading above the banner)

```css
.amount-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 24px 32px;
  background: linear-gradient(135deg, #005570 0%, #1ebdc0 100%);
  border-radius: 16px;
  color: #ffffff;
}
.amount-banner__label { font: 600 12px/1 'Sora'; opacity: 0.9; }
.amount-banner__value { font: 800 56px/1 'Commissioner'; white-space: nowrap; }
```

---

### Offer card

The primary funding offer presentation component. Combines the Amount banner (top) with a white body section (bottom). Used on offer screens, dashboard summary, and embeddable widgets.

**Structure:** vertical stack — Amount banner → white body

| Section | Contents |
|---|---|
| **Header** (teal gradient) | Label top · Amount · Label bottom |
| **Body** (white) | Optional: progress bar · description text · CTA button |

| Property | Value |
|---|---|
| Component width | 800px (desktop full-width card) |
| Header border-radius | 16px top corners |
| Body border-radius | 16px bottom corners |
| Body background | `#ffffff` |
| Body padding | 16px all sides |
| Body gap | 12px between elements |
| Description text | `Body/Copy` · 16px Regular Sora · `color/text/primary` |
| CTA button | **Tertiary** (amber `#ffc266`) — not primary |
| Progress bar | Brand teal fill on neutral track |

**Rules:**
- The CTA on an offer card is always Tertiary (amber), never Primary. This distinguishes accepting an offer from generic actions.
- Description is capped at 2 lines — truncate with ellipsis beyond that.
- When a progress bar is shown it indicates data-checking status; pair with an ETA label (`Sm/Medium`, secondary text colour, right-aligned).

```css
.offer-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-light-sm);
}
.offer-card__header {
  background: linear-gradient(135deg, #005570 0%, #1ebdc0 100%);
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #ffffff;
}
.offer-card__body {
  background: #ffffff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.offer-card__description {
  font: 400 16px/1.5 'Sora';
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.offer-card__cta {
  background: #ffc266;
  border: 1px solid #ffc266;
  border-radius: 12px;
  padding: 0 16px;
  height: 56px;
  font: 700 16px/1 'Sora';
  color: #193a43;
}
```

---

### Key Values

A row of metric cards displaying core financial figures — balance, next repayment, last transaction, etc. Used on the dashboard as the primary data layer below the top bar.

**Layout:** horizontal flex row, equal-width cards, gap 16px

Each card structure:

| Layer | Content | Style |
|---|---|---|
| Top | Icon (24px) + label | `Sm/Title` · 14px Bold Sora · `color/text/primary` |
| Middle | Optional date/time line | `XS/Copy` · 12px Regular Sora · `color/text/secondary` |
| Amount | Primary metric value | `Amount/Md` or `Amount/Lg` · Commissioner Bold |
| Optional | Status chip | Chip with accent colour (e.g. teal for "Completed") |
| Bottom | Optional CTA button | Secondary button (white + teal border on hover) |

| Property | Value |
|---|---|
| Card background | `#ffffff` |
| Card shadow | `Light/Sm` |
| Card border-radius | 16px |
| Card padding | 16px |
| Card min-width | ~200px |
| Amount colour | `color/text/primary` (#193a43) |
| Amount with negative value | `color/text/error` (#d92640) |

**Rules:**
- Negative amounts (repayments, debits) use `color/text/error`.
- Status chips use the accent colour matching the transaction state: teal = completed, amber = pending, red = failed.
- The CTA button in a Key Value card is always Secondary — it navigates to a detail view, never submits a form.

---

### Banner

A dark teal panel used for calls-to-action, eligibility prompts, or product explanations within a page. Distinct from Notice — Banner is marketing/navigational, not status-based.

**Variants:** with action list / with amount display on right / text-only

| Property | Value |
|---|---|
| Background | Dark teal: `#005570` (flat) or gradient |
| Text colour | White throughout |
| Border-radius | 16px |
| Padding | 24px |
| Heading | `Heading/H4` or `Heading/H3` · Commissioner · white |
| Description | `Body/Copy` or `Sm/Copy` · Sora · white · max 3 lines |
| Action items | List of rows: teal bullet icon + `Sm/Medium` text + chevron-right · white |
| Optional right side | Amount banner (label + value) |

**Rules:**
- Banner heading uses Commissioner (heading font) — never Sora.
- Action list items have a `>` chevron on the right; the entire row is tappable.
- When an amount appears on the right, it sits in its own sub-section with a subtle vertical divider.

---

### Notice

A contextual status message. Used for inline validation results, data status, warnings, and informational tips. **Not** for full-page errors (use a page-level state for that).

**Variants axis 1 — Style:** Default · Elevated · Success · Error · Warning · Info

**Variants axis 2 — Layout:** Horizontal (icon left, text right) · Vertical (icon top, text below, button full-width)

**Variants axis 3 — Size:** Medium · Small

| Style | Background | Border | Icon colour | Text colour |
|---|---|---|---|---|
| Default | `#f5f8f9` | `#d7dee0` | `#879092` | `#193a43` |
| Elevated | `#f0f3f4` | `#c1cacd` | `#879092` | `#193a43` |
| Success | `#f1f9f9` | `#c1e5e6` | `#128081` | `#128081` |
| Error | `#fff5f7` | `#ffccd4` | `#d92640` | `#d92640` |
| Warning | `#fff6e5` | `#ffd68f` | `#9e5700` | `#9e5700` |
| Info | `#eff9ff` | `#c0e4fc` | `#0a7bc7` | `#0a7bc7` |

| Size | Padding H | Padding V | Text size | Icon size |
|---|---|---|---|---|
| Medium | 16px | 16px | 16px (Body/Copy) | 24px |
| Small | 12px | 12px | 14px (Sm/Copy) | 20px |

**Structure (Horizontal layout):**
```
[Status icon 24px]  [Heading (bold) + body text]  [Optional button/link]
```

**Structure (Vertical layout):**
```
[Status icon 24px]
[Heading (bold)]
[Body text]
[Button — full width]
```

**Rules:**
- Always include a status icon — never use a notice without one.
- Heading is optional; body text alone is valid for short one-liners.
- The CTA button in a notice is always Secondary or a text link — never Primary.
- Use Elevated variant when the notice sits on a coloured background (e.g. inside a teal banner).

```css
.notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
}
/* Apply status class for colours */
.notice.success { background: #f1f9f9; border-color: #c1e5e6; color: #128081; }
.notice.error   { background: #fff5f7; border-color: #ffccd4; color: #d92640; }
.notice.warning { background: #fff6e5; border-color: #ffd68f; color: #9e5700; }
.notice.info    { background: #eff9ff; border-color: #c0e4fc; color: #0a7bc7; }
.notice__icon   { flex-shrink: 0; width: 24px; height: 24px; }
.notice__body   { display: flex; flex-direction: column; gap: 4px; }
.notice__heading { font: 700 16px/1.5 'Sora'; }
.notice__text    { font: 400 16px/1.5 'Sora'; }
```

---

### Nudge

A lightweight, non-blocking informational card. Used to surface tips, next actions, or contextual guidance without interrupting the user flow. Less prominent than a Notice — no border, softer presentation.

| Property | Value |
|---|---|
| Background | `#ffffff` |
| Shadow | `Light/Sm` |
| Border-radius | 16px |
| Padding | 16px |
| Layout | Horizontal: icon container left + text right |
| Icon container | 40px × 40px · teal `#eaf6f6` background · `#1ebdc0` icon |
| Heading | `Sm/Title` · 14px Bold Sora · `color/text/primary` · max 2 lines |
| Description | `Sm/Copy` · 14px Regular Sora · `color/text/secondary` |
| Gap (icon + text) | 12px |

**Rules:**
- Nudge has no action button by default — it is informational only.
- Use for proactive hints (e.g. "Connect your bank to unlock more funding").
- Can appear in a 2- or 4-column grid layout for a dashboard nudge row.
- Icon is always from Huge Icons, sized 24px inside the 40px container.

```css
.nudge {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: var(--shadow-light-sm);
}
.nudge__icon-wrap {
  flex-shrink: 0;
  width: 40px; height: 40px;
  border-radius: 10px;
  background: #eaf6f6;
  display: flex; align-items: center; justify-content: center;
}
.nudge__heading { font: 700 14px/1.5 'Sora'; color: #193a43; }
.nudge__text    { font: 400 14px/1.5 'Sora'; color: #374d53; margin-top: 2px; }
```

---

## 16. Page Layout System

All screens are built on a **3-column CSS grid** at desktop widths (>1240px). The middle column is flexible; left and right columns are fixed. Screens below 1240px collapse to a simpler layout (nav drawer, single column content).

### Column anatomy

| Column | Width | Contents |
|---|---|---|
| **Col 1 — Left nav** | 270px fixed | Logo area (max 270px) + Main nav (240px) + Sub nav / user info at bottom |
| **Col 2 — Main content** | flexible (1fr) | Page content with internal max-width constraint |
| **Col 3 — Right panel** | 170px or 400px | Context-specific: empty utility rail (170px) or full sidebar panel (400px) |

### Layout variants

| Variant | Col 1 | Col 2 constraint | Col 3 | Used for |
|---|---|---|---|---|
| **Dashboard** | 270px | max 900px | 170px | Main dashboard, data screens |
| **With sidebar** | 270px | max 800px, forms max 540px | 400px | Application forms with contextual help |
| **Table** | 270px | min 500px, unconstrained | — | Transaction lists, repayment tables |
| **Eligibility** | 270px | max 800px, content max 540px | 400px | Step-through application flows |

### CSS grid skeleton

```css
/* Base layout — applies to all screens >1240px */
.app-layout {
  display: grid;
  grid-template-columns: 270px 1fr;  /* right col added per variant */
  grid-template-rows: 1fr;
  min-height: 100vh;
  background: var(--color-canvas);  /* #f7f4f2 */
}

/* With 400px right panel */
.app-layout--sidebar {
  grid-template-columns: 270px 1fr 400px;
}

/* With narrow utility rail */
.app-layout--dashboard {
  grid-template-columns: 270px 1fr 170px;
}

/* Left nav */
.app-nav {
  width: 270px;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);  /* #ffffff */
  box-shadow: var(--shadow-light-sm);
  position: sticky;
  top: 0;
  height: 100vh;
}
.app-nav__brand  { max-width: 270px; padding: 24px 16px; }
.app-nav__main   { flex: 1; padding: 8px; overflow-y: auto; }
.app-nav__footer { padding: 16px; border-top: 1px solid var(--color-neutral-200); }

/* Main content column */
.app-content {
  padding: 32px 40px;
  overflow-y: auto;
}

/* Internal max-width wrappers (applied inside .app-content) */
.content-dashboard { max-width: 900px; }
.content-form      { max-width: 800px; }
.content-form-inner { max-width: 540px; }  /* forms themselves */

/* Right panel */
.app-sidebar {
  width: 400px;
  padding: 24px 16px;
  background: var(--color-surface);
  box-shadow: var(--shadow-light-sm);
}
```

### Widescreen (1920px)

Same column structure. Middle column grows freely between its min/max bounds — content just breathes more. No structural changes needed; CSS grid handles it automatically as long as max-width constraints are on the content wrapper, not the column itself.

### Nav structure (Col 1)

The left nav is context-dependent — it changes per flow. Two patterns are used:

**Dashboard nav** — flat item list:
```
Logo
──────────────
Dashboard
Loans
Transactions
Connections
──────────────
[User / company name]
```

**Application / eligibility nav** — step indicator:
```
Logo
──────────────
✓ Revenue sources    (done — teal icon)
✓ Bank accounts      (done — teal icon)
● Application details  (active — white bg, active state)
○ Business details   (todo — amber icon)
○ Your application   (todo)
○ Your offers [0]    (todo)
──────────────
Log out
```

Nav item states use `color/nav item/*` tokens — see section 8.

---

## 17. Motion Tokens

No motion variables exist in the Figma DS yet. Use the values below for all interactive components until they are formalised.

### Duration scale

| Token | Value | Use |
|---|---|---|
| `duration/instant` | 0ms | Immediate state changes (no animation needed) |
| `duration/fast` | 100ms | Micro-interactions: checkbox check, toggle snap, focus ring |
| `duration/base` | 200ms | Standard transitions: hover colour, button state, input border |
| `duration/slow` | 300ms | Panel entrance/exit, modal open, dropdown reveal |
| `duration/xslow` | 500ms | Page-level transitions, offer amount count-up |

### Easing curves

| Token | Value | Use |
|---|---|---|
| `easing/default` | `cubic-bezier(0.4, 0, 0.2, 1)` | General purpose — most state changes |
| `easing/enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the screen (decelerate in) |
| `easing/exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving the screen (accelerate out) |
| `easing/spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful pop — chip selected, confetti trigger |

### CSS custom properties (add to `:root`)

```css
:root {
  --duration-instant: 0ms;
  --duration-fast:    100ms;
  --duration-base:    200ms;
  --duration-slow:    300ms;
  --duration-xslow:   500ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter:   cubic-bezier(0, 0, 0.2, 1);
  --ease-exit:    cubic-bezier(0.4, 0, 1, 1);
  --ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Applied rules

| Interaction | Duration | Easing | Properties |
|---|---|---|---|
| Button hover (colour) | `--duration-base` | `--ease-default` | `background-color`, `border-color` |
| Button press (scale) | `--duration-fast` | `--ease-default` | `transform: scale(0.98)` |
| Input focus ring | `--duration-fast` | `--ease-default` | `box-shadow` |
| Checkbox / radio fill | `--duration-fast` | `--ease-spring` | `background-color`, `transform` |
| Toggle slide | `--duration-base` | `--ease-default` | `transform` (handle), `background-color` (track) |
| Dropdown / select open | `--duration-slow` | `--ease-enter` | `opacity`, `transform: translateY(-4px → 0)` |
| Modal open | `--duration-slow` | `--ease-enter` | `opacity`, `transform: scale(0.96 → 1)` |
| Modal close | `--duration-base` | `--ease-exit` | `opacity`, `transform: scale(1 → 0.96)` |
| Accordion expand | `--duration-slow` | `--ease-default` | `height` (via `max-height` trick) |
| Notice / toast appear | `--duration-slow` | `--ease-enter` | `opacity`, `transform: translateY(8px → 0)` |
| Page transition | `--duration-xslow` | `--ease-default` | `opacity` |

**Rule:** always transition `opacity` and `transform` — never `width`, `height`, or `top/left` (forces layout recalculation). Use `max-height` for accordion with a generous max to avoid clipping.

---

## 18. Icon System

### Library

**Huge Icons** is the primary icon library. Solid Standard and Solid Rounded styles are used throughout the product.

**npm install for Next.js / React:**
```bash
npm install @hugeicons/react
```

**Usage:**
```jsx
import { Home01Icon, ChartBarLineIcon } from '@hugeicons/react';

// Default (24px, inherits currentColor)
<Home01Icon />

// Custom size
<Home01Icon size={20} />

// Custom colour
<Home01Icon size={24} color="#128081" />
```

### Size rules (match component size mode)

| Context | Lg mode | Md mode | Sm mode |
|---|---|---|---|
| Button / Input leading icon | 24px | 20px | 16px |
| Nav item | 24px | 24px | 24px |
| Chip | 16px | 12px | 12px |
| Nudge icon container | 24px | 24px | 20px |
| Key Values card | 24px | 20px | 20px |
| Inline text icon | 16px | 16px | 14px |
| Standard standalone | 24px | 24px | 24px |

### Colour rules

| Context | Icon colour |
|---|---|
| Nav item — active | `#128081` (brand/600) |
| Nav item — todo step | `#ffc266` (amber / tertiary) |
| Nav item — done step | `#128081` (brand/600) |
| Status notice icon | Match status text colour |
| Primary button icon | `#ffffff` |
| Secondary button icon | `#128081` |
| Nudge icon | `#1ebdc0` (brand/500) on `#eaf6f6` bg |
| Default UI icon | `currentColor` — inherits text colour |

### Icon frame spec (when wrapping icons)

Always place icons in a 24px frame with the icon centred inside. For coloured icon containers (like Nudge):
```css
.icon-container {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: #eaf6f6;
  display: flex; align-items: center; justify-content: center;
  color: #1ebdc0;
  flex-shrink: 0;
}
```

### Icon set notes

| Set | Use | Status |
|---|---|---|
| Huge Icons — Solid Standard | All product UI | Primary — always prefer |
| Huge Icons — Solid Rounded | Alternate style where specified in design | Active |
| Material Icons | Legacy — arrow/utility icons | Being phased out — do not add new usage |
| Custom / Nav | Step indicator icons in application nav | Brand-specific component set |
| Brand / Social | Amazon, Google, eBay, Uncapped logos | Use as-is, do not resize |
