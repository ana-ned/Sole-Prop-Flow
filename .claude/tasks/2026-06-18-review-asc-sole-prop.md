# Task — asc-sole-prop

**Mode:** REVIEW
**Input:** /Users/ana/Desktop/Vibe-Designing-Uncapped-main/Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx
**Started:** 2026-06-18 09:00

---

## Context for reviewers

This is a 6-screen ASC (Amazon Seller Central) sole-proprietor onboarding + application flow.

Screens in order:
1. `seller-central` — Amazon SC financing options table + data-sharing consent modal
2. `amazon-auth` — Amazon OAuth "Uncapped would like access to" screen
3. `eligibility` — Business type toggle (LLC vs Sole Proprietor) with form fields + sidebar
4. `applicant` — Applicant info: DOB, address, email, phone, consent cards
5. `application` — Review & apply summary with SummaryCard components
6. `offer` — OfferHoldingScreen: underwriting progress + What happens now card + IdVerificationCard aside

**Recent change to call out:** The `OfferHoldingScreen` underwriting card was just refactored — the old 3-segment progress bar was replaced with a single continuous progress line (with `role="progressbar"` + `aria-valuenow`) plus a status/ETA label on top, and the stage checklist kept below. Pay attention to whether that change reads cleanly.

**Important:** The Amazon SC screens (seller-central, amazon-auth) intentionally mimic Amazon's chrome — DS tokens do NOT apply there. The comment block in the file marks this clearly at line 220.

**Sandbox note:** No live Uncapped servers. All data is mocked.

---

## [Step 1] ui-copy — Copy Review — 2026-06-18 10:30

### Input

Full copy audit of screens 3–6 (eligibility, applicant, application, offer holding) for voice, tone, clarity, anxiety-reduction, legal/consent strings, button labels, placeholder text, and missing states. Amazon SC screens (seller-central, amazon-auth) reviewed only for Amazon-surface fit.

### Output

---

### Copy Review — asc-sole-prop (Screens 3–6)

**File:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx`
**Pillars reinforced:** Move fast · Full transparency · Keep control

---

#### Amazon SC screens (seller-central, amazon-auth) — Amazon surface check

These intentionally mimic Amazon's own UI. Strings are consistent with Amazon Lending page conventions. No issues flagged for Amazon-branded surfaces. One minor observation:

- Line 503: Copyright reads `© 1996–2024` — this will date quickly in a prototype that may be shown to stakeholders in 2026. Not a voice issue; flag for the ui-designer to update the year if the screen is used in live demos.

---

#### Screen 3 — Eligibility

**Pillar(s) reinforced:** Keep control · Move fast

##### On voice ✅

- Line 578: `"Tell us about your business"` — direct, founder-facing, on brand.
- Line 631: `"As a sole trader, you are the business — no separate company details needed."` — plain English, genuinely reassuring. Good.
- Line 632: `"Your company is a separate legal entity — we'll need its registered details."` — factual, appropriate.
- Line 652: `"Pulled from your Amazon seller account — country, revenue platform and currency are set automatically."` — transparent about data source, removes confusion. On voice.
- Line 736: `"Include any name your business trades under that isn't your own — your Amazon store name, brand name, or any DBA."` — helpful, plain English.
- Line 856: `"If you're part of a group, use the parent company name."` — concrete, clear.
- Line 871: `"Start application"` — action-oriented CTA. On brand.

##### Should-fix ⚠️

**[SHOULD-FIX-1]** Line 623: Tab label reads `"Sole Proprietorship (Trader)"`.
The parenthetical `(Trader)` adds length without adding clarity for a US audience — "sole proprietorship" is the standard US term. "Trader" is a UK/AU term that will read oddly to American founders. The toggle is already on an American flow (US states, USD).
Replacement: `"Sole Proprietorship"`
Reason: Removes the UK-ism "Trader" from a US-locale surface. Uncapped's locale rules say British English is the authoring locale for UK-facing copy, but this flow is US (USD, US states, US bank account requirement). The parenthetical also breaks the compact rhythm of the toggle button.

**[SHOULD-FIX-2]** Lines 710–711: Button label `"Add Name"` has inconsistent capitalisation — Title Case on a UI action button. All other action verbs in the file are sentence case (`"Start application"`, `"Go back"`, `"Continue"`).
Replacement: `"Add name"`
Reason: Capitalisation consistency. Sentence case matches the house style.

**[SHOULD-FIX-3]** Line 647: Helper text reads `"From Amazon"` as a badge on the Country field. This is clear, but the badge text is visually correct while the `title` attribute on the parent div (line 645) reads `"Pre-filled from your Amazon seller account"` — that text is inaccessible (title attributes are not reliably surfaced to screen readers or keyboard users). The visible badge covers the meaning, but a screen-reader user navigating to this field gets no read-only cue.
Replacement: Add `aria-label="Country: United States, pre-filled from your Amazon account"` to the read-only div, or convert to a disabled `<input>` with an explicit `<p>` helper below.
Reason: The helper text at line 652 exists, but the read-only div itself carries no accessible name. Flagged for the accessibility-edge-reviewer to verify, but the copy framing is correct.

**[SHOULD-FIX-4]** Line 558: `canContinue` for the LLC path requires `llcBusinessChosen` but gives the user no feedback when they try to proceed without selecting a business. The CTA is simply `disabled` — there is no validation message explaining why. A first-time applicant may not realise the business search is a required step.
Missing copy: Add helper text below the business search field: `"Select your registered business from the results to continue."` This should only appear if the user has typed in the search field but not chosen a result.
Reason: Missing copy — a blocked CTA with no explanation violates the clarity principle.

##### Polish 🔧

**[POLISH-1]** Line 851: The "Add it manually" option in the LLC business search dropdown reads:
`"Can't find your business? Add it manually"`
Sub-label: `"Use the name exactly as it's registered."`
The heading is fine. The sub-label is a little abrupt. Consider: `"Enter the name exactly as it appears on your registration documents."` — slightly warmer and more specific.
Reason: Minor clarity improvement; current copy is acceptable.

---

#### Screen 4 — Applicant info

**Pillar(s) reinforced:** Full transparency · Keep control

##### On voice ✅

- Line 1204: `"Applicant information"` — clear page title.
- Line 1206: `"A few personal details so we can size your offer accurately. Applying does not affect your credit score."` — excellent. The anxiety-killer phrase lands in the right place. Pairing "size your offer" with the credit score reassurance is the right sequence.
- Lines 1305–1306: Toggle `"Enter address manually"` / `"Search for address instead"` — action-oriented, unambiguous.
- Lines 1460–1461: Credit data card: `"A soft check is not visible to other lenders and does not affect your credit score."` — accurate, plain, reassuring.
- Line 1466: `"A stronger credit profile means a better offer — we use every signal that's in your favour."` — genuinely founder-friendly framing. On brand.

##### Should-fix ⚠️

**[SHOULD-FIX-5]** Line 1383: SMS consent card header reads:
`"We use SMS to notify you about offer updates"`
This is factually narrow — SMS is also used for application-status updates and (in most flows) two-factor verification. The consent copy at line 1393 is broader (`"my application and offer updates"`), creating a mismatch between the card header and the consent text beneath it.
Replacement header: `"We'll text you about your application and offer updates"`
Reason: Aligns the header with the consent text below it. More specific, less formal.

**[SHOULD-FIX-6]** Line 1393: SMS consent string:
`"I agree to receive SMS messages from Uncapped about my application and offer updates. Message frequency varies. Standard message and data rates apply."`
The phrase "Message frequency varies. Standard message and data rates apply." is US telecommunications boilerplate — required by TCPA regulations for US SMS consent. However, it reads as two abrupt, legalese sentences dropped into the middle of flowing copy. They cannot be removed (regulatory requirement), but they can be integrated more naturally.
Replacement: `"I agree to receive texts from Uncapped about my application and offer updates. Message frequency varies; standard message and data rates may apply."`
Reason: "texts" instead of "SMS messages" is more natural in the US context. The semicolon joins the regulatory tail more smoothly. The meaning and regulatory coverage are identical.

**[SHOULD-FIX-7]** Line 1394: `Privacy policy` is styled as bold brand-colour text inline in a sentence, with no link `href` or `<a>` tag — it is a `<span>`. This means it reads as a link visually but is not one functionally. Screen reader users will not know it is interactive.
In addition, placing a bold coloured phrase inside a consent sentence mid-flow is jarring — the eye jumps to it, which may make users think it is a separate CTA rather than context.
Replacement: Convert to a real `<a>` element with `href` pointing to the privacy policy URL (or a `#` placeholder in the prototype). Visually: keep the brand-colour styling but remove the bold weight to reduce the pull. Copy: no change needed — "Privacy policy" is the correct label.
Same issue at line 1419: second `Privacy policy` span in the credit consent.
Reason: Accessibility and UX honesty — styled-as-link elements must behave as links.

**[SHOULD-FIX-8]** Line 1417: Credit check consent reads:
`"I authorise Uncapped to obtain a soft personal credit bureau report to help size my offer. This will not affect my credit score."`
"authorise" is British English — correct for UK, but this is a US-locale flow (USD, US states). The US spelling is "authorize".
Replacement: `"I authorize Uncapped to run a soft credit check to help size my offer. This will not affect my credit score."`
Also: "obtain a soft personal credit bureau report" is correct but dense. "run a soft credit check" is the plain-English equivalent used in the card header and sidebar.
Reason: US locale consistency + plain language. "authorize" instead of "authorise", and aligns the consent language with the simpler phrasing already used in the card header above.

**[SHOULD-FIX-9]** Line 1407: Credit check card header reads:
`"We run a soft credit check to size your offer"`
Alignment note: the consent copy says "to help size my offer" — the first person "my" shifts correctly between header (Uncapped's voice) and consent (customer's voice). This is fine and intentional. No change needed here — flagged as confirmed intentional.

##### Missing copy

**[MISSING-1]** There is no validation error state for any field on this screen. The `canContinue` gate blocks "Continue" but provides no explanation. At minimum, if a user leaves the DOB fields blank and tries to tap Continue (which is disabled, so they can't — but if they navigate back and forward), they receive no guidance. The form relies entirely on the disabled CTA.
Suggested validation text for DOB, if the user partially fills the field and blurs: `"Enter your full date of birth (MM / DD / YYYY)."`
Suggested validation for phone: `"Enter a phone number so we can send you application updates."`
Reason: Missing copy — a disabled button with no explanation is an anxiety moment for a first-time applicant.

---

#### Screen 5 — Application (Review and apply)

**Pillar(s) reinforced:** Full transparency · Keep control

##### On voice ✅

- Line 1494: `"Review and apply"` — clean, direct page title. On brand.
- Line 1497: `"One last look before you apply. Check everything's right, then send it off."` — friendly without being breezy. Good rhythm.
- Line 1503: `"We need to know about all the places your business receives revenue from."` — transparent about the reason. Good.
- Line 1577: `"Apply for funding"` — this is the right CTA at this moment. Matches website power phrase "Apply for capital" / "Get funded" register.
- Line 1567: `"I confirm I will use this funding for business purposes only"` — plain, unambiguous.

##### Should-fix ⚠️

**[SHOULD-FIX-10]** Lines 1523: Business details card subtitle reads:
`"Check your business details are up to date and accurate"`
Line 1532: Contact details card subtitle reads:
`"Check your contact details are up to date and accurate"`
These two lines are identical in structure and almost identical in content, making them feel templated and perfunctory. The instruction "Check … are up to date and accurate" is also slightly redundant with the "Edit" affordance — the user doesn't need to be told to check; they need to know *why* accuracy matters.
Replacement for business details: `"Your business name and address appear on your funding agreement."`
Replacement for contact details: `"We'll use these to send your offer and stay in touch."`
Reason: Gives the user a reason to care about accuracy, which is more useful than a bare instruction to check.

**[SHOULD-FIX-11]** Line 1553: Inside the "Applicant information" SummaryCard, the locked state reads:
`"Applicant information cannot be changed while we're checking your details"`
This is accurate but slightly cold. It implies a restriction without reassurance.
Replacement: `"Your details are locked while we run your credit check. This keeps your application secure."`
Reason: Adds the "why" and reframes the restriction as a security feature, not a limitation. Matches the "keep control" pillar by explaining what Uncapped is doing with the data.

##### Polish 🔧

**[POLISH-2]** Line 1511: `"Amazon — Michael Scott"` in the Connections card uses an em dash with no surrounding spaces, which renders as `Amazon—Michael Scott`. The dash should be spaced or replaced with a colon for readability.
Replacement: `"Amazon · Michael Scott"` (interpunct) or `"Amazon: Michael Scott"`
Reason: Minor typographic clarity.

---

#### Screen 6 — Offer Holding (OfferHoldingScreen)

**Pillar(s) reinforced:** Move fast · Full transparency

##### On voice ✅

- Line 1670: `"Underwriting your offer"` — direct, transparent label for the banner. On brand for the "full transparency" pillar.
- Line 1698: `"Checking information…"` — clear, plain. The ellipsis signals ongoing activity. Good.
- Line 1698 (done state): `"Analysis complete"` — precise, calm. Good.
- Line 1700 (done state): `"Done"` — clean completion signal. Works.
- Line 1700 (in-progress): `"ETA: 5 minutes"` — honest time estimate. This is the right move: Uncapped's brand is built on not hiding information. The specific number is far better than a vague "soon".
- Line 1768: `"What happens now?"` — familiar to customers from the website's how-it-works sections. Good.
- Line 1769: The "What happens now?" body is strong: `"We'll notify you by SMS and email when underwriting is complete, or if we need more information. Sometimes our analysis takes longer than expected — this doesn't mean your application will be rejected."` — this is exactly the right anxiety kill. The second sentence is the most important. The tone is calm and honest. On voice.

##### Should-fix ⚠️

**[SHOULD-FIX-12]** Line 1670: `"Underwriting your offer"` is the overline text on the gradient banner. "Underwriting" is a lender's internal term. A first-time applicant may not know what underwriting means — it could sound ominous or procedural rather than reassuring.
The word appears again in the `aria-label` at line 1712: `"Underwriting progress"`.
Replacement for visible overline: `"Preparing your offer"`
Replacement for `aria-label`: `"Offer preparation progress"`
Reason: "Preparing your offer" is active, positive, and customer-centred. It reinforces the "Move fast" pillar. "Underwriting" is internal jargon that carries no additional meaning for the applicant at this point.

**[SHOULD-FIX-13]** Line 1684: The `aria-label` on the "Calculating" placeholder amount reads:
`aria-label="Calculating offer amount"`
The visible text is simply `"Calculating"` — a single word — shown at 40px in ghost/dim styling. A screen reader will announce "Calculating offer amount" which is fine for context, but the visible word "Calculating" as a stand-in for an offer amount is ambiguous. A user who returns to the screen mid-flow, or who has slow processing, may not immediately understand that this is a temporary placeholder, not an error.
Replacement visible text: `"Preparing…"` (styled identically to current "Calculating" but with an ellipsis to signal progress)
Replacement `aria-label`: `"Your offer amount is being calculated"`
Reason: "Preparing…" is warmer and consistent with the recommended overline change to "Preparing your offer". The ellipsis signals "not done yet" more naturally than a bare noun. The aria-label is a more complete sentence for screen reader context.

**[SHOULD-FIX-14]** Line 1749: The "In progress…" inline tag reads well at a glance, but it is rendered with `animate-pulse` (opacity pulse) as the only visual signal that a stage is active — there is no text-level differentiation. For a user with reduced-motion preferences, `animate-pulse` is suppressed (the `prefers-reduced-motion` CSS at line 145 covers `.asc-enter` and `.asc-scale-reveal` but does NOT cover Tailwind's `animate-pulse`). The "In progress…" label itself is fine copy; the motion risk is flagged for the accessibility-edge-reviewer, but the label should be verified as visible without motion.
No copy change needed. Flag for accessibility-edge-reviewer to confirm `animate-pulse` is suppressed under `prefers-reduced-motion`.

**[SHOULD-FIX-15]** Line 1792: IdVerificationCard body text reads:
`"While you wait for your offer, scan this code with your phone to verify your identity, powered by Sumsub. It takes about 2 minutes and clears the final step before funding."`
"It takes about 2 minutes" is the right specificity. "clears the final step before funding" is slightly ambiguous — "clears" can mean passes or removes. "completes" is more precise.
Also: "powered by Sumsub" is buried mid-sentence. Sumsub is an unfamiliar name to most founders; reassurance about who they are might help.
Replacement: `"While your offer is being prepared, scan this code with your phone to verify your identity. It takes about 2 minutes and completes the final step before you can access your funds."`
Move the Sumsub attribution to the standalone line at 1832 (`"Powered by Sumsub"`) — it already exists there, so remove it from the body copy to avoid the mid-sentence interruption.
Reason: Cleaner sentence, removes the ambiguous "clears", surfaces the time estimate more prominently, and avoids duplicating the Sumsub mention.

##### Polish 🔧

**[POLISH-3]** Line 1700: ETA reads `"ETA: 5 minutes"`. The label `ETA` is an abbreviation that not all users will know (Estimated Time of Arrival). In a fintech context with a multi-cultural user base, spell it out or rephrase.
Replacement: `"About 5 minutes"` or `"Ready in about 5 minutes"`
Reason: Removes the abbreviation without losing meaning. Slightly warmer.

**[POLISH-4]** Lines 1621–1623: Stage labels in `PROGRESS_STAGES`:
- `"Reading your Amazon sales history"` — good, specific.
- `"Checking your business profile"` — fine, though "business profile" is slightly generic.
- `"Sizing your offer"` — "sizing" is internal jargon (same register as "underwriting"). To the customer, this reads as an unusual verb choice.
Replacement for stage 3: `"Calculating your offer amount"`
Reason: More familiar phrasing. Removes the internal "sizing" term while keeping the meaning.

##### Missing copy

**[MISSING-2]** There is no error state or fallback copy for the OfferHoldingScreen if the underwriting process fails, stalls, or returns an eligibility decision before the simulated stages complete. In a real flow, the "What happens now?" card is the only communication. There should be a variation or supplementary state for:
- A delay beyond the ETA: `"We're still reviewing your application. We'll email you as soon as it's ready."`
- A need for more information: `"We need a little more from you before we can make an offer. Check your email — we've sent you details of what we need."`
These don't need to be wired into the prototype but should exist as copy for the design review.
Reason: Missing copy — the "What happens now?" body mentions "if we need more information" but there is no screen state for that scenario.

**[MISSING-3]** The `canContinue` check on the eligibility screen (line 558) only covers the LLC path (`llcBusinessChosen`). For the SP path, `canContinue` is always `true`. However, First Name and Last Name are pre-filled from Amazon but editable — there is nothing stopping the user from clearing both name fields and proceeding. No validation exists. Suggested: add a note in the copy brief that the CTA should be disabled if either name field is blank, with helper text: `"Enter your legal first and last name to continue."`
Reason: Missing validation copy for the SP name fields.

---

### Flags

**Localisation:** This flow is US-locale (USD, US states, US phone format, US lender disclosures). Two British-English spellings were found in consent copy: "authorise" (line 1417) should be "authorize" for this locale. The tab label "(Trader)" (line 623) is a UK/AU term that will read oddly to US founders — remove it.

**Regulatory / Consent:** The SMS TCPA boilerplate at line 1393 ("Message frequency varies. Standard message and data rates apply.") is required for US SMS consent. Do not remove it, but consider integrating it more naturally (see SHOULD-FIX-6). The "Privacy policy" links in both consent cards are non-functional `<span>` elements — they must be real `<a>` elements in production (see SHOULD-FIX-7).

**Jargon:** "Underwriting" (lines 1670, 1712) and "Sizing" (PROGRESS_STAGES stage 3) are lender-internal terms that will land cold for first-time applicants. Both flagged with replacement copy above.

**Missing error states:** No validation messages on applicant screen (MISSING-1), no delay/failure states on offer holding screen (MISSING-2), no validation on SP name fields (MISSING-3).

**Overall voice fit:** The copy is 80% on voice. The page-level structure is strong — the anxiety-killer line on the applicant screen, the "What happens now?" body, and the credit data sidebar all reflect the Uncapped tone well. The main gaps are: (1) jargon ("underwriting", "sizing") in the offer screen; (2) locale mismatches in consent copy ("authorise", "(Trader)"); (3) non-functional privacy policy links; and (4) absent validation error states throughout. The OfferHoldingScreen redesign reads cleanly — the status/ETA label pair is a clear improvement over a segmented progress bar and the stage checklist is easy to scan.

### Findings summary

| Severity | Count | Items |
|---|---|---|
| SHOULD-FIX | 15 | SF-1 through SF-15 |
| POLISH | 4 | P-1 through P-4 |
| MISSING | 3 | M-1 through M-3 |
| CRITICAL | 0 | — |

No copy is critically wrong. Top priorities: SHOULD-FIX-7 (non-functional privacy links — regulatory), SHOULD-FIX-8 (US locale "authorize"), SHOULD-FIX-12 (remove "underwriting" jargon from customer-facing offer screen), SHOULD-FIX-6 (integrate SMS boilerplate more naturally).

---

## [Step 2] design-keeper — Role: Design Review — 2026-06-18 11:00

### Input
Full token/component compliance audit of `asc-sole-prop.tsx` screens 3–6 (eligibility, applicant, application, offer) against Uncapped UI Kit 2025. Amazon SC screens (seller-central, amazon-auth) are intentionally out of DS scope — noted but not flagged as violations.

### Findings

---

#### SHADOW_SM / SHADOW_MD constants — Elevation

Lines 62–63: `SHADOW_SM = "0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)"` matches `Light/Sm` exactly. `SHADOW_MD = "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)"` matches `Light/Md` exactly. Values are token-correct but applied via inline `style={{ boxShadow }}` at ~10 sites throughout the file. The Tailwind classes `shadow-light-sm` / `shadow-light-md` are registered in `app.css @theme` and should be used instead.

[SHOULD-FIX] [ELEVATION] Lines 62–63, ~10 application sites: `style={{ boxShadow: SHADOW_SM }}` / `SHADOW_MD` — values are numerically correct. Replace with `className="shadow-light-sm"` / `"shadow-light-md"` (both registered in `app.css @theme`).

---

#### Typography — heading elements

**Line 574:** EligibilityScreen heading:
`<h1 className="text-[32px] font-semibold leading-[1.3] text-neutral-800" style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}>`
Raw `<h1>` with inline `fontFamily`. Figma Heading/H3 = 32px → code `type="h4"`. The `<Typography>` component is required.

[BLOCKING] [TYPOGRAPHY] Line 574: raw `<h1 style={{ fontFamily: "Commissioner..." }}>` at 32px — use `<Typography type="h4">` (Figma H3 = 32px → code h4). Inline `fontFamily` bypasses the DS typography component.

**Line 1199:** ApplicantScreen heading:
`<h1 className="text-[40px] font-bold leading-tight text-neutral-800" style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}>`
Figma H2 = 40px → code `type="h3"`.

[BLOCKING] [TYPOGRAPHY] Line 1199: raw `<h1 style={{ fontFamily: "Commissioner..." }}>` at 40px — use `<Typography type="h3">` (Figma H2 = 40px → code h3).

**Line 1490:** ApplicationSummaryScreen heading — identical pattern.

[BLOCKING] [TYPOGRAPHY] Line 1490: raw `<h1 style={{ fontFamily: "Commissioner..." }}>` at 40px — use `<Typography type="h3">`.

**Lines 919, 942, 959:** EligibilitySidebar `<h3>` headings: use both `font-heading` class (safelisted, correct) and redundant inline `style={{ fontFamily: "Commissioner..." }}`. Sidebar decoration context.

[SHOULD-FIX] [TYPOGRAPHY] Lines 919, 942, 959: sidebar `<h3>` elements carry redundant `style={{ fontFamily: "Commissioner..." }}` alongside the `font-heading` class. Remove the inline style. `font-heading` is safelisted and sufficient. Full compliance: use `<Typography type="h4" className="text-white">`.

**Line 1672:** OfferHoldingScreen amount `<p>` at 40px uses `font-extrabold` (weight 800). `Amount/Md` spec is Bold 700. The `<Typography>` component is not used here; the inline pattern is acceptable for the animated amount per `_prototype-primitives.md`, but the weight is wrong.

[SHOULD-FIX] [TYPOGRAPHY] Line 1672: amount display uses `font-extrabold` (800) — DS `Amount/Md` (40px) specifies Bold 700. Change `font-extrabold` to `font-bold`.

---

#### Tailwind v4 safelist — `ring-brand-*` (critical, multiple sites)

`ring-brand-200` and `ring-brand-600` are used in the `inputBase` constant (lines 547, 1193) and on individual interactive elements (lines 594, 612, 768, 882, 1303, 1327). Looking at `app.css @source inline()`: the safelist covers `{bg,border,text}-accent-*` and named button/text tokens — but does NOT include `ring-brand-*` at any weight. These classes will silently fail to compile in dev mode. Every input focus ring and several button focus rings will be invisible.

[BLOCKING] [SAFELIST] Lines 547 and 1193 (`inputBase`), 594, 612, 768, 882, 1303, 1327: `focus:ring-brand-200` / `focus-visible:ring-brand-600` / `focus-within:ring-brand-200` — none appear in `app.css @source inline()`. All focus rings on all form inputs and several interactive buttons will be invisible in dev mode. **Systemic fix (two options):**
- Option A: Add `ring-brand-200 ring-brand-600` to the `@source inline()` block in `src/styles/app.css`.
- Option B: Replace `focus:ring-2 focus:ring-brand-200` with `focus:shadow-[0_0_0_3px_#eaf6f6]` and `focus-visible:ring-2 focus-visible:ring-brand-600` with `focus-visible:shadow-[0_0_0_2px_#128081]` (arbitrary shadow utilities always compile).

---

#### Tailwind v4 safelist — `accent-brand-600` on checkboxes

Lines 1390, 1414, 1565: `<input type="checkbox" className="mt-0.5 size-4 accent-brand-600" />`
`accent-brand-600` is the CSS `accent-color` utility — distinct from the `{bg,border,text}-accent-*` pattern in the safelist. It does not appear in `@source inline()`. In dev mode, checkboxes render with the browser-default accent colour (typically blue) instead of brand teal.

[BLOCKING] [SAFELIST] Lines 1390, 1414, 1565: `accent-brand-600` (CSS accent-color utility) is not in `@source inline()`. Checkboxes render browser-default blue in dev. Fix: add `accent-brand-600` to `@source inline()`, or replace with `style={{ accentColor: "#128081" }}`.

---

#### Tailwind v4 safelist — conditional template literals

Lines 594 and 612: business-type toggle buttons use template literal class strings:
```
`${businessType === "llc" ? "bg-white text-brand-600" : "text-text-secondary hover:bg-white/50"}`
```
Tailwind v4's static scanner may not reliably extract class strings from template literals. `text-brand-600` and `text-text-secondary` appear as complete substrings, which helps, but `hover:bg-white/50` is also present inside a ternary and may be missed.

[SHOULD-FIX] [SAFELIST] Lines 594, 612: conditional template literals containing Tailwind classes. While individual class strings may be detected, template literal extraction is not guaranteed in Tailwind v4. Extract to a lookup object: `const tabCls = { llc: "bg-white text-brand-600", sp: "text-text-secondary hover:bg-white/50" }` and apply `className={tabCls[businessType]}`.

---

#### Colour — off-token hex values in DS-scoped screens

**Line 1547:** "Applicant information — Complete" banner:
`style={{ borderColor: "#bfe6e0", backgroundColor: "#f1faf8" }}`
`#bfe6e0` is not a canonical DS token (closest: `brand-300 = #c1e5e6`). `#f1faf8` is one digit off from `brand-100 = #f1f9f9`.

[BLOCKING] [COLOUR] Line 1547: `borderColor: "#bfe6e0"` — not a DS token. Use `#c1e5e6` (brand-300 / status-border-success). `backgroundColor: "#f1faf8"` — not a DS token. Use `#f1f9f9` (brand-100 / status-background-success).

**Line 1707:** Progress bar track:
`style={{ backgroundColor: "#e7eaeb" }}`
Not a DS token. Between neutral-200 (`#f0f3f4`) and neutral-300 (`#d7dee0`).

[SHOULD-FIX] [COLOUR] Line 1707: progress bar track `#e7eaeb` is not a DS token. Use `#f0f3f4` (neutral-200) or `#d7dee0` (neutral-300).

**Line 1668:** OfferHoldingScreen gradient banner:
`style={{ background: "linear-gradient(105deg, #138a86 0%, #0f6b78 45%, #1c5b86 100%)" }}`
None of these three values map to a canonical Uncapped DS colour token. `#138a86` is close to brand-600 (`#128081`) but differs. `#0f6b78` has no token equivalent. `#1c5b86` introduces a navy-blue tone not present in the Uncapped brand palette at all — it would render differently under other brand modes.

[BLOCKING] [COLOUR] Line 1668: gradient uses three off-token hex values (`#138a86`, `#0f6b78`, `#1c5b86`). `#1c5b86` is not in the Uncapped palette. Use the `<Gradient>` DS component, which applies the canonical brand gradient and adapts across brand modes automatically.

---

#### Border radius

**Line 1665:** OfferHoldingScreen outer gradient card: `className="overflow-hidden rounded-3xl bg-white"`. `rounded-3xl` = 24px. DS card Lg mode = `radius/2xl` = 16px (`rounded-2xl`).

[SHOULD-FIX] [BORDER RADIUS] Line 1665: `rounded-3xl` (24px) on the offer card outer wrapper. DS card Lg = `rounded-2xl` (16px). Change to `rounded-2xl`.

---

#### DS component reuse

**`SummaryCard` (lines 1585–1613):** Hand-rolled card with BoxIcon header + title + optional Edit action + body. This is exactly the `<CardV2>` pattern in the DS.

[SHOULD-FIX] [COMPONENT REUSE] Lines 1585–1613: `SummaryCard` duplicates the `<CardV2>` component pattern (icon + title header + body). Replace with `<CardV2 title="..." icon={...} severity="accent-1" actions={<button>Edit</button>}>`. Five uses across `ApplicationSummaryScreen`.

**`CreditDataCard` / `IdVerificationCard` (lines 1441–1471, 1777–1837):** Hand-rolled `<div className="overflow-hidden rounded-2xl bg-white">` with `SHADOW_SM`. Use `<Card>` or `<CardV2>`.

[SHOULD-FIX] [COMPONENT REUSE] Lines 1441 and 1779: `CreditDataCard` and `IdVerificationCard` use raw `<div>` containers instead of `<Card>` or `<CardV2>`.

**`OfferHoldingScreen` gradient div (line 1665):** Raw `<div style={{ background: "linear-gradient(...)" }}>` — the `<Gradient>` DS component exists for this purpose and handles brand-mode colour switching.

[BLOCKING] [COMPONENT REUSE] Line 1665: offer gradient header uses a raw `<div style={{ background: "linear-gradient(...)"}}>` with off-token hex values. Use `<Gradient>` component. This is the same violation as the colour finding above — both root causes must be fixed together.

**`QuickAction` (lines 1146–1153):** Raw `<button>` instead of `<Button variant="secondary" size="sm">` with leading icon.

[SHOULD-FIX] [COMPONENT REUSE] Lines 1146–1153: `QuickAction` uses a raw `<button className="...">` — replace with `<Button variant="secondary" size="sm">` containing a `<BoxIcon>` leading icon.

---

#### `active tab shadow` — layer order mismatch (lines 601, 619)

Active toggle-tab button shadow is written as `{ boxShadow: "0 1px 2px rgba(0,0,0,.07), 0 0 6px rgba(0,0,0,.03)" }` — layer order is reversed vs. the `SHADOW_SM` constant at line 62 (`0 0 6px … , 0 1px 2px …`). Values are correct but layer order differs from the token definition.

[SHOULD-FIX] [ELEVATION] Lines 601, 619: active tab shadow has reversed layer order vs. `SHADOW_SM` constant. Replace with `style={{ boxShadow: SHADOW_SM }}` for consistency.

---

#### Verified-correct items (no action needed)

- `SHADOW_SM` / `SHADOW_MD` numeric values match DS `Light/Sm` / `Light/Md` tokens exactly.
- All Hugeicons imports use correct package paths (`@hugeicons/react`, `@hugeicons-pro/core-solid-standard`, `-rounded`, `-sharp`, `-stroke-standard`). No inline SVG re-creations of library icons.
- All icon colours within DS-scoped screens use `className="text-neutral-*"` or `style={{ color: "#hex" }}` — no raw hex in `className` attribute.
- Hex values in `AccentInner` (`#1ebdc0`, `#37a7f1`, `#ffac30`, `#9a73f6`), `StatusDot` (`#128081`, `#ffac30`, `#879092`), progress bar fill (`#128081`), stage dots (`#128081`, `#ffac30`), "Connected" chip (`#eaf6f6`, `#128081`), QR SVG fill (`#193a43`) — all map to canonical DS tokens.
- `GlassTile` checked badge `#128081` = brand-600. Correct.
- `text-text-secondary` — safelisted at `app.css` line 5. Passes.
- `text-brand-600` — appears as literal complete strings (not in template literals in most uses); picked up by `@source "../**/*.{ts,tsx}"` scanner. Passes.
- All `<BoxIcon severity="accent-{1,2,3,9,11}">` — covered by `app.css` line 3 safelist pattern. Passes.
- Sandbox hygiene: `<div className="min-h-screen w-full bg-surface-canvas">` wrapper at line 149 — correct (`w-full` present). No live Uncapped API calls. No Auth0/Unleash/Sentry hooks. Passes.
- `<Button>`, `<BoxIcon>`, `<Logo>` are all imported from DS component paths and used correctly where they appear.

---

### Verdict
CHANGES REQUIRED

**Blocking — must fix before sharing with stakeholders:**

| # | Location | Issue |
|---|---|---|
| B1 | Lines 547, 594, 612, 768, 882, 1193, 1303, 1327 | `ring-brand-{200,600}` not safelisted — all input/button focus rings invisible in dev |
| B2 | Lines 1390, 1414, 1565 | `accent-brand-600` not safelisted — checkboxes render browser-default blue |
| B3 | Line 1547 | `#bfe6e0` / `#f1faf8` off-token — use `#c1e5e6` / `#f1f9f9` |
| B4 | Line 1668 | Gradient uses off-token hex including non-Uncapped `#1c5b86` — replace with `<Gradient>` |
| B5 | Line 574 | Raw `<h1 style={{ fontFamily }}>` at 32px — use `<Typography type="h4">` |
| B6 | Lines 1199, 1490 | Raw `<h1 style={{ fontFamily }}>` at 40px — use `<Typography type="h3">` |

**Should-fix — before handoff to engineering:**

| # | Location | Issue |
|---|---|---|
| S1 | ~10 sites | `style={{ boxShadow: SHADOW_SM/MD }}` — replace with `shadow-light-sm` / `shadow-light-md` |
| S2 | Lines 601, 619 | Active tab shadow layer order reversed vs. `SHADOW_SM` |
| S3 | Lines 594, 612 | Template literal class strings — extract to lookup object |
| S4 | Line 1665 | `rounded-3xl` (24px) → `rounded-2xl` (16px) |
| S5 | Line 1672 | `font-extrabold` (800) → `font-bold` (700) on amount |
| S6 | Lines 919, 942, 959 | Redundant inline `fontFamily` on sidebar `<h3>` — remove |
| S7 | Line 1707 | Progress bar track `#e7eaeb` → `#f0f3f4` (neutral-200) |
| S8 | Lines 1585–1613 | `SummaryCard` → `<CardV2>` |
| S9 | Lines 1441, 1779 | `CreditDataCard` / `IdVerificationCard` raw divs → `<Card>` or `<CardV2>` |
| S10 | Lines 1146–1153 | `QuickAction` raw button → `<Button variant="secondary" size="sm">` |

---

## [Step 3] ux-motion — Motion Review — 2026-06-18

### Input
Full motion audit of `asc-sole-prop.tsx`. Screens 1–2 (Amazon SC) noted where relevant. Screens 3–6 (Uncapped-branded) are the primary scope. Mode: REVIEW ONLY — no edits made.

---

### Motion Review — asc-sole-prop

**File:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx`
**Total interactive elements audited:** 28
**Elements passing all 4 motion checks (hover / focus / press / state transition):** 9
**Elements needing motion fixes:** 19

---

#### 1. Screen-to-screen transitions — `go()` and `asc-enter`

**How it works:** `go()` calls `setScreen()`, which unmounts the old screen component and mounts the new one. React re-renders synchronously on the same tick, so the new screen element is inserted into the DOM immediately. The `asc-enter` class is on the top-level wrapper of each screen component. Because the element is brand-new on each mount, the CSS `animation: asc-fade-up 0.28s both` fires correctly from the `from` keyframe — the browser has no prior computed style to inherit.

**Pass/fail per screen mount point:**

- `SellerCentralScreen` (line 237): `<div className="asc-enter ...">` — fires on mount. Passes.
- `AmazonAuthScreen` (line 454): `<div className="asc-enter ...">` — fires on mount. Passes.
- `EligibilityScreen` (lines 563, 636, 744): `<div className="asc-enter ...">` on the form column, and separately on the SP fields block and LLC fields block when `businessType` changes. The tab-swap between LLC and SP re-mounts the inner field blocks with their own `asc-enter` — this is the correct behaviour for communicating the context switch.
- `applicant` / `application` / `offer` screens: the `<main className="asc-enter ...">` and `<aside className="asc-enter ...">` wrappers (lines 174, 180, 188, 194, 201, 204) are unmounted and remounted on each `screen` state change because the entire `{screen === "applicant" && ...}` conditional block is destroyed and rebuilt. `asc-enter` fires on each transition. Passes mechanically.

**Issue — old content visual linger (SHOULD-FIX):** When `go()` is called, React batches the state update in a microtask. The old screen component is torn down synchronously in the same frame the new one appears. There is no exit animation on the outgoing screen. Practically, on a fast device this is a near-instant swap that looks like a cut. Optionally addressable, but the incoming `asc-enter` does most of the perceptual work. This is acceptable at prototype fidelity — flagged as POLISH rather than SHOULD-FIX because adding an exit requires either a key-based approach or a delayed unmount pattern, which is materially more complex and not justified for a prototype.

**Issue — EligibilitySidebar does not re-enter on screen change (POLISH):** The `EligibilitySidebar` wrapper at line 894 carries `asc-enter` with `animationDelay: "80ms"`. The sidebar is static decorative content — it does not change between SP and LLC paths, and the `asc-enter` only fires on the initial mount of `EligibilityScreen`. On subsequent tab toggles the sidebar does not re-animate (correct — it shouldn't). No action needed.

---

#### 2. `asc-enter` animation — curve and duration

**Definition (lines 131–141):**
```
animation: asc-fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
translateY: 10px → 0
opacity: 0 → 1
```

**Severity: SHOULD-FIX**

`cubic-bezier(0.22, 1, 0.36, 1)` is a fast-out, slow-in curve with a very high exit velocity — the y2=1 control point means the curve reaches near-final velocity almost immediately. Combined with 0.28s (280ms), this is at the outer edge of the 150–250ms Uncapped target range. The overshoot risk here is zero (this curve has no bounce), but the duration is 30ms over target. For a fintech onboarding screen transition, 250ms with a standard ease-out is more appropriate. The 10px translateY is within the acceptable range (< 16px).

**Fix:** Change `0.28s cubic-bezier(0.22, 1, 0.36, 1)` to `0.22s ease-out` (220ms, standard ease-out). This keeps the entrance quick and precise without the slightly theatrical deceleration tail of the current curve.

---

#### 3. `asc-scale-reveal` — bounce overshoot on offer amount

**Definition (lines 135–143):**
```
animation: asc-scale-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both;
scale: 0.82 → 1 (bounce via 1.56 overshoot coefficient)
opacity: 0 → 1
```

**Severity: BLOCKING**

`cubic-bezier(0.34, 1.56, 0.64, 1)` — the y2=1.56 value drives a visible overshoot above scale(1) before settling. This is a spring/bounce easing. Used in two places:

1. **Consent modal in `SellerCentralScreen` (line 398):** Amazon surface, intentional fidelity mock. The bounce reads as out-of-character even for an Amazon modal — Amazon modals use linear or ease-out, not spring entrances. Jarring but not blocking in prototype context.

2. **Offer amount `<p>` in `OfferHoldingScreen` (line 1673):** The offer amount in a lending product is the most consequential number on the page. A bounce entrance on a dollar figure reads as playful and juvenile — it undermines trust at exactly the moment trust is most fragile. This is the classic Uncapped "never bounce" case.

**Fix for line 1673:** Remove `asc-scale-reveal` from the offer amount `<p>`. Replace with a plain fade-in: `className="animate-[fadeIn_0.2s_ease-out_both]"` and add `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }` to the `<style>` block. The count-up animation already provides sufficient drama — the amount doesn't also need a scale entrance.

**Fix for line 143 (the class definition itself):** Change the easing to `cubic-bezier(0, 0, 0.2, 1)` (standard ease-out, equivalent to Material's decelerate curve). This eliminates the bounce for any future use of the class. The `scale: 0.82 → 1` with ease-out reads as a clean reveal.

**Fix for line 398 (consent modal):** The consent modal is an Amazon surface so DS rules don't apply, but the bounce is still jarring. Change the class on the modal div to use the corrected `asc-scale-reveal` (after fixing the easing above). If the Amazon bounce was intentional fidelity research, add a comment.

---

#### 4. Progress bar fill — `transition-all duration-700 ease-out`

**Line 1715:** `<div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: "${progressPct}%" ... }}/>`

**Severity: SHOULD-FIX**

700ms is too slow for a progress bar fill update. The stage timer fires every 2200ms (`timerRef` at line 1638). With a 700ms fill transition, the bar spends 32% of each stage interval still animating from the previous value. This is perceptually laggy — the bar feels like it doesn't respond promptly to stage completion.

Additionally, `transition-all` is flagged by the smoothness audit rules: it should be `transition-[width]` or `transition-width` to avoid unintentionally transitioning other properties (`height`, `background-color`, etc.).

**Fix:** Change to `transition-[width] duration-500 ease-out`. 500ms is a more typical progress fill duration — visible but not sluggish. Alternatively 400ms if a snappier feel is preferred.

---

#### 5. Stage checklist items — dot and text transitions

**Lines 1728, 1742:** `transition-all duration-300` on both the dot `<span>` and the label `<span>`.

**Severity: SHOULD-FIX (partial)**

`transition-all duration-300` violates smoothness rule 1 — animate only specific properties. The dot transitions `background-color`, `border-color`, and `border-style` (dashed → solid → filled). The label transitions `color` and `font-weight`. `transition-all` includes layout properties like `padding`, `margin`, and `font-size` in its sweep, which can cause unexpected jank.

**Fix for dots (line 1728):** Change `transition-all duration-300` to `transition-colors duration-200`. The dot's visual change is purely colour/fill, not transform or size.

**Fix for labels (line 1742):** Change `transition-all duration-300` to `transition-colors duration-200`. Font-weight changes (`font-semibold` toggle) are not interpolable in CSS — the weight snaps regardless of transition. Only `color` can actually transition here. Using `transition-colors` is more accurate and avoids hinting the browser to watch non-interpolable properties.

**`animate-pulse` on "In progress…" label (line 1749):** `animate-pulse` (Tailwind's 2s infinite opacity 1→0.5→1 pulse) is used as the only real-time activity signal for the active stage. In the context of an underwriting progress list, this is borderline — it's subtle enough to be acceptable in fintech. The copy team flagged this separately (SHOULD-FIX-14). Motion concern: the pulse is not suppressed under `prefers-reduced-motion` (see item 10 below). The pulse itself is not visually alarming, but it is continuous motion that should have a fallback.

---

#### 6. Hover / focus / press feedback — full element audit

**Business type toggle tabs (lines 589–624)**

- Hover: inactive tab has `hover:bg-white/50` — visible but very subtle against the `rgba(0,0,0,0.03)` track. Acceptable at prototype fidelity. Passes.
- Active state visual: `bg-white` + `text-brand-600` + `boxShadow`. Transition: `transition-all duration-150` is present on both tabs. Passes.
- Focus: `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` on both tabs. Passes — but note design-keeper B1: `ring-brand-600` is not safelisted and will be invisible in dev. Motion finding mirrors design-keeper finding.
- Press: No `active:` class on either tab. **SHOULD-FIX** — add `active:opacity-75` to both tab buttons for press feedback. The `transition-all duration-150` already present will smooth the opacity drop.

**"Add Name" / "Add name" button (line 709)**

- Hover: `hover:border-brand-400 hover:bg-brand-50` — visible, on-brand. Passes.
- Focus: `focus-visible:ring-2 focus-visible:ring-brand-200` — present. Passes (same safelist caveat as above).
- Press: `active:scale-[0.97]` — present. This is the one exception where a scale on a button is defensible because it's a small utility action button (not a primary CTA). The 0.97 scale is tight enough to read as a press, not a bounce. Passes.
- Transition: `transition-all` — should be `transition-colors duration-150` to avoid animating scale and colors simultaneously with different semantics. POLISH.

**Country selector (read-only div, line 643) / Country of incorporation (line 750)**

- Both are read-only non-interactive divs. No hover/focus needed. Passes.

**State of formation dropdown button (line 762)**

- Hover: No `hover:` class. **SHOULD-FIX** — add `hover:bg-neutral-50` so the trigger has visible response before the popup opens.
- Focus: `focus:border-brand-600 focus:ring-2 focus:ring-brand-200` — present on the `<button>`. Passes (safelist caveat).
- Press: No `active:` class. Acceptable for a dropdown trigger; omitting press feedback here is standard.
- Transition: `transition-all` is absent from the trigger button — only the chevron icon has `transition-transform duration-200` (line 774). **SHOULD-FIX** — add `transition-colors duration-150` to the trigger button `className` so focus/hover border colour transitions smoothly.
- State dropdown list items (line 790): `transition-colors hover:bg-neutral-50` — passes.

**Business search input (line 807)**

- Hover: None. Not critical — inputs don't require a hover state beyond the focus state.
- Focus: Uses `inputBase` which includes `transition-all duration-150 focus:border-brand-600 focus:ring-2 focus:ring-brand-200`. Passes (safelist caveat).
- Business search result buttons (line 831): `transition-colors hover:bg-neutral-50` — passes.
- "Add it manually" button (line 846): `transition-colors hover:bg-neutral-50` — passes.

**Search result dropdown — entrance animation**

**Severity: SHOULD-FIX**

Line 823: `{llcBusinessOpen && llcResults.length > 0 && (<div ...>)}` — appears with no entrance animation. Snaps in when results arrive. Apply `asc-enter` to the results dropdown div (or a more targeted `opacity + translateY` via a Tailwind `animate-[...]`). Duration 150ms — dropdowns should be faster than screen transitions.

Same issue at line 1351 (phone country picker dropdown): appears with no entrance. SHOULD-FIX.

Same issue at line 777 (state dropdown): appears with no entrance. SHOULD-FIX.

All three dropdowns snap open — consistent with current behaviour but out of step with the Uncapped microinteraction palette (dropdown menu: scale 0.98→1 + fade, 150ms ease-out). Grouping all three as one finding.

**Phone country picker button (line 1328)**

- Hover: `hover:bg-neutral-50` — passes.
- Focus: Inherits from the outer `focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200` wrapper on line 1327. The picker button itself has no `focus-visible:` class, so keyboard-tabbing to the button gives no visible ring on the button element, only the outer wrapper border change. **SHOULD-FIX** — add `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-600` to the picker button, or ensure the outer wrapper's `focus-within` is clearly visible (which requires the safelist fix from design-keeper B1).
- Press: No `active:` class. POLISH — add `active:opacity-75`.
- Transition: `transition-colors` on line 1328. Passes.

**Phone country dropdown list items (line 1361)**

- `transition-colors hover:bg-neutral-50` — passes.
- No `focus-visible:` on individual list-item buttons. **SHOULD-FIX** — add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600` or equivalent.

**SMS consent card label (line 1385)**

- The `<label>` wrapping the checkbox is `cursor-pointer` — correct. No hover visual on the card itself. POLISH — consider adding `hover:bg-neutral-50/50 transition-colors` to the label row so the entire consent row has a hover response, making it feel more clickable.

**Credit check consent card label (line 1409)** — same POLISH issue.

**"Enter address manually" / "Search for address instead" toggle link (line 1300)**

- Hover: `hover:underline` — passes.
- Focus: `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` — passes (safelist caveat).
- Press: No `active:` class. POLISH.
- Transition: `transition-all` — should be `transition-colors duration-150`. POLISH.

**Manual address form appearing (lines 1272–1299)**

When `addressManual` toggles, the manual form block appears with no entrance animation. It replaces the single search input. **SHOULD-FIX** — this is a conditional block swap similar to the SP/LLC tab swap. Add `asc-enter` to the manual address block (line 1272 `<div>`) so the multi-field form fades in rather than snapping.

**`SummaryCard` "Edit" buttons (line 1603)**

- Hover: `hover:bg-neutral-50` — passes.
- Focus: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2` — present, but no focus colour specified. `outline` defaults to browser colour (typically blue on Chrome). **SHOULD-FIX** — change to `focus-visible:outline-brand-600` or `focus-visible:shadow-[0_0_0_2px_#128081]`.
- Press: No `active:` class. POLISH — add `active:opacity-75`.
- Transition: `transition-colors duration-150` — passes.

**"Go back" (link variant Button) — lines 1425, 1573**

These use `<Button variant="link" ...>`. Motion is handled inside the `<Button>` DS component. Assuming the DS Button component has correct hover/focus/press handling, these pass. No additional motion needed at the prototype level.

**"Apply for funding" / "Continue" / "Start application" (primary Button)**

Same as above — DS Button component handles motion. These pass assuming DS Button is correctly implemented. Disabled state should fade opacity with a transition — this is inside the DS component and not visible in the prototype file.

**"Continue on this device" button in `IdVerificationCard` (line 1833)**

Uses `<Button variant="secondary" fullWidth>`. DS Button handles motion. Passes.

**`NavStep` buttons in `AppSidebar` (line 1097)**

- `transition-all` and `hover:bg-neutral-100` — present. Hover passes.
- No `focus-visible:` class. **SHOULD-FIX** — add `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` to the `NavStep` button.
- Press: No `active:` class. POLISH.
- `transition-all` should be `transition-colors duration-150`. POLISH.

**"Your Offer" non-interactive nav item (lines 1054–1066)**

- This is a `<div>`, not a `<button>`. No interaction needed. Passes.

**`QuickAction` buttons (lines 1146–1153)**

- `transition-colors hover:bg-neutral-100` — passes.
- No `focus-visible:` class. **SHOULD-FIX** — add `focus-visible:ring-2 focus-visible:ring-brand-600`.
- Press: No `active:` class. POLISH.

**"Restart prototype" button (line 1069)**

- `transition-colors hover:bg-neutral-100` — passes.
- No `focus-visible:` class. **SHOULD-FIX** — same fix as above.

**"Log out" button in `EligibilityScreen` (line 881)**

- `transition-colors hover:bg-neutral-100` and `active:scale-[0.97]` — passes.
- Focus: `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` — present (safelist caveat). Passes.

---

#### 7. Consent modal — entrance, backdrop, exit

**Consent modal (lines 391–441)**

**Backdrop (line 392):** `<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(15,17,17,0.45)" }}>` — the backdrop appears with no fade-in. It is conditionally rendered (`{consentOpen && ...}`) and snaps to full opacity instantly. This is the Amazon-surface modal so DS rules don't strictly apply, but the instant backdrop snap is jarring on any surface.

**Severity: SHOULD-FIX (Amazon surface — contextual)**

Fix: The backdrop needs CSS-based fade because React mounts it synchronously. Add a `backdrop-enter` keyframe or an `animate-[fadeIn_0.2s_ease-out_both]` to the backdrop div. On the Amazon surface, `transition-opacity` won't work because the element starts unmounted. An `@keyframes` approach is required.

**Modal panel (line 398):** Uses `asc-scale-reveal` — the bounce easing issue is called out in item 3 above (BLOCKING). After fixing the easing, this will be a clean 0.82→1 scale + fade at 220ms. Passes after easing fix.

**Exit transition:** There is no exit transition. `setConsentOpen(false)` unmounts the modal immediately. For a prototype this is acceptable, but adds to the "snappy" feel.

**Severity: POLISH** — add exit via a delayed-unmount pattern (e.g. use a `closing` boolean state that adds an `asc-exit` class for 150ms before setting `consentOpen` to false). Not justified at prototype scope unless stakeholders will see the close animation closely.

---

#### 8. Dropdown menus — entrance/exit

All three custom dropdowns snap open with no entrance:

- **State of formation dropdown** (line 777, `{llcStateOpen && ...}`): instant mount.
- **Business search results** (line 823, `{llcBusinessOpen && ...}`): instant mount.
- **Phone country picker** (line 1350, `{phoneOpen && ...}`): instant mount.

**Severity: SHOULD-FIX**

The Uncapped pattern for dropdown menus is: scale 0.98→1 + fade, 150ms ease-out, transform-origin matches trigger. None of the three implement this.

Fix: Add a shared `asc-dropdown-enter` class (or `animate-[ascDropdown_0.15s_ease-out_both]`) to each dropdown container `<div>` / `<ul>`. Add a keyframe:
```css
@keyframes asc-dropdown-open {
  from { opacity: 0; transform: scale(0.98) translateY(-4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.asc-dropdown-enter {
  animation: asc-dropdown-open 0.15s ease-out both;
}
```
Apply to: line 778 (`<ul role="listbox">`), line 825 (`<div className="absolute...">`), line 1352 (`<div className="absolute..."`).

No exit animation needed for prototype scope — exits are instant-unmount and acceptable.

---

#### 9. Count-up animation on offer amount

**Lines 1644–1658:**
```js
const step = Math.ceil(offerTarget / 60)  // = 667
setInterval callback at 16ms
```

At 16ms intervals and step=667, the count-up completes in approximately 60 × 16ms = 960ms (~1 second). The count-up starts from 0 and advances by $667 each frame.

**Issues:**

**Duration: SHOULD-FIX.** ~960ms is too long for an offer amount reveal. The Uncapped palette specifies 400–600ms for hero count-ups. The 60-frame approach at 16ms assumes the target is always near $40,000 — if `offerTarget` were $100,000, the step would be 1,667 and the duration would still be ~960ms, but the jumps would look coarser. A time-based approach is more robust.

Fix: Replace the frame-count interval with a time-based implementation that completes in 500ms regardless of the target value:
```js
const DURATION = 500
const startTime = performance.now()
const tick = () => {
  const elapsed = performance.now() - startTime
  const progress = Math.min(elapsed / DURATION, 1)
  setCountUp(Math.round(offerTarget * progress))
  if (progress < 1) requestAnimationFrame(tick)
}
requestAnimationFrame(tick)
```
This always takes 500ms, advances smoothly with linear easing (or apply an easing function to `progress`), and does not depend on a fixed step size.

**Settlement moment: SHOULD-FIX.** When `countUp` reaches `offerTarget` and the interval is cleared, the number simply stops. There is no settlement — no brief hold, no visual punctuation on the final value. This reduces the drama of the offer reveal.

Fix: When the count-up completes, briefly apply a `font-bold` or `scale(1.02)` flash or a quick glow pulse on the amount. Given the Uncapped "no bounce, no spring" rule, a simple opacity pulse (1 → 0.7 → 1) over 200ms after the count-up ends is the right approach. This can be done by toggling a CSS class that adds `animate-[pulse_0.2s_ease-in-out_1]` for one iteration.

**Easing: POLISH.** The current count-up uses a linear increment (constant step per frame). A real offer amount reveal typically has an ease-out feel — fast at the start, slowing as it approaches the final number. The time-based approach above can incorporate this with an easing function:
```js
// ease-out quad
const eased = 1 - Math.pow(1 - progress, 2)
setCountUp(Math.round(offerTarget * eased))
```

---

#### 10. Reduced-motion coverage

**Current `@media (prefers-reduced-motion: reduce)` block (lines 145–147):**
```css
.asc-enter, .asc-scale-reveal { animation: none !important; }
```

**Gaps:**

**Count-up animation: BLOCKING.** The `setInterval`/`requestAnimationFrame` count-up in `OfferHoldingScreen` is driven by JavaScript, not CSS. The CSS reduced-motion block has no effect on it. A user with `prefers-reduced-motion: reduce` will still see the counter increment from 0 to $40,000. The correct behaviour is to jump immediately to `offerTarget`.

Fix: In the `useEffect` that starts the count-up (line 1644), check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before starting the interval. If true, call `setCountUp(offerTarget)` immediately and skip the interval entirely.

**`animate-pulse` on "In progress…" label: SHOULD-FIX.** Line 1749: `animate-pulse` is a Tailwind `@keyframes` animation applied via a utility class. The CSS reduced-motion block only suppresses `.asc-enter` and `.asc-scale-reveal` by name. `animate-pulse` uses Tailwind's generated `@keyframes pulse` which is NOT covered by the existing block.

Fix: Add `motion-safe:animate-pulse` instead of bare `animate-pulse`. Tailwind's `motion-safe:` variant wraps the utility in `@media (prefers-reduced-motion: no-preference)`, which means the pulse is automatically suppressed under reduced-motion without adding to the CSS block. Line 1749 change: `animate-pulse` → `motion-safe:animate-pulse`.

**Progress bar fill transition: POLISH.** Line 1715: `transition-[width] duration-500` (after the fix recommended in item 4). The CSS block covers `.asc-enter` and `.asc-scale-reveal` but not this utility-class transition. Tailwind's `transition-*` utilities are not CSS-animation — they use the `transition` property, which the CSS reduced-motion block's `transition-duration: 0.01ms !important` would catch IF the project had the global reset. Without the global reset, the progress bar still transitions under reduced-motion.

Fix: A global reduced-motion reset in `app.css` (as recommended in the Uncapped motion palette docs) would cover this. Alternatively, replace `transition-[width]` with `motion-safe:transition-[width]` on line 1715.

**Settlement flash animation (if added per item 9): note.** Any JS-driven settlement flash added for the count-up must also be gated on `prefers-reduced-motion`, same pattern as the count-up check.

---

#### 11. Aside panel animation delay — 60ms stagger

**Lines 180, 194, 204:** `style={{ animationDelay: "60ms" }}` on `<aside className="asc-enter ...">`.

The main `<main>` block has no delay, so it starts at 0ms. The aside starts at 60ms. The `asc-enter` animation lasts 280ms (220ms after fix). So the main column is 60ms into its reveal before the aside begins. At 60ms delay the stagger is perceivable — the aside visibly lags behind the main content by a small but clear amount.

**Assessment: Passes with minor qualification.** 60ms is within the acceptable stagger window (Uncapped recommends 40ms between staggered elements). For a two-column layout where the aside is secondary, a 60ms lag is slightly generous but not wrong. It reinforces the hierarchy: main content first, supporting content second.

**POLISH:** After fixing `asc-enter` to 220ms, the 60ms delay means the aside starts at 60ms and completes at 280ms. With the original 280ms duration, the aside started at 60ms and completed at 340ms — 340ms total for the full entrance sequence. After the fix: 60ms + 220ms = 280ms total, slightly tighter. This is acceptable.

**Eligibility sidebar (line 894):** Uses `animationDelay: "80ms"`. The form column has no delay, the sidebar starts at 80ms. Same assessment — acceptable. The 80ms (vs 60ms for the later screens) may be because the eligibility layout is a two-column full-screen split rather than the narrower aside; a slightly longer stagger for a wider element is reasonable. Passes.

---

### Findings summary

#### BLOCKING — must fix before stakeholder viewing

| # | Line(s) | Element | Issue | Fix |
|---|---|---|---|---|
| M-B1 | 143 | `asc-scale-reveal` class | `cubic-bezier(0.34, 1.56, 0.64, 1)` produces a bounce overshoot — inappropriate for financial content | Change easing to `cubic-bezier(0, 0, 0.2, 1)` (standard ease-out). Remove `asc-scale-reveal` from offer amount `<p>` (line 1673); replace with a plain `fadeIn` on the amount. |
| M-B2 | 1644–1658 | Count-up animation | Not suppressed under `prefers-reduced-motion` — JS interval runs regardless of OS accessibility setting | Gate on `window.matchMedia('(prefers-reduced-motion: reduce)').matches`; if true, `setCountUp(offerTarget)` immediately, skip interval |

#### SHOULD-FIX — before design handoff

| # | Line(s) | Element | Issue | Fix |
|---|---|---|---|---|
| M-S1 | 140 | `asc-enter` duration | 0.28s (280ms) exceeds 150–250ms target; curve is correct | Change to `0.22s ease-out` |
| M-S2 | 1715 | Progress bar fill | `transition-all duration-700` — 700ms is too slow; `transition-all` animates layout properties | Change to `transition-[width] duration-500 ease-out` |
| M-S3 | 1728, 1742 | Stage checklist dots + labels | `transition-all duration-300` — use specific properties | Dots: `transition-colors duration-200`. Labels: `transition-colors duration-200` |
| M-S4 | 1749 | "In progress…" label | `animate-pulse` not suppressed under `prefers-reduced-motion` | Change to `motion-safe:animate-pulse` |
| M-S5 | 777, 823, 1352 | State dropdown, business search results, phone picker | All three snap open with no entrance animation | Add `asc-dropdown-enter` class + `@keyframes asc-dropdown-open` (scale 0.98→1 + fade, 150ms ease-out) to each |
| M-S6 | 589, 607 | Business type toggle tabs | No `active:` press feedback | Add `active:opacity-75` to both tab buttons |
| M-S7 | 762–776 | State of formation dropdown trigger | No hover state; no `transition-colors` on trigger | Add `hover:bg-neutral-50 transition-colors duration-150` to the trigger button |
| M-S8 | 1272 | Manual address form block | Snaps in when `addressManual` toggles | Add `asc-enter` to the manual address `<div>` wrapper |
| M-S9 | 1603 | `SummaryCard` "Edit" buttons | `focus-visible:outline` without colour — defaults to browser blue | Change to `focus-visible:outline-brand-600` or `focus-visible:shadow-[0_0_0_2px_#128081]` |
| M-S10 | 1097–1111 | `NavStep` buttons | No `focus-visible:` class | Add `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` |
| M-S11 | 1146–1153 | `QuickAction` buttons | No `focus-visible:` class | Add `focus-visible:ring-2 focus-visible:ring-brand-600` |
| M-S12 | 1069–1081 | "Restart prototype" button | No `focus-visible:` class | Add `focus-visible:ring-2 focus-visible:ring-brand-600` |
| M-S13 | 1644–1658 | Count-up | ~960ms duration exceeds 400–600ms target; no settlement moment | Rewrite as time-based (500ms, ease-out quad); add a single 200ms opacity pulse on completion |
| M-S14 | 1328 | Phone country picker button | No `focus-visible:` class on the button itself | Add `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-600 focus-visible:ring-inset` |
| M-S15 | 392 | Consent modal backdrop | Backdrop snaps to `rgba(15,17,17,0.45)` with no fade-in | Add `animate-[fadeIn_0.2s_ease-out_both]` to backdrop div; ensure `fadeIn` keyframe is in `<style>` block |

#### POLISH — optional improvement

| # | Line(s) | Element | Issue | Fix |
|---|---|---|---|---|
| M-P1 | 709 | "Add name" button | `transition-all` should target specific properties | Change to `transition-colors duration-150` (scale is handled by `active:scale-[0.97]`, which needs no transition) |
| M-P2 | 1385, 1409 | Consent card label rows | No hover response on the entire row | Add `hover:bg-neutral-50/50 transition-colors duration-150` to each `<label>` |
| M-P3 | 1361 | Phone dropdown list-item buttons | No `focus-visible:` class | Add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600` |
| M-P4 | 1300 | "Enter address manually" toggle | `transition-all` should target specific properties; no `active:` | Change to `transition-colors duration-150`; add `active:opacity-75` |
| M-P5 | 398 | Amazon consent modal exit | No exit transition on dismiss | Add delayed-unmount exit pattern with `asc-exit` class (150ms fade-out) if close animation matters for demo |
| M-P6 | 1644 | Count-up easing | Linear increment — consider ease-out quad for more natural deceleration | Apply `eased = 1 - Math.pow(1 - progress, 2)` in time-based rewrite |

---

### Overall motion health

The screen transition system (`asc-enter` + hash-based routing) works correctly — every new screen fires the entrance animation on mount. The main issues are:

1. **The `asc-scale-reveal` bounce easing is BLOCKING.** It is incompatible with the Uncapped fintech tone and is applied directly to the offer amount, which is the most trust-sensitive element in the flow. Fix the easing in the class definition and remove the class from the offer amount.

2. **The count-up is not reduced-motion safe (BLOCKING).** A user with vestibular settings will see a counter rapidly incrementing — this is exactly the kind of continuous numerical motion that reduced-motion preferences are designed to suppress.

3. **Three dropdown menus snap open.** This is the most visible roughness in the interactive flow — every time the user opens the state selector, business search, or phone picker, there is no entrance softening. Adding a single `asc-dropdown-enter` keyframe covers all three.

4. **Focus rings are present in code on most interactive elements but are invisible in dev** due to the design-keeper B1 safelist issue. Motion and accessibility both depend on this being fixed. Once the safelist fix lands, the focus-ring motion (border-color transition) will work as intended.

Top 3 priorities: fix `asc-scale-reveal` easing → gate count-up on reduced-motion → add dropdown entrance.

---

## [Step 4] accessibility-edge-reviewer — Findings — 2026-06-18

### Accessibility & Edge-Case Review — asc-sole-prop.tsx

**File:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx`
**Stage:** application + offer (screens 3–6); Amazon screens (seller-central, amazon-auth) reviewed on white background separately.

---

#### CRITICAL — WCAG-blocking, fix before sharing

---

**[A-CRIT-1] Contrast — `"Calculating"` text at `text-white/30` on gradient** (WCAG 1.4.3)

Line 1682: `className="text-[40px] font-extrabold leading-none text-white/30"` on the gradient background (`#138a86` at the lightest start stop).

`rgba(255,255,255,0.30)` composited on `#138a86` yields an effective foreground of approximately `#59adaa`. Measured contrast: **1.59:1** against the `#138a86` start stop. This fails 4.5:1 by a factor of nearly three. The element has `aria-label="Calculating offer amount"` (good for AT), but the visible text is the accessibility surface for sighted users and must meet the text contrast requirement unless purely decorative — which it is not.

Fix: Replace `text-white/30` with the placeholder text suppressed entirely, showing only the `aria-label` content via a visually-hidden span and rendering a skeleton shimmer bar in its place. Alternatively use `text-white/70` (effective ~2.7:1 — still fails, but the cleanest immediate improvement without a redesign) and note as a known contrast violation pending visual redesign. See also ui-copy SHOULD-FIX-13 for copy replacement to "Preparing…".

Needs designer input.

---

**[A-CRIT-2] Contrast — `opacity-85` white overline and subtext on gradient lightest stop** (WCAG 1.4.3)

Lines 1670 and 1689: `className="text-sm font-semibold opacity-85"` and `className="mt-1 text-sm opacity-85"`. Both render white text at 85% opacity. At the lightest gradient stop (`#138a86`), white/85 composites to approximately `#dceded` — measured contrast: **3.47:1** against `#138a86`. Fails 4.5:1 for 14px text.

The full-white 40px bold amount text at line 1673 (allDone state) passes — 4.19:1 at lightest stop, and 40px bold qualifies as large text (only 3:1 required).

Fix: Remove `opacity-85` from both lines 1670 and 1689. White at full opacity on all gradient stops passes (worst-case 4.19:1 at `#138a86` → passes as large text; 6.19:1 at `#0f6b78` → passes for all text).

Auto-fixable.

---

**[A-CRIT-3] Contrast — active step indicator dot border `#ffac30` on canvas** (WCAG 1.4.11)

Line 1135 (StatusDot active branch): active step indicator is a 16px circle with `border-2` at `borderColor: "#ffac30"` (amber). This is a UI component communicating the "in progress" state. Measured contrast: **1.71:1** against canvas `#f7f4f2`. WCAG 1.4.11 (Non-text contrast) requires 3:1 for UI component boundaries.

Fix: Add a thin outer ring or change to a solid filled indicator with a higher-contrast element. Simplest prototype fix: add `border border-neutral-300` wrapper around the amber ring to provide the 3:1 boundary against canvas. Or change the amber ring to a solid amber fill with `border border-amber-400` (this still fails — amber/canvas is 1.71:1 regardless of fill vs outline). The fundamental issue is the amber colour on this canvas. Using a combination of `bg-amber-400` inner fill + `border-neutral-400` outer boundary would meet 3:1 for the boundary.

Needs designer input.

---

**[A-CRIT-4] Contrast — todo step dot dashed border on canvas** (WCAG 1.4.11)

Line 1136 (StatusDot todo branch): `border-dashed` with `borderColor: "#879092"` (neutral-500) on canvas. Measured contrast: **2.98:1** — marginally below the 3:1 non-text contrast requirement for a UI boundary.

Fix: Change `borderColor: "#879092"` → `"#556468"` (neutral-600, ~4.1:1 on canvas). In the `StatusDot` component at line 1136: `style={{ borderColor: "#556468" }}`.

Auto-fixable.

---

**[A-CRIT-5] Focus ring missing — `QuickAction` button** (WCAG 2.4.7)

Lines 1147–1153: `<button type="button" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100">`. No `focus-visible:` class present.

Fix: Add `focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none` to the className at line 1149.

Auto-fixable.

---

**[A-CRIT-6] Focus ring missing + insufficient touch target — trading-name `×` remove button** (WCAG 2.4.7, 2.5.5)

Line 723: `<button … className="ml-0.5 text-neutral-400 hover:text-neutral-600">×</button>`. No focus ring. Computed size is approximately 14×14px (the `×` character with no padding) — below the 44×44px target (WCAG 2.5.5 AAA; below 24×24px minimum of WCAG 2.2 2.5.8 AA).

Fix: `className="ml-0.5 rounded p-1.5 text-neutral-400 hover:text-neutral-600 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"`. The `p-1.5` (6px each side) brings the click area to approximately 26×26px, meeting WCAG 2.2 2.5.8 minimum.

Auto-fixable.

---

**[A-CRIT-7] Semantic markup — `"Privacy policy"` spans are not links** (WCAG 4.1.2)

Lines 1394 and 1418: `<span className="font-bold text-brand-600">Privacy policy</span>`. Visually styled as a link but not keyboard-reachable, has no role, and does not respond to Enter/Space. Screen-reader users hear no indication it is interactive.

Fix: Convert both to `<a href="#" className="font-bold text-brand-600 underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">Privacy policy</a>`. (Also flagged by ui-copy SHOULD-FIX-7 — a11y dimension makes it Critical.)

Auto-fixable.

---

**[A-CRIT-8] Keyboard — consent modal: no focus trap, no focus management** (WCAG 2.1.2, 2.4.3)

Lines 390–441: modal has `role="dialog"` and `aria-modal="true"` but no focus trap. On open, focus stays on the "Start application" button behind the overlay. Tab cycles through the full underlying page. No `useEffect` moves focus into the modal on open; no focus-return on close.

Fix: On open, move focus to the Cancel or "I agree" button inside the modal. While open, confine Tab/Shift+Tab within the modal's focusable descendants. On close, return focus to the trigger button. For the prototype: `useRef` on the modal's first button + `ref.current?.focus()` in an open-state `useEffect`.

Needs engineering input for full implementation; flag as prototype blocker.

---

**[A-CRIT-9] Keyboard — business search, state, and phone dropdowns: no arrow-key navigation** (WCAG 2.1.1)

Lines 777–798 (state dropdown), 823–854 (business search), 1350–1371 (phone picker): all carry `role="listbox"` + `role="option"` ARIA semantics that promise keyboard interaction. Arrow Down/Up, Enter, and Escape are not implemented. A keyboard-only user who opens any dropdown cannot select an option.

Fix: Implement `onKeyDown` handlers on each trigger button and `<ul>`. Use arrow keys to move a `focused-option` index; Enter/Space to select; Escape to close and return focus to trigger. Alternatively replace with native `<select>` for prototype scope. Flag for the DS `<Dropdown>` component in production.

Needs engineering input.

---

#### SHOULD-FIX — Before stakeholder review

---

**[A-SHOULD-1] Semantic markup — Country and Country of incorporation divs have no accessible name** (WCAG 4.1.2)

Line 643 (SP Country) and line 750 (LLC Country of incorporation): both implemented as plain `<div>` elements with no `role`. The title attribute (line 644) is unreliable for screen readers.

Fix: Convert both to `<input type="text" readOnly value="..." aria-label="Country" className="..." />` (SP) and `<input type="text" readOnly value="..." aria-label="Country of incorporation" className="..." />` (LLC). Add `htmlFor` to the existing `<label>` elements at lines 639 and 747 matching the new input ids.

Auto-fixable.

---

**[A-SHOULD-2] Semantic markup — Amazon screen `"Learn more"` and privacy/terms links are `<span>` elements** (WCAG 4.1.2)

Lines 291, 419, 497, 503: link-styled `<span>` elements in the Amazon surfaces. These are keyboard-unreachable. WCAG applies even on Amazon-mimicking surfaces.

Fix: Replace each with `<a href="#" style={{ color: AMZN_LINK }}>…</a>`. Use `focus-visible:outline focus-visible:outline-2` (consistent with the focus pattern already used on modal buttons in this file).

Auto-fixable.

---

**[A-SHOULD-3] ARIA — `aria-live="polite"` on an animating count-up will produce excessive announcements** (WCAG 4.1.3)

Line 1675: `aria-live="polite"` on the `<p>` that receives a new value every 16ms for ~60 ticks. Most screen readers debounce rapid live region updates, but behaviour varies (NVDA + Firefox may announce every queued value).

Fix: Remove `aria-live` from the animated element. Add a visually-hidden sibling `<p aria-live="polite" className="sr-only">` that receives the final amount only after the count-up settles. Populate it in the `useEffect` at the moment `start >= offerTarget`.

Needs engineering input.

---

**[A-SHOULD-4] ARIA — `role="option"` on `<li>` should be on the interactive child `<button>`** (WCAG 4.1.2)

Lines 784–795 (state dropdown), 830–843 (business search), 1356–1368 (phone picker): `role="option"` and `aria-selected` are on the `<li>` element, but the interactive element is the child `<button>`. This can produce double-announcement ("option button") in screen readers.

Fix: Move `role="option"` and `aria-selected` from each `<li>` to its inner `<button>`. Set each `<li>` to `role="presentation"`.

Auto-fixable.

---

**[A-SHOULD-5] No explanation for why the Continue/Apply buttons are disabled** (WCAG 3.3.1)

Lines 868–872, 1428–1435, 1576: all three CTAs use `disabled={!canContinue}` with no adjacent validation message. Screen-reader users hear "Start application, dimmed" with no context.

Fix: Add a `<p role="status" className="text-sm text-text-secondary">` near each CTA that describes what is missing when the button is disabled. Long-term: inline field-level `aria-invalid` + `aria-describedby` error messages per the DS pattern.

Needs copy + product input (see ui-copy MISSING-1, MISSING-3).

---

**[A-SHOULD-6] Focus ring missing — "Restart prototype" button** (WCAG 2.4.7)

Line 1070: `<button type="button" … className="flex h-[38px] items-center gap-1 rounded-lg px-2 transition-colors hover:bg-neutral-100">`. No `focus-visible:` class.

Fix: Add `focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none` to the className.

Auto-fixable.

---

**[A-SHOULD-7] ARIA — `"Your Offer"` nav item missing `aria-current` when active** (WCAG 4.1.2)

Lines 1054–1067: the "Your Offer" `<div>` in the nav stepper renders as the active step when `screen === "offer"` but has no `aria-current` attribute.

Fix: Add `aria-current={screen === "offer" ? "step" : undefined}` to the `<div>` at line 1055.

Auto-fixable.

---

**[A-SHOULD-8] Consent modal close button: touch target below minimum** (WCAG 2.5.5)

Line 408: `<button … className="rounded p-1 …">✕</button>`. With `p-1` (4px padding), computed size is approximately 24×24px — at the WCAG 2.2 2.5.8 lower bound (24px minimum), but only just. The `aria-label="Close"` is correctly set.

Fix: Change `p-1` to `p-2` (8px padding) → ~32×32px, comfortably above 24px minimum. This brings it in line with the wider interactive elements in this file.

Auto-fixable.

---

#### POLISH — Minor; can wait until final demo prep

---

**[A-POLISH-1] `animate-pulse` not suppressed under `prefers-reduced-motion`** (WCAG 2.3.3)

Line 1749: `animate-pulse`. The inline `@media (prefers-reduced-motion: reduce)` block at line 145 covers `.asc-enter` and `.asc-scale-reveal` only. `animate-pulse` is a Tailwind utility animation, not covered by name.

Fix: Change `animate-pulse` → `motion-safe:animate-pulse` (Tailwind's responsive variant wraps the class in `@media (prefers-reduced-motion: no-preference)` automatically). The "In progress…" text is the primary indicator; the pulse is purely decorative.

Auto-fixable (class rename).

---

**[A-POLISH-2] `SummaryCard` "Edit" buttons have ambiguous accessible name** (WCAG 2.4.6)

Line 1603: multiple "Edit" buttons on the same page (business details, contact details). Screen-reader navigation by button list will surface "Edit, Edit" with no context.

Fix: Add `aria-label={\`Edit ${title}\`}` to the button at line 1603, using the `title` prop already available in `SummaryCard`.

Auto-fixable.

---

**[A-POLISH-3] No `maxLength` on SP name inputs; chip text can overflow** (WCAG 1.4.10)

Lines 662 and 674: first/last name inputs have no `maxLength`. Line 721: chip name text has no `truncate` constraint. Very long names can overflow the chip container or the name field without wrapping guards.

Fix: Add `maxLength={80}` to both name inputs. Add `truncate max-w-[160px]` to the chip name `<span>` at line 721 and `title={n}` for full name on hover.

Auto-fixable.

---

#### Missing Edge-Case States

---

**[A-EDGE-1] No inline validation error messages on any screen**

All three CTAs gate on `canContinue` with no field-level error feedback. A first-time user who leaves required fields blank sees only a disabled button. This affects EligibilityScreen (LLC path needs `llcBusinessChosen`; SP path has no validation at all on names), ApplicantScreen (DOB, address, phone), and ApplicationSummaryScreen (purpose checkbox).

Suggested handling: Reserve error `<p>` elements below required fields. Populate them after first attempted submission or on blur. Associate each with its input via `aria-describedby`. See ui-copy MISSING-1, MISSING-3 for copy.

---

**[A-EDGE-2] OfferHoldingScreen: no error or stalled-underwriting state**

The screen simulates 3 stages completing in ~6.6s. There is no state for: underwriting exceeding the ETA, returning an ineligibility decision, or a simulated MSW 500 during polling.

For AT users specifically: the `role="progressbar"` correctly communicates progress at each stage, but there is no `aria-live` region to announce when the process completes or stalls. A screen-reader user would have to poll the progressbar manually to know when the status changes.

Suggested handling: Add a visually-hidden `aria-live="polite"` region outside the progress bar that announces: stage completions ("Step 1 of 3 complete"), final completion ("Analysis complete — your offer is $40,000"), and any error/stall state.

---

**[A-EDGE-3] No loading/skeleton state for screens 3–5**

Data is pre-filled from mock state — no network latency is simulated. If this prototype is ever demoed on a throttled connection or with mock latency added, screens would flash from empty → filled without a loading transition.

Suggested handling: Add a brief `isLoading` gate (400ms) on `EligibilityScreen` before rendering form content, showing shimmer skeleton shapes matching the form layout.

---

**[A-EDGE-4] "Apply for funding" transitions immediately — no submitting state**

After clicking "Apply for funding" (line 1576), `onApply()` is called synchronously, navigating to the offer screen with no intermediate "Submitting…" state. Real submissions take 1–3 seconds.

Suggested handling: Add a 1.5s `isSubmitting` state that renders the button in a loading state (spinner + "Applying…" label) before calling `onApply()`.

---

#### Sandbox / White-label Notes

---

**[A-WL-1] `animate-pulse` not covered by the reduced-motion `@media` block**

See A-POLISH-1. The scoped `@media (prefers-reduced-motion)` in the `<style>` tag covers only `.asc-enter` and `.asc-scale-reveal`. Using `motion-safe:animate-pulse` resolves this via Tailwind's built-in variant.

---

**[A-WL-2] Canonical DS gradient endpoints may introduce a new contrast failure**

Once design-keeper B4 is applied (replace off-token gradient with `<Gradient>` component), the canonical DS gradient from the foundation doc (`#005570 → #1ebdc0`, section 15) places `#1ebdc0` (brand-500) at the light end. White text on `#1ebdc0` = **1.78:1** — a new critical contrast failure, worse than the current off-token values.

This means: the current off-token gradient (`#138a86` lightest stop) actually gives better white text contrast than the canonical DS gradient's lightest stop (`#1ebdc0`).

Resolution needed before B4 is applied: confirm with design whether text is only ever rendered on the dark half of the gradient (which would pass), or whether the gradient endpoints for text-bearing banners should use `#005570 → #128081` (both dark, both passing for white text). Flag for design-keeper + design discussion.

---

### Verdict
CHANGES REQUIRED before stakeholder sharing.

**Critical blockers (9 items):**

| # | Line(s) | Issue |
|---|---|---|
| A-CRIT-1 | 1682 | "Calculating" white/30 text: 1.59:1 contrast (WCAG 1.4.3) |
| A-CRIT-2 | 1670, 1689 | opacity-85 overline/subtext: 3.47:1 on lightest gradient stop (WCAG 1.4.3) |
| A-CRIT-3 | 1135 | Active step dot border #ffac30: 1.71:1 non-text contrast (WCAG 1.4.11) |
| A-CRIT-4 | 1136 | Todo step dot dashed border #879092: 2.98:1 (WCAG 1.4.11) |
| A-CRIT-5 | 1147–1153 | QuickAction button: no focus ring (WCAG 2.4.7) |
| A-CRIT-6 | 723–730 | Trading-name remove button: no focus ring + target ~14px (WCAG 2.4.7, 2.5.5) |
| A-CRIT-7 | 1394, 1418 | Privacy policy spans not links — keyboard unreachable (WCAG 4.1.2) |
| A-CRIT-8 | 390–441 | Consent modal: no focus trap, no focus move on open/close (WCAG 2.1.2, 2.4.3) |
| A-CRIT-9 | 777–798, 823–854, 1350–1371 | All three custom dropdowns: no keyboard arrow-nav (WCAG 2.1.1) |

**Auto-applied fixes:** A-CRIT-2, A-CRIT-4, A-CRIT-5, A-CRIT-6, A-CRIT-7, A-SHOULD-2, A-SHOULD-4, A-SHOULD-6, A-SHOULD-7, A-SHOULD-8, A-POLISH-1, A-POLISH-2, A-POLISH-3.

**Needs design/product input before fixing:** A-CRIT-1 (placeholder visual treatment), A-CRIT-3 (active dot indicator redesign), A-CRIT-8 (focus trap implementation), A-CRIT-9 (dropdown keyboard nav), A-SHOULD-3 (count-up aria-live strategy), A-SHOULD-5 (validation error copy + pattern), A-WL-2 (canonical gradient vs text contrast conflict).
