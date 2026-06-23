---
name: component-library
description: Use when choosing or composing components for an Uncapped prototype. Lists every component in the design system with its purpose, key props, and when to use each. Always check this before building a custom version of anything.
---

# Skill: Uncapped Component Library

## When to use this skill
Whenever you're about to build any UI element —
button, card, banner, chip, label, input, modal —
check here first. The DS likely already has it.
Hand-rolling something the DS provides is the most
common avoidable mistake.

## Where components live
- `Assets-Uncapped/front-portal-develop/src/components/Basic/`
- `Assets-Uncapped/front-portal-develop/src/components/UI/`

Glob both folders before building. The codebase is
the source of truth — this skill is a fast index.

## Component inventory

### Text and actions

| Need | Component | Notes |
|---|---|---|
| Any text | `<Typography type="…" color="…">` | Only way to render text. Mind the Figma↔code shift. |
| Clickable action | `<Button variant size>` | `variant="primary\|secondary\|tertiary\|link"`, `size="md\|sm"` |
| Group of buttons | `<ButtonGroup>` | Layouts buttons together |
| Decorative coloured icon container | `<BoxIcon icon severity size>` | `severity="accent-1…11\|accent-brand"`; `size={6\|10}` |

### Containers

| Need | Component | Notes |
|---|---|---|
| Plain card | `<Card spacing>` | `spacing="default\|big\|small"`. White, `shadow-light-sm` |
| Card with header + icon | `<CardV2 title icon severity actions>` | Icon header + off-white body. Matches Figma "Widget" |
| Multi-step form / data card | `<Widget>` | Composable card with sections |
| Modal overlay | `<Modal>` | DS modal, do not roll your own |
| Drawer / side panel | (use `<Modal>` with positioning) | No dedicated drawer component yet |

### Status and feedback

| Need | Component | Notes |
|---|---|---|
| Status banner | `<Notice variant title icon>` | `variant="info\|warning\|danger\|brand"`. **`danger` not `error`. `brand` not `success`.** |
| Status pill | `<Chip label color>` | `color="success\|warning\|danger\|disabled\|default"` |
| Tip / guidance card | `<Nudge icon title content layout accent>` | `accent={1-11\|"brand"}`, `layout="horizontal\|vertical"` |
| Inline alert | `<Alert>` | Lighter than Notice, used inline |
| Toast notification | `<Toast>` | Auto-dismissing, slide-in |
| Confirmation dialog | `<Confirmation>` | Pre-confirm summary before irreversible actions |
| Loader | `<Loader>` | Skeleton-style; prefer over spinners |

### Money + numbers

| Need | Component | Notes |
|---|---|---|
| Decorated offer amount | `<OfferAmount amount currency>` | Hero financial number, decorated |
| Segmented LOC bar | `<AmountBar segments currency>` | Drawn / pending / available, customisable colours |
| Step progress bar | `<ProgressBar total current color>` | Segmented (one per step), not smooth percentage |

### Lists, tables, content

| Need | Component | Notes |
|---|---|---|
| Simple table | `<SimpleTable>` | Lightweight tabular data |
| List item | `<ListItem>` / `<ListItemLarge>` / `<ListItemInput>` | Variants for list rows |
| Checklist | `<CheckList>` | Steps with check states |
| Accordion | `<Accordion>` | Expandable sections |
| Section divider | `<ContentDivider>` / `<Separator>` | Visual splits |
| Tabs | `<Tabs titles={[…]}>` | Tabbed content |
| Bar chart | `<SimpleBarChart>` / `<GraphWidget>` | Data visualisation |

### Forms

| Need | Component | Notes |
|---|---|---|
| Form layout | `<FormLayout>` | Standard form structure, label + input + helper |
| Checkbox / Radio / Toggle | `<Checkbox>`, `<RadioCard>`, `<Switcher>` | DS controls |
| Dropdown | `<Dropdown>` / `<DropdownMenu>` | Select-style and menu-style |

### Page shell

| Need | Component | Notes |
|---|---|---|
| Standard portal page | `<Layout menu={<PortalMenu />}>` + `<Layout.Parent>` | Handles 270px nav, sticky positioning, mobile collapse |
| Onboarding-style page | `<Layout mode="onboarding" sidebar={…}>` | Form on left, contextual panel on right |
| Plain page (no nav) | `<PlainLayout>` | For standalone screens |
| Stepper-driven flow | `<StepperMenu>` | Numbered step navigation |
| Logo-only menu | `<LogoOnlyMenu>` | Minimal header (e.g. application flows) |

### Brand and decoration

| Need | Component | Notes |
|---|---|---|
| Teal hero / amount banner | `<Gradient>` | Wraps content in teal gradient. White-label safe. |
| Logo | `<Logo>` | Renders the active brand's logo |
| Trustpilot widget | `<TrustpilotWidget>` | For credibility on key screens |
| Main banner (top of page) | `<MainBanner>` | Page-level banner |
| Page bar (sub-nav) | `<PageBar>` | Sub-navigation bar |
| Product story card | `<ProductStory>` | Narrative section |

### Icons
```tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { Home08SolidStandard } from "@hugeicons-pro/core-solid-standard"

<HugeiconsIcon icon={Home08SolidStandard} size={20} className="text-brand-600" />
```
Sizes: 16 / 20 / 24 / 32. Colour via `text-*` class — never inline hex. Never inline SVG re-creations.

## Always-prefer list (don't hand-roll these)

If you're about to build a custom version of any of these, stop and use the DS component:

- `<Typography>` — never raw `<h1>` / `<p>` with custom sizing
- `<Button>` — never a custom `<button className="bg-…">` 
- `<Card>` / `<CardV2>` — never `<div className="bg-white shadow-…">`
- `<Notice>` — never a custom alert div
- `<Chip>` — never a custom pill
- `<Modal>` — never a custom overlay
- `<Tabs>` — never a custom tab roll-up
- `<Layout>` + `<PortalMenu>` — never a hand-built page shell

## Known gaps

| Gap | Workaround |
|---|---|
| 56px Lg button missing | Use `size="md"` (44px) |
| Notice "Default" and "Elevated" variants missing | Use closest available (`info` or `brand`) |
| Dark mode not implemented | Light mode only |
| No dedicated drawer component | Use `<Modal>` with side positioning |

## Naming quirks (memorise)

- `<Notice variant="danger">` — not `error`
- `<Notice variant="brand">` — not `success`
- Code `<Typography type="h2">` = Figma `Heading/H1` (48px)
- Code `<Typography type="h1">` = financial amount display (56px), **not** page title
