---
name: screen-patterns
description: Use when designing or building a new Uncapped screen. Provides the standard layout shells, common screen archetypes (offer, dashboard, application, decline, repayment, drawdown), and the page wrapper requirements. Reference when starting any new prototype.
---

# Skill: Uncapped Screen Patterns

## When to use this skill
At the start of any new screen. Before deciding on
structure, check whether the screen fits one of the
established archetypes — most do. Reusing patterns
keeps the portal coherent across teams.

## Reference: Figma layout library
Canonical visual layouts live in the UI Kit 2025 file:
`https://www.figma.com/design/yi1vHrojH9MV6AckmROOQx/UI-Kit-2025?node-id=2369-6191`

The existing prototype `offer-screen.tsx` is the
working code reference for a real Uncapped screen.

## Required page wrapper (always)

Every prototype starts with this wrapper. Don't skip it.

```tsx
<div className="min-h-screen w-full bg-surface-canvas">
  <Layout menu={<PortalMenu />}>
    <Layout.Parent>
      {/* page content */}
    </Layout.Parent>
  </Layout>
</div>
```

- `min-h-screen` — full viewport height
- `w-full` — required because `#root` is `display:flex` (Tailwind v4 quirk). Without it, `mx-auto` has nothing to centre.
- `bg-surface-canvas` (`#f7f4f2`) — never `bg-white` on the page wrapper
- `<Layout>` + `<PortalMenu>` — handles nav, sticky positioning, mobile collapse

## Layout shells

| Shell | When to use | Code |
|---|---|---|
| **Standard portal** | Dashboards, account screens, lists | `<Layout menu={<PortalMenu />}>` + `<Layout.Parent>` |
| **Onboarding mode** | Application steps, multi-step forms | `<Layout mode="onboarding" sidebar={…}>` — form on left, help on right |
| **Plain layout** | Standalone screens, errors, decline | `<PlainLayout>` — no nav |
| **Stepper-driven** | Multi-step flows with numbered steps | `<Layout menu={<StepperMenu />}>` |
| **Logo-only header** | Application or KYC, focused work | `<Layout menu={<LogoOnlyMenu />}>` |

## Screen archetypes

### 1. Offer screen
**Goal:** present 1–N funding options, transparent cost, accept/decline action.

Structure:
- Page header — `<Typography type="h2">Your funding offer</Typography>` + status `<Chip label="Offer ready" color="success">`
- Hero amount — `<Gradient>` banner with `<Typography type="h1">` (56px display) + subtitle ("Revenue-based repayment · No personal guarantee")
- Tier selector — multi-tile grid, customer picks (Wayflyer / Stripe Capital pattern)
- Breakdown card — fixed fee, total to repay, repayment %, term
- Benefits list — funds in 24h, no PG, pay off early, etc.
- Primary action — `<Button variant="tertiary">Accept offer</Button>` (amber, the offer-CTA convention)
- Secondary action — "View breakdown" / "Talk to your account manager"

Reference: `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/offer-screen.tsx`

### 2. Dashboard
**Goal:** at-a-glance state of customer's funding + next action.

Structure:
- Page header — `<Typography type="h2">` + greeting + last-update time
- Hero metric — one big number that matters (next repayment, available balance, forward forecast)
- Multi-product cards — `<CardV2>` for each active product (Term Loan, LoC, Cash Advance, Daily Payout) — Uncapped's multiproduct breadth is a differentiator, surface it
- Recent activity — `<SimpleTable>` or `<ListItem>` rows of last 5 transactions
- Next action `<Nudge>` — "Connect Amazon to unlock more funding" or similar
- Right rail (optional) — account-manager contact, support link

### 3. Application form (multi-step)
**Goal:** collect data progressively, never lose customer's work.

Structure:
- `<Layout mode="onboarding">` shell
- `<ProgressBar total={N} current={n}>` always visible
- One screen per chunk — cap at 5 fields per screen
- Easy/low-anxiety questions first; bank-connect later, never first
- "Save and exit" tertiary action visible at all steps
- Footer: back button + primary "Continue" or final "Submit application"

### 4. Connect / data-sharing step
**Goal:** kill privacy anxiety; explain access scope.

Structure:
- `<Typography type="h2">Connect your sales accounts</Typography>`
- Subtitle explaining *why* (e.g. "We use this to generate your offer faster")
- Provider tiles — Amazon, Shopify, eBay, Stripe (logos, "Connect" buttons)
- "Read-only access" reassurance prominently displayed
- `<Notice variant="info">` with privacy specifics
- Skip option ("Upload statements instead") so the customer never feels stuck

### 5. Decline screen
**Goal:** honest, calm, named next step.

Structure:
- `<PlainLayout>` (no portal nav — focused moment)
- `<Typography type="h2">We can't offer funding right now</Typography>`
- Plain-language reason if disclosable
- Three things only: what / why / what next
- Account-manager name + email visible
- Re-apply timeline ("You can apply again in 90 days")
- No upsell, no marketing copy. Calm tone.

### 6. Drawdown / fund request
**Goal:** request funds with full transparency on amount, destination, timing.

Structure:
- Available balance hero (calm, not alarming)
- Amount input — slider or numeric field with min/max visible
- Live-updating breakdown — fee, expected repayment, days to settle
- Destination account (read-only, confirmed)
- Pre-confirmation summary before commit
- Real-time status after submit (pending → processing → sent)

### 7. Repayments view
**Goal:** show upcoming + history, status at a glance.

Structure:
- `<Tabs titles={["Upcoming", "Past"]}>` — default to Upcoming
- For each repayment: amount + date + source account + `<Chip>` status
- Don't put status in a column of words — use chips

### 8. Confirmation / success screen
**Goal:** confirm action, name next step, set timeline.

Structure:
- Hero confirmation message — specific to the action ("Your funding has been approved")
- What happens next — concrete steps with dates
- Timeline expectation ("Funds in your account within 24 hours")
- "View dashboard" or named next action
- Optional: account manager intro

### 9. Empty state page
**Goal:** explain why empty, name the action.

Structure:
- Centred `<Card>` with icon + headline + body + primary action
- Headline: "No active loans yet"
- Body: one sentence explaining why + what to do
- Action: `<Button variant="primary">Apply for funding</Button>`
- Don't leave the page blank with "No data".

### 10. Settings
**Goal:** group controls by intent, not by data model.

Structure:
- Sections: Profile / Notifications / Security / Documents / Connected accounts
- Each section in its own `<Card>` or `<CardV2>`
- Avoid alphabetised settings — group by what the customer is trying to do

## Designer patterns observed from real Figma builds

Patterns extracted from comparing Figma designs to code. Apply these when building from a *brief* (no Figma reference) so the prototype still matches the way Uncapped designers compose screens. This section grows each time we build from a new Figma reference.

### Three-column portal layout for offer / decision screens
Used when the screen needs both context (right rail) and primary nav.
- **Left** 270px fixed — logo + nav items + log out at bottom
- **Centre** max 600px, flex-1 — main offer content stack with `gap-y-6`
- **Right** 400px fixed — quick actions + supporting cards
- Outer page padding: 40px (`px-10 pt-10 pb-10`)
- Centre column owns the primary CTA at the very bottom-right

### Pre-offer hero pattern (single card, two zones)
Used at the top of every offer screen.
- One `rounded-2xl shadow-light-sm` card
- **Top zone:** gradient teal background (radial from `brand-500` `#1ebdc0` toward `brand-800` `#004b4d`), 40px vertical padding
- Hero text: Commissioner Bold 48px, white, centred
- **Bottom zone:** `bg-[#fbfaf9]` (surface/elevated-2), 16px padding
- Body explainer with **inline bold on key amounts**: "Receive **$100,000** now, then **80% of your net sales every day**"

### Notice positioning convention
Time-sensitive notices (offer expiry, deadline) come *immediately after* the hero card and *before* the breakdown. Always `<Notice variant="warning">`. Date format pairs relative + absolute: "Offer expires in 7 days on 24 Nov 2025".

### Value-list pattern inside breakdown cards
For terms / breakdown rows. Each row is a flex layout:
- Title left — `<Typography type="bodyMedium">` (16px SemiBold)
- Value right-aligned — `<Typography type="bodyTitle">` (16px Bold)
- Description below — `<Typography type="smallCopy" color="neutral-700">` (14px Regular)
- Inline links use `text-brand-600 font-bold` (no underline)
- When a row has no value (e.g. an explanation-only row), show only title + description

### Three-layer card nesting on canvas
Creates depth without aggressive shadows.
1. **Outer** card with `shadow-light-sm` sits on canvas (`#f7f4f2`)
2. **Middle** body uses `bg-[#fbfaf9]` (surface/elevated-2) — slightly darker off-white
3. **Inner** white card with `shadow-light-sm` sits inside the elevated-2 body

### CardV2 severity rotation across sections
Designers rotate the `severity` accent across sections of one screen so each card reads as a distinct topic:
- Detail / understanding section → `severity="accent-9"` (indigo)
- Comparison / data section → `severity="accent-11"` (purple)
- Marketplace / connections → `severity="accent-9"` (indigo)
- Offer-CTA card → `severity="accent-2"` (amber)

Within one screen, use 2–3 different accents — not all the same, not all eleven.

### Quick-action chips in right-rail header
Top-right of the contextual rail. NOT the standard `<Button>` — these are nav-item-style:
- Inline-flex: `<BoxIcon size={6} severity={accent}>` + 16px label
- No background by default; `hover:bg-neutral-100`
- Each action gets a different accent (e.g. "Book a call" = `accent-brand`, "Invite team" = `accent-9`)
- Use for low-prominence persistent actions (call team, invite, settings shortcuts)

### Benefits / why-us list with rotating accent icons
For "Why we're better" / "What's included" sections.
- Each row: `<BoxIcon size={6}>` + 16-pixel gap + body text (`<Typography type="body">`)
- 24px gap between rows
- **Rotate accent semantically** — accent-brand for core feature, accent-3 (blue) for delivery, accent-11 (purple) for integration, accent-2 (amber) for flexibility/pause
- Reads as 4 distinct value props rather than one homogenous list

### Connection list rows (Marketplace, integrations)
- Square 40px logo container — `rounded-lg border-neutral-300 bg-neutral-100`
- Then in one line: name (`bodyMedium`) + em-dash + account identifier (`smallCopy`)

### Comparison-chart card pattern
For "us vs competitor" data viz.
- Bold context line at the top of the card body — "Your competitors get paid every 14 days. **You don't have to**"
- Bar chart with x-axis labels (Day 1 → Day N), most cells empty (zero), one or two tall bars
- Pattern-fill on bars (diagonal stripes) to differentiate
- Three-row legend at the bottom with `size-[14px]` colour swatch + `smallTitle` label

### Calculator / helper link pattern
For "do this related thing" cross-links.
- Single white card, `shadow-light-sm`
- Bold text on left ("Calculate your advances and repayments over time") + small secondary button ("View") on right

### CTA placement
Primary CTA goes at the **bottom-right** of the centre column. Single primary action only. No secondary button beside it. Just `<Button variant="primary">Select offer</Button>`.

### Brand colour discipline (observed)
- `brand-600` (`#128081`) — links, primary button fill, link-bold text
- `brand-500` (`#1ebdc0`) — hero gradient end-point, brand-accent surfaces
- `brand-400` (`#a5d3d4`) — focus rings, light data-viz bars (e.g. "Daily Payout" series)
- `brand-200` / `brand-100` — subtle tints
- Raw teal hex appears **only** inside gradients (where exact shade matters); everywhere else it's `brand-*` Tailwind classes

### Shadow discipline (observed)
- `shadow-light-sm` — every card on canvas (the default)
- `shadow-light-md` — slightly elevated cards (the pre-offer hero)
- `shadow-light-lg` — modals only
- Never mix shadows on the same surface. Pick one per card.

### Typography rhythm on offer screens
- Hero financial amount → 48–56px Commissioner Bold (one per page)
- Card header title → `bodyTitle` (16px Sora Bold)
- Value row title → `bodyMedium` (16px Sora SemiBold)
- Value row amount → `bodyTitle` (16px Sora Bold, right-aligned)
- Body copy → `body` (16px Sora Regular)
- Description / helper → `smallCopy` (14px Sora Regular, neutral-700)
- Caption / chart axis → `footnote` (12–14px Sora Regular, neutral-700)

## Composition rules

- **One primary action per view.** Multiple primaries = no spine.
- **Anchor + body + action.** Every screen has a clear page title (anchor), a focused job (body), and one obvious action.
- **Status never alone in colour.** Always pair `<Chip>` colour with a label, `<Notice>` colour with an icon and text.
- **Same-row alignment.** Elements on a horizontal row share height or use `items-center`.
- **Layout rhythm.** Within any container (panel, card, modal), horizontal padding is consistent across all sibling sections.

## Safe template
Copy `offer-screen.tsx` as the starting point for any new prototype. Avoid `hello-world.tsx` — it depends on auth/onboarding hooks that fail in sandbox mode.
