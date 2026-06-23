# Task — accept-term-loan-daily-payouts

**Mode:** BUILD
**Input:** https://www.figma.com/design/Icet45WChEqTrEwKtQ87yg/Multi-Offers-Q2-2026?node-id=10632-17041&t=QgIGzEvggsew6teR-4
**Started:** 2026-05-13 00:00

**Context:**
- Continuation flow after /prototypes/multi-offers when user selects Term Loan + Daily Payouts and taps Continue
- Figma node: 10632-17041 in file Icet45WChEqTrEwKtQ87yg
- Reference file: /Users/ana/Desktop/Uncapped-Design/Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/multi-offers.tsx
- Target file: /Users/ana/Desktop/Uncapped-Design/Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/accept-term-loan-daily-payouts.tsx
- Route: /prototypes/accept-term-loan-daily-payouts
- Routes file: /Users/ana/Desktop/Uncapped-Design/Assets-Uncapped/front-portal-develop/src/domains/prototypes/routes.tsx
- Skip disclosures screen for now
- No real API calls, no Auth0, no live Uncapped URLs

---

## ux-designer — Strategy

**UX Strategy: Term Loan + Daily Payout acceptance flow**

**Customer state:** Post-offer, first-time commitment. The customer has just spent time on the multi-offers screen comparing options and actively selected Term Loan + Daily Payouts. They arrive here with moderate-to-high engagement and moderate anxiety — they've decided what they want, but now they're configuring the actual terms that will govern real money. Trust has been building since offer selection; this step can either consolidate it or crack it. Desktop context is most likely (1440px primary), but mobile stacked layout must be safe.

**The single job of each screen:**
- Screen 1 (Term Loan): Confirm and customise the loan amount and repayment start date. Understand the exact cost before committing.
- Screen 2 (Daily Payout): Confirm the Daily Payout add-on terms. Understand how it layers on top of the Term Loan.

**Trust state:** Earned-but-fragile. The customer chose Uncapped — that's a vote of confidence. But this is the first moment real money terms appear with commitment weight. Any surprise (hidden cost, ambiguous number, confusing UI) resets trust to zero.

**Anxiety level:** High (offer acceptance / commitment step — the highest-stakes moment in the funnel). Techniques used to reduce it:
- Full cost visible inline at all times (fee, total repayable, monthly instalment amount all surfaced without expanding anything)
- Live-updating summary card: as the customer adjusts the amount slider, the Offer Summary reflects it immediately — concrete, not abstract
- Offer hero banner ($100,000 in large Commissioner Bold on dark teal) anchors the amount as "your number", not a generic figure
- Progress spine (sidebar nav) shows exactly where they are and how many more steps remain — always answerable in 1 second
- Repayment holiday option ("Start repaying on day 60", Payment holiday chip) is a trust-builder: shows Uncapped thinks about the customer's cashflow, not just its own collections
- "No early repayment fee — New" chip on Offer Summary communicates flexibility and fairness
- Offer expiry notice (orange, prominent) is honest urgency — real deadline, real date, not manufactured

**Mental model:** The customer brings a "loan calculator" mental model — they expect to dial in an amount and see the cost update. Stripe Capital established this as category-standard. The slider + live summary card confirms to that model exactly.

**Cognitive load budget:** Medium. Three logical chunks per screen: (1) Hero anchor — amount, (2) Configuration — amount + repayment term, (3) Summary — fee, total, monthly instalment. Right column (balance chart + Why we're better) is supporting context, not primary decision content — it should feel calm and supplementary.

**Key decisions the Figma design makes:**

- **3-column desktop layout (sidebar + main + right panel):** Preserves continuity from the offers screen. The sidebar nav makes the full journey legible at a glance (7 remaining steps). The right column contextualises the decision without cluttering the main task.
- **Amount slider with text input (default $100,000):** Defaults to the maximum available — follows commitment escalation ethically (they already said yes to $100K on the offers screen; the slider can only reduce anxiety by showing flexibility). The text input gives precision for founders who want control.
- **Two repayment-start options (day 30 default vs day 60 payment holiday):** Excellent trust signal. The "Payment holiday" chip on day-60 gives the customer a real choice that benefits them, not Uncapped. Default chip on day-30 is honest about the standard path.
- **Offer summary card at the bottom:** Full cost visible (fee, total, monthly amount) without scrolling on desktop. This is the Stripe Capital pattern done right — no expanders hiding cost.
- **"Your balance over time" line chart in right column:** Forward-looking emotional anchor — the customer sees their balance trajectory, not a static number. Reduces abstract-fee anxiety.
- **Screen 2 (Daily Payout):** Sidebar advances (Term Loan ticked, Daily Payout active) — the customer gets clear confirmation they completed step 1. Consistent structure with Screen 1 reduces cognitive load.

**Inspired by:** Stripe Capital's live-updating fee breakdown as slider moves (main column structure); 8Fig's sidebar onboarding tracker for multi-step orientation (sidebar nav); Wayflyer's "Why we're better" card pattern (right column).

**Biggest risk to the customer:** The repayment options card contains two nested cards (inner card with amount+slider, inner card with radio list) — if the nesting hierarchy isn't visually clear, the customer may not understand they're choosing a repayment start date (which changes the fee from 10% to 12%). Unclear hierarchy here = surprise cost discovery later = trust collapse. The build must make the two radio options and their associated fees unmistakably readable.

**Constraints to preserve during build:**
1. Offer summary must always show fee, total repayable, and monthly instalment amount without any progressive disclosure — this is a hard trust rule.
2. The amount slider and repayment-start radio must be interactive — they update the summary card values dynamically.
3. Sidebar nav must show the correct active/complete/to-do states for each step.
4. Responsive: on mobile/tablet (< xl), the sidebar collapses to the centred-logo top bar from multi-offers; the right column stacks below; the Continue CTA becomes a sticky bottom bar with gradient backdrop.
5. No real API calls. All values are mock. Sandbox-safe.
6. Offer expiry date must use the mock date from Figma (24 Nov 2025) — not today's real date.

---

## ui-designer — Build

**File:** `/Users/ana/Desktop/Uncapped-Design/Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/accept-term-loan-daily-payouts.tsx`
**Route registered:** `/prototypes/accept-term-loan-daily-payouts` (in routes.tsx)

**Screens built:**
- Screen 1 (Term Loan): 3-col desktop layout with sidebar nav (7 steps, Term Loan active), main column (offer hero banner, expiry notice, Capital card with amount slider, Repayments card with term slider + repayment start radio selector, Offer Summary card with live-computed fee/total/monthly), right column (balance chart + "Why Uncapped"). Sticky bottom CTA on mobile; inline CTA row on desktop.
- Screen 2 (Daily Payout): Same 3-col layout, Daily Payout step active in sidebar, main column adapted for DP product.

**Components used:** Button, Typography, BoxIcon, Logo, Chip, Notice, HugeiconsIcon, custom RangeSlider, custom AmountInput, custom SectionCardHeader, custom OfferHeroBanner, custom BalanceChart (SVG), custom SummaryRow.

**State:** activeStep, termLoanAmount, repaymentStart, dpAmount — all mock, no API calls.

## ui-copy — Voice pass

- Offer hero copy rewritten for directness: "Term Loan — borrow up to $100,000 and pay one simple fixed fee."
- Repayments intro: active voice — "Your repayment options change based on the term you choose below."
- "Why we're better" → "Why Uncapped"
- Bullet copy made concrete: "One fixed fee. No hidden charges, ever", "Your own Customer Success Manager, not a chatbot"

## ux-motion — Motion pass

- Slider track + thumb: `transition-[width/left] duration-150 ease-out`, thumb `active:scale-110`
- Step transition: `animate-[fadeSlideIn_0.2s_ease-out]` on `<main key={activeStep}>` (6px Y-slide + fade)
- Radio buttons: `active:scale-[0.99]` press state
- `@keyframes fadeSlideIn` added to `app.css` + `prefers-reduced-motion` guard

## light-QA — Combined

**Critical:** None.
**Should-fix (resolved):** Duplicate `aria-label` on AmountInput instances → fixed to unique labels. RangeSlider `aria-label` fixed.
**Passed:** focus-visible on all interactives, aria-current on steps, role="radiogroup"+"radio"+aria-checked, touch targets ≥ 44px, no colour-alone information, prefers-reduced-motion respected.

---

## Session 2 — Rebuild + Expand (2026-05-13)

### Changes applied

**1. Dynamic expiry date**
Replaced hardcoded `"24 Nov 2025"` with a module-level IIFE that computes `new Date() + 7 days` and formats as `DD MMM YYYY`. Runs at render time.

**2. Screen 2 (Daily Payout) — full rebuild from Figma node 10646-28099**
- Hero: "Get Paid Daily" headline, amount mirrors termLoanAmount (intentional mirrored slider per user)
- "Understanding your Daily Payouts" card: indigo accent, 4 value rows with description copy
- Right panel: Marketplace card (gaston_express + gaston_ltd) + DpBarChart (15-bar, legend, Calculate link) + DP "Why Uncapped" (4 DP-specific bullets)
- CTA: "Continue to Sign agreements"

**3. Sign agreements — 3 new screens**
- `sign-agreements`: "Review and sign agreement", "What happens next?" card, TL pending + DP locked. Right: Agreement summary (TL Main Offer + DP Additional). Top-right: Dashboard link.
- `sign-agreements-tl-signed`: TL shows Signed (green chip + checkmark). DP unlocked — Pending signature + Sign button.
- `sign-agreements-done`: Both signed. Brand Notice. "Continue to Verify owners" CTA (desktop inline + mobile sticky).

**4. Navigation**
`type Step` expanded to 5 values. `getNavStates()` drives all sidebar states. `MobileTopBar` covers all steps. `handleSignTL` + `handleSignDP` drive Screen 3 → 4 → 5.

**5. TypeScript fixes**
`LayoutTableColumnSolidStandard` → `Layout2ColumnSolidStandard`; `type="small"` → `type="smallCopy"`; `variant="success"` → `variant="brand"`. Clean: 0 errors.

**Open questions for user:**
- "Continue to Verify owners" (Screen 5) is a placeholder — the Verify owners screen is not yet built.
- "Calculate your advances over time" View button in DP right panel has no target — placeholder.
