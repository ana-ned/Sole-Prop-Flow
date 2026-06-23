# Uncapped Screen Patterns

Pick the matching archetype before designing. Most screens fit one. All
component names below refer to the patterns shown in `components.html`.

## The layout grid system (from the UI Kit) — set this FIRST

Every desktop screen is a **3-column grid** inside a page with a **40px gutter on
ALL four sides** (top, right, bottom, left) — content never touches the viewport
edge; logo, sidebar and content all start 40px in. Left-aligned, designed for
**≥1240px**, content capped at 1360px. Copy the **`.app-page` + `.app-grid`**
wrapper from components.html as the outermost element. What changes per screen is
the width of each column — lock these widths before adding any content; most
"broken layout" results come from inventing widths instead of using these.

| Screen | Col 1 (left) | Col 2 (content) | Col 3 (right) |
|---|---|---|---|
| **Sign-up / Eligibility / Readiness** | *(no nav)* form panel ≈820px: logo top-left, **540px content centred**, Log out bottom-left | — | **620px teal gradient** panel (full height) |
| **Onboarding / application** | **270px** — logo + vertical **stepper** (240px) + Log out pinned bottom | **540px** form, **centred** in a ~700px track | **302px** help rail — "Book a call / Invite team" + a help card |
| **Application + wide help ("With sidebar")** | **270px** stepper | **540px** form centred | **400px** help rail (wider) |
| **Dashboard** | **270px** — logo + **nav items** (240px, 38px tall) + profile + Log out pinned bottom | **800px** (max 900px) content | **170px** breathing margin (no rail) |
| **Table / list** | **270px** nav | **950px** table | *(none)* |

Shared rules pulled from the kit:
- **Col 1 is always 270px** (logo block 270×53 at top; nav/stepper items 240px
  wide). Whatever sits at its bottom (Log out, and on a dashboard the profile
  block) is **pinned to the bottom of a full-height column** — copy the
  `.sidebar` skeleton; never let it float at the bottom of the scrolled page.
- **Col 2 holds the content and owns the primary CTA** at its bottom. Its width
  is the dial: 540 (forms) · 800 (dashboard) · 950 (table).
- **Col 3 is contextual:** a 620px gradient (sign-up), a 302/400px help rail
  (application), or just a 170px margin (dashboard). A dashboard does **not** get
  a help rail — multi-column rows (e.g. 3 metric cards) live *inside* Col 2.
- Content is **left-aligned on the page**, not centred in the viewport. The only
  thing centred is the form stack *within its own panel* on the split layouts.

## Page shells

| Shell | When to use | Structure |
|---|---|---|
| **Standard portal (dashboard)** | Dashboards, account screens, lists (customer is *signed in and funded*) | 270px **portal sidebar**: logo + **real nav-item icons** in accent tiles + user-profile block + bottom-pinned Log out. Same rail style as onboarding but real icons, not stepper checks. Content = main column + optional right column (or single column). |
| **Onboarding / application** | Application steps, connect step, **and the offer step** — anything inside the apply flow | 270px **left column = logo + vertical stepper** + centre content (min 600px) + right help rail + top-right quick actions. See below. |
| **Plain** | Declines, standalone confirmations | No nav — centred content on canvas, focused moment |
| **Logo-only header** | Late KYC / signing / "blocked" moments only | Just the logo, no nav, no stepper — a deliberately stripped focus screen. **Do not use this for the offer step.** |

The centre column owns the primary CTA at its very bottom-right. One primary
action per screen, no secondary button beside it.

### The onboarding / application shell (use for the offer step)

This is the real shell for every screen *inside the apply flow*, including the
offer. It is **not** a portal sidebar and **not** a bare logo-only top header —
getting this wrong is the most common mistake.

- **Left column (270px):** the Uncapped logo at the top, then a **vertical
  stepper** listing the application steps. Each step has a status indicator:
  - **Done** — small filled teal circle (`#128081`) with a white check
  - **Active** — small circle with a teal ring and a teal dot inside; the row
    is highlighted with `#fbfaf9` background + small shadow only — **no border**
    (the real Uncapped theme has nav border-width 0)
  - **To-do** — small dashed grey circle, secondary-grey label
  **These status dots apply to EVERY regular step (Your details, Connect sales,
  Bank accounts, Applicant info, Review…) in all states.** A step reads as
  *active* via the highlighted white pill row + the teal **ring dot** — NOT by
  swapping in an accent icon tile. **Never give a regular step an accent `BoxIcon`
  with an invented icon (info, shield, etc.).**
  - The **only** exception: an actual **offer step** shows an accent `BoxIcon`
    instead of a dot (a coin / MoneyBag02 in amber for a loan or cash advance,
    MoneyExchange03 / cyan for a line of credit), optionally with a count chip.
    Even when active, an offer step keeps the highlighted pill.
  Typical steps: Your details · Connect sales · Bank accounts · Applicant info ·
  Review · [the offer(s)]. The logo sits above the steps. **"Log out" is
  pinned to the very bottom-left of the sidebar** (full-height column with
  `margin-top:auto`), shown as an **amber `accent-2` BoxIcon tile** with the
  Logout03 icon + "Log out" label — never a plain floating link right under the
  steps.
- **Top-right quick actions (ALWAYS present in onboarding):** a **"Book a call"**
  (phone icon, cyan tile) and **"Invite team"** (people icon, indigo tile) pair.
  They sit at the **top of Col 3 (the right help rail)** — i.e. the **top-right
  corner of the page, above the right column**. **NOT above the centre content.**
  They share the top row with the rail; the help card sits directly beneath them.
- **Centre (min 600px):** the screen content (the offer card, the form, etc.) —
  give it room; never let it drop below 600px.
- **Right rail (~240–400px):** contextual help — a "what you asked for" recap,
  account-manager card, an info notice, sometimes a Trustpilot widget.

See the rendered example in `components.html` ("Onboarding / application shell").
A small "Step 4 of 5" caption above the page title is fine *in addition to* the
stepper, but the stepper sidebar is what must be present.

## Archetypes

### 1. Offer screen
Present funding options with transparent cost.
- **Shell:** if the customer is still *inside the apply flow* (most offer
  screens), use the **onboarding / application shell** above — logo + vertical
  stepper on the left, offer in the centre, help rail on the right. Only a
  signed-in, already-funded customer viewing a new offer from their dashboard
  uses the portal shell.
- **No page title and no "Step X of Y" caption.** The stepper sidebar is the
  progress; the offer screen leads straight with the hero card. (An "Offer ready"
  chip is optional, but the big "Your offer's ready, Name" heading is not needed.)
- **Hero card** (the first thing in the centre column): top zone = teal radial
  gradient with the amount in white 56px Commissioner, **content centred** (label
  + amount centre-aligned); bottom zone = cream (`#fbfaf9`) explainer with inline
  bold on key amounts ("Receive **£100,000** now, then…")
- Time-sensitive notice (warning) immediately after the hero, before breakdown:
  "Offer expires in 7 days on 24 Nov 2025"
- Breakdown card with value-list rows: fixed fee, total to repay, repayment %, term
- Benefits list with rotating accent icons (funds in 24h, no personal
  guarantee, pay off early)
- Primary CTA bottom-right: **primary teal** button ("Accept offer"). The amber
  tertiary is *rare* — only for a secondary add-on like "Add Daily Payouts",
  never the main accept action.

### 2. Dashboard
At-a-glance funding state + next action. For a **signed-in, funded** customer.
- **Shell — the portal sidebar (NOT the onboarding stepper).** It looks almost
  identical to the onboarding rail and shares its style. **The sidebar is FLUSH
  on the canvas — it is NOT a white card** (no background, no border, no shadow
  around it). The logo sits flush top-left, nav items sit directly on the
  canvas, and only the **active item is an elevated white pill** (`#fff` +
  small shadow). Three differences from the onboarding rail:
  - **Real nav-item icons in accent tiles** (Home, Funding, Repayments,
    Connections, Settings) — *never* the stepper check-dots. Active item gets the
    `#fbfaf9` background + small shadow, **no border**.
  - A **user-profile block** near the bottom: round avatar with initials
    (`brand-200` bg, `brand-600` text) + name + company.
  - **"Log out" pinned to the very bottom** (amber `accent-2` tile + Logout03),
    same as onboarding.
- **Content column is capped — `width ~800px, max-width 900px`, left-aligned**,
  with Col 3 left as a ~170px margin. **It must NOT sprawl full-width** (the most
  common dashboard break). No stepper, no top-right "Book a call / Invite team".
- **Numbers are RESTRAINED on a dashboard.** There is **no giant 56–80px balance
  hero** — that's an offer-screen move, not a dashboard one. The largest figure
  is the headline inside the gradient status card (~40–48px); metric-card amounts
  are ~28px. Never blow up the outstanding balance into a page-dominating number.
- **The canonical stack inside the content column (top → bottom):**
  1. *(Optional)* a small greeting + last-update line ("Welcome back, Joss ·
     Wildgrove Supply Co. · Last updated …"). The real dashboard often has **no
     page title at all** — it leads straight with the gradient card below.
  2. **Hero status card** — a teal→blue **gradient band** with a centred headline
     figure (agreement signed / unlocked / available), optionally a white body
     zone below (verification progress, ETA, an explainer + a CTA). This is the
     focal point, not a raw number.
  3. **A row of 3 equal metric cards** (Total outstanding · Next repayment · Last
     transaction). Each card = icon-header in an accent BoxIcon tile + amount
     (~28px) + a one-line caption + a **secondary "View…" button** at the bottom
     (View agreement · View payments · View transactions). Rotate the accents.
  4. **Optional feature/promo banner** (e.g. "Daily Payouts is now available")
     with a comparison and its own CTA (amber tertiary is allowed here for the
     add-on), and/or a **"Do more with Uncapped"** list-action card (rows with
     icon + label + chevron: withdraw funds, refer brands…).
- Recent activity, when shown, is list rows with status chips.
- **One primary next action** for the page; everything else secondary.

### 3. Application form (multi-step)
- Onboarding / application shell — the **left stepper sidebar** shows where the
  customer is; a "Step 4 of 7" caption above the title is an optional extra
- Max 5 fields per screen, grouped by topic not data model
- Easy questions first; bank-connect later, never first
- "Save and exit" link visible at every step
- Footer: back link + one primary "Continue"

### 4. Connect / data-sharing step
Kill privacy anxiety.
- Title + subtitle explaining *why* ("We use this to generate your offer faster")
- Provider tiles: Amazon, Shopify, eBay, Stripe — 40px logo containers
  (8px radius, `#f0f3f4` bg, `#d7dee0` border) + "Connect" secondary buttons
- "Read-only access — we can never move your money" prominently displayed
- Info notice with privacy specifics
- Escape hatch: "Upload statements instead"

### 5. Decline screen
Honest, calm, named next step.
- Plain shell (no nav)
- "We can't offer funding right now" — plain-language reason if disclosable
- Exactly three things: what / why / what next
- Account manager name + email visible
- Re-apply timeline ("You can apply again in 90 days")
- No upsell. Calm.

### 6. Drawdown / fund request
- Available balance hero (calm, not alarming)
- Amount input with min/max visible
- Live-updating breakdown: fee, expected repayment, days to settle
- Destination account shown read-only
- Pre-confirmation summary before commit
- After submit: status timeline (pending → processing → sent)

### 7. Repayments view
- Tabs: "Upcoming" (default) / "Past"
- Each row: amount + date + source account + status chip
- Status is always a chip, never a word in a column

### 8. Confirmation / success
- Hero message specific to the action ("Your funding has been approved")
- What happens next: concrete steps with dates
- Timeline expectation ("Funds in your account within 24 hours")
- One named next action ("View dashboard")

### 9. Empty state
- Centred card: icon + headline + one-sentence body + primary action
- "No active loans yet" + why + "Apply for funding"
- Never a blank page with "No data"

### 10. Registration / sign-up & pre-qualification
The very first screens — account creation, eligibility, readiness — *before* the
numbered application begins. **Do NOT use the numbered stepper here.**
- **Shell:** a **two-column split**, not the stepper shell. **Copy the
  `.split-auth` skeleton from components.html verbatim** — don't hand-roll the
  flex, it's the layout that breaks most. Structure:
  - **Left = form panel** (`flex:1`). Inside it: the **logo hard top-left** at
    28px, then the **form stack as a fixed ~420px column horizontally CENTRED in
    the panel** (`max-width:420px; margin:0 auto`). Optional Log out bottom-left.
    ⚠️ The logo is LEFT, the form is CENTRED — the common break is doing the
    opposite (centred logo + left-jammed form) which leaves a huge empty void on
    the right of the form. Never let the form sit against the left edge of a wide
    panel.
  - **Right = gradient panel** — `flex:0 0 44%`, **max 620px**, full height,
    teal-dominant (teal → deep teal/blue), white text. It must never grow wider
    than ~44% or the form panel collapses.
- **Sign-up screen:** social sign-up first (Google + Amazon, real glyphs) → "or
  sign up with email" divider → first/last name, email, password (with show/hide)
  → full-width **primary** "Sign up with email" → "Already have an account? Log
  in" + Terms/reCAPTCHA microcopy.
- **Eligibility / readiness screens:** same split; form fields (currency fields
  with a currency selector + symbol prefix, selects, business-name search, phone
  with country code, SMS consent) on the left, gradient on the right.
- **Right gradient panel:** a reassurance headline, the **`$100,000` eligibility
  hero number**, and 1–2 **glass cards** (translucent white on the gradient,
  icons accent-coloured teal/amber — never white).
- Keep the gradient identical across sign-up → readiness → eligibility.
- The numbered application ("Step 1 of 5") that follows DOES use the onboarding
  stepper shell (archetype 3).

### 11. Settings
- Sections grouped by intent: Profile / Notifications / Security / Documents /
  Connected accounts — each in its own card
- Never alphabetised

## Composition rules (every screen)

- **One primary action per view.**
- **Anchor + body + action** — clear page title, focused job, one obvious action.
- **Status never colour-alone** — chips pair colour with a label; notices pair
  colour with an icon and text.
- **Three-layer depth**: canvas `#f7f4f2` → white card (Light/Sm shadow) →
  cream `#fbfaf9` inner zone → optional white inner card. Depth via layering,
  not big shadows.
- **Accent rotation**: 2–3 accent colours per screen, one per topic. Detail
  sections indigo (accent-9), comparisons magenta (accent-11), offers amber
  (accent-2), repayments violet (accent-6).
- **Typography rhythm**: the big figure (h1/h2 ~48–56px) only inside a gradient
  hero card, and only when the screen has one · page title `h4` 32px, often
  omitted · card header titles 16px Sora bold · value rows = 16px semibold label
  left, 16px bold value right, 14px secondary description below · metric amounts
  ~28px, all consistent. (See the conditional rule in tokens.md.)
- **Layout rhythm**: consistent horizontal padding across all sibling sections
  of a container; 24px gap between cards; 8px grid throughout.

## Anti-anxiety toolkit (use at high-anxiety moments)

Offers, drawdowns, declines, first repayment:
- Show the full cost before any commitment — no "see fees at checkout"
- Pre-confirmation summary before anything irreversible
- Say what happens next and when, with real dates
- Real deadlines only — fake urgency destroys trust
- Reassurance lines at the moment of doubt ("No personal guarantee",
  "Applying does not affect your credit score")
- After money moves: immediate visible status, not silence
