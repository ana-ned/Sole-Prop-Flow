# Uncapped Design System — Style Guide Audit

**File:** UI Kit 2025 (`yi1vHrojH9MV6AckmROOQx`)
**Audited:** 2026-04-27
**Scope:** Style guide only — colours, typography, spacing, shadows, icons. Components excluded.

---

## File Structure

The file is organised into clear sections separated by divider pages:

| Section | Pages |
|---|---|
| **Style guide** | Typography, Color, Icons, Shadows |
| **Layout** | Layout (Desktop 1440, Widescreen 1920, Mobile) |
| **Brand** | Brand logo, Customer Logos |
| **Atoms** | Button, Nav Item, Chip, Loader, Paragraph, Heading, Text Input, Phone Input, Currency Input, Date Input, Select, Menu, Autocomplete, Checkbox, Radio Button, Toggle Switch, Card, List Item, Value, Progress Bar, Accordion, Scrollbar, Gradient Background, Confetti, Page Header, Eligibility Step, Icon Container, Connector, Scrollbar |
| **Molecules** | Amount, Benefit List, Top Bar, Offer, Agent, Button Patterns, Nav Groups, Banner, Key Values, Notice, Nudge, Modal, Range Slider, Embeddable Banner |
| **Organisms** | Bar Chart, Address Form, Area Chart, Table |
| **In Progress** | Toggle switch, Hubspot Widget, Available Funding Chart |

---

## Variable Collections

The system has 3 variable collections:

| Collection | Modes | Purpose |
|---|---|---|
| **Brand** | Uncapped, Jungle Scout, Sellermate, Boltshift Demo, Avask, Ebay, Walmart, Google, YouTube, Data Dive | All brand-specific colours, spacing, and typography tokens. The core white-label architecture. |
| **Component Size** | Lg, Md, Sm | Controls component density — button/input/chip/card/modal sizing. |
| **Locale** | USA, UK, EU, Canada | Currency symbol, phone format, date format. |

---

## Typography

### Font Families

| Role | Font | Used for |
|---|---|---|
| Headings | **Commissioner** | H1–H6, amount/financial display |
| Body & UI | **Sora** | Paragraphs, labels, inputs, all UI copy |

### Text Styles

**Amount (financial display) — Commissioner, 100% line height**

| Style | Size | Weight |
|---|---|---|
| Amount/XL | 56px | ExtraBold |
| Amount/Lg | 48px | Bold |
| Amount/Md | 40px | Bold |
| Amount/Sm | 32px | Bold |
| Amount/Sub/XL | 32px | ExtraBold |
| Amount/Sub/Lg | 24px | SemiBold |
| Amount/Sub/Md | 16px | SemiBold |
| Amount/Sub/Sm | 14px | SemiBold |

**Headings — Commissioner, 130% line height**

| Style | Size | Weight |
|---|---|---|
| Heading/H1 | 48px | SemiBold |
| Heading/H2 | 40px | SemiBold |
| Heading/H3 | 32px | SemiBold |
| Heading/H4 | 24px | Bold |
| Heading/H5 | 20px | Bold |
| Heading/H6 | 16px | Bold |

**Body — Sora, 150% line height**

| Style | Size | Weight |
|---|---|---|
| Body/Title | 16px | Bold |
| Body/Medium | 16px | SemiBold |
| Body/Copy | 16px | Regular |
| Sm/Title | 14px | Bold |
| Sm/Medium | 14px | SemiBold |
| Sm/Copy | 14px | Regular |
| XS/Title | 12px | Bold |
| XS/Medium | 12px | SemiBold |
| XS/Copy | 12px | Regular |

### Typography Variables

**Size scale:**

| Token | Value |
|---|---|
| `typography/size/xs` | 12px |
| `typography/size/sm` | 14px |
| `typography/size/md` | 16px |
| `typography/size/lg` | 20px |
| `typography/size/xl` | 24px |
| `typography/size/2xl` | 32px |
| `typography/size/3xl` | 40px |
| `typography/size/4xl` | 48px |
| `typography/size/5xl` | 56px |

**Weight scale:**

| Token | Value |
|---|---|
| `typography/weight/regular` | 400 |
| `typography/weight/medium` | 500 |
| `typography/weight/semibold` | 600 |
| `typography/weight/bold` | 700 |
| `typography/weight/extra bold` | 800 |

**Other:**
- `typography/family/heading` → Commissioner
- `typography/family/body` → Sora
- `typography/paragraph spacing/body` → 8px
- `typography/paragraph spacing/small` → 8px
- `typography/paragraph spacing/xs` → 8px

---

## Colour

All values below are for the **Uncapped** brand mode.

### Core Resolved Values

| Token | Hex | Description |
|---|---|---|
| `color/brand/500` | `#1ebdc0` | Primary teal — main brand colour |
| `color/brand/100` | `#f1f9f9` | Brand tint — subtle backgrounds |
| `color/text/primary` | `#193a43` | Main text — very dark teal |
| `color/text/secondary` | `#374d53` | Secondary text |
| `color/text/link` | `#128081` | Link colour — mid teal |
| `color/surface/canvas` | `#f7f4f2` | Page background — warm off-white |
| `color/surface/default` | `#ffffff` | Card / modal surface |
| `color/neutral/50` | `#f8fafb` | Lightest neutral |
| `color/neutral/900` | `#0b1d22` | Darkest neutral / near-black |
| `color/error/500` | `#fa566f` | Error — pink-red |
| `color/warning/500` | `#ffac30` | Warning — amber |
| `color/info/500` | `#37a7f1` | Info — blue |
| `color/success/500` | `#1ebdc0` | Success — **same hex as brand** ⚠️ |
| `color/white` | `#ffffff` | |
| `color/black` | `#000000` | |

### Full Colour Scales

Each of the following has a full **50 → 900** scale (10 stops):

- `color/brand` — teal family
- `color/secondary` — secondary palette
- `color/tertiary` — tertiary palette
- `color/info` — blue family
- `color/success` — maps to brand teal ⚠️
- `color/error` — red/pink family
- `color/warning` — amber/yellow family
- `color/neutral` — grey family

### Accent Colours

11 accent groups (`color/accent/1` through `color/accent/11`), each with 3 variants:

| Variant | Purpose |
|---|---|
| `{n}-subtle` | Light background tint |
| `{n}-contrast` | Foreground / text on that accent |
| `{n}-border` | Border / outline |

Total: **33 accent tokens**

### Semantic UI Tokens

**Text:**
`color/text/primary` · `color/text/secondary` · `color/text/link` · `color/text/error` · `color/text/success` · `color/text/warning` · `color/text/info` · `color/text/disabled`

**Surfaces:**
`color/surface/canvas` · `color/surface/default` · `color/surface/elevated 1` · `color/surface/elevated 2`

**Button states:**
Primary, secondary, tertiary backgrounds + borders · hover states · disabled state · on-primary/secondary/tertiary text colours

**Input states:**
`color/input/border` · `color/input/background` · active / error / disabled variants

**Status backgrounds + borders:**
Success, error, warning, info, disabled — each with background, background-elevated, and border tokens

**Nav item:**
`color/nav item/icon-todo` · `color/nav item/icon-done` · `color/nav item/background-active` · `color/nav item/background-hover`

**Data visualisation:**
`color/data/1` through `color/data/4`

**Marketing:**
`color/marketing/dark background flat` `#005570` · `color/marketing/background fallback light` `#f9fbfc` · `color/marketing/marketing accent 1–6`

---

## Spacing

All modes share the same numeric scale:

| Token | Value |
|---|---|
| `spacing/none` | 0px |
| `spacing/2` | 2px |
| `spacing/4` | 4px |
| `spacing/6` | 6px |
| `spacing/8` | 8px |
| `spacing/10` | 10px |
| `spacing/12` | 12px |
| `spacing/16` | 16px |
| `spacing/20` | 20px |
| `spacing/24` | 24px |
| `spacing/32` | 32px |
| `spacing/40` | 40px |

Base grid: **8px**. Scale mixes 4px steps at small sizes and 8px steps at larger sizes.

Component-specific spacing tokens (`spacing/button/padding/horizontal`, etc.) alias back into this scale, with small per-brand offsets to account for different border-radius shapes.

---

## Shadows

6 shadow effect styles + 1 focus ring. All shadows use a **double-layer technique** (short shadow + long shadow stacked) for a natural look.

### Light shadows (for light/white backgrounds)

| Style | Layer 1 | Layer 2 |
|---|---|---|
| **Light/Sm** | `0 0 6 0` · 3% black | `0 1 2 0` · 7% black |
| **Light/Md** | `0 1 8 0` · 5% black | `0 1 2 0` · 8% black |
| **Light/Lg** | `0 2 10 0` · 7% black | `0 0 2 0` · 8% black |

### Dark shadows (for coloured/dark backgrounds)

| Style | Layer 1 | Layer 2 |
|---|---|---|
| **Dark/Sm** | `0 0 6 0` · 16% black | `0 1 2 0` · 20% black |
| **Dark/Md** | `0 1 8 0` · 18% black | `0 1 2 0` · 20% black |
| **Dark/Lg** | `0 2 10 0` · 15% black | `0 1 2 0` · 15% black |

### Focus ring

| Style | Value |
|---|---|
| **Focus** | `rgba(165, 211, 212, 1)` — 1px spread, no blur — teal outline |

Shadow variables are stored in the Brand collection under `shadow/light/sm/short`, `shadow/light/sm/long`, etc., with x, y, blur, spread, and colour as separate sub-variables.

---

## Icons

| Source | Usage |
|---|---|
| **Huge Icons** | Primary library. Solid-Standard and Solid-Rounded styles. Used throughout the product. |
| **Material Icons** | Legacy. Limited use. Being phased out — should complete the migration. |
| **Custom / Nav** | Component set for navigation states. Brand-specific. |
| **Brand / Social** | Amazon, Google, eBay, Uncapped custom components. |

Standard icon frame: **24px**. Icons live in a 24px frame with appropriate space. Multiple sizes supported via Component Size variables.

---

## Component Size System

3 density modes control all component proportions:

| Mode | When used |
|---|---|
| **Lg** | Default / spacious desktop |
| **Md** | Standard compact desktop |
| **Sm** | Dense / mobile contexts |

Applies to: Button, Nav Item, Chip, Input, Card, Card Header, Modal, Notice, Control (checkbox/radio/toggle), List Item, Value.

---

## White-Label Brand System

The Brand variable collection has **10 modes**, one per supported brand. Swapping the mode remaps all semantic tokens (colours, border radii, button padding) to match that brand's visual identity. Supported:

Uncapped · Jungle Scout · Sellermate · Boltshift Demo · Avask · Ebay · Walmart · Google · YouTube · Data Dive

---

## Analysis: What to Keep, Fix, Remove, Add

### Keep ✅

- **Two-font system** — Commissioner (headings) + Sora (body) is clean and purposeful. Clear role distinction.
- **Semantic token layer** — `color/text/primary`, `color/surface/default`, etc. The abstraction is the right approach.
- **8px spacing scale** — solid grid foundation. No changes needed.
- **Multi-brand mode system** — sophisticated white-label architecture. Keep and document it better.
- **Double-shadow technique** — natural-looking depth. Light/Sm is a good default.
- **Component Size modes (Lg/Md/Sm)** — good density system. Works well for responsive layouts.
- **Locale variable collection** — correct place for currency/phone/date formatting.
- **Amount text styles** — the financial display scale (XL/Lg/Md/Sm) is domain-appropriate for a fintech product.

### Simplify / Fix ⚠️

- **Old `palette/` variable names still in use** — the library was renamed from `palette/` to `color/` at some point, but thousands of nodes in design files still bind to the old names (e.g. `palette/brand/600`, `palette/neutral/800`, `palette/accent/1-subtle`). Figma keeps these alive by ID so nothing is visually broken — but do not delete those old variables until a migration pass rebinds all affected nodes to the new `color/` equivalents.
- **Old `font/` prefix** — same issue for some typography bindings using `font/family/body` instead of `typography/family/body`.
- **`success` and `warning` token mapping** — `color/success` maps to brand teal (intentional, accepted). `color/warning` shares the same orange primitive as `color/secondary` — to review later, not urgent as it reads clearly in context.
- **11 accent colours (33 tokens)** — likely more than actually used. Audit usage across components before the next system version and cut to 5–6 max.
- **Amount Sub styles** — 4 sub-styles (XL/Lg/Md/Sm). Verify all 4 are genuinely used in production before keeping.
- **`spacing/6` and `spacing/10`** — odd values in an 8px grid. Check if they are used or can be removed.
- **Typography size `lg` = 20px** — there is no `Heading/H5` = 20px text style that uses this token directly in the text styles panel. Alignment between the size scale and text styles needs a review.

### Remove 🗑

- **Material Icons references** — migration is already in progress. Complete it and remove Material icon components.
- **"(DEPRICATED) Thumbnail"** component on the Cover page — delete it.
- **Fragmented external library copies** — copies of Untitled UI PRO, Global Component Library, and Ebay Library are floating around as external references. These should be consolidated or the dependencies removed.
- **"Toggle switch" In Progress page** — appears to duplicate the existing Toggle Switch atom page. Resolve and clean up.

### Add ➕

- **Border width tokens** — no stroke/border-weight tokens exist. Add `border/1`, `border/2`.
- **Dark mode** — no dark colour scheme exists. The shadow system already has Dark/Sm-Lg styles for dark surfaces, but there are no dark mode colour tokens. This is the biggest gap for future expansion.
- **Breakpoint / grid tokens** — the Layout page shows Desktop 1440 / Widescreen 1920 / Mobile frames but these widths are not tokenised as variables. Add `breakpoint/mobile`, `breakpoint/tablet`, `breakpoint/desktop`, `breakpoint/wide`.
- **Motion / animation tokens** — no transition duration or easing curve tokens. Minimum needed: `duration/fast` (100ms), `duration/base` (200ms), `duration/slow` (300ms) + 2–3 easing curves.
- **Opacity tokens** — opacity is used ad hoc across components (disabled states, overlays). Should be tokenised: `opacity/disabled`, `opacity/overlay`, etc.
- **Z-index / layer tokens** — no layer/stacking tokens. Needed for modals, dropdowns, toasts, tooltips.

---

## Priority Order for Improvement

1. **Migrate `palette/` → `color/` bindings** — rebind all nodes still using old variable names before any restructuring.
2. **Fix radius variable scopes** — `radius/` tokens exist and are correct but all set to `ALL_SCOPES`. Narrow to `CORNER_RADIUS` so they only appear in the corner radius picker, not in every property field.
3. ~~**Add breakpoint tokens**~~ — skipped for now.
4. **Consolidate colour primitives** — clean up multi-level aliasing within the Brand collection.
5. **Audit and reduce accent colours** — simplify from 11 to ~5–6.
6. **Add motion tokens** — needed for interactive prototypes.
7. **Review `warning` = `secondary` overlap** — deferred, not urgent.
8. **Plan dark mode** — longer term, but architecture decisions now affect how easy this will be later.
