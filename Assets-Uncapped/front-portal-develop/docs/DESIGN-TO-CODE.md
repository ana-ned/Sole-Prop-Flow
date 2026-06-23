# Uncapped — Design System to Code Reference

This document maps every Figma design system concept to the exact React component or CSS class to use when prototyping. Use this alongside `design-system-foundation.md`.

**Prototype location:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/`
**Run the app:** `pnpm dev` inside `front-portal-develop` → open `http://localhost:3000/prototypes/<your-page>`

---

## Typography

Figma calls these "text styles." In code they're handled by a single `<Typography>` component.

```tsx
import Typography from "@/components/Basic/Typography"
```

| Figma style | Code `type` prop | Size | Font | Weight |
|---|---|---|---|---|
| `Heading/H1` | `type="h2"` | 48px | Commissioner | SemiBold |
| `Heading/H2` | `type="h3"` | 40px | Commissioner | SemiBold |
| `Heading/H3` | `type="h4"` | 32px | Commissioner | SemiBold |
| `Heading/H4` | `type="h5"` | 24px | Commissioner | SemiBold |
| `Body/Title` | `type="bodyTitle"` | 16px | Sora | Bold |
| `Body/Medium` | `type="bodyMedium"` | 16px | Sora | SemiBold |
| `Body/Copy` | `type="body"` | 16px | Sora | Regular |
| `Sm/Title` | `type="smallTitle"` | 14px | Sora | Bold |
| `Sm/Copy` | `type="smallCopy"` | 14px | Sora | Regular |
| `XS/Copy` | `type="footnote"` | 12px | Sora | Regular |
| Amount display (56px) | `type="h1"` | 56px | Commissioner | SemiBold |

> **Important gap:** Code `type="h1"` is 56px — it's used for large financial display amounts, not page titles. For a page title (Figma H1 = 48px), use `type="h2"`.

**Colour prop** — use the token name without `color/`:
```tsx
<Typography type="body" color="neutral-800">Main text</Typography>
<Typography type="smallCopy" color="neutral-700">Secondary text</Typography>
<Typography type="footnote" color="neutral-500">Disabled / caption</Typography>
```

**Examples:**
```tsx
// Page heading (Figma Heading/H1)
<Typography type="h2">Your funding offer</Typography>

// Section label (Figma Sm/Title)
<Typography type="smallTitle" color="neutral-800">Balance</Typography>

// Body paragraph
<Typography type="body" color="neutral-700">We'll transfer funds within 24 hours.</Typography>
```

---

## Colour tokens in Tailwind

Instead of hard-coding hex values, use Tailwind colour classes. These map directly to Figma tokens.

| Figma token | Tailwind class (text) | Tailwind class (bg) | Tailwind class (border) |
|---|---|---|---|
| `color/text/primary` | `text-neutral-800` | — | — |
| `color/text/secondary` | `text-neutral-700` | — | — |
| `color/text/link` | `text-brand-600` | — | — |
| `color/text/disabled` | `text-neutral-500` | — | — |
| `color/text/error` | `text-error-500` | — | — |
| `color/surface/canvas` | — | `bg-surface-canvas` | — |
| `color/surface/default` | — | `bg-white` | — |
| `color/brand/500` (teal) | `text-brand-500` | `bg-brand-500` | `border-brand-500` |
| `color/brand/600` (action) | `text-brand-600` | `bg-brand-600` | `border-brand-600` |
| `color/neutral/200` | — | `bg-neutral-200` | `border-neutral-200` |
| `color/neutral/300` | — | `bg-neutral-300` | `border-neutral-300` |
| Accent teal subtle | — | `bg-accent-1-subtle` | `border-accent-1-border` |
| Accent amber subtle | — | `bg-accent-2-subtle` | `border-accent-2-border` |

**Page canvas background** (always set this on the page wrapper):
```tsx
<div className="min-h-screen bg-surface-canvas">
```

---

## Button

```tsx
import Button from "@/components/Basic/Button"
```

| Figma variant | Code prop | Notes |
|---|---|---|
| Primary (teal fill) | `variant="primary"` | Default |
| Secondary (white, teal border) | `variant="secondary"` | |
| Tertiary (amber fill) | `variant="tertiary"` | Use for offer CTAs |
| Text link | `variant="link"` | Inline link style |

| Figma size | Code prop | Height |
|---|---|---|
| Md | `size="md"` | 44px (default) |
| Sm | `size="sm"` | 38px |

> **Gap:** The 56px (Lg) button from Figma is not in the code. Default to `size="md"` (44px) unless the design specifically calls for Sm.

```tsx
// Primary CTA
<Button type="button" variant="primary" onClick={...}>Apply now</Button>

// Secondary action
<Button type="button" variant="secondary">Download PDF</Button>

// Offer accept (always tertiary/amber)
<Button type="button" variant="tertiary">Accept offer</Button>

// Full-width (forms, mobile)
<Button type="button" variant="primary" fullWidth>Continue</Button>

// Loading state
<Button type="button" variant="primary" loading>Submitting...</Button>

// As navigation link
<Button href="/dashboard" variant="secondary">Go to dashboard</Button>
```

---

## Card

Two card variants exist. Choose based on whether the card needs a header row.

### Card — plain container
```tsx
import Card from "@/components/UI/Card"
```

| Prop | Options | Notes |
|---|---|---|
| `variant` | `default` (white), `background` (pattern), `tertiary` (off-white) | Default: white |
| `spacing` | `default` (16px), `big` (24px), `small` (8px) | Default: 16px |

```tsx
// Standard white card (Figma Card Lg)
<Card>
  <Typography type="bodyTitle">Balance</Typography>
  <Typography type="h2">$12,450</Typography>
</Card>

// Tighter card (Md density)
<Card spacing="small">...</Card>
```

### CardV2 — card with icon header row
```tsx
import CardV2 from "@/components/UI/CardV2"
```

This matches the Figma "Widget" pattern — white header with icon + title, off-white body.

```tsx
<CardV2
  title="Next repayment"
  icon={<HugeiconsIcon icon={Calendar01Icon} />}
  severity="accent-3"   // accent-3 = blue. See BoxIcon accent colours below.
  actions={<Button type="button" variant="link" size="sm">View all</Button>}
>
  <Typography type="h4">$2,200</Typography>
  <Typography type="smallCopy" color="neutral-700">Due 15 May 2026</Typography>
</CardV2>
```

---

## Notice (Status banner)

```tsx
import Notice from "@/components/UI/Notice"
```

| Figma variant | Code `variant` | Colours |
|---|---|---|
| Info | `variant="info"` | Blue background + border |
| Warning | `variant="warning"` | Amber background + border |
| Error | `variant="danger"` | Red background + border |
| Success/Brand | `variant="brand"` | Teal background + border |

> **Important:** Code uses `"danger"` for error/red (not `"error"`), and `"brand"` for success/teal (not `"success"`).

```tsx
import { InformationCircleIcon } from "@hugeicons/react"

<Notice
  variant="info"
  title="Bank account connected"
  icon={<InformationCircleIcon />}
>
  We'll use this account to send your funds within 24 hours.
</Notice>

<Notice variant="warning" icon={<AlertCircleIcon />}>
  Your offer expires on Friday 9 May.
</Notice>

<Notice variant="danger" title="Action required" icon={<AlertCircleIcon />}>
  Please upload your latest bank statement to continue.
</Notice>
```

---

## Chip (status label / tag)

```tsx
import Chip from "@/components/UI/Chip"
```

| Figma accent | Code `color` | Use for |
|---|---|---|
| Success / teal | `color="success"` | Completed, Active, Funded |
| Warning / amber | `color="warning"` | Pending, Processing |
| Error / red | `color="danger"` | Failed, Overdue, Declined |
| Disabled | `color="disabled"` | Inactive, Closed |
| Neutral | `color="default"` | Generic label |

```tsx
<Chip label="Active" color="success" />
<Chip label="Pending review" color="warning" />
<Chip label="Payment failed" color="danger" />
<Chip label="Closed" color="disabled" />

// Animated shimmer (use for "Processing" states)
<Chip label="Processing" color="warning" animated />
```

---

## Nudge (tip / guidance card)

Figma calls this "Nudge." A soft card with a coloured icon box, title, and description.

```tsx
import Nudge from "@/components/UI/Nudge"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link04Icon } from "@hugeicons-pro/core-solid-standard"
```

| `accent` value | Colour | Use for |
|---|---|---|
| `"brand"` | Teal (#1ebdc0) | Brand / primary tips |
| `1` | Teal | Same as brand |
| `2` | Amber | Upsell / attention |
| `3` | Blue | Info / data |
| `4` | Green | Success / positive |
| `5` | Red | Warnings / critical |
| `6` | Purple | Feature / premium |

```tsx
// Horizontal layout (icon + text side by side) — most common
<Nudge
  icon={Link04Icon}
  title="Connect your bank account"
  content="Linking your bank helps us make faster decisions and offer you more funding."
  layout="horizontal"
  accent="brand"
/>

// Vertical layout (icon top, text below) — for taller cards
<Nudge
  icon={Link04Icon}
  content="Repayments are taken automatically from your daily revenue."
  layout="vertical"
  accent={3}
/>
```

---

## ProgressBar (step progress)

```tsx
import ProgressBar from "@/components/UI/ProgressBar"
```

This renders a segmented bar (one segment per step), not a smooth percentage bar.

```tsx
// 5-step flow, currently on step 2
<ProgressBar total={5} current={2} />

// With status colours
<ProgressBar total={3} current={1} color="orange" />  // amber/warning
<ProgressBar total={3} current={2} color="error" />   // striped red
<ProgressBar total={3} current={1} color="paused" />  // striped teal
```

---

## Tabs

```tsx
import Tabs from "@/components/UI/Tabs"
```

```tsx
<Tabs
  titles={["Monthly", "Weekly"]}
  tabsClassName="mb-4"
>
  <div>Monthly content</div>
  <div>Weekly content</div>
</Tabs>
```

---

## Gradient (teal hero / offer banner)

Used for the teal gradient header on offer cards, amount banners, and hero sections.

```tsx
import Gradient from "@/components/UI/Gradient"
```

```tsx
<Gradient className="rounded-2xl px-8 py-6 text-center text-white">
  <Typography type="footnote" className="opacity-80 uppercase tracking-wider">
    Your approved offer
  </Typography>
  <Typography type="h1" className="text-white">
    $150,000
  </Typography>
  <Typography type="footnote" className="opacity-80">
    Revenue-based repayment
  </Typography>
</Gradient>
```

---

## OfferAmount (decorated offer number)

Renders a large financial amount with decorative highlight underline — used on offer confirmation screens.

```tsx
import OfferAmount from "@/components/UI/OfferAmount"
```

```tsx
<OfferAmount amount={150000} currency="USD" />
<OfferAmount amount={75000} currency="GBP" />
```

---

## AmountBar (segmented funding bar)

Used for line-of-credit overview — shows drawn, pending, available segments.

```tsx
import AmountBar from "@/components/UI/AmountBar"
```

```tsx
<AmountBar
  currency="USD"
  segments={[
    { amount: 20000, label: "Drawn", color: "neutral-800" },
    { amount: 5000, label: "Requested", color: "neutral-300" },
    { amount: 25000, label: "Available", color: "brand-600", emphasis: true },
  ]}
/>
```

---

## Icons

The icon library is Huge Icons. Import individual icons by name.

```tsx
import { HugeiconsIcon } from "@hugeicons/react"
import { Home08SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Calendar01SolidRounded } from "@hugeicons-pro/core-solid-rounded"

// Default 24px, inherits text colour
<HugeiconsIcon icon={Home08SolidStandard} />

// Custom size
<HugeiconsIcon icon={Home08SolidStandard} size={20} />

// Custom colour
<HugeiconsIcon icon={Calendar01SolidRounded} className="text-brand-600" />
```

**Which package to import from:**
- Most icons → `@hugeicons-pro/core-solid-standard`
- Rounded style (softer) → `@hugeicons-pro/core-solid-rounded`
- Icon names follow the format: `{Name}SolidStandard` or `{Name}SolidRounded`

**Common icons used in the product:**
```tsx
import {
  Home08SolidStandard,        // Dashboard nav
  MoneyExchange03SolidStandard, // Loans / transactions nav
  Activity03SolidRounded,     // Business insights
  MoneyBag02SolidRounded,     // Loans
  UserGroupSolidRounded,      // Team / partners
  Calendar01SolidRounded,     // Dates / repayments
  Link04SolidStandard,        // Connections / bank link
  CheckmarkCircle02SolidStandard, // Success / completed
  Alert02SolidStandard,       // Warning / alert
  InformationCircleSolidStandard, // Info
} from "@hugeicons-pro/core-solid-standard"
```

---

## BoxIcon (coloured icon container)

The 40×40 teal box used inside Nudge and CardV2 headers.

```tsx
import BoxIcon from "@/components/Basic/BoxIcon"
import { HugeiconsIcon } from "@hugeicons/react"
```

| `severity` | Colour | Figma accent |
|---|---|---|
| `"accent-brand"` | Teal (#1ebdc0) | Brand |
| `"accent-1"` | Teal | Accent 1 |
| `"accent-2"` | Amber | Accent 2 |
| `"accent-3"` | Blue | Accent 3 |
| `"accent-4"` | Green | Accent 4 |
| `"accent-5"` | Red | Accent 5 |
| `"accent-6"` | Purple | Accent 6 |

| `size` | Dimensions |
|---|---|
| `6` (default) | 24×24px with 16px icon |
| `10` | 40×40px with 24px icon |

```tsx
<BoxIcon
  icon={<HugeiconsIcon icon={Calendar01SolidRounded} />}
  severity="accent-3"
  size={10}
/>
```

---

## Page Layout

Every prototype should use the same layout structure as the real product.

```tsx
import Layout from "@/components/UI/Layout"
import PortalMenu from "@/components/UI/PortalMenu"
```

**Dashboard layout** (nav + main content + optional right rail):
```tsx
const MyPrototype = () => (
  <Layout menu={<PortalMenu />}>
    <Layout.Parent>
      <div className="flex flex-col gap-y-6">
        {/* your content here */}
      </div>
    </Layout.Parent>
  </Layout>
)
```

**With sidebar** (onboarding/form flows — nav + form + contextual panel):
```tsx
<Layout
  menu={<PortalMenu />}
  mode="onboarding"
  sidebar={<div>Contextual help content</div>}
>
  <Layout.Parent>
    <div className="max-w-[540px]">
      {/* form content */}
    </div>
  </Layout.Parent>
</Layout>
```

> The 270px nav column, sticky positioning, mobile collapse, and max-width constraints are all handled automatically by `Layout`.

---

## Shadows

| Figma token | Tailwind class | When to use |
|---|---|---|
| `Light/Sm` | `shadow-light-sm` | Default for all cards |
| `Light/Md` | `shadow-light-md` | Dropdowns, floating elements |
| `Light/Lg` | `shadow-light-lg` | Modals, popovers |
| `Focus` | `shadow-focus` | Focused inputs / buttons |

---

## Border radius

| Figma token | Tailwind class | Common use |
|---|---|---|
| `radius/full` | `rounded-full` | Chips, pills |
| `radius/2xl` (16px) | `rounded-2xl` | Cards, modals |
| `radius/xl` (12px) | `rounded-xl` | Buttons, inputs, notices |
| `radius/lg` (8px) | `rounded-lg` | Smaller interactive elements |
| `radius/md` (6px) | `rounded-md` | Tight controls |
| `radius/sm` (4px) | `rounded-sm` | Checkboxes, subtle rounding |

---

## Spacing

Base grid: 8px. Use Tailwind spacing classes — they map 1:1 to Figma tokens.

| Figma token | Tailwind | Value |
|---|---|---|
| `spacing/4` | `p-1`, `gap-1` | 4px |
| `spacing/8` | `p-2`, `gap-2` | 8px |
| `spacing/12` | `p-3`, `gap-3` | 12px |
| `spacing/16` | `p-4`, `gap-4` | 16px |
| `spacing/24` | `p-6`, `gap-6` | 24px |
| `spacing/32` | `p-8`, `gap-8` | 32px |
| `spacing/40` | `p-10`, `gap-10` | 40px |

---

## Complete prototype page template

Copy this as a starting point for any new prototype:

```tsx
import Layout from "@/components/UI/Layout"
import PortalMenu from "@/components/UI/PortalMenu"
import Card from "@/components/UI/Card"
import CardV2 from "@/components/UI/CardV2"
import Typography from "@/components/Basic/Typography"
import Button from "@/components/Basic/Button"
import Chip from "@/components/UI/Chip"
import Notice from "@/components/UI/Notice"
import Nudge from "@/components/UI/Nudge"
import { HugeiconsIcon } from "@hugeicons/react"
import { Home08SolidStandard } from "@hugeicons-pro/core-solid-standard"

const MyPrototype = () => {
  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <div className="flex flex-col gap-y-6">

          {/* Page heading */}
          <div>
            <Typography type="h2">Screen title</Typography>
            <Typography type="body" color="neutral-700">Supporting description.</Typography>
          </div>

          {/* Status notice */}
          <Notice variant="info" icon={<HugeiconsIcon icon={Home08SolidStandard} />}>
            Something the user should know.
          </Notice>

          {/* Card with data */}
          <Card>
            <div className="flex items-center justify-between">
              <Typography type="bodyTitle">Section label</Typography>
              <Chip label="Active" color="success" />
            </div>
            <Typography type="h3" className="mt-2">$25,000</Typography>
          </Card>

          {/* Nudge tip */}
          <Nudge
            icon={Home08SolidStandard}
            title="Tip title"
            content="Short tip or guidance text for the user."
            layout="horizontal"
            accent="brand"
          />

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="primary">Primary action</Button>
            <Button type="button" variant="secondary">Secondary</Button>
          </div>

        </div>
      </Layout.Parent>
    </Layout>
  )
}

export default MyPrototype
```

---

## Known gaps between Figma and code

| Figma | Code status |
|---|---|
| Button Lg (56px) | Missing — use `size="md"` (44px) as default |
| Notice "default" and "elevated" variants | Missing — only info/warning/danger/brand exist |
| Typography headings shifted by 1 level | Code h2 = Figma H1, code h3 = Figma H2, etc. |
| Dark mode colour tokens | Not implemented |
| `palette/` prefix variables | Legacy — use `color/` prefix tokens |
| Z-index / layer tokens | Not tokenised — use `z-10`, `z-20` etc. manually |
