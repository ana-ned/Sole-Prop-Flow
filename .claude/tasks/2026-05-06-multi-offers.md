# Task — multi-offers

**Mode:** BUILD
**Input:** Brief — multi-offer selection screen with A/B layout toggle (RHS rail vs expand-below panel), two scaling products (Term Loan + Cash Advance) + Daily Payouts in a Liquidity section.
**Started:** 2026-05-06 00:00

---

## ux-designer — Strategy

**Customer state:** Approved founder (Coastal Goods) who has cleared underwriting and now faces a genuine decision. Anxiety is moderate-to-high: three product options with different fee structures, repayment mechanics, and risk profiles. The stakes feel real — this is capital for the business. The customer may not fully understand the difference between a Term Loan and a Cash Advance, and Daily Payouts may read as a bonus or an afterthought rather than a standalone product.

**Pillar:** Confidence through clarity. The job of this screen is not to sell — approval already happened. It is to help the founder make a decision they feel good about. Every element should reduce cognitive load, not add to it.

**Mental model:** The customer is mentally shopping: "Which of these fits how I run the business?" They want to compare, but they do not want to feel overwhelmed. The grouping of Scaling vs Liquidity is the right call — it frames Term Loan and Cash Advance as peers (grow the business) and Daily Payouts as a complement (improve cashflow timing), which matches how a founder actually thinks about working capital.

**Variant toggle:** The toggle must be unobtrusive but impossible to miss for the team using it. Placing it top-right of the main column (not in the nav, not floating) is the right call. Label "Right rail | Expand below" is clear enough for an internal prototype. The default to Right rail honours the lead's direction and means the first load is the current consensus view. One risk: the toggle could confuse a customer if this prototype is accidentally shared externally — the label copy should be prefixed with something like "Layout preview:" to signal it is a design tool, not a product feature.

**AE soft prompt direction:** Must be positive and forward-looking. "Want help deciding?" is the right opening — it positions the call as a tool for the founder, not a rescue for a broken product. Avoid any copy that implies the offers might not be good enough. The prompt should sit below the detail panel in Variant A (right rail) and at the very bottom of the page in Variant B (expand-below), so it never competes with the primary decision.

**Key decisions confirmed:**
- Term Loan: pre-selected (RECOMMENDED FOR YOU badge), radio behaviour across cards
- Cash Advance: fee + rev share, no term shown (per Ravi's correction)
- Daily Payouts: banner-style in its own Liquidity group, selectable, detail panel updates on selection
- No bar viz / repayment-shape chart on cards
- No "Are none of these the right fit?" copy anywhere

**Biggest risk:** Variant B (expand-below) on a page with three selectable products risks feeling like an accordion. If the expanded panel is long and the user clicks between Term Loan, Cash Advance, and Daily Payouts in quick succession, the layout will jump. The motion spec must include a fast collapse-then-expand sequence (not simultaneous) to prevent the page from feeling chaotic. Flag this to ux-motion.

**Recommended flow for testing:** Let reviewers load ?layout=rhs first (default), spend 30 seconds deciding, then switch to ?layout=expand and repeat. That sequence mirrors how Grace asked to explore options.

---

## ui-designer — Build

**File:** `/Users/ana/Desktop/Uncapped-Design/Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/multi-offers.tsx`
**Route registered:** `src/domains/prototypes/routes.tsx` — path `multi-offers`, element `<MultiOffers />`
**TypeScript:** Clean (no errors)

**Structure:**
- Custom 3-column flex layout (no auth-gated Layout/PortalMenu) — matches daily-payouts.tsx pattern
- All data as constants at top of file — OFFERS, DETAIL_PANEL_CONTENT, NAV_ITEMS
- Layout state driven by `useState<Layout>` initialised from `?layout=` query string, synced back on toggle change
- `LayoutToggle` component: pill-style segmented control, top-right of main column, labeled "Layout preview: Right rail | Expand below"

**Variant A (RHS):** sticky 400px right rail with DetailPanelContent, Continue CTA, and BookACallPrompt below. Per-card "Review this offer" inline link on each card.

**Variant B (Expand below):** `ExpandBelowPanel` uses height animation (0 → scrollHeight via `useEffect`) with `280ms cubic-bezier(0.4,0,0.2,1)`. Collapse-then-expand sequencing: on offer change, panel height collapses (180ms), then new panel opens. Single Continue CTA + BookACallPrompt at bottom of page.

**Components used:** Button, Typography, BoxIcon, Logo (all from existing component library). No CardV2 — custom card patterns to keep radio behaviour clean. Icons: CheckmarkCircle02SolidStandard, Call02SolidStandard, UserMultiple02SolidStandard, Logout03SolidStandard, ArrowRight01SolidStandard, InformationCircleSolidStandard, StarAward02SolidStandard, MoneyReceive02SolidStandard, Calendar01SolidStandard, PercentCircleSolidStandard (solid-standard); MoneyBag02SolidRounded, MoneyReceive02SolidRounded, FlashSolidRounded (solid-rounded).

**Known gap:** BoxIcon only supports size 6 and 10 — Daily Payouts banner uses size 6 (not the visually larger size the brief requested). Flagged for design-keeper.

---

## ui-copy — Voice refinements

**What was changed:**

Card shape lines: made more concrete and action-oriented. "Fixed monthly repayments" → "Fixed monthly repayments — same amount every time". "Repay with a % of weekly sales" → "Repayments flex with your weekly sales".

Daily Payouts banner description: added "no penalties" (was implied, now explicit). Changed "Works with whichever scaling option you pick above" → "Works alongside whichever scaling offer you choose" — "pick above" reads as instructions, "choose" is neutral.

Detail panel headings: "why this for you" → "why this works for you" (more confident, less like a question). Daily Payouts: "how this works" → "how it works" (tighter).

"Why we recommended this" callout: renamed "Why we picked this for you" — recommended is a label on the card badge; in the panel the tone should feel more personal and less mechanical.

Section headings: "capital to grow your business" → "capital to grow the business" (removes the "your" that makes the heading sound like a tooltip rather than a section label). "get paid faster on your existing sales" → "get paid faster on sales you've already made" (more specific — anchors the concept).

Book a call prompt: shortened from "they know your application and can walk you through the options" → "They know your numbers and can help you pick the right fit" — tighter, more confident, frames the AE as helpful not remedial.

Best-for and Worth Knowing bullets: rewritten throughout to be more direct. Removed hedging constructions ("businesses that want", "founders who prefer"). Cash Advance worth knowing: "A slower sales week means a smaller repayment, which protects your cashflow" → "A quieter sales week means a smaller repayment. Your cashflow is protected automatically." — split for emphasis, added "automatically" to reinforce it's not manual.

**No strings were deleted.** All content from the brief is present.

---

## ux-motion — Transitions and micro-interactions

**Card hover/focus/press:**
- Scaling offer cards and Daily Payouts banner: `transition-all duration-200` — border colour transitions from `neutral-300` → `brand-400` on hover, full `brand-500` ring on selection. `active:scale-[0.99]` on press (both card types).
- Radio dot: `transition-colors duration-200` — border and fill animate together on select.
- Selected state: `shadow-[0_0_0_4px_rgba(30,189,192,0.12),0_2px_8px_rgba(0,0,0,0.08)]` — branded focus ring effect using brand-500 at 12% opacity.

**Layout toggle buttons:**
- `transition-all duration-150 active:scale-95` — responsive press feel without being distracting.

**"Review this offer" arrow nudge:**
- `group-hover/cta:translate-x-0.5 transition-transform duration-150` — arrow steps 2px right on hover. Applied to both ScalingOfferCard and DailyPayoutsBanner.

**Variant B — expand-below panel:**
- Height: `260ms cubic-bezier(0.4, 0, 0.2, 1)` — Material-standard ease-in-out.
- Content fade: delayed 60ms after height starts, `opacity` + `translateY(6px→0)` over `200ms ease`. Prevents content flashing before the container is tall enough to show it.
- Collapse-then-expand sequencing: selected offer changes immediately (so the card state updates at click), collapse plays over 180ms, then new panel opens. No simultaneous open+close jumping.

**Variant A — RHS panel entrance:**
- `key={selectedOffer}` on the panel div forces a remount on offer change.
- `@keyframes rhsPanelFadeIn`: `opacity: 0, translateY(6px)` → `opacity: 1, translateY(0)` over `220ms ease`. Plays fresh on every selection.

**No reduced-motion handling added** — this is a prototype, not production. Worth adding `@media (prefers-reduced-motion)` before shipping to engineering.

---

## design-keeper — Light QA

**Auto-applied fixes:**
- Unused import `MoneyReceive02SolidStandard` removed (from `@hugeicons-pro/core-solid-standard`).
- Card amount `$80,000` changed from `Typography type="h3"` (Heading/H3, Commissioner 32px SemiBold) to an explicit `Amount/Sm` span (Commissioner Bold 32px, line-height 1) — financial amounts must use the Amount scale, not heading styles.

**Should-fix (not blocking for prototype):**
- `bg-[#eaf6f6]` and `border-[#c1e5e6]` are hardcoded hex values inside the "Why we picked this for you" callout and tag chips. In production these should be semantic Tailwind aliases (e.g. `bg-accent-brand-subtle border-accent-brand-border`). Acceptable in a prototype; flag for engineering handoff.
- Section heading labels use raw `uppercase tracking-widest text-xs` classes rather than a `Typography` variant. Fine for a prototype; a `label` variant would be cleaner in production.

**Blockers:** none.

---

## accessibility-edge-reviewer — Light QA

**Auto-applied fixes:**
- `aria-current="step"` added to the active nav item ("Your offers").
- Expand-below panels now have `id="panel-{offerId}"`, `role="region"`, and `aria-label="{Offer name} detail"` — gives screen readers a named landmark for each panel.

**Should-fix:**
- `role="radio"` on `<button>` elements: valid in this prototype context (aria-checked is present, elements are inside a `role="radiogroup"` div). In production, replace with `<fieldset>/<legend>/<input type="radio">` pattern with custom styling — avoids potential AT inconsistencies.
- The card button and the inner "Review this offer" text: no nested interactive element issue (it is a `<span>`, not a `<button>`). However, AT may announce "Review this offer" as part of the button name in some modes. Consider hiding it from AT with `aria-hidden` if the full card button label is descriptive enough.
- `aria-controls` relationship between card buttons and their expand-below panels is not wired — the panels have IDs but the buttons don't reference them. Adds cognitive load for keyboard+AT users who want to predict what will happen on press. Should-fix before user testing with AT users.
- Missing `prefers-reduced-motion` — all transitions play regardless of OS accessibility setting. Add `@media (prefers-reduced-motion: reduce)` to disable height animation and fade-in before engineering handoff.

**Blockers:** none.

---

## [Step 5] ui-copy — Copy Pass (Polish) — 2026-05-06 10:00

### Input
Full copy polish pass on the agreed final direction for the multi-offers selection screen. Structure locked. Task: make every string sound like Uncapped, not a fintech template. Priority order: shape lines → detail panel (shape, best-for, why, worth knowing, tags) → AE prompt → selection indicator → sticky CTA → section headings → eyebrow labels → subhead.

### Output

**Shape lines (CARD_CONFIG.shapeLine)**

| Before | After | Rationale |
|---|---|---|
| `"Fixed monthly repayments"` | `"Fixed repayments — same amount every month"` | The em-dash construction adds the reassurance ("same amount every month") that the bar label already shows visually. Founder reads the card line first; the bar confirms it. Pillar: Full transparency. |
| `"Repay with a % of weekly sales"` | `"Repayments move with your weekly sales"` | Active voice. "Move with" frames flexibility as a benefit, not a mechanism. "Repay with a %" sounds like an instruction; this sounds like a product promise. Pillar: Stay flexible. |
| `"Then 80% of net sales daily"` | `"Your Amazon sales, paid to you the next business day"` | "Then" implied it followed something — it doesn't. Daily Payouts is a standalone product in its own section. The new line names the customer's asset (Amazon sales), the Uncapped action (paid), and the timeline (next business day) — the whole value prop in one line. Pillar: Move fast. |

**Bar label**

| Before | After | Rationale |
|---|---|---|
| `"PAID DAILY, ONGOING"` | `"PAID EVERY BUSINESS DAY"` | The product pays on business days, not calendar days. "Ongoing" is vague. "Every business day" is precise and matches the shape text. |

**DETAIL_CONTENT — shape strings**

| Product | Before | After | Rationale |
|---|---|---|---|
| Term Loan | "Total cost is fixed at signing — $9,600 in fees on top of the $80,000 you borrow." | "Total cost is fixed at signing: $80,000 plus a flat $9,600 fee." | Removed the "$80,000" repetition (it appeared two sentences earlier). Colon + additive format is more scannable. "flat" reinforces the power phrase "fixed fee". |
| Cash Advance | "Faster sales weeks pay it off faster; slower weeks pay less." | "Faster sales weeks clear it faster; slower weeks, you pay less." | "Clear it" is more active and natural. Comma structure in the second clause matches spoken rhythm. |
| Daily Payouts | "instead of waiting Amazon's standard 14-day cycle" | "no more waiting for Amazon's 14-day payout cycle" | "Waiting Amazon's" was grammatically loose. Em-dash construction makes the contrast sharper and more conversational. |

**DETAIL_CONTENT — bestFor bullets**

| Product | Before | After | Rationale |
|---|---|---|---|
| Term Loan [1] | "A specific, planned use of capital (e.g. inventory, marketing push)" | "A specific, planned use of capital — inventory, a marketing push, new equipment" | Em-dash replaces parenthetical — matches Uncapped's rhythm, adds "new equipment" as a third example for fuller self-recognition. |
| Term Loan [2] | "Predictable monthly cashflow that can absorb the repayment" | "Predictable monthly cashflow with room for a fixed repayment" | "Absorb" is slightly negative (implies strain). "With room for" is neutral and affirmative. |
| Term Loan [3] | "Wanting a known total cost up front" | "Knowing the total cost upfront, with no surprises" | Gerund lead removed (voice rule). "With no surprises" maps to the established power phrase. |
| Cash Advance [1] | "Seasonal sellers with peaks and troughs" | "Seasonal businesses with busy and quiet periods" | "Troughs" has a negative connotation. "Busy and quiet periods" is the founder's own language and reads as self-recognition not jargon. |
| Cash Advance [3] | "Wanting repayment to scale with cashflow" | "Businesses where repayment should move with revenue" | Gerund lead removed. "Move with revenue" matches the shape line's "move with your weekly sales" — deliberate echo for consistency. |
| Daily Payouts [2] | "Businesses that need to keep inventory or ad spend in motion daily" | "Businesses that need to keep inventory or ad spend moving daily" | "Moving" is more concrete and action-led than "in motion". |
| Daily Payouts [3] | "Anyone wanting to smooth cashflow without taking on a fixed-term loan" | "Anyone who wants to smooth cashflow without committing to a fixed-term loan" | "Taking on" is slightly informal. "Committing to" is clearer and more precise for a lending context. |

**DETAIL_CONTENT — whyEyebrow**

All three changed from `"WHY THIS MIGHT SUIT YOU"` to `"WHY THIS FITS"`.

Rationale: "Might" hedges a personalised data signal that is being presented as a confident insight ("your revenue has been within ±8%"). If the data is worth showing, the framing should be confident. "WHY THIS FITS" is direct, shorter, and survives 30% expansion into German/French. Pillar: Full transparency (honest, not oversold).

**DETAIL_CONTENT — why strings**

| Product | Before | After | Rationale |
|---|---|---|---|
| Term Loan | "That kind of stability fits a product where the repayment is the same each month." | "That kind of stability fits a product with a fixed monthly repayment." | "Where the repayment is the same each month" and "fixed monthly repayment" are identical in meaning; the shorter form is tighter. |
| Cash Advance | No change. | — | Existing copy ("breathing room in slow weeks") is already on-voice and uses natural language. Kept. |
| Daily Payouts | "would unlock around $58,000 of working capital at any given time." | "would unlock around $58,000 in working capital." | "At any given time" is loose. Removing it makes the figure land harder. "In working capital" is the established category term. |

**DETAIL_CONTENT — whyTag chips**

| Before | After | Rationale |
|---|---|---|
| `"Stable monthly revenue · clear use of capital"` | `"Stable revenue · planned spend"` | "Monthly" redundant (the why text already specifies monthly). "Clear use of capital" is slightly abstract. "Planned spend" is the founder's frame — they know what they're buying. |
| `"Variable revenue · breathing room"` | No change. | Punchy, plain, already on-voice. Kept. |
| `"Marketplace-tied · daily liquidity"` | `"Amazon-heavy · daily cash flow"` | "Marketplace-tied" is tech language. "Amazon-heavy" is the customer's own descriptor (they recognise it as self-description). "Daily liquidity" is financial jargon; "daily cash flow" is the plain-English equivalent. |

**DETAIL_CONTENT — worthKnowing bullets**

| Product | Before | After | Rationale |
|---|---|---|---|
| Term Loan [1] | "You can repay early at no extra cost" | "Pay off early at no extra cost" | Aligns with the established power phrase. Removes "You can" which is slightly weak — the plain instruction is more confident. |
| Term Loan [3] | "Funding lands in your bank within 1 business day of acceptance" | "Funds reach your bank within 1 business day of accepting your offer" | "Acceptance" is passive and abstract. "Accepting your offer" names the customer's action as the trigger — sets correct expectations. |
| Cash Advance [2] | "Expected duration around 9 months at current sales" | "At your current sales rate, you'd clear the full amount in around 9 months" | Passive construction removed. "At your current sales rate" grounds it in the customer's data. "Clear the full amount" is more concrete than "duration". |
| Daily Payouts [1] | "Cancel any time, no penalties or minimums" | "Cancel any time — no penalties or minimums" | Em-dash replaces comma — the two clauses are distinct facts, not a list. Matches Uncapped's emphatic two-clause rhythm. |
| Daily Payouts [3] | "Works alongside a Term Loan or Cash Advance, or on its own" | "Use it alongside a Term Loan or Cash Advance, or on its own" | "Works" is passive. "Use it" is instructional and empowering — frames the customer as active. |

**Page subhead**

Before: `"Pick what fits how you'd use the capital. Tap any option to see how it works."`
After: `"Choose what fits your business. Select any option for the full breakdown."`

Rationale: "Pick" and "Tap" in adjacent sentences are mismatched in register. "Tap" assumes touch on a desktop portal. "Choose" is device-neutral. "Your business" is more direct than "how you'd use the capital" — same meaning, three fewer words. "For the full breakdown" is concrete (it tells the founder what they'll get) rather than generic.

**Section headings**

| Before | After | Rationale |
|---|---|---|
| `"Scaling — capital to grow your business"` | `"Scaling — working capital to grow your business"` | Adds Uncapped's established category term "working capital" — reinforces brand vocabulary and distinguishes from generic "capital". |
| `"Liquidity — get paid faster on existing sales"` | `"Liquidity — access cash from sales you've already made"` | "Existing sales" is slightly odd (sales are events, not assets). "Sales you've already made" is the customer's frame. "Access cash" is more active than "get paid faster". |

**AE soft prompt**

Before headline: `"Want a second opinion?"`
After headline: `"Want to talk it through?"`

Rationale: "Second opinion" implies the first opinion (the offers) may be wrong — mild negative framing per the Slack thread rule (language must be POSITIVE). "Talk it through" is forward-looking and invitation-style.

Before body: `"Talk it through with one of our account executives — they've helped hundreds of e-commerce businesses pick the right structure."`
After body: `"Your dedicated account manager knows your numbers and can help you choose the right structure."`

Rationale: "One of our account executives" is impersonal. "Your dedicated account manager" uses the possessive power phrase and implies a real relationship. "They've helped hundreds of e-commerce businesses" is generic social proof. "Knows your numbers" is personalised — matches what customers say in testimonials ("they speak our language").

**Selection indicator**

Before: `"You've selected the [Product]. Tap another card to compare."`
After: `"[Product] selected. Choose another to compare."`

Rationale: "You've selected the" is three words of padding. Leading with the product name in bold confirms the selection immediately. "Tap" replaced with "Choose" for device-neutrality.

**Sticky CTA label**

`"Continue with {selectedOfferName}"` — kept as-is. See Flags.

**Strings kept without change (selected)**

- `"RECOMMENDED"` badge — team specified.
- `"Get Paid Daily"` headline on Daily Payouts card — intentional product framing.
- `"SAME EVERY MONTH"` and `"FLEXES WITH SALES"` bar labels — already exact and on-voice.
- `"THE SHAPE OF IT"` eyebrow — informal, plain, correct register.
- `"{content.productName} · how this works"` panel heading — direct, possessive, on-brand.
- All three subheads in DETAIL_CONTENT — already on-voice.
- Cash Advance why — natural language, specific data, "breathing room" is human.
- Cash Advance worthKnowing [1]: `"Total cost is fixed ($10,400) — only the speed varies"` — excellent regulatory honesty.
- Cash Advance worthKnowing [3]: `"Repayments pause automatically if sales pause"` — maps to the power phrase.
- Daily Payouts worthKnowing [2]: `"Funds reach your bank by 09:00 the next business day"` — the 09:00 specificity is reassuring.

### Flags

**Flag 1 — Sticky CTA for brand-voice owner:**
`"Continue with [Product]"` does not name the downstream outcome. If this screen commits the customer, change to `"Accept [Product]"`. If it advances to a contract review step, "Continue with [Product]" is acceptable. Confirm with product team.

**Flag 2 — Eyebrow labels "main offer" / "add on" for brand-voice owner:**
"Add on" should be hyphenated: "Add-on". More broadly, "main offer" has a mildly promotional register. If these labels survive into a real product (rather than being prototype wayfinding only), consider "Your offer" and "Add-on" for precision.

**Flag 3 — US locale currency:**
All amounts are USD. If this prototype is a template that should support multiple locales, replace hardcoded `$` amounts with `{{currency}}` placeholders per the localisation rule. Flagging to confirm whether this is intentionally US-facing.

**Flag 4 — Consistency note on "Choose an offer" aria-label:**
The `aria-label="Choose an offer"` on the radiogroup (line ~706) now matches the updated subhead copy ("Choose what fits your business"). No change needed — noting for completeness.
