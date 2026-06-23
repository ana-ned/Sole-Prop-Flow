# Final self-check — dos and don'ts

Run through this list before delivering any mockup. Fix violations silently.

## Visual system

| ❌ Don't | ✅ Do |
|---|---|
| White page background | Canvas `#f7f4f2`, white only on cards |
| Any font other than Commissioner/Sora | Commissioner = headings + amounts; Sora = everything else |
| Generic CSS shadows | Only the three Light shadows from tokens.md, one per surface |
| Off-grid spacing (13px, 18px, 22px…) | 8px grid: 4/8/12/16/24/32/40 |
| Random colours or "close enough" hex | Exact hex from tokens.md only |
| Pure black text (`#000`) | Text primary `#193a43` |
| A large number sitting bare on the canvas, or forcing a "hero number" onto every screen | The big figure (h1/h2, ~48–56px) lives **only inside a gradient hero card**, white + centred. Form screens have **no** large figure. Never two competing big numbers |
| A 48px page title, or a title on every screen | In-app page title is **32px (h4)** — and **omitted** when the screen leads with a gradient card or section cards |
| All sections the same accent colour | Rotate 2–3 accents semantically |
| Larger radius inside smaller | Nested radii always smaller than parent |
| `outline: none` with no replacement | Focus ring `0 0 0 1px #a5d3d4` on every interactive element |

## Components

| ❌ Don't | ✅ Do |
|---|---|
| Buttons taller/shorter than 44px | 44px height, 12px radius |
| Two primary buttons on one screen | One primary action; everything else secondary/link |
| Status as coloured text alone | Chip with label, or notice with icon + text |
| A text wordmark ("uncapped" typed out) | The real logo SVG from brand-assets.md |
| **Any thin outline / stroke icon** (`stroke="currentColor"`) | Real **filled** Hugeicons from brand-assets.md (`fill="currentColor"`) — this is the #1 fake-looking tell |
| Inventing an icon shape | Use a named icon from brand-assets.md; it covers benefits, headers, quick actions |
| Bare icons floating in the nav | Every menu / section / benefit icon wrapped in an accent `BoxIcon` tile |
| Offer / apply screen with no menu, or a bare logo-only top header | Onboarding shell: logo + **vertical stepper** sidebar on the left (see screen-patterns.md) |
| A border/stroke around the active stepper/nav row | Active row = `#fbfaf9` bg + small shadow only, **no border** |
| An accent icon tile on a **regular stepper step** (e.g. active "Applicant info" with an amber info icon) | Regular steps use **status dots** in every state (done check / active ring / todo dashed); active = highlighted pill + ring dot. Only **offer steps** get a coin/cart `BoxIcon` |
| Stroke notice/status icons | Filled notice icons (InformationCircle, Alert02, AlertCircle, CheckmarkCircle02) |
| A money-bag icon that looks like a solid blob | MoneyBag02 needs `fill-rule="evenodd"` so the £ cuts out |
| A page title + "Step X of Y" caption on the offer screen | Offer screen leads straight with the hero card; the stepper sidebar is the progress |
| Onboarding screen missing the top actions, or them placed **above the centre content** | Show **"Book a call"** + **"Invite team"** at the **top of Col 3 (the right rail)** — the top-right corner of the page, above the right column, never above the centre content |
| "Log out" floating loosely under the steps | **Pin "Log out" to the bottom-left** of the sidebar (full-height column, `margin-top:auto`), amber `accent-2` tile + Logout03 icon |
| Hero gradient card content left-aligned | Hero label + amount are **centred** |
| The portal nav on an apply-flow screen | Portal nav is only for signed-in, funded customers; the apply flow uses the stepper sidebar |
| Stepper check-dots on a **dashboard** nav | Dashboard uses the **portal sidebar** — real nav-item icons in accent tiles + user-profile block + bottom Log out |
| **Sidebar wrapped in a white card** (bg + shadow + border) | The sidebar (dashboard AND onboarding) is **flush on the canvas** — no card. Only the **active item** is an elevated white pill (`#fff` + small shadow) |
| Dashboard sidebar missing the profile block | Add the avatar (initials) + name + company near the bottom, above Log out |
| Onboarding-only bits on a dashboard | No stepper, no "Book a call / Invite team" top actions on a dashboard |
| Cramped centre column | Centre content column ~600px |
| Amber tertiary button as the main CTA | **Primary teal** is the default CTA (offer flow + dashboards); amber tertiary is rare (add-ons only), text on amber is `#193a43` |
| Hand-drawn alert/banner styles | The four notice variants from components.html |
| Spinners | Skeleton placeholders (animated `#f0f3f4` blocks) |

## Render-quality tells (the things that actually break realism)

These are the defects seen most often in generated mockups. Each one instantly
reads as "fake". Check every one before delivering.

| ❌ Don't | ✅ Do |
|---|---|
| **Oversized logo** — the wordmark rendered huge (its viewBox is 366×80, so it balloons if height isn't pinned) | Pin the logo to a fixed pixel height every time: `height:28px;width:auto` in a sidebar, never a `%` width and never `width:100%`. The logo must NOT scale with its container |
| **Inconsistent global scale** — the same screen rendered at two different sizes (giant sidebar/nav one time, normal the next) | Anchor structure in **fixed px**, not viewport/percentage: sidebar `270px`, nav-icon tile `24/40px`, hero amount `56px`, logo `28px`. Don't let the shell scale with the window |
| **Floating superscript cents** — `$95,289` with `⁴³` raised high above the baseline, detached | Cents are **smaller but baseline-aligned** (~0.6em, sit on the SAME baseline as the pounds, `vertical-align:baseline`). Never `<sup>` / raised. Apply the SAME treatment to every amount on the page |
| **Flat grey avatar circles** (initials on a neutral `#e…` disc) | Avatars use an **accent fill + white initials** (e.g. `brand-200`/`brand-600` for the profile block; rotate accents for a team/verification cluster). Never plain grey |
| **Hero gradient gone near-black** (dark teal → navy, almost monochrome) | Keep the hero/agreement gradient **teal-dominant**: teal (`#1ebdc0`/`#128081`) leading into deep blue (`#00416b`), bright enough to read as teal, not black. White text + accent-coloured icons on top |
| **Mixed market signals** — US business types (LLC/Corporation) next to a UK country + `£`, or `$` next to "Companies House" | Pick ONE market and keep type label + currency + reg-number label + country consistent (see Registration table below) |
| Amount sizes drifting (one card a different size from another for the same kind of number) | All metric/value amounts share a single consistent size (~28px on cards); the only larger figure is the one inside a gradient hero card |
| **Over-rounded fields & buttons** (12–16px radius — looks like a different product) | Inputs, selects and buttons are **8px** radius (`radius-lg`). Only cards (12–16px) and chips (full pill) are rounder |
| **Centred logo** over a form column | Logo sits **top-LEFT**, aligned with the fields below it (split/form layouts and all sidebars) |
| **Redrawn / invented Google or Amazon logo** (Amazon comes out as a black blob/face) | Paste the **real provider SVGs** from brand-assets.md. Provider buttons stay white secondary buttons — never colour the button itself |
| **Form left-jammed in a wide panel** with a big empty void beside it (broken split layout) | Copy the **`.split-auth` skeleton** from components.html: form stack is a fixed ~460px column **centred** in its half (`margin:0 auto`); gradient panel capped at ~44% / 620px. The form never hugs the left edge of a wide column |
| Centred logo + left-aligned form (the inverted, broken arrangement) | **Logo hard top-left, form centred** — that specific pairing |
| **Profile block / Log out floating at the bottom of the scrolled page** (not pinned to the sidebar) | Sidebar is a **full-height sticky column** (`height:100vh; position:sticky`); profile + Log out pinned to its bottom with `margin-top:auto`. Copy the `.sidebar` skeleton |
| Inventing column widths / a dashboard with a help rail | Use the **layout grid** (screen-patterns.md): Col 1 = 270px; Col 2 = 540 (forms) / 800 (dashboard) / 950 (table); Col 3 = 620 gradient / 302–400 help / 170 margin. Dashboards have **no** help rail |
| **Dashboard content sprawling full-width** | Cap the content column at **~800px (max 900)**, left-aligned; Col 3 stays a ~170px margin |
| Content/logo/sidebar touching the viewport edge, or an inconsistent outer margin | **40px gutter on all four sides** (top, right, bottom, left) — copy the `.app-page` wrapper. Everything starts 40px in |
| **A giant 56–80px balance hero on a dashboard** (duplicating a metric card) | Dashboard numbers are restrained: gradient-card headline ~40–48px, metric amounts ~28px. The focal point is the **gradient status card**, not a raw balance figure |
| Dashboard metric cards as bare numbers, or one big product detail card | A **row of 3 equal metric cards**, each with an icon-header tile, ~28px amount, and a **secondary "View…" button**. Not one oversized Term-Loan card |

## Trust & honesty (non-negotiable)

| ❌ Never | ✅ Always |
|---|---|
| Hidden or late-revealed fees | Full cost visible before commitment |
| Fake urgency / countdown theatre | Real deadlines, relative + absolute date |
| Confirmshaming ("No, I don't want to grow") | Neutral decline options |
| Pre-ticked marketing checkboxes | Unticked, clearly labelled |
| Soft-decline weasel language | Honest "We can't offer funding right now" + why + what next |
| Burying the repayment obligation | Total to repay always as prominent as the amount received |

## Copy (see voice.md for full rules)

- British English, "you/your", contractions fine
- Buttons: verb-first, under 4 words, never "Continue"/"Submit"
- Errors: what happened + why + what to do
- Empty states: explain why empty + the action, never "No data"
- Digits for numbers, £ before amount, comma separators

## Accessibility

- Body text ≥ 14px; footnotes 12px only for captions
- Text contrast: primary `#193a43` on white/canvas is safe; never light grey
  on white below 14px bold; never white text on amber (`#ffc266`) — use
  `#193a43` on amber
- Every input has a visible label (not placeholder-as-label)
- Interactive targets ≥ 44px tall
- Heading levels sequential (one h1, then h2, h3…)
- State changes announced in text, not colour alone

## Edge cases — design these in, don't skip them

A flow mockup should show (or at least mention) what happens when:
- The list is empty (first-time user)
- The data is loading (skeletons)
- Something fails (error notice with retry)
- The answer is no (decline path — calm, honest, named next step)

## Registration & onboarding flow (matches the real product)

The sign-up area has two distinct layouts. **Don't use the numbered stepper for
account creation** — that's the single most common registration mistake.

### Sign-up, eligibility & readiness screens (account-creation, pre-application)

These are the *very first* screens — before the numbered application starts.

| ❌ Don't | ✅ Do |
|---|---|
| Put a numbered "Step 1 of 5" stepper on the sign-up / eligibility / readiness screen | **Two-column split:** form on the **left** (logo pinned top-left, content centred ~400–540px), full-height **dark teal gradient marketing panel on the right** (~40%, `620px`). No stepper — the customer hasn't entered the numbered application yet |
| Lead with the email form | **Social sign-up first:** Google + Amazon buttons (real provider glyphs — multi-colour Google, real Amazon mark, never a plain "G"), then an "or sign up with email" divider, then the email fields |
| Plain password field | Password field with a **show/hide eye toggle**; full-width **primary** "Sign up with email" CTA |
| Forget the account-recovery + legal lines | "Already have an account? **Log in**" under the CTA, plus the Terms / reCAPTCHA microcopy |
| White or empty right panel | Right panel = teal gradient with a reassurance headline, the **`$100,000` eligibility hero number**, and 1–2 **glass benefit/trust cards** (translucent white cards on the gradient, icons accent-coloured teal/amber — not white) |
| "Book a call / Invite team" top actions, or a stepper "Log out" | Those belong to the numbered application shell. The pre-application split can still pin a **Log out** bottom-left of the form column (amber `accent-2` tile) |
| Different gradient per screen | Same teal-dominant gradient across sign-up → readiness → eligibility for continuity |

### The numbered application ("Step 1 of 5: Tell us about your business")

Once past sign-up, switch to the **onboarding / application stepper shell**
(left stepper · centre form · right "Why we ask this" rail · top-right "Book a
call / Invite team"). See screen-patterns.md.

| ❌ Don't | ✅ Do |
|---|---|
| Mix markets: "LLC / Corporation" with `£` + "United Kingdom", or `$` with "Companies House" | Keep market consistent. **UK:** "Limited company / Sole trader", `£`, "Company registration number", UK country. **US:** "LLC / Corporation", `$`, "EIN", US country |
| More than ~5 fields on a step | Max ~5 fields, grouped by topic; business-structure choice as a 2-tab toggle with accent BoxIcon tiles |
| Drop the credit-score reassurance | Keep "Applying does not affect your credit score" near the top of the first step |
| Only a primary CTA in the footer | Footer = **"Save and exit"** link + one primary ("Save my details" / "Continue"); the left stepper carries progress |
| Invent an accent icon on a regular step | Regular steps use **status dots** (done check / active ring / todo dashed); active row = `#fbfaf9` pill + ring dot, no border |
