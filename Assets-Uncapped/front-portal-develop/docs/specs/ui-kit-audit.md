# UI Kit 2025 — Component Audit

> **Date:** 2026-04-03
> **Figma file:** [UI Kit 2025](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1173-45854)
> **Codebase:** `src/components/` (Basic, UI, Forms, Collections, Functional, Headless)
> **Standard:** Figma component name = code component name, Figma property name = code prop name. Zero mapping.

---

## Table of Contents

- [1. Design System Foundation](#1-design-system-foundation)
- [2. Directory Structure](#2-directory-structure)
- [3. Fully In Sync](#3-fully-in-sync)
- [4. Name Mismatches](#4-name-mismatches)
- [5. Property Mismatches](#5-property-mismatches)
- [6. Structural Mismatches](#6-structural-mismatches)
- [7. Figma Only — No Code Equivalent](#7-figma-only--no-code-equivalent)
- [8. Code Only — No Figma Equivalent](#8-code-only--no-figma-equivalent)
- [9. Deprecated / Stale](#9-deprecated--stale)
- [10. Action Plan](#10-action-plan)

---

## 1. Design System Foundation

### Tokens & Theming

Token-driven via CSS custom properties, consumed by Tailwind v4's `@theme` block in `src/styles/app.css`.

| Token Category | Examples |
|---|---|
| Colors | `brand-*`, `secondary-*`, `neutral-*`, `info-*`, `success-*`, `warning-*`, `error-*`, `accent-1`–`accent-11` (each with `-subtle`, `-contrast`, `-border`), semantic tokens (`text-*`, `surface-*`, `button-*`, `status-*`) |
| Typography | `--typography-family-body` (Sora), `--typography-family-heading` (Commissioner) |
| Spacing/Sizing | `--size-*`, `--spacing-*`, `--size-button-*`, `--size-input-*`, `--size-control-*` |
| Radius | `--radius-card-sm/md/lg`, `--radius-button-sm/md/lg` |
| Shadow | `--shadow-light-sm` |

**4 themes** via `data-theme`:

| Theme | File |
|---|---|
| Uncapped (+ Amazon) | `src/styles/themes/uncapped.css` |
| Jungle Scout | `src/styles/themes/jungle-scout.css` |
| Seller Mate | `src/styles/themes/seller-mate.css` |
| Demo | `src/styles/themes/demo.css` |

### Typography

- Figma: [Heading](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1173-45640) + [Paragraph](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1119-468)
- Code: `Basic/Typography` — 16 variants (`h1`–`h6`, `bodyTitle`, `bodyMedium`, `tableHeader`, `tableValue`, `tableLink`, `link`, `body`, `smallTitle`, `smallCopy`, `footnote`)

---

## 2. Directory Structure

### Current State

Components are spread across 8 directories with no clear principle:

```
src/components/
├── Basic/          9 components   — "foundational" (Button, Typography, BoxIcon...)
├── UI/            43 components   — everything else from design system + app-specific
├── Forms/         15 components   — RHF-controlled inputs
├── Collections/   10 components   — composite components (mix of design system + domain)
├── Functional/     7 components   — logic-only (guards, error handling)
├── Headless/       2 components   — renderless (MultistepForm, Page)
├── Content/        2 directories  — domain content (Onboarding, Registration)
└── Shared/         8 components   — domain shared forms/modals
```

**Problems:**
- `Basic/` vs `UI/` is arbitrary — Button is "Basic" but Chip is "UI". No rule explains which goes where.
- `Forms/` separates inputs by RHF coupling, not by design system membership — `Select` and `TextInput` have Figma pages but live in a different directory than `Chip` and `Accordion`.
- `Collections/` mixes design system components (`FieldsSummary`) with domain-specific ones (`TransactionList`).
- A designer saying "use the Autocomplete component" gives no hint whether it's in `Basic/`, `UI/`, `Forms/`, or `Collections/`.

### Proposed Structure

Create a `ui-kit/` directory for everything that has a Figma counterpart — including inputs. The rule: **if it has a Figma page, it lives in `ui-kit/`**. Everything else stays where it is for now.

```
src/components/
├── ui-kit/                    # 1:1 with Figma UI Kit pages
│   ├── Accordion/
│   ├── Amount/                # was OfferAmount
│   ├── AreaChart/             # was GraphWidget
│   ├── Autocomplete/          # was CustomCombobox
│   ├── BarChart/              # was SimpleBarChart + AmountBar
│   ├── Button/
│   ├── ButtonGroup/
│   ├── Card/                  # absorbs CardV2
│   ├── Checkbox/
│   ├── Chip/
│   ├── CurrencyInput/         # was Input renderType=currency + MoneyFields
│   ├── DateInput/
│   ├── Gradient/
│   ├── IconContainer/         # was BoxIcon
│   ├── ListItem/              # absorbs ListItemLarge + ListItemInput
│   ├── Loader/
│   ├── Logo/
│   ├── Menu/                  # was DropdownMenu
│   ├── Modal/
│   ├── Notice/
│   ├── Nudge/
│   ├── PageHeader/            # was PageBar
│   ├── PhoneInput/            # was Input renderType=phone
│   ├── ProgressBar/
│   ├── RadioButton/           # was MultipleRadio
│   ├── RangeSlider/           # was SliderInput
│   ├── Select/
│   ├── Separator/
│   ├── TextInput/             # was Input
│   ├── ToggleSwitch/          # new — extracted from deprecated Checkbox
│   ├── Typography/
│   └── Value/                 # was SimpleTable + FieldsSummary
│
├── Basic/                     # remains as-is (non-ui-kit components stay)
├── UI/                        # remains as-is (non-ui-kit components stay)
├── Forms/                     # remains as-is (non-ui-kit components stay)
├── Collections/               # remains as-is
├── Functional/                # remains as-is
├── Headless/                  # remains as-is
├── Content/                   # remains as-is
└── Shared/                    # remains as-is
```

**Rules:**
1. **`ui-kit/` = Figma UI Kit.** Every component here has a corresponding Figma page. Component name = Figma page name.
2. **To add a component to `ui-kit/`, it needs a Figma page first.** This prevents drift.
3. **Non-ui-kit components stay in their current directories.** Restructuring those is a separate effort.

### Migration Map

Only UI Kit components move. Everything else stays.

| Current Path | New Path | Change |
|---|---|---|
| `Basic/BoxIcon` | `ui-kit/IconContainer` | Move + rename |
| `Basic/Button` | `ui-kit/Button` | Move |
| `Basic/ButtonGroup` | `ui-kit/ButtonGroup` | Move |
| `Basic/Separator` | `ui-kit/Separator` | Move |
| `Basic/Typography` | `ui-kit/Typography` | Move |
| `UI/Accordion` | `ui-kit/Accordion` | Move |
| `UI/AmountBar` | `ui-kit/BarChart` | Move + merge |
| `UI/Card` + `UI/CardV2` | `ui-kit/Card` | Move + merge |
| `UI/Chip` | `ui-kit/Chip` | Move |
| `UI/DropdownMenu` | `ui-kit/Menu` | Move + rename |
| `UI/Gradient` | `ui-kit/Gradient` | Move |
| `UI/GraphWidget` | `ui-kit/AreaChart` | Move + rename |
| `UI/ListItem` + `UI/ListItemLarge` + `UI/ListItemInput` | `ui-kit/ListItem` | Move + merge |
| `UI/Loader` | `ui-kit/Loader` | Move |
| `UI/Logo` | `ui-kit/Logo` | Move |
| `UI/Modal` | `ui-kit/Modal` | Move |
| `UI/Notice` | `ui-kit/Notice` | Move |
| `UI/Nudge` | `ui-kit/Nudge` | Move |
| `UI/OfferAmount` | `ui-kit/Amount` | Move + rename |
| `UI/PageBar` | `ui-kit/PageHeader` | Move + rename |
| `UI/ProgressBar` | `ui-kit/ProgressBar` | Move |
| `UI/SimpleBarChart` | `ui-kit/BarChart` | Move + merge |
| `UI/SimpleTable` + `Collections/FieldsSummary` | `ui-kit/Value` | Move + merge |
| `UI/Widget` | `ui-kit/KeyValues` | Move + rename |
| `Forms/Input` | `ui-kit/TextInput` | Move + rename |
| `Forms/Input` (renderType=phone) | `ui-kit/PhoneInput` | Extract + move |
| `Forms/Input` (renderType=currency) + `Forms/MoneyFields` | `ui-kit/CurrencyInput` | Extract + merge + move |
| `Forms/Select` | `ui-kit/Select` | Move |
| `Forms/CustomCombobox` | `ui-kit/Autocomplete` | Move + rename |
| `Forms/Checkbox` | `ui-kit/Checkbox` | Move |
| `Forms/MultipleRadio` | `ui-kit/RadioButton` | Move + rename |
| `Forms/SliderInput` | `ui-kit/RangeSlider` | Move + rename |
| `Forms/DateInput` | `ui-kit/DateInput` | Move |

**New component (no current source):**
| New Path | Source |
|---|---|
| `ui-kit/ToggleSwitch` | Extracted from deprecated `UI/Checkbox` (renderStyle=switch) |

---

## 3. Fully In Sync

Components where **name matches** and **props/variants are consistent**.

### Button
- **Figma:** [Button](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2-1303) | **Code:** `src/components/Basic/Button/Button.tsx`
- **Status:** ✅ Name matches, variants aligned

> **But property names differ** — see [Section 4](#41-button--property-model-differs).

### Loader
- **Figma:** [Loader](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=353-210) | **Code:** `src/components/UI/Loader/Loader.tsx`
- **Status:** ✅

Figma `Size`: `xxs`/`xs`/`sm`/`md`/`lg`/`xl` — Code `size`: same values. Match.

### Select
- **Figma:** [Select](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=568-476) | **Code:** `src/components/Forms/Select/Select.tsx`
- **Status:** ✅

### Checkbox
- **Figma:** [Checkbox](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2-98) | **Code:** `src/components/Forms/Checkbox/Checkbox.tsx`
- **Status:** ✅

Figma props: `Checked`, `State`, `Focused`, `Disabled`, `Inline`, `Layout` (Right/Left). Code is RHF-controlled which handles checked/disabled via form state.

### Accordion
- **Figma:** [Accordion](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=475-483) | **Code:** `src/components/UI/Accordion/Accordion.tsx`
- **Status:** ✅

Figma: `Open` (True/False). Code: items with `alwaysOpen`, `variant` (`v1`/`v2`).

### Progress Bar
- **Figma:** [Progress Bar](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1570-13635) | **Code:** `src/components/UI/ProgressBar/ProgressBar.tsx`
- **Status:** ✅ Name matches

> **But property names differ** — see [Section 4](#46-progress-bar--property-names-differ).

### Nudge
- **Figma:** [Nudge](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=3421-180) | **Code:** `src/components/UI/Nudge/Nudge.tsx`
- **Status:** ✅

Figma: `Layout` (Vertical/Horizontal), `Elevated` (True/False). Code: `layout` (`horizontal`/`vertical`), `accent`.

### Modal
- **Figma:** [Modal](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=193-391) | **Code:** `src/components/UI/Modal/Modal.tsx`
- **Status:** ✅

Code: `size` (`sm`/`md`/`lg`), `fullScreen`, `slim`.

### Date Input
- **Figma:** [Date Input](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1197-4190) | **Code:** `src/components/Forms/DateInput/DateInput.tsx`
- **Status:** ✅

---

## 4. Name Mismatches

Components where **Figma and code use different names**. One side needs to be renamed.

| Figma Name | Figma Link | Code Name | Code Path | Rename Target |
|---|---|---|---|---|
| **Icon Container** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1106-2097) | `BoxIcon` | `Basic/BoxIcon/` | Code → `IconContainer` |
| **Text Input** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=475-504) | `Input` | `Forms/Input/` | Code → `TextInput` |
| **Menu** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1834-7496) | `DropdownMenu` | `UI/DropdownMenu/` | Code → `Menu` |
| **Autocomplete** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=475-488) | `CustomCombobox` | `Forms/CustomCombobox/` | Code → `Autocomplete` |
| **Page Header** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2-1272) | `PageBar` | `UI/PageBar/` | Code → `PageHeader` |
| **Gradient Background** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1250-364) | `Gradient` | `UI/Gradient/` | Figma → `Gradient` or Code → `GradientBackground` |
| **Range Slider** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1913-38979) | `SliderInput` | `Forms/SliderInput/` | Code → `RangeSlider` |
| **Area Chart** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=3435-9845) | `GraphWidget` | `UI/GraphWidget/` | Code → `AreaChart` |
| **Key Values** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1814-39678) | `Widget` | `UI/Widget/` | Code → `KeyValues` |
| **Button Patterns** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1197-3019) | `ButtonGroup` | `Basic/ButtonGroup/` | Agree on one name |
| **Amount** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1250-334) | `OfferAmount` | `UI/OfferAmount/` | Code → `Amount` |

---

## 5. Property Mismatches

Components where **names may or may not match, but the prop/property names or values are inconsistent**.

### 4.1 Button — property model differs

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `Color` + `Variant` | Color: Primary/Secondary/Tertiary/Error × Variant: Solid/Outline/Link | `variant` | `primary`/`secondary`/`tertiary`/`link` |
| `State` | Default/Hover/Loading/Disabled/Error | `loading`, `disabled`, `error` | separate booleans |
| `Hug contents` | True/False | `fullWidth` | boolean (**inverse logic**) |
| `Icon only` | True/False | — | auto-derived, not a prop |
| `Disabled` | True/False | `disabled` | boolean ✅ |

**Issues:**
- Figma uses two axes (`Color` × `Variant`) for what code handles as a single `variant` prop. The Figma `Variant=Link` maps to code `variant="link"`, but `Variant=Outline` maps to code `variant="secondary"` — this requires a mapping table.
- `Hug contents=True` in Figma means `fullWidth=false` in code — inverse semantics.
- Figma has `Error` as a `Color`, code has it as a separate boolean `error` prop.

---

### 4.2 Chip — color values differ + missing features

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `Style` | Success/Error/Warning/Info/Default/Disabled | `color` | `danger`/`success`/`warning`/`disabled`/`default` |
| — | — | — | No `size` prop |
| `On Dark` | True/False | — | Not supported |

**Issues:**
- Figma calls it `Style`, code calls it `color` — different prop name.
- Figma value `Error` = code value `danger` — different value name.
- Figma has `Info` — code doesn't have it.
- Figma has `On Dark` — code doesn't support it.
- Figma has 3 sizes (Lg/Md/Sm) controlled via appearance panel — code has no `size` prop.

---

### 4.3 Icon Container / BoxIcon — completely different property model

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `Accent Color` | Brand/Cyan/Orange/Blue/Green/Violet/Yellow/Pink/Indigo/Teal/Purple/None/Default | `severity` | `accent-1`–`accent-11`/`accent-brand` |
| `Size` | sm/md/lg | `size` | `6`/`10` |
| `Type` | Icon/Logo | — | Not supported |
| `Error` | True/False | — | Not supported |
| `Disabled` | True/False | — | Not supported |
| `On Dark` | True/False | — | Not supported |

**Issues:**
- Figma uses human-readable color names (`Cyan`, `Orange`), code uses numbered accents (`accent-1`, `accent-2`) — requires a mapping table to know which is which.
- Figma has 3 sizes (`sm`/`md`/`lg`), code has 2 (`6`/`10`) with numeric values instead of semantic names.
- Figma has `Type`, `Error`, `Disabled`, `On Dark` — none exist in code.

---

### 4.4 Notice — missing variants + different property names

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `Style` | Default/Elevated/Success/Error/Warning/Info | `variant` | `warning`/`danger`/`info` |
| `Layout` | Horizontal/Vertical | — | Not supported |
| `Size` | Medium/Small | — | Not supported |

**Issues:**
- Figma calls it `Style`, code calls it `variant`.
- Figma `Error` = code `danger`.
- Figma has `Default`, `Elevated`, `Success` — code doesn't.
- Figma has `Layout` and `Size` props — code doesn't.

---

### 4.5 Card — completely different property model

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `With Header` | True/False | — | Separate `CardV2` component |
| `With State` | True/False | — | Not supported |
| `With Gradient` | True/False | `variant` | `background` |
| `On Dark` | True/False | — | Not supported |
| `Active` | True/False | — | Not supported |
| — | — | `spacing` | `default`/`big`/`small` |
| — | — | `variant` | `default`/`background`/`tertiary` |

**Issues:**
- Figma uses boolean toggles (`With Header`, `With Gradient`), code uses a `variant` enum.
- Figma's `With Header=True` requires a different code component (`CardV2`) — structural split.
- Figma has `Active`, `On Dark`, `With State` — code doesn't.

---

### 4.6 Progress Bar — property names differ

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `State` | Active/Paused/Ready | `color` | `error`/`orange`/`paused` |
| `Complete` | True/False | — | Derived from `current === total` |
| `%` | 0–100 / adjustable | `current` + `total` | numbers |

**Issues:**
- Figma calls it `State`, code calls it `color` — and the values don't match (`Active` vs no equivalent, `Ready` vs no equivalent).
- Figma tracks completion as a boolean, code derives it from `current`/`total`.

---

### 4.7 List Item — different property model

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `State` | Default/Hover/Error | `error` + `active` | booleans |
| `Clickable` | True/False | — | Derived from `href` presence |
| `Disabled` | True/False | `disabled` | boolean ✅ |
| `Control.Type` | Radio Button/Checkbox/Toggle Switch | — | Separate `ListItemInput` component |

**Issues:**
- Code component is named `ListItemLarge`, not `ListItem`.
- Figma has embedded control types (radio, checkbox, toggle) — code puts these in a separate `ListItemInput` component.
- Code has 11+ `more.type` values for right-side actions that aren't modeled in Figma at all.

---

### 4.8 Nav Item — different property names

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `State` | Default/Hover/Active | — | Not a standalone component |
| `Onboarding` | True/False | — | Inline in PortalMenu |
| `Inline` | True/False | — | Inline in PortalMenu |

**Issues:**
- Figma defines Nav Item as a standalone atom. Code has no `NavItem` component — it's rendered inline in `PortalMenu`.

---

### 4.9 Toggle Switch — no proper code component

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `On` | True/False | `checked` | boolean (on deprecated `UI/Checkbox`) |
| `State` | Active/Inactive | — | — |
| `Focused` | True/False | — | — |
| `Disabled` | True/False | `disabled` | boolean |

**Issues:**
- Figma has a dedicated `Toggle Switch` atom. Code only has it as `renderStyle="switch"` on the **deprecated** `UI/Checkbox`.
- No standalone, non-deprecated Toggle Switch component exists.

---

### 4.10 Radio Button — name + structure mismatch

| Figma Property | Figma Values | Code Prop | Code Values |
|---|---|---|---|
| `Selected` | True/False | — | RHF-controlled internally |
| `Focused` | True/False | — | — |
| `Disabled` | True/False | — | Per-group, not per-item |
| `Inline` / `Layout` | True/False / Right/Left | — | `variant` (`default`/`compact`) |

**Issues:**
- Figma: `Radio Button` (standalone atom). Code: `MultipleRadio` (group only) — no standalone radio button component.
- Different names, different granularity.

---

## 6. Structural Mismatches

Cases where **one Figma component maps to multiple code components** or vice versa. These force a mapping layer.

### 5.1 Banner / Offer / Amount → `MainBanner`

Three separate Figma components share **one code component**:

| Figma Component | Figma Link |
|---|---|
| [Banner](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1258-1101) | Gradient hero banner with heading, content, action list |
| [Offer](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1814-31879) | Offer card with amount + progress bar + content |
| [Amount](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1250-334) | Currency display with label top/bottom + confetti |

**Code:** `src/components/UI/MainBanner/MainBanner.tsx` (themes: `default`/`dark`) + `src/components/UI/OfferAmount/OfferAmount.tsx`

**Decision needed:** Either split `MainBanner` into 3 components matching Figma, or consolidate the 3 Figma pages into one.

---

### 5.2 Top Bar → `LogoOnlyMenu` + `ActionButtons`

- **Figma:** [Top Bar](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2290-31859) — single molecule
- **Code:** `src/components/UI/LogoOnlyMenu/LogoOnlyMenu.tsx` + `src/components/Collections/ActionButtons/ActionButtons.tsx` — two components

---

### 5.3 Nav Groups → `PortalMenu` + `StepperMenu`

- **Figma:** [Nav Groups](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1196-2135) — single molecule with pre-offer, post-offer, and portal variants
- **Code:** `src/components/UI/PortalMenu/PortalMenu.tsx` + `src/components/UI/StepperMenu/StepperMenu.tsx` — two components

---

### 5.4 Card → `Card` + `CardV2`

- **Figma:** [Card](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2-1271) — single component with `With Header` toggle
- **Code:** `src/components/UI/Card/Card.tsx` (base) + `src/components/UI/CardV2/CardV2.tsx` (with header) — two components

---

### 5.5 List Item → `ListItemLarge` + `ListItem` + `ListItemInput`

- **Figma:** [List Item](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1555-2576) — single component with `Control.Type` for embedded inputs
- **Code:** Three separate components:
  - `src/components/UI/ListItemLarge/ListItemLarge.tsx` — feature-rich
  - `src/components/UI/ListItem/ListItem.tsx` — simple link-only
  - `src/components/UI/ListItemInput/ListItemInput.tsx` — with checkbox/radio/switch

---

### 5.6 Value → `SimpleTable` + `FieldsSummary`

- **Figma:** [Value](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1935-5820) — single atom for label/value rows
- **Code:** `src/components/UI/SimpleTable/SimpleTable.tsx` + `src/components/Collections/FieldsSummary/FieldsSummary.tsx` — two components, neither named "Value"

---

### 5.7 Bar Chart → `SimpleBarChart` + `AmountBar`

- **Figma:** [Bar Chart](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2956-5670) — single organism
- **Code:** `src/components/UI/SimpleBarChart/SimpleBarChart.tsx` + `src/components/UI/AmountBar/AmountBar.tsx` — two components

---

### 5.8 Phone Input / Currency Input → `Input` renderType variants

- **Figma:** [Phone Input](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1197-4188) + [Currency Input](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1212-1006) — two dedicated component pages
- **Code:** `src/components/Forms/Input/Input.tsx` with `renderType="phone"` / `renderType="currency"` — one component with a mode switch

**Decision needed:** Either extract `PhoneInput` and `CurrencyInput` as standalone code components, or merge the Figma pages into the Text Input page as variants.

---

## 7. Figma Only — No Code Equivalent

| Figma Component | Figma Link | Notes |
|---|---|---|
| **Connector** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=3396-11598) | Decorative line/dot connector. Likely CSS-only. |
| **Scrollbar** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=593-4553) | Custom scrollbar styling. CSS-only, not a component. |
| **Confetti** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1801-401) | Standalone atom in Figma. Embedded in `MainBanner` in code — not reusable. |
| **Benefit List** | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2286-7626) | Figma page is empty. |

---

## 8. Code Only — No Figma Equivalent

### High Priority — widely used, should be in Figma

| Code Component | Path | Usage | Notes |
|---|---|---|---|
| **Alert** | `UI/Alert/Alert.tsx` | **41+ files** | 6 types: `normal`/`danger`/`info`/`warning`/`success`/`waiting`. SCSS modules. Most widely used feedback component with no Figma representation. Overlaps with Notice. |
| **Switcher / SwitcherV2** | `Basic/Switcher/` | Common | Segmented tab control (pill tabs). Two visual variants. No Figma page. |
| **Tabs** | `UI/Tabs/Tabs.tsx` | Common | Tab container built on Switcher. |
| **RadioCard / RadioCardGroup** | `UI/RadioCard/` | Selection flows | Full-card radio buttons. Props: `name`, `value`, `label`, `checked`, `disabled`, `onChange`. |
| **Dropdown** | `UI/Dropdown/Dropdown.tsx` | Forms | Controlled value selector (Headless UI Listbox). Different from Menu — this is for picking a value. Props: `options`, `onChange`, `value`, `label`, `disabled`. |

### Medium Priority

| Code Component | Path | Notes |
|---|---|---|
| **ClipboardBox** | `UI/ClipboardBox/` | Copy-to-clipboard display. Variants: `default`/`branded`. |
| **Confirmation** | `UI/Confirmation/` | Full-page success/error screen with illustration. |
| **SearchableList** | `Collections/SearchableList/` | Alphabetical searchable list with "frequently selected" section. |
| **DatePicker** | `Forms/DatePicker/` | Calendar picker (react-day-picker). Figma only has split-field DateInput. |
| **CheckList** | `UI/CheckList/` | Read-only list with checkmark icons. |
| **ProductStory** | `UI/ProductStory/` | Slideshow/story modal with keyboard nav. |
| **ErrorListItem** | `UI/ErrorListItem/` | Error row with icon, title, action. |

### Low Priority — domain-specific

| Code Component | Path |
|---|---|
| ApiErrorAlert | `Functional/ApiErrorAlert/` |
| InviteMembersButton | `UI/InviteMembersButton/` |
| GoogleAutocompleteInput | `Forms/GoogleAutocompleteInput/` |
| CheckboxGroup | `Forms/CheckboxGroup/` |
| GodMode | `Functional/GodMode/` |

---

## 9. Deprecated / Stale

### Deprecated Code Components

| Component | Path | Replacement | Blocker |
|---|---|---|---|
| `UI/Checkbox` | `UI/Checkbox/Checkbox.tsx` | `Forms/Checkbox` | Still the only Toggle Switch implementation (`renderStyle="switch"`) |
| `UI/ContentDivider` | `UI/ContentDivider/` | `UI/Card` | — |
| `Layout.Sidebar` | `UI/Layout/Layout.tsx` | None needed | — |

### Stale Figma Pages

| Page | Link | Issue |
|---|---|---|
| Benefit List | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2286-7626) | Empty page |
| Toggle Switch (In Progress) | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1828-5769) | Duplicate of the atom page — should be cleaned up |
| Hubspot Widget | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1888-17889) | In Progress — promote or archive |
| Available Funding Chart | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=1888-19288) | In Progress — promote or archive |
| Sidebar | [link](https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=120-38) | In Progress — `Layout.Sidebar` is deprecated in code |

### Alert vs Notice — overlapping components

Two feedback components exist in code with overlapping purpose:

| | Alert | Notice |
|---|---|---|
| Styling | SCSS modules + clsx | CVA + Tailwind |
| In Figma? | **No** | **Yes** |
| Usage | **41+ files** | Fewer, newer |
| Variants | `normal`/`danger`/`info`/`warning`/`success`/`waiting` | `warning`/`danger`/`info` |
| Layout prop | `horizontal`/`vertical` | — |

**This is the biggest inconsistency.** The most-used feedback component (Alert) isn't in Figma. The Figma-defined one (Notice) has fewer variants. Must decide: expand Notice and migrate, or add Alert to Figma.

---

## 10. Action Plan

### Phase 1 — Move UI Kit components into `ui-kit/`

Create `src/components/ui-kit/` and move all Figma-matched components there with their new names. Renames and merges happen as part of the move. Non-ui-kit components stay in their current directories.

See [Section 2 — Migration Map](#migration-map) for the full list.

**Order of operations per component:**
1. Create new directory in `ui-kit/` with the Figma name
2. Move/merge source files
3. Update all imports across the codebase
4. Delete the old directory
5. Verify tests pass

**Components requiring merge during move:**
- `Card` + `CardV2` → `ui-kit/Card` (compound `Card.Header` sub-component)
- `ListItem` + `ListItemLarge` + `ListItemInput` → `ui-kit/ListItem` (with `control` prop)
- `SimpleBarChart` + `AmountBar` → `ui-kit/BarChart`
- `SimpleTable` + `FieldsSummary` → `ui-kit/Value`
- `Input` (renderType=phone) → `ui-kit/PhoneInput` (extract)
- `Input` (renderType=currency) + `MoneyFields` → `ui-kit/CurrencyInput` (extract + merge)

**New component:**
- `ui-kit/ToggleSwitch` — extract from deprecated `UI/Checkbox` (renderStyle=switch)

### Phase 2 — Align prop names + values

Per-component prop renames to match Figma properties. Requires updating all usage sites.

| Component | Current Prop | New Prop (= Figma) | Notes |
|---|---|---|---|
| Chip | `color` | `style` | Rename prop |
| Chip | `color="danger"` | `style="error"` | Rename value |
| Chip | — | `size` | Add `lg`/`md`/`sm` |
| Chip | — | `onDark` | Add boolean |
| Notice | `variant` | `style` | Rename prop |
| Notice | `variant="danger"` | `style="error"` | Rename value |
| Notice | — | `layout` | Add `horizontal`/`vertical` |
| Notice | — | `size` | Add `medium`/`small` |
| Notice | — | `style="success"/"elevated"/"default"` | Add missing variants |
| IconContainer | `severity` | `accentColor` | Rename prop |
| IconContainer | `severity="accent-1"` | `accentColor="cyan"` | Use human-readable names |
| IconContainer | `size={6}` | `size="sm"` | Use semantic sizes |
| IconContainer | — | `size="lg"` | Add third size |
| IconContainer | — | `type` / `error` / `disabled` / `onDark` | Add missing props |
| ProgressBar | `color` | `state` | Rename prop |

### Phase 3 — Resolve remaining structural mismatches

These are Figma ↔ code boundary mismatches not covered by Phase 1 merges.

| Issue | Options |
|---|---|
| `Banner` / `Offer` / `Amount` → `MainBanner` | Either split `MainBanner` into 3 ui-kit components or consolidate the 3 Figma pages into 1 |
| `LogoOnlyMenu` + `ActionButtons` → `TopBar` | Create `ui-kit/TopBar` composition or align Figma naming |
| `PortalMenu` + `StepperMenu` → `NavGroup` | Keep split — they serve genuinely different UX |

### Phase 4 — Fill gaps

1. **Resolve Alert vs Notice** — expand Notice to cover all Alert variants and migrate, or add Alert to Figma.
2. **Add to Figma:** Switcher/Tabs, RadioCard, Dropdown, ClipboardBox, Confirmation, SearchableList.
3. **Clean up Figma:** remove empty Benefit List page, archive stale "In Progress" pages.

### Phase 5 — Remove deprecated

1. Delete `UI/Checkbox` after `ToggleSwitch` is extracted and `ListItemInput` merged into `ListItem`.
2. Delete `UI/ContentDivider`.
3. Remove `Layout.Sidebar`.
