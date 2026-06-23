---
name: design-system
description: Use when implementing or auditing visual elements in an Uncapped prototype — colours, typography, spacing, border radius, shadows, density modes, white-label brand modes. Provides the token-to-Tailwind mapping and the Figma↔code typography shift. Reference this before applying any visual style.
---

# Skill: Uncapped Design System

## When to use this skill
Whenever you're choosing a colour, font size, spacing
value, radius, shadow, or component size. Whenever
you're translating a Figma style into code. Whenever
you're checking whether a value is on-system.

## Source of truth
The full token spec lives at:
`Assets-Uncapped/front-portal-develop/docs/design-system-foundation.md`

Component-to-code mapping at:
`Assets-Uncapped/front-portal-develop/docs/DESIGN-TO-CODE.md`

This skill is a quick reference. The two docs above
are the authoritative source — read them when in doubt.

## Two fonts only
- **Commissioner** — headings + financial amounts
- **Sora** — body, labels, UI copy

Use the `<Typography>` component, never raw `<h1>`/`<h2>` 
or inline `font-family`.

## Typography mapping (Figma → code)

The code naming is shifted by one level. Memorise:

| Figma style | Code prop | Size |
|---|---|---|
| `Heading/H1` | `type="h2"` | 48px |
| `Heading/H2` | `type="h3"` | 40px |
| `Heading/H3` | `type="h4"` | 32px |
| `Heading/H4` | `type="h5"` | 24px |
| `Body/Title` | `type="bodyTitle"` | 16px Bold |
| `Body/Copy` | `type="body"` | 16px Regular |
| `Sm/Title` | `type="smallTitle"` | 14px Bold |
| `Sm/Copy` | `type="smallCopy"` | 14px Regular |
| `XS/Copy` | `type="footnote"` | 12px Regular |
| Amount display | `type="h1"` | 56px |

Page title is `type="h2"`. Code `type="h1"` is **only** for hero financial amounts.

## Colour — Tailwind classes (never raw hex)

Surfaces:
- `bg-surface-canvas` (`#f7f4f2`) — page background, **always**
- `bg-white` — cards, modals, panels

Text:
- `text-neutral-800` — primary text, headings
- `text-neutral-700` — secondary
- `text-neutral-500` — disabled, placeholder
- `text-brand-600` — links, primary action text
- `text-error-500` — validation errors

Brand teal:
- `brand-500` `#1ebdc0` — brand primary
- `brand-600` `#128081` — primary action, links
- `brand-700` `#00696b` — hover
- `brand-400` `#a5d3d4` — focus ring, active borders
- `brand-200` / `brand-100` — subtle tints

Status (use as triplet — bg + border + text):
- `success` / `warning` / `danger` / `info`
- 11 accent groups for tags and chips

## Spacing — 8px grid

`gap-1` 4 / `gap-2` 8 / `gap-3` 12 / `gap-4` 16 / `gap-6` 24 / `gap-8` 32 / `gap-10` 40. No arbitrary values like `p-[13px]`.

## Border radius

`rounded-sm` 4 / `rounded-md` 6 / `rounded-lg` 8 / `rounded-xl` 12 / `rounded-2xl` 16 / `rounded-full`. Nested radii smaller than parent.

## Shadows

- `shadow-light-sm` — default for all cards on canvas
- `shadow-light-md` — dropdowns, floating elements
- `shadow-light-lg` — modals, popovers
- `shadow-focus` — focused inputs and buttons (1px `#a5d3d4` ring)

Never use Tailwind's default `shadow-md` / `shadow-lg` — they aren't the Uncapped double-layer shadows.

## Density modes

Three modes — `Lg` (default desktop), `Md` (compact), `Sm` (mobile).

| Element | Lg | Md | Sm |
|---|---|---|---|
| Button height | 56 | 44 | 38 |
| Input height | 56 | 44 | 38 |
| Card padding | 16 | 8 | 4 |
| Card radius | 16 | 12 | 8 |

> **Known gap:** the 56px Lg button is **not in the code yet**. Default to `<Button size="md">` (44px).

## White-label safety

The same screen renders under 10 brand modes (Uncapped, Jungle Scout, Avask, eBay, etc.). Use `brand-*` Tailwind classes — **never** the Uncapped teal hex inline. The brand variable collection swaps the teal for the active brand's colour.

## What to never do
- Hardcode hex values in JSX
- Use deprecated token prefixes (`palette/*`, `font/*`) — they're now `color/*` and `typography/*`
- Use `bg-white` on the page background — it's always `bg-surface-canvas`
- Use `<Notice variant="error">` or `variant="success"` — the API uses `danger` and `brand`
- Pure black shadows or arbitrary `box-shadow`
- Skip the focus ring with `outline:none` and no replacement
