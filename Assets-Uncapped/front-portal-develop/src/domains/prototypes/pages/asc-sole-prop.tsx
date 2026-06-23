import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Tick02SolidStandard,
  ArrowDown01SolidStandard,
  ArrowRight01SolidStandard,
  Search01SolidStandard,
  Add01SolidStandard,
  RefreshSolidStandard,
  Chart01SolidStandard,
  Logout03SolidStandard,
  Invoice02SolidStandard,
  Calendar02SolidStandard,
  ChartUpSolidStandard,
  CreditCardSolidStandard,
  Tag01SolidStandard,
  UserGroupSolidStandard,
  ArrowRightDoubleSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { ShoppingCart01StrokeStandard } from "@hugeicons-pro/core-stroke-standard"
import {
  Location06SolidSharp,
} from "@hugeicons-pro/core-solid-sharp"
import {
  MoneyBag02SolidRounded,
  SecurityValidationSolidRounded,
  Call02SolidRounded,
  UserMultiple02SolidRounded,
  InformationCircleSolidRounded,
  FlashSolidRounded,
  PencilEdit02SolidRounded,
  LockSolidRounded,
  DocumentValidationSolidRounded,
  BankSolidRounded,
  CheckmarkCircle02SolidRounded,
  IdentityCardSolidRounded,
  FaceIdSolidRounded,
  Home01SolidRounded,
  ArrowDataTransferHorizontalSolidRounded,
  Analytics01SolidRounded,
  Message02SolidRounded,
  RocketSolidRounded,
  Award01SolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import Loader from "../../../components/UI/Loader/Loader"
import Notice from "../../../components/UI/Notice/Notice"
import { OfferHeroBanner } from "../offers/_shared/hero-banner"
import { OfferExpiryNotice } from "../offers/_shared/notice"
import { SectionCardHeader, formatCurrency, PChip } from "../offers/_shared/primitives"
import { BalanceChart } from "../offers/_shared/balance-chart"
import { WhyWereBetter, type WhyBetterBullet } from "../offers/_shared/why-were-better"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"
import { ReactComponent as ConnectMask } from "../../../components/Collections/RegistrationSidebars/assets/mask.svg"
import { ReactComponent as OfferCardSvg } from "../../../components/Collections/RegistrationSidebars/assets/offer-card.svg"
import { ReactComponent as UncappedLogoCard } from "../../../components/Collections/RegistrationSidebars/assets/uncapped-logo-card.svg"

// ---------------------------------------------------------------------------
// ASC Sole-Proprietor onboarding + application flow
// Figma: PpchLKGzsCWPWyK1GOQcsi – "Third Iteration"
//   2368:22378  Screen 1 – Eligibility entrance (SP variant)
//   2368:22379  Screen 1 – Eligibility entrance (LLC variant)
//   2368:22964  Screen 2 – Applicant info
//   2368:23607  Screen 3 – Connections
//   2368:24280  Screen 4 – "Your offer" holding
//
// Sandbox-safe: all mock data, no live Uncapped URLs.
// ---------------------------------------------------------------------------

type Screen =
  | "seller-central"
  | "amazon-auth"
  | "eligibility"
  | "applicant"
  | "application"
  | "offer"
  | "offer-details"
  | "signatory"
  | "verify-identity"
  | "withdraw"
  | "dashboard"
type BusinessType = "llc" | "sp"

const SCREEN_ORDER: Screen[] = [
  "seller-central",
  "amazon-auth",
  "eligibility",
  "applicant",
  "application",
  "offer",
  "offer-details",
  "signatory",
  "verify-identity",
  "withdraw",
  "dashboard",
]

const SHADOW_SM = "0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)"
const SHADOW_MD = "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)"

const PHONE_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dial: "+61" },
]

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
]

const mockBusinesses = (q: string) => {
  const s = q.trim()
  if (!s) return []
  return [
    { name: `${s} LLC`, address: "242 Porter Blvd, Stamford, CT 06901", reg: "#7702264" },
    { name: `${s} Corp`, address: "18 Market St, Austin, TX 73301", reg: "#5519830" },
    { name: `${s} Holdings Inc.`, address: "9 Riverside Ave, Brooklyn, NY 11201", reg: "#3320117" },
  ]
}

const readScreen = (): Screen => {
  if (typeof window === "undefined") return "seller-central"
  const h = window.location.hash.replace("#", "") as Screen
  return SCREEN_ORDER.includes(h) ? h : "seller-central"
}

// ===========================================================================
// Root
// ===========================================================================

const AscSoleProp = () => {
  const [screen, setScreen] = useState<Screen>(readScreen)
  const [businessType, setBusinessType] = useState<BusinessType>("llc")
  const [maxStep, setMaxStep] = useState(() =>
    Math.max(0, STEP_FLOW.indexOf(stepOf(readScreen())))
  )

  // Once the offer is accepted (the signing step has been reached), the nav
  // regroups into its post-acceptance form. Derived from furthest progress so it
  // persists when the user navigates back to an earlier summary in this phase.
  const accepted = maxStep >= STEP_FLOW.indexOf("signatory")

  useEffect(() => {
    const target = `#${screen}`
    if (window.location.hash !== target)
      window.history.replaceState(null, "", target)
  }, [screen])

  // Remember the furthest step reached so completed steps stay navigable
  useEffect(() => {
    const i = STEP_FLOW.indexOf(stepOf(screen))
    if (i > maxStep) setMaxStep(i)
  }, [screen, maxStep])

  useEffect(() => {
    const handler = () => setScreen(readScreen())
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  const go = (s: Screen) => {
    setScreen(s)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <style>{`
        @keyframes asc-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes asc-scale-in {
          from { transform: scale(0.82); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .asc-enter {
          animation: asc-fade-up 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .asc-scale-reveal {
          animation: asc-scale-in 0.22s cubic-bezier(0, 0, 0.2, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .asc-enter, .asc-scale-reveal { animation: none !important; }
        }
      `}</style>
    <div className="min-h-screen w-full bg-surface-canvas">
      {screen === "seller-central" && (
        <SellerCentralScreen onStart={() => go("amazon-auth")} />
      )}
      {screen === "amazon-auth" && (
        <AmazonAuthScreen
          onAllow={() => go("eligibility")}
          onCancel={() => go("seller-central")}
        />
      )}
      {screen === "eligibility" && (
        <div className="flex min-h-screen w-full items-stretch">
          <EligibilityScreen
            businessType={businessType}
            setBusinessType={setBusinessType}
            onContinue={() => go("applicant")}
          />
        </div>
      )}
      {(screen === "applicant" || screen === "application" || screen === "offer" || screen === "offer-details" || screen === "signatory" || screen === "verify-identity" || screen === "withdraw") && (
        <div className="mx-auto flex w-full max-w-[1320px] gap-12 px-6 py-10 lg:px-10">
          <AppSidebar screen={screen} onGo={go} accepted={accepted} maxStep={maxStep} />
          <div className="flex w-full min-w-0 flex-1 justify-between gap-10">
            {screen === "applicant" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <ApplicantScreen onContinue={() => go("application")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                  <CreditDataCard />
                </aside>
              </>
            )}
            {screen === "application" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <ApplicationSummaryScreen
                    readOnly={accepted}
                    onBack={() => go("applicant")}
                    onApply={() => go("offer")}
                  />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                </aside>
              </>
            )}
            {screen === "offer" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <OfferHoldingScreen onViewOffer={() => go("offer-details")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                  <IdVerificationCard />
                </aside>
              </>
            )}
            {screen === "offer-details" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <OfferDetailsScreen readOnly={accepted} onAccept={() => go("signatory")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                  <OfferRightRail />
                </aside>
              </>
            )}
            {screen === "signatory" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <SignatoryScreen onComplete={() => go("verify-identity")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                  <AgreementSummaryCard />
                </aside>
              </>
            )}
            {screen === "verify-identity" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <VerifyIdentityScreen onComplete={() => go("withdraw")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                </aside>
              </>
            )}
            {screen === "withdraw" && (
              <>
                <main className="asc-enter w-full min-w-0 flex-1 lg:max-w-[700px]">
                  <WithdrawScreen onSubmit={() => go("dashboard")} />
                </main>
                <aside className="asc-enter hidden shrink-0 flex-col items-end gap-4 lg:flex" style={{ animationDelay: "60ms" }}>
                  <TopActions />
                </aside>
              </>
            )}
          </div>
        </div>
      )}
      {screen === "dashboard" && <DashboardScreen />}
    </div>
    </>
  )
}

// ===========================================================================
// Amazon Seller Central entry screens (pre-Uncapped)
// Figma 2368:19987 (financing options + data-sharing modal), 2368:19981 (OAuth)
//
// NOTE: these intentionally mimic Amazon Seller Central / Amazon OAuth chrome —
// they are NOT Uncapped design-system surfaces, so DS tokens don't apply here.
// All colours/strings are static mocks. No live URLs.
// ===========================================================================

const AMZN_HEADER = "#232f3e"
const AMZN_TEAL = "#0d8395"
const AMZN_YELLOW = "#f7ca00"
const AMZN_LINK = "#0a6e8c"

// --- Amazon Seller Central: available financing options + data-sharing modal --
const SellerCentralScreen = ({ onStart }: { onStart: () => void }) => {
  const [consentOpen, setConsentOpen] = useState(false)

  return (
    <div className="asc-enter min-h-screen w-full bg-white text-[#0f1111]">
      {/* Top nav bar */}
      <header
        className="flex items-center gap-4 px-4 py-2 text-sm text-white"
        style={{ backgroundColor: AMZN_HEADER }}
      >
        <span className="font-bold lowercase tracking-tight">
          amazon <span className="font-normal opacity-90">seller central</span>
        </span>
        <span className="rounded-sm border border-white/30 px-2 py-1 text-xs text-white/90">
          United St… ▾
        </span>
        <div className="mx-auto flex w-full max-w-[520px] items-center overflow-hidden rounded-sm bg-white">
          <input
            aria-label="Search Seller Central"
            placeholder="Search"
            className="w-full px-3 py-1.5 text-sm text-neutral-800 outline-none"
            disabled
          />
          <span
            className="flex h-8 w-10 items-center justify-center"
            style={{ backgroundColor: AMZN_YELLOW }}
          >
            <HugeiconsIcon icon={Search01SolidStandard} size={16} className="text-[#0f1111]" />
          </span>
        </div>
        <nav className="flex items-center gap-4 text-xs text-white/90">
          <span>✉</span>
          <span>⚙</span>
          <span>EN ▾</span>
          <span>Help</span>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-[980px] px-4 py-6">
        {/* New-feature notice strip */}
        <div
          className="mb-5 flex items-start gap-3 rounded-sm border px-4 py-3 text-sm"
          style={{ borderColor: "#bfe3e8", backgroundColor: "#eef8fa" }}
        >
          <HugeiconsIcon icon={InformationCircleSolidRounded} size={18} className="mt-0.5 text-[#0f6d7e]" />
          <p className="flex-1 text-[#0f1111]">
            <span className="font-bold">NEW</span>{" "}
            If your business is approved for any loan from Amazon Lending and a line of
            credit from Marcus by Goldman Sachs, you can now accept both at the same time.
          </p>
          <span className="cursor-default text-neutral-500">✕</span>
        </div>

        {/* How it works */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-lg font-bold">How it works</h1>
            <a href="#" style={{ color: AMZN_LINK }} className="text-sm focus-visible:outline focus-visible:outline-2">Learn more</a>
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[#3a3a3a]">
            <li>Choose a financing option that meets your business&rsquo;s needs.</li>
            <li>
              Select &lsquo;Start application&rsquo; next to the financing option. For products from
              third-party providers, you&rsquo;ll be redirected to the provider&rsquo;s site.
            </li>
            <li>Fill out the application information. Note: A U.S. business bank account is required.</li>
            <li>Completed applications can take up to 5 business days for a decision.</li>
          </ul>
        </div>

        {/* Available financing options */}
        <h2 className="mb-3 text-lg font-bold">Available financing options</h2>
        <div className="overflow-hidden rounded-md border border-neutral-300">
          {/* Uncapped row */}
          <div className="grid grid-cols-[150px_1fr_180px_160px_auto] items-start gap-4 border-b border-neutral-200 p-5">
            <div>
              <span
                className="inline-flex items-center rounded px-2 py-1 text-sm font-bold text-white"
                style={{ backgroundColor: AMZN_TEAL }}
              >
                uncapped
              </span>
              <p className="mt-2 text-xs text-neutral-500">Uncapped</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">Up to $100,000</p>
              <p>Term loan</p>
              <p className="mt-1 text-neutral-600">Expires: Oct 30, 2025</p>
              <p className="mt-1 text-neutral-600">
                You can request a larger loan subject to extra data provided during onboarding.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-bold">3% – 24% Fixed Fee</p>
              <p className="text-neutral-600">
                Cost of credit expressed as a Fixed Fee (equivalent to 10.99% to 29.99% APR).
              </p>
            </div>
            <div className="text-sm">
              <p className="font-bold">Up to 18 Months</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-neutral-600">
                <li>Fast approval in as little as 24 hours</li>
                <li>Flexible repayment cycle</li>
                <li>No early repayment fees</li>
                <li>No impact on your personal credit score</li>
              </ul>
            </div>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setConsentOpen(true)}
                className="rounded px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: AMZN_TEAL }}
              >
                Start application
              </button>
            </div>
          </div>

          {/* Parafin row (greyed, expired — for contrast) */}
          <div className="grid grid-cols-[150px_1fr_180px_160px_auto] items-start gap-4 p-5 opacity-70">
            <div>
              <span className="inline-flex items-center text-sm font-semibold text-neutral-500">
                ◌ Parafin
              </span>
            </div>
            <div className="text-sm">
              <p className="font-bold">Up to $1,000</p>
              <p>Merchant Cash Advance</p>
              <p className="mt-1 text-neutral-600">Expires: Apr 23, 2023</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">10% – 15% Payment Rate</p>
            </div>
            <div className="text-sm">
              <p className="font-bold">Up to $1,000</p>
            </div>
            <div className="pt-1">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-400"
              >
                Start application
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-neutral-500">
          Any content translated prior to this experience was translated for convenience only. By
          continuing, you understand your experience here and forward is English only. Financing
          products are made or arranged by Amazon Capital Services, Inc., NMLS&nbsp;#2277788.
        </p>
      </div>

      {/* Data-sharing consent modal (Figma 2368:19987) */}
      {consentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15,17,17,0.45)" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="asc-consent-title"
        >
          <div className="asc-scale-reveal w-full max-w-[760px] rounded-md bg-white p-6 shadow-xl">
            <div className="mb-3 flex items-start justify-between gap-4">
              <h3 id="asc-consent-title" className="text-base font-bold text-[#0f1111]">
                To start the financing application you will be redirected to the provider&rsquo;s site
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setConsentOpen(false)}
                className="rounded p-2 text-neutral-500 transition-colors hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2"
              >
                ✕
              </button>
            </div>
            <p className="text-sm leading-relaxed text-[#3a3a3a]">
              By clicking &lsquo;I agree&rsquo;, you agree and authorize Amazon to share your business&rsquo;s
              data on file with the provider, including tenure, sales and disbursement data over
              different time frames, main product category, Fulfillment by Amazon (FBA) inventory,
              account status, total number of orders, returns, cancellations, order defects, late
              shipments, warning actions, and number of customer feedback over the trailing 12 months.
            </p>
            <a href="#" className="mt-3 block text-sm focus-visible:outline focus-visible:outline-2" style={{ color: AMZN_LINK }}>
              Learn more about the data that will be shared with the provider
            </a>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConsentOpen(false)}
                className="rounded border border-neutral-300 px-5 py-2 text-sm font-medium text-[#0f1111] transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onStart}
                className="rounded px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: AMZN_TEAL }}
              >
                I agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- Amazon OAuth: "Uncapped would like access to" (Figma 2368:19981) ---------
const AmazonAuthScreen = ({
  onAllow,
  onCancel,
}: {
  onAllow: () => void
  onCancel: () => void
}) => (
  <div className="asc-enter flex min-h-screen w-full flex-col bg-white text-[#0f1111]">
    <header className="flex items-center justify-between px-8 py-5">
      <span className="mx-auto text-2xl font-bold tracking-tight">
        amazon<span style={{ color: AMZN_YELLOW }}>.</span>
      </span>
      <span className="absolute right-8 text-sm text-neutral-700">Michael Scott 👤</span>
    </header>

    <main className="mx-auto w-full max-w-[760px] flex-1 px-4">
      <div className="rounded-lg border border-neutral-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Uncapped would like access to:</h1>
        <div className="mt-5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={InformationCircleSolidRounded} size={18} className="text-neutral-500" />
            <span className="text-base font-semibold">Profile</span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-[#3a3a3a]">
            <p>Name: Michael Scott</p>
            <p>Email address: michael@gmail.com</p>
            <p>Postcode: 19101</p>
          </div>
          <hr className="mt-5 border-neutral-200" />
        </div>

        <div className="mt-12 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-w-[200px] rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-[#0f1111] transition-colors hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAllow}
            className="min-w-[200px] rounded-full px-6 py-2.5 text-sm font-semibold text-[#0f1111] transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: AMZN_YELLOW }}
          >
            Allow
          </button>
        </div>
        <p className="mt-5 text-center text-xs text-neutral-500">
          You can remove access at any time by visiting{" "}
          <a href="#" style={{ color: AMZN_LINK }} className="focus-visible:outline focus-visible:outline-2">Manage apps and services with data access</a> at
          Amazon.
        </p>
      </div>
      <p className="mt-6 text-center text-xs text-neutral-400">
        <a href="#" style={{ color: AMZN_LINK }} className="focus-visible:outline focus-visible:outline-2">Amazon Terms &amp; Privacy</a> ·{" "}
        <a href="#" style={{ color: AMZN_LINK }} className="focus-visible:outline focus-visible:outline-2">Uncapped Privacy</a> · © 1996–2024, Amazon.com, Inc.
        or its affiliates
      </p>
    </main>
  </div>
)

// ===========================================================================
// Screen 1 – Eligibility entrance (no left nav, 2-column)
// Figma 2368:22378 (SP) / 2368:22379 (LLC)
// ===========================================================================

const EligibilityScreen = ({
  businessType,
  setBusinessType,
  onContinue,
}: {
  businessType: BusinessType
  setBusinessType: (t: BusinessType) => void
  onContinue: () => void
}) => {
  const [tradingName, setTradingName] = useState("")
  const [tradingNames, setTradingNames] = useState<string[]>([])
  const [firstName] = useState("Michael")
  const [lastName] = useState("Scott")
  // LLC fields
  const [llcBusinessSearch, setLlcBusinessSearch] = useState("")
  const [llcBusinessOpen, setLlcBusinessOpen] = useState(false)
  const [llcBusinessChosen, setLlcBusinessChosen] = useState(false)
  const [llcState, setLlcState] = useState("Delaware")
  const [llcStateOpen, setLlcStateOpen] = useState(false)
  const llcRef = useRef<HTMLDivElement | null>(null)
  const llcStateRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (llcRef.current && !llcRef.current.contains(e.target as Node)) setLlcBusinessOpen(false)
      if (llcStateRef.current && !llcStateRef.current.contains(e.target as Node)) setLlcStateOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const inputBase =
    "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-500 transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"

  const llcResults = llcBusinessSearch.trim() && !llcBusinessChosen ? mockBusinesses(llcBusinessSearch) : []

  const addTradingName = () => {
    const v = tradingName.trim()
    if (!v) return
    setTradingNames((prev) =>
      prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [...prev, v]
    )
    setTradingName("")
  }

  const canContinue = businessType === "sp" ? true : llcBusinessChosen

  return (
    <>
      {/* Form column */}
      <div className="asc-enter flex min-w-[520px] flex-1 flex-col justify-between p-10">
        <div className="flex flex-col gap-y-10">
          {/* Logo */}
          <div className="h-[40px]">
            <Logo link={false} className="h-[40px] w-auto" />
          </div>

          {/* Form content */}
          <div className="flex w-full justify-center">
            <div className="flex w-full flex-col gap-y-8" style={{ maxWidth: "540px" }}>
              {/* Heading */}
              <h1
                className="text-[32px] font-semibold leading-[1.3] text-neutral-800"
                style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
              >
                Tell us about your business
              </h1>

              {/* Business-type toggle */}
              <div className="flex flex-col gap-y-4">
                <div
                  role="tablist"
                  aria-label="Business type"
                  className="flex items-center gap-1.5 rounded-xl p-1"
                  style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={businessType === "llc"}
                    onClick={() => setBusinessType("llc")}
                    className={`flex h-[38px] flex-1 items-center justify-center rounded-lg px-4 text-sm font-semibold outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
                      businessType === "llc"
                        ? "bg-white text-brand-600"
                        : "text-text-secondary hover:bg-white/50"
                    }`}
                    style={
                      businessType === "llc"
                        ? { boxShadow: "0 1px 2px rgba(0,0,0,.07), 0 0 6px rgba(0,0,0,.03)" }
                        : undefined
                    }
                  >
                    LLC / Corporation / LLP
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={businessType === "sp"}
                    onClick={() => setBusinessType("sp")}
                    className={`flex h-[38px] flex-1 items-center justify-center rounded-lg border px-4 text-sm font-semibold outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
                      businessType === "sp"
                        ? "border-neutral-300 bg-white text-brand-600"
                        : "border-transparent text-text-secondary hover:bg-white/50"
                    }`}
                    style={
                      businessType === "sp"
                        ? { boxShadow: "0 1px 2px rgba(0,0,0,.07), 0 0 6px rgba(0,0,0,.03)" }
                        : undefined
                    }
                  >
                    Sole Proprietorship (Trader)
                  </button>
                </div>

                {/* Per-type subtitle */}
                <p className="text-xs leading-[1.5] text-text-secondary">
                  {businessType === "sp"
                    ? "As a sole trader, you are the business — no separate company details needed."
                    : "Your company is a separate legal entity — we'll need its registered details."}
                </p>

                {/* SP fields */}
                {businessType === "sp" && (
                  <div className="asc-enter flex flex-col gap-y-4">
                    {/* Country — prefilled, read-only hint */}
                    <div className="flex flex-col gap-y-0.5">
                      <label htmlFor="sp-country" className="text-sm font-semibold text-text-secondary">
                        Country
                      </label>
                      <div className="flex h-11 items-center rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800">
                        <input
                          id="sp-country"
                          type="text"
                          value="United States"
                          readOnly
                          aria-label="Country"
                          className="flex-1 bg-transparent text-sm text-neutral-800 outline-none"
                        />
                      </div>
                    </div>

                    {/* First + Last name */}
                    <div className="flex gap-3">
                      <div className="flex flex-1 flex-col gap-y-0.5">
                        <label htmlFor="sp-first-name" className="text-sm font-semibold text-text-secondary">
                          First Name
                        </label>
                        <input
                          id="sp-first-name"
                          type="text"
                          defaultValue={firstName}
                          maxLength={80}
                          className={inputBase}
                          autoComplete="given-name"
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-y-0.5">
                        <label htmlFor="sp-last-name" className="text-sm font-semibold text-text-secondary">
                          Last Name
                        </label>
                        <input
                          id="sp-last-name"
                          type="text"
                          defaultValue={lastName}
                          maxLength={80}
                          className={inputBase}
                          autoComplete="family-name"
                        />
                      </div>
                    </div>

                    {/* Trading names */}
                    <div className="flex flex-col gap-y-1">
                      <label htmlFor="trading-name" className="text-sm font-semibold text-text-secondary">
                        Trading names
                      </label>
                      <input
                        id="trading-name"
                        type="text"
                        value={tradingName}
                        onChange={(e) => setTradingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTradingName()
                          }
                        }}
                        placeholder="e.g. Sunrise Goods"
                        className={inputBase}
                      />
                      {/* Inline add affordance — appears as you type so the name is never lost */}
                      {tradingName.trim() && (
                        <button
                          type="button"
                          onClick={addTradingName}
                          className="asc-enter mt-1 flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-left text-sm outline-none transition-colors hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-200"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                            <HugeiconsIcon icon={Add01SolidStandard} size={14} />
                          </span>
                          <span className="text-neutral-800">
                            Add &ldquo;<span className="font-semibold">{tradingName.trim()}</span>&rdquo;
                          </span>
                        </button>
                      )}
                      {tradingNames.length > 0 && (
                        <ul className="mt-1 flex flex-wrap gap-2">
                          {tradingNames.map((n) => (
                            <li
                              key={n}
                              className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm text-neutral-800"
                            >
                              <span className="truncate max-w-[160px]" title={n}>{n}</span>
                              <button
                                type="button"
                                aria-label={`Remove ${n}`}
                                onClick={() => setTradingNames((prev) => prev.filter((x) => x !== n))}
                                className="ml-0.5 rounded p-1.5 text-neutral-400 hover:text-neutral-600 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-xs leading-5 text-text-secondary">
                        Include any name your business trades under that isn't your own — your Amazon store name, brand name, or any DBA.
                      </p>
                    </div>
                  </div>
                )}

                {/* LLC fields */}
                {businessType === "llc" && (
                  <div className="asc-enter flex flex-col gap-y-4">
                    {/* Country of incorporation */}
                    <div className="flex flex-col gap-y-0.5">
                      <label htmlFor="llc-country" className="text-sm font-semibold text-text-secondary">
                        Country of incorporation
                      </label>
                      <div className="flex h-11 items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800">
                        <input
                          id="llc-country"
                          type="text"
                          value="United States of America"
                          readOnly
                          aria-label="Country of incorporation"
                          className="flex-1 bg-transparent text-sm text-neutral-800 outline-none"
                        />
                        <HugeiconsIcon icon={ArrowDown01SolidStandard} size={16} className="text-neutral-400" aria-hidden="true" />
                      </div>
                    </div>

                    {/* State of formation */}
                    <div className="flex flex-col gap-y-0.5" ref={llcStateRef}>
                      <label htmlFor="state-of-formation" className="text-sm font-semibold text-text-secondary">
                        State of formation
                      </label>
                      <div className="relative">
                        <button
                          id="state-of-formation"
                          type="button"
                          onClick={() => setLlcStateOpen((v) => !v)}
                          aria-haspopup="listbox"
                          aria-expanded={llcStateOpen}
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
                        >
                          {llcState}
                          <HugeiconsIcon
                            icon={ArrowDown01SolidStandard}
                            size={16}
                            className={`text-neutral-400 transition-transform duration-200 ${llcStateOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {llcStateOpen && (
                          <ul
                            role="listbox"
                            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-auto rounded-lg border border-neutral-200 bg-white"
                            style={{ boxShadow: SHADOW_MD }}
                          >
                            {US_STATES.map((s) => (
                              <li key={s} role="presentation">
                                <button
                                  type="button"
                                  role="option"
                                  aria-selected={llcState === s}
                                  onClick={() => { setLlcState(s); setLlcStateOpen(false) }}
                                  className={`flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50 ${llcState === s ? "bg-brand-50 font-semibold text-brand-700" : "text-text-primary"}`}
                                >
                                  {s}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Business name search */}
                    <div className="flex flex-col gap-y-0.5" ref={llcRef}>
                      <label htmlFor="llc-business-search" className="text-sm font-semibold text-text-secondary">
                        Search for registered business name
                      </label>
                      <div className="relative">
                        <input
                          id="llc-business-search"
                          type="text"
                          value={llcBusinessSearch}
                          onChange={(e) => { setLlcBusinessSearch(e.target.value); setLlcBusinessChosen(false); setLlcBusinessOpen(true) }}
                          onFocus={() => { if (llcBusinessSearch.trim() && !llcBusinessChosen) setLlcBusinessOpen(true) }}
                          placeholder="Registered business name"
                          autoComplete="off"
                          className={`${inputBase} pr-9`}
                        />
                        <HugeiconsIcon
                          icon={Search01SolidStandard}
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        />
                      </div>
                      {llcBusinessOpen && llcResults.length > 0 && (
                        <div
                          className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white"
                          style={{ boxShadow: SHADOW_MD, maxWidth: "540px" }}
                        >
                          <ul className="max-h-60 overflow-y-auto">
                            {llcResults.map((r) => (
                              <li key={r.reg}>
                                <button
                                  type="button"
                                  onClick={() => { setLlcBusinessSearch(r.name); setLlcBusinessChosen(true); setLlcBusinessOpen(false) }}
                                  className="flex w-full items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                                >
                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-neutral-800">{r.name}</span>
                                    <span className="block truncate text-xs text-text-secondary">{r.address}</span>
                                  </span>
                                  <span className="shrink-0 text-xs text-neutral-400">{r.reg}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            onClick={() => { setLlcBusinessChosen(true); setLlcBusinessOpen(false) }}
                            className="block w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                          >
                            <span className="text-sm font-semibold text-brand-600">Can't find your business? Add it manually</span>
                            <span className="block text-xs text-text-secondary">Use the name exactly as it's registered.</span>
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-text-secondary">
                        If you're part of a group, use the parent company name.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canContinue}
                  onClick={onContinue}
                >
                  Start application
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Log out */}
        <button
          type="button"
          onClick={() => { window.location.hash = "#eligibility"; window.location.reload() }}
          className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 outline-none transition-colors hover:bg-neutral-100 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
        >
          <BoxIcon
            icon={<HugeiconsIcon icon={Logout03SolidStandard} size={16} />}
            severity="accent-2"
            size={6}
          />
          <span className="px-2 text-base text-neutral-800">Log out</span>
        </button>
      </div>

      {/* Sidebar */}
      <div className="asc-enter flex h-full" style={{ animationDelay: "80ms" }}>
        <EligibilitySidebar />
      </div>
    </>
  )
}

// ===========================================================================
// Eligibility sidebar — reused exactly from registration.tsx
// Three stacked sections: Discover → Connect → Receive (OfferCardSvg graphic)
// ===========================================================================

const EligibilitySidebar = () => (
  <div className="relative hidden h-full min-h-screen w-[620px] shrink-0 overflow-hidden lg:block">
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 80% -10%, rgba(30, 189, 192, 0.55), transparent 55%), radial-gradient(circle at -10% 110%, rgba(0, 65, 107, 0.7), transparent 55%), linear-gradient(180deg, #004b4d 0%, #002a3c 100%)",
      }}
    />
    <div className="relative flex h-full flex-col items-stretch justify-start gap-6 p-20">
      <div className="flex flex-col items-center gap-y-14 text-center text-white">
        {/* Discover your potential */}
        <div className="flex w-full flex-col items-center gap-y-8">
          <h3
            className="font-heading text-[32px] font-semibold leading-[1.2] text-white"
            style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
          >
            Discover your potential
          </h3>
          <div className="flex items-center justify-center gap-6">
            <GlassTile checked>
              <AccentInner icon={<HugeiconsIcon icon={Location06SolidSharp} size={24} />} hex="#1ebdc0" />
            </GlassTile>
            <GlassTile checked>
              <AccentInner icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={24} />} hex="#37a7f1" />
            </GlassTile>
            <GlassTile checked>
              <AccentInner icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} size={24} />} hex="#ffac30" />
            </GlassTile>
          </div>
        </div>

        {/* Connect your data */}
        <div className="flex w-full flex-col items-center gap-y-3">
          <h3
            className="font-heading text-[32px] font-semibold leading-[1.2] text-white"
            style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
          >
            Connect your data
          </h3>
          <div className="flex items-center justify-center gap-0.5">
            <GlassTile>
              <AccentInner icon={<HugeiconsIcon icon={Chart01SolidStandard} size={24} />} hex="#9a73f6" />
            </GlassTile>
            <ConnectMask aria-hidden="true" />
            <UncappedLogoCard aria-hidden="true" className="mt-2 -mx-4" />
          </div>
        </div>

        {/* Receive offers — OfferCardSvg already contains the card + count-up graphic */}
        <div className="flex w-full flex-col items-center gap-y-3">
          <h3
            className="font-heading text-[32px] font-semibold leading-[1.2] text-white"
            style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
          >
            Receive offers
          </h3>
          <div className="flex items-center justify-center">
            <OfferCardSvg aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Sidebar icon tile components (from registration.tsx)
const GlassTile = ({ children, checked }: { children: React.ReactNode; checked?: boolean }) => (
  <div
    className="relative flex size-[72px] items-center justify-center rounded-xl border backdrop-blur-sm"
    style={{
      borderColor: "rgba(141, 141, 141, 0.20)",
      background: "linear-gradient(225deg, rgba(255, 255, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
      boxShadow: "0 0.758px 3.034px 0 rgba(0, 0, 0, 0.21), 0 0 15.169px 0 rgba(0, 0, 0, 0.15), 0 11.376px 15.169px 0 rgba(0, 0, 0, 0.15)",
    }}
  >
    {children}
    {checked && (
      <span
        className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full"
        style={{ backgroundColor: "#128081", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 2px 9px 0 rgba(0, 0, 0, 0.15)" }}
      >
        <HugeiconsIcon icon={Tick02SolidStandard} className="size-3 text-white" />
      </span>
    )}
  </div>
)

const AccentInner = ({ icon, hex }: { icon: React.ReactNode; hex: string }) => (
  <div
    className="flex size-10 items-center justify-center rounded-lg border"
    style={{ color: hex, borderColor: `${hex}40`, backgroundColor: `${hex}1f` }}
  >
    {icon}
  </div>
)

// ===========================================================================
// Left-nav stepper (Screens 2-4)
// ===========================================================================

type StepStatus = "done" | "active" | "todo"

// Full journey, in order. Several screens collapse onto a single visible step.
const STEP_FLOW: Screen[] = [
  "eligibility",
  "applicant",
  "application",
  "offer",
  "signatory",
  "verify-identity",
  "withdraw",
]

// Map any screen onto its visible nav step
const stepOf = (s: Screen): Screen => {
  if (s === "offer-details") return "offer"
  return s
}

type NavItem = {
  milestone: Screen
  label: string
  go: Screen
  cart?: boolean
  badge?: number
}

// Phase 1 — building the application (granular steps)
const NAV_PRE: NavItem[] = [
  { milestone: "eligibility", label: "Business details", go: "eligibility" },
  { milestone: "applicant", label: "Applicant info", go: "applicant" },
  { milestone: "application", label: "Your application", go: "application" },
  { milestone: "offer", label: "Your offer", go: "offer", cart: true },
]

// Phase 2 — after the offer is accepted: the whole application phase collapses
// into two completed summaries, and the fulfilment steps appear.
const NAV_POST: NavItem[] = [
  { milestone: "application", label: "Your application", go: "application" },
  { milestone: "offer", label: "Your offers", go: "offer-details", cart: true, badge: 1 },
  { milestone: "signatory", label: "Sign your agreement", go: "signatory" },
  { milestone: "verify-identity", label: "Verify identity", go: "verify-identity" },
  { milestone: "withdraw", label: "Withdraw funds", go: "withdraw" },
]

const AppSidebar = ({
  screen,
  onGo,
  accepted,
  maxStep,
}: {
  screen: Screen
  onGo: (s: Screen) => void
  accepted: boolean
  maxStep: number
}) => {
  const steps = accepted ? NAV_POST : NAV_PRE
  const current = stepOf(screen)

  const getStatus = (milestone: Screen): StepStatus => {
    if (milestone === current) return "active"
    if (STEP_FLOW.indexOf(milestone) <= maxStep) return "done"
    return "todo"
  }

  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col lg:flex"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="px-2 pb-6 pt-1">
        <Logo link={false} className="h-7 w-auto" />
      </div>
      <nav aria-label="Application steps" className="flex flex-col gap-1">
        {steps.map((s) => {
          const status = getStatus(s.milestone)
          return (
            <NavStep
              key={s.label}
              label={s.label}
              status={status}
              cart={s.cart}
              badge={s.badge}
              isCurrent={status === "active"}
              onClick={status !== "todo" ? () => onGo(s.go) : undefined}
            />
          )
        })}
      </nav>
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => window.location.assign("/prototypes/asc-sole-prop")}
          className="flex h-[38px] items-center gap-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
        >
          <BoxIcon
            icon={<HugeiconsIcon icon={RefreshSolidStandard} size={16} />}
            severity="accent-2"
            size={6}
          />
          <span className="px-2 text-base text-neutral-800">Restart prototype</span>
        </button>
      </div>
    </aside>
  )
}

const NavStep = ({
  label,
  status,
  isCurrent,
  cart,
  badge,
  onClick,
}: {
  label: string
  status: StepStatus
  isCurrent?: boolean
  cart?: boolean
  badge?: number
  onClick?: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    aria-current={isCurrent ? "step" : undefined}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all ${
      onClick ? "hover:bg-neutral-100" : "cursor-default"
    } ${status === "active" ? "bg-white" : ""}`}
    style={status === "active" ? { boxShadow: SHADOW_SM } : undefined}
  >
    {cart ? (
      <HugeiconsIcon
        icon={ShoppingCart01StrokeStandard}
        size={18}
        className={`shrink-0 ${status === "done" ? "text-brand-600" : "text-neutral-500"}`}
      />
    ) : (
      <StatusDot status={status} />
    )}
    <span className="flex flex-1 items-center gap-2">
      <span className={`text-base ${status === "todo" ? "text-text-secondary" : "text-neutral-800"}`}>
        {label}
      </span>
      {badge !== undefined && (
        <span className="inline-flex size-5 items-center justify-center rounded-full border border-brand-200 bg-white text-xs font-semibold text-brand-600">
          {badge}
        </span>
      )}
    </span>
  </button>
)

const StatusDot = ({ status }: { status: StepStatus }) => {
  if (status === "done")
    return (
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: "#128081" }}
      >
        <HugeiconsIcon icon={Tick02SolidStandard} className="size-2.5 text-white" />
      </span>
    )
  if (status === "active")
    return (
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: "#ffac30" }}
      >
        <span
          className="size-2.5 rounded-full"
          style={{ background: "linear-gradient(to right, transparent 50%, #ffac30 50%)" }}
        />
      </span>
    )
  return <span className="size-4 shrink-0 rounded-full border border-dashed" style={{ borderColor: "#556468" }} />
}

const TopActions = () => (
  <div className="hidden shrink-0 items-start gap-1 pt-1 lg:flex">
    <QuickAction icon={<HugeiconsIcon icon={Call02SolidRounded} size={14} />} severity="accent-1" label="Book a call" />
    <QuickAction icon={<HugeiconsIcon icon={UserMultiple02SolidRounded} size={14} />} severity="accent-9" label="Invite team" />
  </div>
)

const QuickAction = ({ icon, severity, label }: { icon: React.ReactNode; severity: string; label: string }) => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
  >
    <BoxIcon icon={icon} severity={severity as never} size={6} />
    {label}
  </button>
)

// ===========================================================================
// Screen 2 – Applicant info
// Figma 2368:22964
// ===========================================================================

const ApplicantScreen = ({
  onContinue,
}: {
  onContinue: () => void
}) => {
  const [dobMonth, setDobMonth] = useState("")
  const [dobDay, setDobDay] = useState("")
  const [dobYear, setDobYear] = useState("")
  const [address, setAddress] = useState("")
  const [addressManual, setAddressManual] = useState(false)
  const [email] = useState("michael@gmail.com")
  const [phone, setPhone] = useState("")
  const [smsConsent, setSmsConsent] = useState(false)
  const [creditConsent, setCreditConsent] = useState(false)
  const [phoneSel, setPhoneSel] = useState(PHONE_COUNTRIES[0])
  const [phoneOpen, setPhoneOpen] = useState(false)
  const phoneRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) setPhoneOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const dobValid = dobMonth.length > 0 && dobDay.length > 0 && dobYear.length === 4
  const canContinue = dobValid && (address.length > 0 || addressManual) && phone.length > 0

  const inputBase =
    "h-11 rounded-lg border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-500 transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"

  return (
    <div className="flex flex-col gap-y-6">
      {/* Page header */}
      <div>
        <h1
          className="text-[40px] font-bold leading-tight text-neutral-800"
          style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
        >
          Applicant information
        </h1>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#fbfaf9] px-4 py-3.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#eaf6f6", color: "#1ebdc0" }}>
            <HugeiconsIcon icon={SecurityValidationSolidRounded} size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-neutral-800">Our Credit Score promise</p>
            <p className="text-sm text-text-secondary">The checks we make will never impact your credit score</p>
          </div>
        </div>
      </div>

      {/* Date of birth */}
      <fieldset className="flex flex-col gap-y-1 border-0 p-0 m-0">
        <legend className="text-sm font-semibold text-text-secondary">Date of birth</legend>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM"
            maxLength={2}
            value={dobMonth}
            onChange={(e) => setDobMonth(e.target.value.replace(/\D/g, ""))}
            className={`${inputBase} w-16 text-center`}
            aria-label="Birth month"
          />
          <span className="text-text-secondary">/</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD"
            maxLength={2}
            value={dobDay}
            onChange={(e) => setDobDay(e.target.value.replace(/\D/g, ""))}
            className={`${inputBase} w-16 text-center`}
            aria-label="Birth day"
          />
          <span className="text-text-secondary">/</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="YYYY"
            maxLength={4}
            value={dobYear}
            onChange={(e) => setDobYear(e.target.value.replace(/\D/g, ""))}
            className={`${inputBase} w-24 text-center`}
            aria-label="Birth year"
          />
        </div>
      </fieldset>

      {/* Home address */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="home-address" className="text-sm font-semibold text-text-secondary">
          Home address
        </label>
        {!addressManual ? (
          <div className="relative">
            <input
              id="home-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Start typing your address"
              autoComplete="off"
              className={`${inputBase} w-full pr-9`}
            />
            <HugeiconsIcon
              icon={Search01SolidStandard}
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="addr-line1" className="text-sm font-semibold text-text-secondary">Address line 1</label>
              <input id="addr-line1" type="text" placeholder="Street address" className={`${inputBase} w-full`} />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="addr-line2" className="text-sm font-semibold text-text-secondary">Address line 2 (optional)</label>
              <input id="addr-line2" type="text" placeholder="Apartment, suite, unit, etc." className={`${inputBase} w-full`} />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="addr-city" className="text-sm font-semibold text-text-secondary">City</label>
              <input id="addr-city" type="text" placeholder="City" className={`${inputBase} w-full`} />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="addr-state" className="text-sm font-semibold text-text-secondary">State</label>
              <select id="addr-state" defaultValue="" className={`${inputBase} w-full appearance-none bg-white`}>
                <option value="" disabled>Select a state</option>
                {US_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="addr-zip" className="text-sm font-semibold text-text-secondary">Zip code</label>
              <input id="addr-zip" type="text" inputMode="numeric" placeholder="Zip code" className={`${inputBase} w-full`} />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setAddressManual((v) => !v)}
          className="mt-1 self-start text-sm font-semibold text-brand-600 outline-none transition-all hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1"
        >
          {addressManual ? "Search for address instead" : "Enter address manually"}
        </button>
      </div>

      {/* Email — prefilled, read-only */}
      <div className="flex flex-col gap-y-0.5">
        <label htmlFor="email" className="text-sm font-semibold text-text-secondary">
          Email address
        </label>
        <input
          id="email"
          type="email"
          defaultValue={email}
          readOnly
          className={`${inputBase} w-full bg-neutral-50 text-text-secondary`}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-y-0.5">
        <label htmlFor="phone-number" className="text-sm font-semibold text-text-secondary">Personal contact number</label>
        <div className="relative" ref={phoneRef}>
          <div className="flex h-11 items-stretch overflow-hidden rounded-lg border border-neutral-300 bg-white transition-all focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200">
            <button
              type="button"
              onClick={() => setPhoneOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={phoneOpen}
              aria-label={`Phone country: ${phoneSel.name} ${phoneSel.dial}`}
              className="flex items-center gap-1.5 border-r border-neutral-300 px-3 transition-colors hover:bg-neutral-50"
            >
              <span className="text-base leading-none" aria-hidden="true">{phoneSel.flag}</span>
              <span className="text-sm text-neutral-800" aria-hidden="true">{phoneSel.dial}</span>
              <HugeiconsIcon icon={ArrowDown01SolidStandard} size={14} className="text-neutral-400" aria-hidden="true" />
            </button>
            <input
              id="phone-number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 000-0000"
              inputMode="tel"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm placeholder:text-neutral-500 outline-none"
            />
          </div>
          {phoneOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white"
              style={{ boxShadow: SHADOW_MD }}
            >
              <ul role="listbox" aria-label="Select country code" className="max-h-64 overflow-y-auto">
                {PHONE_COUNTRIES.map((c) => (
                  <li key={c.code} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={phoneSel.code === c.code}
                      onClick={() => { setPhoneSel(c); setPhoneOpen(false) }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50"
                    >
                      <span className="text-base leading-none" aria-hidden="true">{c.flag}</span>
                      <span className="flex-1 truncate text-neutral-800">{c.name}</span>
                      <span className="text-text-secondary">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SMS consent card */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
          <BoxIcon
            icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={14} />}
            severity="accent-1"
            size={6}
          />
          <p className="text-sm font-bold text-neutral-800">We use SMS to notify you about offer updates</p>
        </div>
        <label className="flex cursor-pointer items-start gap-3 px-4 py-3" style={{ backgroundColor: "#fbfaf9" }}>
          <input
            type="checkbox"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="mt-0.5 size-4 accent-brand-600"
          />
          <span className="text-xs leading-5 text-text-secondary">
            I agree to receive SMS messages from Uncapped about my application and offer updates. Message frequency varies. Standard message and data rates apply.{" "}
            <a href="#" className="font-bold text-brand-600 underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">Privacy policy</a>
          </span>
        </label>
      </div>

      {/* Soft credit check consent card */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
        <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
          <BoxIcon
            icon={<HugeiconsIcon icon={FlashSolidRounded} size={14} />}
            severity="accent-3"
            size={6}
          />
          <p className="text-sm font-bold text-neutral-800">We run a soft credit check to size your offer</p>
        </div>
        <label className="flex cursor-pointer items-start gap-3 px-4 py-3" style={{ backgroundColor: "#fbfaf9" }}>
          <input
            type="checkbox"
            checked={creditConsent}
            onChange={(e) => setCreditConsent(e.target.checked)}
            className="mt-0.5 size-4 accent-brand-600"
          />
          <span className="text-xs leading-5 text-text-secondary">
            I authorise Uncapped to obtain a soft personal credit bureau report to help size my offer. This will not affect my credit score.{" "}
            <a href="#" className="font-bold text-brand-600 underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">Privacy policy</a>
          </span>
        </label>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-end pt-2">
        <Button
          type="button"
          variant="primary"
          disabled={!canContinue}
          onClick={onContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

const CreditDataCard = () => (
  <div className="w-[280px] rounded-2xl bg-white p-5" style={{ boxShadow: SHADOW_SM }}>
    <p className="mb-4 text-base font-bold leading-snug text-neutral-800">
      How we use your credit data to boost your application
    </p>
    <ul className="flex flex-col gap-4">
      <li className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#fff0d6", color: "#ffac30" }}>
          <HugeiconsIcon icon={RocketSolidRounded} size={16} />
        </span>
        <span className="text-sm leading-relaxed text-text-secondary">
          Credit data allows us to provide better, faster offers to more businesses
        </span>
      </li>
      <li className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#f4f0fe", color: "#9a73f6" }}>
          <HugeiconsIcon icon={Award01SolidRounded} size={16} />
        </span>
        <span className="text-sm leading-relaxed text-text-secondary">
          We only conduct &ldquo;soft&rdquo; credit checks to provide a high-level view of your credit history
        </span>
      </li>
    </ul>
  </div>
)

// ===========================================================================
// Screen 3 – "Your application" review & apply summary
// Figma 2368:23992
// ===========================================================================

const ApplicationSummaryScreen = ({
  onBack,
  onApply,
  readOnly = false,
}: {
  onBack: () => void
  onApply: () => void
  readOnly?: boolean
}) => {
  const [purposeConfirmed, setPurposeConfirmed] = useState(false)

  return (
    <div className="flex flex-col gap-y-6">
      <div>
        <h1
          className="text-[40px] font-bold leading-tight text-neutral-800"
          style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
        >
          {readOnly ? "Your application" : "Review and apply"}
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          {readOnly
            ? "A summary of the application you submitted."
            : "One last look before you apply. Check everything’s right, then send it off."}
        </p>
      </div>

      {/* Business details */}
      <SummaryCard icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={14} />} severity="accent-1" title="Business details" action={readOnly ? undefined : "Edit"}>
        <p className="mb-3 text-sm text-text-secondary">Check your business details are up to date and accurate</p>
        <div className="rounded-xl border border-neutral-200 px-4 py-3">
          <p className="text-sm font-bold text-neutral-800">Michael Scott, Sunrise Goods</p>
          <p className="text-sm text-text-secondary">1780 Colorado Boulevard, Denver, Colorado, 80220, USA</p>
        </div>
      </SummaryCard>

      {/* Contact details */}
      <SummaryCard icon={<HugeiconsIcon icon={Call02SolidRounded} size={14} />} severity="accent-1" title="Contact details" action={readOnly ? undefined : "Edit"}>
        <p className="mb-3 text-sm text-text-secondary">Check your contact details are up to date and accurate</p>
        <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-neutral-800">Personal contact email</span>
            <span className="text-sm text-text-secondary">michael.scott@gmail.com</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-neutral-800">Personal contact phone number</span>
            <span className="text-sm text-text-secondary">+1 (308) 786-4983</span>
          </div>
        </div>
      </SummaryCard>

      {!readOnly && (
        <>
          {/* Purpose confirmation */}
          <SummaryCard icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={14} />} severity="accent-1" title="Purpose confirmation">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={purposeConfirmed}
                onChange={(e) => setPurposeConfirmed(e.target.checked)}
                className="mt-0.5 size-4 accent-brand-600"
              />
              <span className="text-sm leading-5 text-text-secondary">I confirm I will use this funding for business purposes only</span>
            </label>
          </SummaryCard>

          {/* Nav */}
          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="link" onClick={onBack}>
              Go back
            </Button>
            <Button type="button" variant="primary" disabled={!purposeConfirmed} onClick={onApply}>
              Apply for funding
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

// Reusable summary card — header (icon + title + optional Edit action) + body
const SummaryCard = ({
  icon,
  severity,
  title,
  action,
  children,
}: {
  icon: React.ReactNode
  severity: string
  title: string
  action?: string
  children: React.ReactNode
}) => (
  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
    <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3">
      <BoxIcon icon={icon} severity={severity as never} size={6} />
      <p className="flex-1 text-sm font-bold text-neutral-800">{title}</p>
      {action && (
        <Button type="button" variant="secondary" size="sm" ariaLabel={`${action} ${title}`}>
          {action}
        </Button>
      )}
    </div>
    <div className="px-5 py-4">{children}</div>
  </div>
)

// ===========================================================================
// Screen 4 – "Your offer" holding screen
// Figma 2368:24280
// ===========================================================================

const PROGRESS_STAGES = [
  { id: "amazon", label: "Reading your Amazon sales history" },
  { id: "profile", label: "Checking your business profile" },
  { id: "sizing", label: "Sizing your offer" },
]

// How long each underwriting stage takes in the demo.
// 3 stages × 10.5s ≈ 31.5s — 50% faster than the previous ~63s run.
const STAGE_DURATION_MS = 10500

const OfferHoldingScreen = ({ onViewOffer }: { onViewOffer: () => void }) => {
  const [stagesDone, setStagesDone] = useState<number>(0)
  const [countUp, setCountUp] = useState(0)
  const [opening, setOpening] = useState(false)
  const [barWidth, setBarWidth] = useState(0)
  const [reduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  const offerTarget = 40000
  const totalDuration = PROGRESS_STAGES.length * STAGE_DURATION_MS
  const allDone = stagesDone >= PROGRESS_STAGES.length
  const timerRef = useRef<number | null>(null)
  const countRef = useRef<number | null>(null)

  // Brief loading moment when opening the full offer, then navigate
  const handleViewOffer = () => {
    setOpening(true)
    window.setTimeout(onViewOffer, 700)
  }

  // Continuously creep the progress bar across the full underwriting duration,
  // so it glides instead of jumping at each stage. A single linear CSS
  // transition runs to 100% over ~63s, landing on each third exactly as that
  // stage completes. Reduced-motion users fall back to discrete steps below.
  useEffect(() => {
    if (reduceMotion) return
    const raf = requestAnimationFrame(() => setBarWidth(100))
    return () => cancelAnimationFrame(raf)
  }, [reduceMotion])

  // Simulate stages completing one by one
  useEffect(() => {
    if (stagesDone >= PROGRESS_STAGES.length) return
    timerRef.current = window.setTimeout(() => {
      setStagesDone((n) => n + 1)
    }, STAGE_DURATION_MS)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  }, [stagesDone])

  // Count-up animation once all stages done
  useEffect(() => {
    if (!allDone) return
    // Respect reduced-motion: snap straight to the final amount, no incrementing counter
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCountUp(offerTarget)
      return
    }
    let start = 0
    const step = Math.ceil(offerTarget / 60)
    countRef.current = window.setInterval(() => {
      start += step
      if (start >= offerTarget) {
        setCountUp(offerTarget)
        if (countRef.current) window.clearInterval(countRef.current)
      } else {
        setCountUp(start)
      }
    }, 16)
    return () => { if (countRef.current) window.clearInterval(countRef.current) }
  }, [allDone])

  const progressPct = (stagesDone / PROGRESS_STAGES.length) * 100

  return (
    <div className="flex flex-col gap-y-4">
      {/* Gradient banner */}
      <div className="overflow-hidden rounded-3xl bg-white" style={{ boxShadow: SHADOW_MD }}>
        <div
          className="px-6 py-6 text-center text-white"
          style={{ background: "linear-gradient(105deg, #138a86 0%, #0f6b78 45%, #1c5b86 100%)" }}
        >
          <p className="text-sm font-semibold">Preparing your offer</p>
          {allDone ? (
            <p
              className="asc-scale-reveal text-[40px] font-extrabold leading-none transition-all duration-500"
              style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
              aria-live="polite"
              aria-label={`Offer amount: $${countUp.toLocaleString()}`}
            >
              ${countUp.toLocaleString()}
            </p>
          ) : (
            <p
              className="text-[40px] font-extrabold leading-none text-white/70"
              style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
              aria-label="Your offer amount is being calculated"
            >
              Preparing…
            </p>
          )}
          <p className="mt-1 text-sm">
            Repayment term <span className="font-bold">up to 12 months</span>
          </p>
        </div>

        {/* Underwriting progress */}
        <div className="px-5 py-4">
          {/* Overall status + ETA */}
          <div className="mb-1.5 flex items-center justify-between text-xs text-text-secondary">
            <span>{allDone ? "Analysis complete" : "Checking information…"}</span>
            <span className="font-bold text-neutral-800">
              {allDone ? "Done" : "ETA: 5 minutes"}
            </span>
          </div>

          {/* Single continuous progress line */}
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "#f0f3f4" }}
            role="progressbar"
            aria-valuenow={Math.round(progressPct)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Offer preparation progress"
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${reduceMotion ? progressPct : barWidth}%`,
                backgroundColor: "#128081",
                transition: reduceMotion
                  ? "width 500ms ease-out"
                  : `width ${totalDuration}ms linear`,
              }}
            />
          </div>

          {/* Stage checklist */}
          <div className="mt-4 flex flex-col gap-3">
            {PROGRESS_STAGES.map((stage, i) => {
              const done = i < stagesDone
              const active = i === stagesDone && !allDone
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  {done ? (
                    <span
                      className="flex size-5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#128081" }}
                    >
                      <HugeiconsIcon icon={Tick02SolidStandard} size={11} className="text-white" />
                    </span>
                  ) : active ? (
                    <Loader size="xxs" className="!h-5 size-5 shrink-0" />
                  ) : (
                    <span className="size-5 shrink-0 rounded-full border-2 border-dashed border-neutral-300" />
                  )}
                  <span
                    className={`text-sm transition-colors duration-200 ${
                      done ? "font-semibold text-neutral-800" : active ? "font-semibold text-neutral-800" : "text-text-secondary"
                    }`}
                  >
                    {stage.label}
                  </span>
                  {active && (
                    <span className="ml-auto text-xs text-text-secondary motion-safe:animate-pulse">In progress…</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {allDone ? (
        /* Offer ready — invite the founder into the full details */
        <div className="asc-enter rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
          <div className="mb-1 flex items-center gap-3">
            <BoxIcon
              icon={<HugeiconsIcon icon={Tick02SolidStandard} size={14} />}
              severity="accent-2"
              size={6}
            />
            <span className="text-base font-bold text-neutral-800">Your offer is ready</span>
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            See your full terms — amount, fee and how repayment works — before you decide. There&rsquo;s nothing to accept yet.
          </p>
          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={opening}
            onClick={handleViewOffer}
          >
            {opening ? (
              <>
                <Loader size="xxs" className="!h-auto" />
                Opening your offer…
              </>
            ) : (
              <>
                View your offer
                <HugeiconsIcon icon={ArrowRight01SolidStandard} size={18} />
              </>
            )}
          </Button>
        </div>
      ) : (
        /* What happens now — reassurance while underwriting runs */
        <div className="rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
          <div className="mb-2 flex items-center gap-3">
            <BoxIcon
              icon={<HugeiconsIcon icon={InformationCircleSolidRounded} size={14} />}
              severity="accent-11"
              size={6}
            />
            <span className="text-base font-bold text-neutral-800">What happens now?</span>
          </div>
          <p className="text-sm text-text-secondary">
            This usually takes just a few minutes — stay with us and your offer will appear right here. While you wait, you can verify your identity (scan the code on the right) to clear the final step before funding. If you need to step away, we&rsquo;ll text and email you the moment it&rsquo;s ready.
          </p>
        </div>
      )}
    </div>
  )
}

// ===========================================================================
// Screen 5 – "Your offer" full details
// ===========================================================================

const OFFER_GRADIENT =
  "linear-gradient(105deg, #138a86 0%, #0f6b78 45%, #1c5b86 100%)"

const usd = (n: number) => `$${n.toLocaleString()}`

// Shared offer numbers so every post-acceptance screen agrees
const OFFER = {
  amount: 40000,
  feePct: 8,
  fee: 3200,
  total: 43200,
  termMonths: 12,
  monthly: 3600,
  apr: "19.57%",
  initialRepaymentDay: 30,
}

// Compact range slider (mirrors the Term Loan offer module)
const OfferRangeSlider = ({
  min,
  max,
  value,
  onChange,
  disabled,
  step = 1000,
  ariaLabel = "Adjust amount",
}: {
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  disabled?: boolean
  step?: number
  ariaLabel?: string
}) => {
  const pct = Math.round(((value - min) / (max - min)) * 100)
  return (
    <div className="relative flex h-2 w-full items-center">
      <div className="absolute left-0 h-2 rounded-l-full transition-[width] duration-150 ease-out" style={{ width: `${pct}%`, backgroundColor: "#128081" }} aria-hidden />
      <div className="absolute h-2 rounded-r-full bg-neutral-300 transition-[left] duration-150 ease-out" style={{ left: `${pct}%`, right: 0 }} aria-hidden />
      <div className="absolute transition-[left] duration-150 ease-out" style={{ left: `calc(${pct}% - 9px)` }} aria-hidden>
        <div className="size-[18px] rounded-full border-2 border-white shadow-md transition-transform duration-100 active:scale-110" style={{ backgroundColor: "#128081" }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
        aria-label={ariaLabel}
      />
    </div>
  )
}

// On/off toggle switch (Figma "Amazon Automated Repayment")
const Toggle = ({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none ${
      checked ? "bg-brand-600" : "bg-neutral-300"
    } ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
)

// Right rail for the offer screen: balance chart + "Why we're better"
const WHY_BETTER: WhyBetterBullet[] = [
  // accent-11 (magenta)
  { icon: ChartUpSolidStandard, accentBg: "#fbecfd", accentBorder: "#f4ccfa", iconColor: "#cf5be1", text: "Able to scale with you, thanks to our $200M debt line" },
  // accent-brand (teal)
  { icon: CreditCardSolidStandard, accentBg: "#eaf6f6", accentBorder: "#c1e5e6", iconColor: "#1ebdc0", text: "Unlock more top-up funding as you repay" },
  // accent-6 (purple)
  { icon: Tag01SolidStandard, accentBg: "#f4f0fe", accentBorder: "#e0d5fb", iconColor: "#9a73f6", text: "Simple fixed fee" },
  // accent-2 (amber)
  { icon: UserGroupSolidStandard, accentBg: "#fff0d6", accentBorder: "#ffd68f", iconColor: "#ffac30", text: "Dedicated Customer Success Manager" },
  // accent-3 (blue)
  { icon: ArrowRightDoubleSolidStandard, accentBg: "#e5f5ff", accentBorder: "#c0e4fc", iconColor: "#37a7f1", text: "Payback through direct debits" },
]

const OfferRightRail = () => (
  <div className="flex w-[320px] flex-col gap-4">
    <BalanceChart title="What you'll owe over time" labels={["50k", "40k", "30k", "20k", "10k", "0"]} />
    <WhyWereBetter bullets={WHY_BETTER} />
  </div>
)

const OfferDetailsScreen = ({
  onAccept,
  readOnly = false,
}: {
  onAccept: () => void
  readOnly?: boolean
}) => {
  const [amount, setAmount] = useState(OFFER.amount)
  const [term, setTerm] = useState(OFFER.termMonths)
  const [autoRepay, setAutoRepay] = useState(true)

  const feePct = OFFER.feePct
  const fee = Math.round((amount * feePct) / 100)
  const total = amount + fee
  const monthly = Math.round(total / term)

  return (
    <div className="flex flex-col gap-y-4">
      <OfferHeroBanner
        caption="Your offer"
        amount={amount}
        description={
          <>
            This is a <strong>Term Loan</strong>. You can borrow up to {formatCurrency(OFFER.amount)} and
            pay a simple fixed fee — you&rsquo;ll repay in fixed equal instalments.
          </>
        }
      />

      <OfferExpiryNotice />

      {/* Capital */}
      <div className="overflow-hidden rounded-xl shadow-light-sm">
        <SectionCardHeader
          icon={<HugeiconsIcon icon={Invoice02SolidStandard} size={14} style={{ color: "#37a7f1" }} />}
          title="Capital"
          accentBg="#e5f5ff"
          accentBorder="#c0e4fc"
        />
        <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
          <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-light-sm">
            {/* Amazon Automated Repayment */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-800">Amazon Automated Repayment</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Amazon will automatically send the repayment amount to us. Any remaining balance from your payout will be disbursed into your bank account.{" "}
                  <a href="#" className="font-semibold text-text-link underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">
                    Learn how it works
                  </a>
                </p>
              </div>
              <Toggle checked={autoRepay} onChange={setAutoRepay} disabled={readOnly} label="Amazon Automated Repayment" />
            </div>

            <div className="h-px w-full bg-neutral-100" />

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-neutral-800">Amount</span>
              <span className="text-base font-bold text-neutral-800">{formatCurrency(amount)}</span>
            </div>
            <OfferRangeSlider min={10000} max={OFFER.amount} value={amount} onChange={setAmount} disabled={readOnly} ariaLabel="Capital amount" />
          </div>
        </div>
      </div>

      {/* Repayments */}
      <div className="overflow-hidden rounded-xl shadow-light-sm">
        <SectionCardHeader
          icon={<HugeiconsIcon icon={Calendar02SolidStandard} size={14} style={{ color: "#9a73f6" }} />}
          title="Repayments"
          accentBg="#f4f0fe"
          accentBorder="#e0d5fb"
        />
        <div className="flex flex-col gap-4 px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
          <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-light-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-neutral-800">Repayment term</span>
              <span className="flex h-9 min-w-[110px] items-center justify-center rounded-lg border border-neutral-300 px-3 text-sm font-bold text-neutral-800">
                {term} months
              </span>
            </div>
            <OfferRangeSlider min={3} max={12} step={1} value={term} onChange={setTerm} disabled={readOnly} ariaLabel="Repayment term in months" />
            <div className="h-px w-full bg-neutral-100" />
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-neutral-800">Repayment frequency</span>
              <span className="text-sm font-bold text-neutral-800">Every marketplace payout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Offer summary */}
      <div className="overflow-hidden rounded-xl shadow-light-sm">
        <SectionCardHeader
          icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} size={14} style={{ color: "#1f9d57" }} />}
          title="Offer summary"
          accentBg="#e7f8eb"
          accentBorder="#c9e9d0"
        />
        <div className="flex flex-col gap-4 bg-white px-5 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-800">Fixed fee ({feePct}%)</span>
            <span className="font-bold text-neutral-800">{formatCurrency(fee)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-800">Total repayable</span>
            <span className="font-bold text-neutral-800">{formatCurrency(total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-800">No early repayment fee</span>
            <PChip tone="success">New</PChip>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-neutral-800">{term} monthly repayments</span>
            <span className="font-bold text-neutral-800">
              {"$" + monthly.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      {readOnly ? (
        <Notice variant="brand" icon={<HugeiconsIcon icon={CheckmarkCircle02SolidRounded} />}>
          You&rsquo;ve accepted this offer. Continue with the steps on the left to receive your funds.
        </Notice>
      ) : (
        <>
          <Button type="button" variant="primary" fullWidth onClick={onAccept}>
            Accept your offer
          </Button>
          <p className="text-center text-xs text-text-secondary">
            Illustrative example for a prototype. Final terms are confirmed before you accept.
          </p>
        </>
      )}
    </div>
  )
}

// ===========================================================================
// Shared bits for the post-acceptance flow
// ===========================================================================

const ScreenHeader = ({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) => (
  <div>
    <h1
      className="text-[24px] font-extrabold leading-tight text-neutral-800"
      style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
    >
      {title}
    </h1>
    {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
  </div>
)

// "What happens next?" reassurance card (used on the signatory screen)
const WhatHappensNext = ({ items }: { items: string[] }) => (
  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
    <div className="border-b border-neutral-100 px-5 py-3">
      <p className="text-sm font-bold text-neutral-800">What happens next?</p>
    </div>
    <ul className="flex flex-col gap-4 px-5 py-4" style={{ backgroundColor: "#fbfaf9" }}>
      {items.map((line) => (
        <li key={line} className="flex items-start gap-3 text-sm text-neutral-800">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border" style={{ backgroundColor: "#eaf6f6", borderColor: "#c1e5e6" }}>
            <HugeiconsIcon icon={Tick02SolidStandard} size={16} style={{ color: "#1ebdc0" }} />
          </span>
          {line}
        </li>
      ))}
    </ul>
  </div>
)

// Agreement summary side card (signatory screen)
const AgreementSummaryCard = () => (
  <div className="w-[280px] overflow-hidden rounded-2xl bg-white" style={{ boxShadow: SHADOW_SM }}>
    <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
      <BoxIcon icon={<HugeiconsIcon icon={DocumentValidationSolidRounded} size={14} />} severity="accent-1" size={6} />
      <p className="text-sm font-bold text-neutral-800">Agreement summary</p>
    </div>
    <div className="flex flex-col gap-3 px-4 py-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary">Advance amount</span>
        <span className="font-bold text-neutral-800">{usd(OFFER.amount)}</span>
      </div>
      <div className="flex items-start justify-between">
        <span className="text-text-secondary">
          Fixed fee ({OFFER.feePct}%)
          <span className="block text-xs text-text-secondary">APR equivalent of {OFFER.apr}</span>
        </span>
        <span className="font-bold text-neutral-800">{usd(OFFER.fee)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-text-secondary">Repayment term</span>
        <span className="font-bold text-neutral-800">{OFFER.termMonths} months</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-text-secondary">Initial repayment</span>
        <span className="font-bold text-neutral-800">On day {OFFER.initialRepaymentDay}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-text-secondary">{OFFER.termMonths} monthly repayments</span>
        <span className="font-bold text-neutral-800">{usd(OFFER.monthly)}</span>
      </div>
    </div>
  </div>
)

// ===========================================================================
// Screen 6 – Agreement signatory (sequential signing via Dropbox Sign)
// Figma 2490:10040 / 2490:10086 / 2264:21215
// ===========================================================================

const AGREEMENTS = [
  { id: "disclosure", name: "Disclosure" },
  { id: "loan", name: "Loan Agreement" },
  { id: "amazon", name: "Amazon Automated Repayment Enrollment" },
]

const SignatoryScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [signedCount, setSignedCount] = useState(0)
  const [activeDoc, setActiveDoc] = useState<number | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const allSigned = signedCount >= AGREEMENTS.length

  return (
    <div className="flex flex-col gap-y-4">
      <ScreenHeader title="Agreement signatory" />

      <WhatHappensNext
        items={[
          "Review and sign the agreements on our partner site, Dropbox Sign.",
          "We will complete our due diligence checks.",
          "Your funds will be available in your account to start spending once your application has been approved.",
        ]}
      />

      {/* To sign */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
        <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3">
          <BoxIcon icon={<HugeiconsIcon icon={PencilEdit02SolidRounded} size={14} />} severity="accent-9" size={6} />
          <p className="text-sm font-bold text-neutral-800">To sign</p>
        </div>
        <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
          <ul className="flex flex-col gap-5 rounded-xl bg-white p-4 shadow-light-sm">
            {AGREEMENTS.map((doc, i) => {
              const signed = i < signedCount
              const current = i === signedCount && !allSigned
              const locked = i > signedCount
              return (
                <li key={doc.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold ${locked ? "text-text-secondary" : "text-neutral-800"}`}>
                      {doc.name}
                    </p>
                    <div className="mt-1">
                      {signed ? (
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#f1f9f9", borderColor: "#c1e5e6", color: "#128081" }}>
                          <HugeiconsIcon icon={Tick02SolidStandard} size={11} />
                          Signed
                        </span>
                      ) : current ? (
                        <span className="inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold text-text-secondary" style={{ backgroundColor: "#ffffff", borderColor: "#d7dee0" }}>
                          Pending signature
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium text-text-secondary" style={{ backgroundColor: "#ffffff", borderColor: "#d7dee0" }}>
                          Available after {AGREEMENTS[i - 1].name} is signed
                        </span>
                      )}
                    </div>
                  </div>
                  {signed ? (
                    <HugeiconsIcon icon={CheckmarkCircle02SolidRounded} size={22} className="shrink-0" style={{ color: "#1ebdc0" }} />
                  ) : current ? (
                    <Button type="button" variant="primary" onClick={() => setActiveDoc(i)}>
                      Sign
                    </Button>
                  ) : (
                    <HugeiconsIcon icon={LockSolidRounded} size={20} className="shrink-0 text-neutral-400" aria-label="Locked" />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {allSigned && (
        <div className="asc-enter">
          <Notice variant="brand" icon={<HugeiconsIcon icon={CheckmarkCircle02SolidRounded} />}>
            <div className="flex items-center gap-2">
              <span>All agreements signed — taking you to verify your identity…</span>
              {redirecting && <Loader size="xxs" className="!h-auto shrink-0" />}
            </div>
            <button
              type="button"
              onClick={onComplete}
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-text-link underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm"
            >
              Continue now
              <HugeiconsIcon icon={ArrowRight01SolidStandard} size={16} />
            </button>
          </Notice>
        </div>
      )}

      {activeDoc !== null && (
        <DropboxSignModal
          docName={AGREEMENTS[activeDoc].name}
          onClose={() => setActiveDoc(null)}
          onSigned={() => {
            const next = (activeDoc ?? 0) + 1
            setSignedCount((c) => Math.max(c, next))
            setActiveDoc(null)
            // Last document just signed: show the confirmation, then auto-advance
            if (next >= AGREEMENTS.length) {
              setRedirecting(true)
              window.setTimeout(onComplete, 1300)
            }
          }}
        />
      )}
    </div>
  )
}

// Dropbox Sign embedded modal (sandbox-safe mock of the partner signing surface)
const DropboxSignModal = ({
  docName,
  onClose,
  onSigned,
}: {
  docName: string
  onClose: () => void
  onSigned: () => void
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    dialogRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Sign ${docName} via Dropbox Sign`}
        className="flex max-h-[88vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dropbox Sign chrome */}
        <div className="flex items-center justify-between bg-neutral-900 px-5 py-3 text-white">
          <span className="text-sm font-semibold">Dropbox Sign</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close signing window"
            className="rounded-md p-1.5 text-white/80 transition-colors hover:bg-white/10 focus-visible:shadow-[0_0_0_2px_#ffffff80] focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Document preview (fictional, sandbox-safe) */}
        <div className="flex-1 overflow-auto bg-neutral-100 px-6 py-6">
          <div className="mx-auto max-w-[560px] rounded-lg bg-white p-8 text-neutral-800 shadow-sm">
            <p className="text-center text-lg font-extrabold" style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}>
              uncapped
            </p>
            <p className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-neutral-700">
              {docName}
            </p>
            <div className="mt-4 space-y-2">
              {[100, 92, 96, 80, 100, 88].map((w, idx) => (
                <div key={idx} className="h-2 rounded bg-neutral-200" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-6 rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center text-xs text-text-secondary">
              Your signature will be applied here
            </div>
          </div>
        </div>

        {/* Sign action */}
        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-3">
          <span className="text-xs text-text-secondary">
            Signing as the authorised signatory for this business.
          </span>
          <Button type="button" variant="primary" onClick={onSigned}>
            Sign document
          </Button>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Screen 7 – Verify identity (Sumsub WebSDK)
// Figma 2264:21293 (placeholder only — built out here)
//
// PRODUCTION INTEGRATION (for engineering — not run in this sandbox):
//   1. Backend mints a short-lived access token:
//        POST https://api.sumsub.com/resources/accessTokens/sdk
//        body: { userId, levelName: "basic-kyc-level", ttlInSecs: 600 }
//      (App Token + secret signed server-side; never expose the secret client-side.)
//   2. Client renders the official React wrapper:
//        import SumsubWebSdk from "@sumsub/websdk-react"
//        <SumsubWebSdk
//          accessToken={token}
//          expirationHandler={() => fetchFreshToken()}   // returns a Promise<string>
//          config={{ lang: "en" }}
//          options={{ addViewportTag: false, adaptIframeHeight: true }}
//          onMessage={(type, payload) => {
//            // type === "idCheck.onApplicantStatusChanged" → read payload.reviewStatus
//            // "completed" + reviewResult.reviewAnswer === "GREEN" → mark verified
//          }}
//          onError={(e) => reportError(e)}
//        />
//   3. The SDK renders ID-capture + liveness inside its own iframe; we only react
//      to status messages and advance the flow when the applicant is approved.
//
// The block below is a sandbox-safe SIMULATION of that embedded experience so the
// prototype can demo the full flow without contacting Sumsub.
// ===========================================================================

type KycPhase = "intro" | "mobile" | "verifying" | "done"

const VerifyIdentityScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<KycPhase>("intro")
  const done = phase === "done"

  // Simulate Sumsub running its checks, then auto-advance once verified
  useEffect(() => {
    if (phase === "verifying") {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const t = window.setTimeout(() => setPhase("done"), reduce ? 0 : 2600)
      return () => window.clearTimeout(t)
    }
    if (phase === "done") {
      const t = window.setTimeout(onComplete, 1300)
      return () => window.clearTimeout(t)
    }
  }, [phase, onComplete])

  return (
    <div className="flex flex-col gap-y-4">
      <ScreenHeader
        title="Verify identity"
        subtitle="Use our secure verification partner Sumsub to confirm your identity. Continuing on your phone is the easiest way to complete these steps."
      />

      {/* Region where the Sumsub WebSDK iframe is mounted (simulated below) */}
      <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-neutral-200 bg-white p-6" style={{ boxShadow: SHADOW_SM }}>
        <SumsubWidget phase={phase} setPhase={setPhase} />
      </div>

      {/* Auto-advances once Sumsub reports success; manual fallback below */}
      <div className="flex items-center justify-end gap-3">
        {done && (
          <span className="flex items-center gap-2 text-sm text-text-secondary">
            <Loader size="xxs" className="!h-auto shrink-0" />
            Taking you to withdraw your funds…
          </span>
        )}
        <Button type="button" variant="primary" disabled={!done} onClick={onComplete}>
          {done ? "Continue now" : "Complete"}
        </Button>
      </div>
    </div>
  )
}

// Sumsub-style embedded widget — visually mimics the Sumsub WebSDK surface
// (neutral chrome, dark "Switch to mobile" CTA, "Powered by Sumsub" footer).
// Sandbox-safe: no real SDK; buttons drive a simulated success path.
const SumsubWidget = ({
  phase,
  setPhase,
}: {
  phase: KycPhase
  setPhase: (p: KycPhase) => void
}) => (
  <div className="w-full max-w-[360px] rounded-xl border border-neutral-200 bg-white px-6 py-6 shadow-sm">
    {phase === "intro" && (
      <div className="flex flex-col">
        <p className="text-center text-base font-bold text-neutral-900">Let&rsquo;s get you verified</p>
        <p className="mt-1 text-center text-xs text-neutral-500">Follow the simple steps below</p>

        <div className="mt-6 flex flex-col gap-4">
          <SumsubStep n={1} icon={IdentityCardSolidRounded} label="Provide an identity document" />
          <SumsubStep n={2} icon={FaceIdSolidRounded} label="Get ready for a live face scan" />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setPhase("verifying")}
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
          >
            Continue on desktop
          </button>
          <button
            type="button"
            onClick={() => setPhase("mobile")}
            className="flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
            style={{ backgroundColor: "#193a43" }}
          >
            Switch to mobile
          </button>
        </div>

        <SumsubFooter />
      </div>
    )}

    {phase === "mobile" && (
      <div className="flex flex-col items-center text-center">
        <p className="text-base font-bold text-neutral-900">Continue on your phone</p>
        <p className="mt-1 text-xs text-neutral-500">Scan this code to pick up where you left off.</p>
        <div className="my-5 flex size-[150px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50" role="img" aria-label="QR code (prototype)">
          <div className="grid grid-cols-5 grid-rows-5 gap-0.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className={`size-3 rounded-[1px] ${[0,1,2,4,5,8,10,12,14,16,18,20,21,22,24].includes(i) ? "bg-neutral-800" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPhase("verifying")}
          className="text-sm font-semibold text-brand-600 underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm"
        >
          I&rsquo;ve finished on my phone
        </button>
        <SumsubFooter />
      </div>
    )}

    {phase === "verifying" && (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Loader size="sm" />
        <div>
          <p className="text-base font-bold text-neutral-900">Verifying your identity…</p>
          <p className="mt-1 text-xs text-neutral-500">This only takes a moment. Please don&rsquo;t close this window.</p>
        </div>
        <SumsubFooter />
      </div>
    )}

    {phase === "done" && (
      <div className="asc-enter flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: "#eaf6f6" }}>
          <HugeiconsIcon icon={CheckmarkCircle02SolidRounded} size={28} style={{ color: "#1ebdc0" }} />
        </span>
        <div>
          <p className="text-base font-bold text-neutral-900">Identity verified</p>
          <p className="mt-1 text-xs text-neutral-500">Thanks — that&rsquo;s the security check done.</p>
        </div>
        <SumsubFooter />
      </div>
    )}
  </div>
)

const SumsubStep = ({ n, icon, label }: { n: number; icon: typeof IdentityCardSolidRounded; label: string }) => (
  <div className="flex items-center gap-3">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
      <HugeiconsIcon icon={icon} size={18} />
    </span>
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">Step {n}</p>
      <p className="text-sm font-semibold text-neutral-800">{label}</p>
    </div>
  </div>
)

const SumsubFooter = () => (
  <div className="mt-5 flex items-center justify-center gap-1 text-[11px] text-neutral-400">
    Powered by
    <span className="inline-flex items-center gap-1 font-bold text-neutral-600">
      <span className="size-2 rounded-full" style={{ backgroundColor: "#1ebdc0" }} />
      sumsub
    </span>
  </div>
)

// ===========================================================================
// Screen 8 – Withdraw funds: confirm bank account
// Figma 2481:9625
// ===========================================================================

const WithdrawScreen = ({ onSubmit }: { onSubmit: () => void }) => {
  const [acct, setAcct] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const digits = acct.replace(/\D/g, "")
  const valid = digits.length >= 3 && digits.slice(-3) === "920"

  const handleSubmit = () => {
    setSubmitting(true)
    window.setTimeout(onSubmit, 900)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <ScreenHeader
        title="Withdraw your cash"
        subtitle="Funds can only be sent to the bank account linked to your Amazon seller account. Confirm the account ending in 920 to submit."
      />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
        <div className="flex items-center gap-2 border-b border-neutral-100 px-5 py-3">
          <BoxIcon icon={<HugeiconsIcon icon={BankSolidRounded} size={14} />} severity="accent-1" size={6} />
          <p className="text-sm font-bold text-neutral-800">Confirm your bank account</p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
            <span className="text-sm font-semibold text-neutral-800">Advance amount</span>
            <span className="text-base font-extrabold text-neutral-800">{usd(OFFER.amount)}</span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#1462d6] text-white">
              <HugeiconsIcon icon={BankSolidRounded} size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-800">Chase Bank</p>
              <p className="text-xs text-text-secondary">Account ending ••••920</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-600">
              <HugeiconsIcon icon={Tick02SolidStandard} size={11} />
              Linked with Amazon
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm-acct" className="text-sm font-semibold text-neutral-800">
              Confirm bank account number
            </label>
            <input
              id="confirm-acct"
              inputMode="numeric"
              autoComplete="off"
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              placeholder="Account number ending 920"
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-800 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-600 focus:shadow-[0_0_0_3px_#eaf6f6]"
            />
            {acct.length > 0 && !valid && (
              <span className="text-xs text-text-error">
                This should match your linked account ending in 920.
              </span>
            )}
          </div>
        </div>
      </div>

      <Notice
        variant="info"
        icon={<HugeiconsIcon icon={InformationCircleSolidRounded} />}
      >
        To send funds to a different account, please{" "}
        <a href="#" className="font-semibold text-text-link underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">
          contact our support team
        </a>
        .
      </Notice>

      <div className="flex justify-end">
        <Button type="button" variant="primary" disabled={!valid || submitting} onClick={handleSubmit}>
          {submitting ? (
            <>
              <Loader size="xxs" className="!h-auto" />
              Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  )
}

// ===========================================================================
// Screen 10 – Dashboard (submitted-but-pending state)
// Figma 2600:12168 — user lands here after submitting the withdrawal.
// Hero shows the signed agreement + "completing final verification checks".
// ===========================================================================

const DASH_NAV: { id: string; label: string; icon: typeof Home01SolidRounded; severity: string; active?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home01SolidRounded, severity: "accent-1", active: true },
  { id: "agreements", label: "Agreements", icon: MoneyBag02SolidRounded, severity: "accent-3" },
  { id: "transactions", label: "Transactions", icon: ArrowDataTransferHorizontalSolidRounded, severity: "accent-6" },
  { id: "connections", label: "Connections", icon: Analytics01SolidRounded, severity: "accent-2" },
]

const DASH_STATUS = [
  { title: "Application submitted", desc: "We’ve received all the needed information.", state: "done" as const },
  { title: "Final verification checks", desc: "Our team is running the last checks. Usually done within 24 hours.", state: "active" as const },
  { title: "Funds released", desc: "We send your advance to your linked bank account. Funds typically arrive within 1 business day.", state: "todo" as const },
]

const DashboardScreen = () => {
  const stepsDone = DASH_STATUS.filter((s) => s.state === "done").length
  const progressPct = (stepsDone / DASH_STATUS.length) * 100

  return (
    <div className="mx-auto flex w-full max-w-[1320px] gap-12 px-6 py-10 lg:px-10">
      {/* Product sidebar */}
      <aside className="hidden w-[240px] shrink-0 flex-col lg:flex" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="px-2 pb-6 pt-1">
          <Logo link={false} className="h-7 w-auto" />
        </div>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {DASH_NAV.map((item) => (
            <div
              key={item.id}
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${item.active ? "bg-white" : ""}`}
              style={item.active ? { boxShadow: SHADOW_SM } : undefined}
            >
              <BoxIcon icon={<HugeiconsIcon icon={item.icon} size={14} />} severity={item.severity as never} size={6} />
              <span className={`text-base ${item.active ? "font-semibold text-neutral-800" : "text-text-secondary"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 pt-6">
          <div className="flex items-center gap-2 px-2 py-2">
            <BoxIcon icon={<HugeiconsIcon icon={UserMultiple02SolidRounded} size={14} />} severity="accent-1" size={6} />
            <span className="text-sm font-semibold text-neutral-800">Gaston Express</span>
          </div>
          <button
            type="button"
            onClick={() => window.location.assign("/prototypes/asc-sole-prop")}
            className="flex h-[38px] items-center gap-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none"
          >
            <BoxIcon icon={<HugeiconsIcon icon={RefreshSolidStandard} size={16} />} severity="accent-2" size={6} />
            <span className="px-2 text-base text-neutral-800">Restart prototype</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="asc-enter flex w-full min-w-0 flex-1 flex-col gap-4">
        {/* Hero + verification status */}
        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: SHADOW_MD }}>
          <div className="px-6 py-6 text-center text-white" style={{ background: OFFER_GRADIENT }}>
            <p className="text-sm font-semibold opacity-90">Your agreement is signed</p>
            <p className="text-[40px] font-extrabold leading-none" style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}>
              {usd(OFFER.amount)}
            </p>
          </div>

          <div className="px-5 py-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-base font-bold text-neutral-800">Completing final verification checks</span>
              <span className="text-sm text-text-secondary">
                ETA: <span className="font-bold text-neutral-800">24 hours</span>
              </span>
            </div>

            {/* continuous progress bar */}
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "#f0f3f4" }}
              role="progressbar"
              aria-valuenow={Math.round(progressPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Verification progress"
            >
              <div className="h-full rounded-full" style={{ width: `${progressPct}%`, backgroundColor: "#128081" }} />
            </div>

            {/* status checklist */}
            <ul className="mt-5 flex flex-col gap-5">
              {DASH_STATUS.map((step) => (
                <li key={step.title} className="flex items-start gap-3">
                  {step.state === "done" ? (
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#128081" }}>
                      <HugeiconsIcon icon={Tick02SolidStandard} size={13} className="text-white" />
                    </span>
                  ) : step.state === "active" ? (
                    <Loader size="xxs" className="mt-0.5 !h-6 size-6 shrink-0" />
                  ) : (
                    <span className="mt-0.5 size-6 shrink-0 rounded-full border-2 border-dashed border-neutral-300" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800">{step.title}</p>
                    <p className="mt-0.5 text-sm text-text-secondary">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* We'll keep you posted */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white" style={{ boxShadow: SHADOW_SM }}>
          <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-3">
            <BoxIcon icon={<HugeiconsIcon icon={Message02SolidRounded} size={14} />} severity="accent-6" size={6} />
            <p className="text-sm font-bold text-neutral-800">We&rsquo;ll keep you posted</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-text-secondary">
              This will normally take 24 hours. We&rsquo;ll notify you by email once completed. If you need to change any information, please contact{" "}
              <a href="#" className="font-semibold text-text-link underline-offset-2 hover:underline focus-visible:shadow-[0_0_0_2px_#a5d3d4] focus:outline-none rounded-sm">
                support@weareuncapped.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// ID Verification card (parallel side card, Sumsub-powered)
const IdVerificationCard = () => (
  <div
    className="w-[280px] overflow-hidden rounded-2xl bg-white"
    style={{ boxShadow: SHADOW_SM }}
  >
    <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
      <BoxIcon
        icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={14} />}
        severity="accent-1"
        size={6}
      />
      <p className="text-sm font-bold text-neutral-800">ID Verification</p>
    </div>
    <div className="flex flex-col items-center gap-3 px-4 py-4 text-center">
      <p className="text-sm text-text-secondary">
        While you wait for your offer, scan this code with your phone to verify your identity, powered by Sumsub. It takes about 2 minutes and clears the final step before funding.
      </p>
      {/* Placeholder QR code (fictional, sandbox-safe) */}
      <div
        className="flex size-[120px] items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
        role="img"
        aria-label="QR code for ID verification (fictional demo)"
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* QR code grid — fictional/placeholder */}
          {[0,1,2,3,4,5,6].map((row) =>
            [0,1,2,3,4,5,6].map((col) => {
              // Position finder patterns + random interior
              const inTopLeft = row < 3 && col < 3
              const inTopRight = row < 3 && col > 3
              const inBottomLeft = row > 3 && col < 3
              const filled = inTopLeft || inTopRight || inBottomLeft ||
                ((row + col * 3 + row * col) % 3 === 0)
              return filled ? (
                <rect
                  key={`${row}-${col}`}
                  x={col * 13 + 4}
                  y={row * 13 + 4}
                  width={11}
                  height={11}
                  rx={1.5}
                  fill="#193a43"
                />
              ) : null
            })
          )}
        </svg>
      </div>
      <p className="text-xs text-text-secondary">Powered by Sumsub</p>
      <Button type="button" variant="secondary" fullWidth>
        Continue on this device
      </Button>
    </div>
  </div>
)

export default AscSoleProp
