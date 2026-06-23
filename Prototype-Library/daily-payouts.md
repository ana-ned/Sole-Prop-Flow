# Daily Payouts — Offer Screen

**Status:** Polished — 2026-05-05
**Figma:** [Multi-Offers-Q2-2026 / Daily Payouts](https://www.figma.com/design/Icet45WChEqTrEwKtQ87yg/Multi-Offers-Q2-2026?node-id=10502-7825)

---

## What this is

The product offer screen for **Uncapped's Daily Payouts product** — a revenue advance for Amazon sellers. Customer gets 80% of each day's Amazon sales the next business day, plus an initial $100,000 advance, with a 0.3% daily fee on the outstanding balance.

This is the customer's first encounter with the product after underwriting. They see the offer amount, the cost, the repayment pattern (vs the standard 14-day marketplace cycle), and decide whether to accept.

---

## Variants

Four prototypes covering the full range of states:

| URL | State | What it shows |
|---|---|---|
| `/prototypes/daily-payouts` | Active offer (happy path) | Full 3-column portal layout with hero, breakdown, comparison chart, marketplace card, benefits list, and accept-offer CTA |
| `/prototypes/daily-payouts-expired` | Offer has expired | Danger notice, muted hero, "What you can do" card with Reapply / Talk-to-AM CTAs |
| `/prototypes/daily-payouts-no-connection` | No marketplace connected (empty state) | Centred empty-state card with "Connect Amazon" CTA + privacy-reassurance points |
| `/prototypes/daily-payouts-loading` | Loading skeleton | Animated placeholder bars matching real content shapes; ARIA live region for screen readers |

Run all four with `pnpm dev` from `Assets-Uncapped/front-portal-develop` and visit the URLs.

---

## Source files

```
Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/
├── daily-payouts.tsx
├── daily-payouts-expired.tsx
├── daily-payouts-no-connection.tsx
└── daily-payouts-loading.tsx
```

Routes registered in `Assets-Uncapped/front-portal-develop/src/domains/prototypes/routes.tsx`.

---

## Components used

From `src/components/`:

- **`<Logo link={false} />`** — Uncapped wordmark in nav top-left
- **`<Typography>`** — all text. `h2` for hero (with `!font-bold` override for Commissioner Bold), `bodyTitle`, `bodyMedium`, `smallCopy`, `footnote`
- **`<Button>`** — `variant="primary"` for "Accept offer" / "Reapply for funding" / "Connect Amazon", `variant="secondary"` for "View" and "Talk to your account manager"
- **`<Card>`** with `spacing="big"` for empty state, plain `<Card>` for "What you can do"
- **`<CardV2>`** with `severity="accent-9"` (indigo) for breakdown and Marketplace cards
- **`<Notice>`** — `variant="warning"` (offer expiry), `variant="danger"` (expired state), `variant="info"` (non-Amazon alternative)
- **`<BoxIcon>`** — colored icon containers; severity rotates per row: `accent-brand`, `accent-3`, `accent-9`, `accent-11`, `accent-2`, `accent-4`
- **`<HugeiconsIcon>`** — all icons from `@hugeicons-pro/core-solid-standard` and `core-solid-rounded`

Custom assets (downloaded from Figma):

- `src/svgs/partners/connections/amazon.svg` — Amazon "smile" connection icon (UI Kit 2025 Connection Logos library, node `1555:8832`)
- `src/svgs/patterns/dash-pattern-light.png` — "Dash Pattern Light" named DS asset (used for diagonal-stripe bar fills)

> **Layout:** This prototype uses a **custom 3-column flex layout**, not `<Layout>` + `<PortalMenu>`, because those depend on auth/onboarding hooks that fail in sandbox mode.

---

## Patterns demonstrated

This prototype is rich with reusable patterns. See [`.claude/skills/screen-patterns-skill.md`](../.claude/skills/screen-patterns-skill.md) for the full catalog.

| Pattern | Where it shows |
|---|---|
| **3-column portal layout** | 270 nav / flex-1 main / 400 rail, with 40 outer / 48 nav-gap / 40 main-gap |
| **Pre-offer hero** | Gradient teal block + off-white explainer with inline-bold key amounts |
| **Notice positioning convention** | Expiry notice right after hero, before breakdown |
| **Value-list pattern** | Title-left + value-right + description below + inline-bold link in `text-brand-600` |
| **Three-layer card nesting** | Canvas → `surface-elevated-2` body → white inner card |
| **CardV2 severity rotation** | Different accents per topic across the screen (`accent-9`, `accent-11`, `accent-2`) |
| **Quick-action chips** | Right-rail header with `<BoxIcon>` + label, hover bg, no Button component |
| **Benefits with rotating accent icons** | `<BoxIcon>` per row, semantic accent rotation (brand → blue → purple → amber) |
| **Connection list rows** | Square logo container + name + em-dash + account identifier |
| **Comparison chart card** | Bold context line + sparse bar chart + 3-row legend |
| **4-layer pattern fill** | White base + dash pattern image (10×10 tile) + `neutral-300` multiply + color overlay. Applied to marketplace bar AND legend swatches. The exact technique used in the Figma. |
| **Edge-case state variants** | Separate prototypes for expired / no-connection / loading |

---

## Voice notes

Following the [`brand-voice` skill](../.claude/skills/brand-voice-skill.md):

| Element | String | Voice rule applied |
|---|---|---|
| Hero | **"Get Paid Daily"** | Three-word product framing, action-led |
| Body | "Receive **$100,000** now, then **80% of your net sales every day.** Pause anytime, with no penalties or minimum commitment." | Single paragraph with dual-bold key phrases (matches website pattern) |
| Notice | "Offer expires in 7 days on **24 Nov 2025**" | Dual-format date (relative + absolute), British format |
| Inline link | "Learn how we calculate your initial advance" | `font-bold text-brand-600`, no underline |
| Primary CTA | **"Accept offer"** | Verb + outcome — never "Submit", "Select", "Continue" |
| Right-rail card title | **"Benefits to your business"** | Matches website voice — never "Why we're better" |
| Decline CTA | "Decline offer" | Direct, no euphemism |
| Decline-state CTAs | "Reapply for funding" + "Talk to your account manager" | Calm, named next steps with real human |
| Empty-state reassurance | "Applying does not affect your credit score" | Site-standard anxiety-killer |

---

## Sandbox safety

- All four prototypes use **mock data** declared as constants at the top of each file. No `fetch`, no API hooks.
- **Custom 3-column layout** instead of `<Layout>` + `<PortalMenu>` — both depend on `useAuth`, which is short-circuited in sandbox.
- **`<Logo link={false} />`** — disables the `<Link to="/">` wrapper that would navigate to the auth-walled root.
- Page wrapper: `<div className="min-h-screen w-full bg-surface-canvas">` — `w-full` is required because of the Tailwind v4 `#root: flex` quirk.

---

## Spacing reference (matches Figma)

| Spacing | Value | Where |
|---|---|---|
| Page outer padding | 40px all sides | `px-10 pt-10 pb-10` on root |
| Left nav width | 270px fixed | `w-[270px]` |
| Nav → Main gap | 48px | `pr-12` on nav aside |
| Main column | fills available space | `flex-1` (no max-width cap) |
| Main → Rail gap | 40px | `pr-10` on main |
| Right rail width | 400px fixed | `w-[400px]` |
| Hero gradient padding | 16px all sides | `p-4` (not `py-10` — that's too tall) |
| Card padding | 16px | `p-4` |
| Card stack gap | 24px | `gap-y-6` |

---

## When to use this as a starting point

- Building any **product offer screen** (Term Loan, Cash Advance, Line of Credit, etc.) — the 3-column structure, pre-offer hero, breakdown card, and benefits list transfer directly
- Building any **us-vs-competitor visualisation** — the 4-layer pattern fill works for any "competitor pattern" comparison chart
- Building **edge-case state variants** for an existing screen — see how this one's expired / no-connection / loading variants are structured (separate `.tsx` files, simpler single-column layouts)
- Building **any screen with a contextual right rail** — the quick-action chips + secondary cards pattern is reusable
