# Task — asc-sole-prop

**Mode:** BUILD
**Input:** ASC Sole Proprietor onboarding + application flow, 4-screen prototype, file `asc-sole-prop.tsx`
**Started:** 2026-06-17 13:12

---

## Brief

Single-file prototype covering the Amazon Seller Central (ASC) sole-proprietor journey:

- **Screen 1 — Eligibility entrance** (no left nav, 2-col with sidebar): business-type toggle (LLC FIRST / default, SP second), live tab swap, SP fields prefilled, empty offer state in sidebar
- **Screen 2 — Applicant info** (left-nav stepper starts here): DOB, Home address, Email (prefilled michael@gmail.com), Phone, 2 consent cards unticked
- **Screen 3 — Connections**: single Amazon card, connect state toggle, single-region only
- **Screen 4 — "Your offer" holding**: underwriting progress + ID verification parallel side card

## Reuse map

1. Screen 1 → `registration.tsx` eligibility step: FormColumn, SidebarShell, EligibilitySidebar pattern (ConnectMask, OfferCardSvg, UncappedLogoCard), PhoneField, SelectField patterns
2. Screens 2–3 → `application.tsx`: Sidebar/NavStep/StatusDot shell, Card, PageHeading, SectionHeader, InlineNotice atoms
3. Screen 4 → `underwriting.tsx`: gradient banner, progress bar, "What happens now?" card, QuickAction chips

## Figma

File key: `PpchLKGzsCWPWyK1GOQcsi`, section "Third Iteration"
- 2368:22378 — SP eligibility entrance
- 2368:22379 — LLC/company variant (same screen)
- 2368:22964 — Applicant info
- 2368:23607 — Connections
- 2368:24280 — "Your offer" holding

## Key constraints

- Sandbox-safe: no live Uncapped URLs, no real API calls, all mock data
- Tailwind v4: use inline `style=` for any hex not in the design system rather than arbitrary Tailwind classes
- Route: `/prototypes/asc-sole-prop`
- Output file: `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx`
- Register in: `Assets-Uncapped/front-portal-develop/src/domains/prototypes/routes.tsx`

---

## ui-copy output

**Screens refined:** all 4 screens
**Key changes:**
- Screen 1: LLC subtitle "we'll need its registered details" (tighter), SP country helper "country, revenue platform and currency set automatically", trading names helper "Include any name … brand name", CTA "Start application"
- Screen 2: Heading corrected to "Applicant information" (Figma match). Subtitle uses power phrase "Applying does not affect your credit score." Credit data card title updated to "boost your application". CTA "Connect my accounts" (outcome-named)
- Screen 3: Heading "Connect your accounts" (Figma match). Subtitle adds read-only reassurance. Connected confirmation copy tightened. "What we read" items improved. CTA "See my offer" (outcome-named)
- Screen 4: "Repayment term up to 12 months" (lowercase). "What happens now?" updated to mention SMS and email. ID verification copy sharpened. "Calculating" (no ellipsis, Figma match)

---

## ux-motion output

**Applied:**
- CSS `@keyframes asc-fade-up` + `asc-scale-in` in a `<style>` block at root
- `.asc-enter` (fade-up, 0.28s) on: eligibility form column, eligibility sidebar (80ms delay), each main/aside pair on screens 2–4 (aside at 60ms stagger), SP/LLC field panels on tab swap, Amazon connected state
- `.asc-scale-reveal` (scale-in with spring, 0.22s) on count-up number reveal (Screen 4)
- `prefers-reduced-motion: reduce` guard cancels all `.asc-enter` and `.asc-scale-reveal` animations
- `transition-all duration-150` already on tab toggle buttons (kept)
- `focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1` added to: tab toggle buttons, Add Name button, Log out button, address toggle link
- `active:scale-[0.97]` added to Add Name button and Log out button

---

## design-keeper output

**Tailwind v4 safelist check — PASS (no blockers after fixes)**
- Fixed 4 arbitrary hex class violations:
  - `bg-[#fbfaf9]` → `style={{ backgroundColor: "#fbfaf9" }}` (3 instances: SMS card header, credit card header, connection card body)
  - `bg-[#128081]` on progress dot → moved to `style=` via conditional object
  - `border-[#ffac30]` on active dot → moved to `style=`
- Arbitrary sizing classes (`max-w-[...]`, `text-[...]`, `h-[...]`) are layout tokens — acceptable for prototypes, not a colour violation
- All semantic colour tokens used correctly: `text-neutral-800`, `text-text-secondary`, `bg-surface-canvas`, `text-brand-600`, `border-neutral-300`, `bg-white`

---

## accessibility-edge-reviewer output

**Critical fixes applied:**
- Phone label: added `htmlFor="phone-number"` + `id="phone-number"` on input — label now programmatically associated
- Phone country button: added `aria-haspopup="listbox"`, `aria-expanded={phoneOpen}`, `aria-label` with full country name + dial code; flags marked `aria-hidden`
- Phone dropdown: `role="listbox"`, `aria-label="Select country code"` on `<ul>`; `role="option"` + `aria-selected` on each `<li>`
- Business type toggle: container gets `role="tablist"` + `aria-label="Business type"`; each button gets `role="tab"` + `aria-selected`
- DOB group: `<label>` + `<div>` replaced with `<fieldset>` + `<legend>` — group relationship now explicit for screen readers
- Nav stepper: `<nav aria-label="Application steps">` added; `NavStep` accepts `isCurrent` prop and sets `aria-current="step"` on active step

**Should-fix (not blocking):**
- Country field (SP) has a `<label>` without `htmlFor` — acceptable since the target is a `<div>` not an `<input>`; `title` attribute provides the explanation
- `prefers-reduced-motion` guard is in place for all entrance animations

---

## visual smoke test

**Status: mismatch found and fixed**
- Screen 2 heading: "Applicant info" → "Applicant information" (Figma match)
- Screen 3 heading: "Connect your Amazon store" → "Connect your accounts" (Figma match)  
- Screen 3 connection card: rebuilt as compact single-row layout (logo + name + status badge + Connect button) matching Figma 2368:23607
- Screen 3 "What we read" rail: icons updated to Amazon BoxIcon + SecurityValidation BoxIcon (matching Figma)
- Screen 4: "Calculating…" → "Calculating" (no ellipsis, Figma match)
- Screen 4 "What happens now?": "SMS and email" notification (Figma match)
- Credit data card title: "to size your offer" → "to boost your application" (Figma match)
- Known intentional divergences: sidebar offer amount shows `$--,---` (empty state per spec) vs Figma count-up frame; "Months" capitalisation kept as lowercase (grammatically correct)

---

## ui-designer output

**File built:** `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/asc-sole-prop.tsx`
**Route registered:** `/prototypes/asc-sole-prop` in `src/domains/prototypes/routes.tsx`
**TypeScript check:** clean (no errors)
**Dev server:** running, route returns 200

**Reuse applied:**
- Screen 1: `FormColumn`/`SidebarShell` shell from `registration.tsx`; `GlassTile`/`AccentInner` glass tile components; `ConnectMask`, `OfferCardSvg`, `UncappedLogoCard` SVG assets; phone picker pattern
- Screens 2-4: `NavStep`/`StatusDot`/`AppSidebar` stepper shell from `application.tsx`; `Card`, `PageHeading`, `TopActions`, `QuickAction` atoms
- Screen 4: gradient banner + progress stages + "What happens now?" card from `underwriting.tsx`

**Screen specifics:**
1. Eligibility: LLC/SP toggle (LLC default + active), live variant swap; SP fields prefilled (Michael/Scott, United States + "From Amazon" badge); trading-names add/remove list; sidebar with empty `$--,---` placeholder
2. Applicant info: DOB 3-inputs, home address search + manual toggle, email prefilled read-only, phone country picker; 2 consent cards unchecked; CreditDataCard rail
3. Connections: single Amazon card, not-connected → connect → connected state; ConnectionsRailCard
4. Offer holding: 3 progress stages (2.2s intervals), count-up animation (triggers only after all stages done, $40k target), "What happens now?" notice; IdVerificationCard with fictional QR SVG

---
