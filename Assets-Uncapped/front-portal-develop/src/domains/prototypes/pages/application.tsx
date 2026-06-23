import { useState, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RefreshSolidStandard,
  Tick02SolidStandard,
  ArrowRight01SolidStandard,
  ArrowDown01SolidStandard,
  UserShield01SolidStandard,
  Analytics01SolidStandard,
  CreditCardSolidStandard,
  HelpCircleSolidStandard,
  Search01SolidStandard,
  Building06SolidStandard,
  Mail01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { ShoppingCart01StrokeStandard } from "@hugeicons-pro/core-stroke-standard"
import {
  Call02SolidRounded,
  UserMultiple02SolidRounded,
  InformationCircleSolidRounded,
  MoneySecuritySolidRounded,
  SecurityCheckSolidRounded,
  FlashSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"
import { ReactComponent as AmazonLogo } from "../../../svgs/partners/connections/amazon.svg"
import { ReactComponent as ShopifyLogo } from "../../../svgs/brands/shopify.svg"
import { ReactComponent as StripeLogo } from "../../../svgs/brands/stripe.svg"

// ---------------------------------------------------------------------------
// Sandbox-safe application flow: Bank accounts → Revenue sources →
// Applicant information → Review & submit. Picks up after Registration /
// Eligibility (registration.tsx) and hands off to Underwriting → Offer.
// Figma: Main-Product-File · Application board 5:11503
// ---------------------------------------------------------------------------

const SHADOW_SM = "0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)"
const SHADOW_MD = "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)"

type Step = "bank" | "revenue" | "applicant" | "review"
const STEP_ORDER: Step[] = ["bank", "revenue", "applicant", "review"]

const STEPS: { id: Step; label: string }[] = [
  { id: "bank", label: "Bank accounts" },
  { id: "revenue", label: "Revenue sources" },
  { id: "applicant", label: "Application details" },
  { id: "review", label: "Your application" },
]

const BANKS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "Barclays",
]

const inputBase =
  "h-11 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-neutral-500 transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200 border-neutral-300"

const readStep = (): Step => {
  if (typeof window === "undefined") return "bank"
  const h = window.location.hash.replace("#", "") as Step
  return STEP_ORDER.includes(h) ? h : "bank"
}

// ===========================================================================
// Root
// ===========================================================================

const Application = () => {
  const [step, setStep] = useState<Step>(readStep)
  const [bankDone, setBankDone] = useState(false)
  const [revenueDone, setRevenueDone] = useState(false)
  const [applicantDone, setApplicantDone] = useState(false)

  useEffect(() => {
    const target = `#${step}`
    if (window.location.hash !== target)
      window.history.replaceState(null, "", target)
  }, [step])

  useEffect(() => {
    const handler = () => setStep(readStep())
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  const go = (s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto flex w-full max-w-[1320px] gap-12 px-6 py-10 lg:px-10">
        <Sidebar step={step} onGo={go} />
        <div className="flex w-full min-w-0 flex-1 justify-between gap-10">
          <main
            className={`w-full min-w-0 flex-1 ${
              step === "applicant" ? "lg:max-w-[480px]" : "lg:max-w-[680px]"
            }`}
          >
            {step === "bank" && (
              <BankStep
                done={bankDone}
                setDone={setBankDone}
                onContinue={() => go("revenue")}
              />
            )}
            {step === "revenue" && (
              <RevenueStep
                done={revenueDone}
                setDone={setRevenueDone}
                onBack={() => go("bank")}
                onContinue={() => go("applicant")}
              />
            )}
            {step === "applicant" && (
              <ApplicantStep
                onBack={() => go("revenue")}
                onContinue={() => {
                  setApplicantDone(true)
                  go("review")
                }}
              />
            )}
            {step === "review" && (
              <ReviewStep onBack={() => go("applicant")} />
            )}
          </main>
          <aside className="hidden shrink-0 flex-col items-end gap-4 lg:flex">
            <TopActions />
            {step === "applicant" && <CreditDataCard />}
          </aside>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Shell: flush left stepper sidebar + top-right actions + right rail
// ===========================================================================

const Sidebar = ({ step, onGo }: { step: Step; onGo: (s: Step) => void }) => {
  const currentIdx = STEP_ORDER.indexOf(step)
  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col lg:flex"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <div className="px-2 pb-6 pt-1">
        <Logo link={false} className="h-7 w-auto" />
      </div>
      <nav className="flex flex-col gap-1">
        {STEPS.map((s, i) => (
          <NavStep
            key={s.id}
            label={s.label}
            status={
              i < currentIdx ? "done" : i === currentIdx ? "active" : "todo"
            }
            onClick={i <= currentIdx ? () => onGo(s.id) : undefined}
          />
        ))}
        {/* Offer step — plain stroke cart (no tile) until offers exist */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <HugeiconsIcon
            icon={ShoppingCart01StrokeStandard}
            size={18}
            className="shrink-0 text-neutral-500"
          />
          <span className="flex-1 text-base text-text-secondary">Your offers</span>
          <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs font-bold text-text-secondary">
            0
          </span>
        </div>
      </nav>
      <div className="mt-auto pt-6">
        <button
          type="button"
          onClick={() => window.location.assign("/prototypes/registration")}
          className="flex h-[38px] items-center gap-1 rounded-lg px-2 transition-colors hover:bg-neutral-100"
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
  onClick,
}: {
  label: string
  status: "done" | "active" | "todo"
  onClick?: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-all ${
      onClick ? "hover:bg-neutral-100" : "cursor-default"
    } ${status === "active" ? "bg-white" : ""}`}
    style={status === "active" ? { boxShadow: SHADOW_SM } : undefined}
  >
    <StatusDot status={status} />
    <span
      className={`text-base ${
        status === "todo" ? "text-text-secondary" : "text-neutral-800"
      }`}
    >
      {label}
    </span>
  </button>
)

const StatusDot = ({ status }: { status: "done" | "active" | "todo" }) => {
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
  return (
    <span
      className="size-4 shrink-0 rounded-full border border-dashed"
      style={{ borderColor: "#879092" }}
    />
  )
}

// Top-right quick actions only — the application screens have no right rail.
const TopActions = () => (
  <div className="hidden shrink-0 items-start gap-1 pt-1 lg:flex">
    <QuickAction
      icon={<HugeiconsIcon icon={Call02SolidRounded} size={14} />}
      severity="accent-1"
      label="Book a call"
    />
    <QuickAction
      icon={<HugeiconsIcon icon={UserMultiple02SolidRounded} size={14} />}
      severity="accent-9"
      label="Invite team"
    />
  </div>
)

const QuickAction = ({
  icon,
  severity,
  label,
}: {
  icon: React.ReactNode
  severity: string
  label: string
}) => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-100"
  >
    <BoxIcon icon={icon} severity={severity as never} size={6} />
    {label}
  </button>
)

// ===========================================================================
// Shared atoms
// ===========================================================================

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`rounded-2xl bg-white p-4 ${className}`} style={{ boxShadow: SHADOW_SM }}>
    {children}
  </div>
)

const PageHeading = ({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) => (
  <div className="mb-6">
    <h1
      className="text-[40px] font-bold leading-tight text-neutral-800"
      style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
    >
      {title}
    </h1>
    {subtitle && (
      <p className="mt-2 text-base text-text-secondary">{subtitle}</p>
    )}
  </div>
)

const SectionHeader = ({
  icon,
  severity,
  title,
  right,
}: {
  icon: React.ReactNode
  severity: string
  title: string
  right?: React.ReactNode
}) => (
  <div className="mb-4 flex items-center gap-3">
    <BoxIcon icon={icon} severity={severity as never} size={6} />
    <p className="flex-1 text-base font-bold text-neutral-800">{title}</p>
    {right}
  </div>
)

const InlineNotice = ({
  children,
  variant = "info",
}: {
  children: React.ReactNode
  variant?: "info" | "warning" | "brand"
}) => {
  const styles: Record<string, { bg: string; border: string; color: string }> = {
    info: { bg: "#e5f5ff", border: "#c0e4fc", color: "#1779b8" },
    warning: { bg: "#fff6e5", border: "#ffd68f", color: "#9e5700" },
    brand: { bg: "#eaf6f6", border: "#c1e5e6", color: "#128081" },
  }
  const s = styles[variant]
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 text-sm"
      style={{ backgroundColor: s.bg, borderColor: s.border, color: s.color }}
    >
      <HugeiconsIcon
        icon={InformationCircleSolidRounded}
        size={18}
        className="mt-0.5 shrink-0"
      />
      <span>{children}</span>
    </div>
  )
}

// ===========================================================================
// Step 1 — Bank accounts (Plaid)
// ===========================================================================

const BANK_FAQS = [
  {
    q: "Why do I need to connect bank accounts to Uncapped?",
    a: "We use your banking data to verify your business and calculate an accurate, fair offer. The more revenue accounts you connect, the better your offer can be.",
  },
  {
    q: "How do you secure my data?",
    a: "We connect through trusted providers like Plaid using bank-level encryption. Access is read-only — we can see your transactions to build your offer, but we can never move your money.",
  },
  {
    q: "What can I do if my bank isn't available?",
    a: "If we can't connect your bank automatically, you can upload recent statements instead, or your account manager can help you connect manually.",
  },
]

const BankStep = ({
  done,
  setDone,
  onContinue,
}: {
  done: boolean
  setDone: (v: boolean) => void
  onContinue: () => void
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  return (
    <>
      <PageHeading
        title="Bank accounts"
        subtitle="Connect all the bank accounts you've used to run your business in the last 12 months. Starting with accounts used to receive revenue."
      />

      {/* outer card: revenue + connector + bank connections all live inside one card */}
      <div
        className="rounded-3xl p-5"
        style={{ backgroundColor: "#f9f7f6", border: "1px solid #ece8e4", boxShadow: SHADOW_SM }}
      >
        {/* monthly revenue — white card, teal border */}
        <div
          className="flex items-center gap-3 rounded-2xl border bg-white p-3"
          style={{ borderColor: "#c1e5e6" }}
        >
          <BoxIcon
            icon={<HugeiconsIcon icon={Analytics01SolidStandard} size={14} />}
            severity="accent-1"
            size={6}
          />
          <span className="text-base text-neutral-800">
            Your monthly revenue: <span className="font-bold">$150,000</span>
          </span>
        </div>

        {/* connector with a vertical line */}
        <div className="flex flex-col items-center">
          <span className="h-4 w-px" style={{ backgroundColor: "#a5d3d4" }} />
          <p className="py-1 text-base font-bold text-neutral-800">
            Where do sales payouts go?
          </p>
          <span className="h-3 w-px" style={{ backgroundColor: "#a5d3d4" }} />
          <HugeiconsIcon
            icon={ArrowDown01SolidStandard}
            size={18}
            className="-mt-1"
            style={{ color: "#a5d3d4" }}
          />
        </div>

        {/* bank connections — white card inside the outer card */}
        <div className="mt-1 overflow-hidden rounded-2xl bg-white" style={{ boxShadow: SHADOW_SM }}>
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <BoxIcon
              icon={<HugeiconsIcon icon={CreditCardSolidStandard} size={14} />}
              severity="accent-1"
              size={6}
            />
            <span className="text-base font-bold text-neutral-800">
              Bank connections
            </span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
          >
            Connect a bank
          </Button>
        </div>
        <div className="bg-[#fbfaf9] p-6">
          {done ? (
            <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 items-center justify-center rounded-lg text-sm font-bold text-neutral-800"
                  style={{ backgroundColor: "#f0f3f4", border: "1px solid #d7dee0" }}
                >
                  C
                </span>
                <div>
                  <p className="text-base font-semibold text-neutral-800">Chase</p>
                  <p className="text-sm text-text-secondary">
                    Business checking ···4821
                  </p>
                </div>
              </div>
              <span
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ backgroundColor: "#eaf6f6", color: "#128081" }}
              >
                <HugeiconsIcon icon={Tick02SolidStandard} size={12} /> Connected
              </span>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <BoxIcon
                  icon={<HugeiconsIcon icon={MoneySecuritySolidRounded} size={24} />}
                  severity="accent-1"
                  size={10}
                />
              </div>
              <p className="text-base font-bold text-neutral-800">
                Bank-Level Security
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Your data is encrypted and secure. We use secure connection
                providers trusted by millions of users worldwide.
              </p>
            </div>
          )}
        </div>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 text-sm font-bold text-brand-600 hover:underline"
      >
        Banks from other countries
      </button>

      <div className="mt-4">
        <Card>
          <SectionHeader
            icon={<HugeiconsIcon icon={HelpCircleSolidStandard} size={14} />}
            severity="accent-3"
            title="Bank Connection FAQs"
          />
          <div className="flex flex-col">
            {BANK_FAQS.map((f, i) => (
              <div key={f.q} className="border-b border-neutral-100 last:border-0">
                <button
                  type="button"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left"
                >
                  <span className="text-base font-semibold text-neutral-800">
                    {f.q}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowDown01SolidStandard}
                    size={18}
                    className={`shrink-0 text-neutral-400 transition-transform ${
                      faqOpen === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {faqOpen === i && (
                  <p className="pb-3 text-sm text-text-secondary">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="button"
          variant="primary"
          onClick={onContinue}
          disabled={!done}
        >
          I've connected all my business banks
        </Button>
      </div>

      {modalOpen && (
        <PlaidModal
          onClose={() => setModalOpen(false)}
          onConnected={() => {
            setDone(true)
            setModalOpen(false)
          }}
        />
      )}
    </>
  )
}

// Mock Plaid flow — consent → pick bank → connecting → done. Fully offline.
const PlaidModal = ({
  onClose,
  onConnected,
}: {
  onClose: () => void
  onConnected: () => void
}) => {
  const [phase, setPhase] = useState<"consent" | "pick" | "connecting">(
    "consent"
  )

  useEffect(() => {
    if (phase !== "connecting") return
    const t = setTimeout(onConnected, 1600)
    return () => clearTimeout(t)
  }, [phase, onConnected])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(25,58,67,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl bg-white p-6"
        style={{ boxShadow: SHADOW_MD }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-bold tracking-wide text-neutral-800">
            Plaid
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-text-secondary hover:text-neutral-800"
          >
            Close
          </button>
        </div>

        {phase === "consent" && (
          <>
            <p className="text-lg font-bold text-neutral-800">
              Uncapped uses Plaid to connect your account
            </p>
            <ul className="my-4 flex flex-col gap-3">
              {[
                "Connect in seconds with thousands of banks",
                "Your data is encrypted and read-only",
                "Plaid never sells your personal information",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-neutral-800">
                  <HugeiconsIcon
                    icon={Tick02SolidStandard}
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: "#128081" }}
                  />
                  {t}
                </li>
              ))}
            </ul>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => setPhase("pick")}
            >
              Continue
            </Button>
          </>
        )}

        {phase === "pick" && (
          <>
            <p className="mb-3 text-lg font-bold text-neutral-800">
              Select your bank
            </p>
            <div className="grid grid-cols-2 gap-2">
              {BANKS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setPhase("connecting")}
                  className="flex h-16 items-center justify-center rounded-xl border border-neutral-300 px-3 text-center text-sm font-semibold text-neutral-800 transition-colors hover:border-brand-400 hover:bg-[#fbfaf9]"
                >
                  {b}
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "connecting" && (
          <div className="flex flex-col items-center py-8 text-center">
            <span
              className="mb-4 size-10 animate-spin rounded-full border-4"
              style={{ borderColor: "#eaf6f6", borderTopColor: "#128081" }}
            />
            <p className="text-base font-semibold text-neutral-800">
              Connecting securely…
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              This usually takes a few seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================================================================
// Step 2 — Revenue sources
// ===========================================================================

const AMAZON_REGIONS = [
  {
    name: "North America",
    countries: "United States of America, Brazil, Canada, Mexico",
    primary: true,
  },
  {
    name: "Europe",
    countries:
      "United Kingdom, Spain, Italy, Poland, Netherlands, Germany, France, Sweden, Turkey, Saudi Arabia, United Arab Emirates, Egypt, India",
  },
  { name: "Far East", countries: "Singapore, Japan, Australia" },
]

const REVENUE_SUBTITLE =
  "Connect all the other sales platforms you receive revenue from. We'll match these with the bank accounts you use to receive payouts in the next step."

const RevenueStep = ({
  done,
  setDone,
  onBack,
  onContinue,
}: {
  done: boolean
  setDone: (v: boolean) => void
  onBack: () => void
  onContinue: () => void
}) => {
  const [phase, setPhase] = useState<"region" | "sources">(
    done ? "sources" : "region"
  )
  const [connecting, setConnecting] = useState<string | null>(null)

  const connectRegion = (name: string) => {
    setConnecting(name)
    setTimeout(() => {
      setConnecting(null)
      setDone(true)
      setPhase("sources")
    }, 1400)
  }

  // ---- Screen 1: connect your store region (Amazon) ----
  if (phase === "region") {
    return (
      <>
        <PageHeading title="Connect your store region" subtitle={REVENUE_SUBTITLE} />
        <div className="flex flex-col gap-4">
          {AMAZON_REGIONS.map((r) => (
            <div
              key={r.name}
              className="overflow-hidden rounded-2xl bg-white"
              style={{ boxShadow: SHADOW_SM }}
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <AmazonLogo className="h-5 w-auto" />
                  <span className="text-base font-bold text-neutral-800">{r.name}</span>
                </div>
                <Button
                  type="button"
                  variant={r.primary ? "primary" : "secondary"}
                  size="sm"
                  loading={connecting === r.name}
                  onClick={() => connectRegion(r.name)}
                >
                  Connect
                </Button>
              </div>
              <div className="border-t border-neutral-100 bg-[#fbfaf9] px-5 py-3">
                <p className="text-sm font-bold text-neutral-800">
                  Choose if your store is located in:
                </p>
                <p className="text-sm text-text-secondary">{r.countries}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button type="button" variant="link" onClick={onBack}>
            Back
          </Button>
        </div>
      </>
    )
  }

  // ---- Screen 2: other revenue sources ----
  return (
    <>
      <PageHeading title="Other revenue sources" subtitle={REVENUE_SUBTITLE} />

      <div
        className="rounded-3xl p-5"
        style={{ backgroundColor: "#f9f7f6", border: "1px solid #ece8e4", boxShadow: SHADOW_SM }}
      >
        <div
          className="flex items-center gap-3 rounded-2xl border bg-white p-3"
          style={{ borderColor: "#c1e5e6" }}
        >
          <BoxIcon
            icon={<HugeiconsIcon icon={Analytics01SolidStandard} size={14} />}
            severity="accent-1"
            size={6}
          />
          <span className="text-base text-neutral-800">
            Your monthly revenue: <span className="font-bold">$150,000</span>
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="h-4 w-px" style={{ backgroundColor: "#a5d3d4" }} />
          <p className="py-1 text-base font-bold text-neutral-800">
            Where else do you get revenue from?
          </p>
          <span className="h-3 w-px" style={{ backgroundColor: "#a5d3d4" }} />
          <HugeiconsIcon
            icon={ArrowDown01SolidStandard}
            size={18}
            className="-mt-1"
            style={{ color: "#a5d3d4" }}
          />
        </div>

        <div className="mt-1 overflow-hidden rounded-2xl bg-white" style={{ boxShadow: SHADOW_SM }}>
          <SourceRow logo={<AmazonLogo className="h-5 w-auto" />} name="Amazon" subtitle="Connect another region" />
          <SourceRow logo={<AmazonLogo className="h-5 w-auto" />} name="Amazon Ads" />
          <SourceRow logo={<ShopifyLogo className="h-5 w-auto" />} name="Shopify" />
          <SourceRow text="Wa" name="Walmart" />
          <SourceRow logo={<StripeLogo className="h-5 w-auto" />} name="Stripe" />
          <SourceRow text="⋯" name="Other options" />
        </div>
      </div>

      {/* a connected source, being analysed */}
      <div
        className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4"
        style={{ boxShadow: SHADOW_SM, border: "1px solid #c1e5e6" }}
      >
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#f0f3f4", border: "1px solid #d7dee0" }}
        >
          <AmazonLogo className="h-5 w-auto" />
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-base text-neutral-800">
            <span className="font-bold">Amazon</span> — gaston_express
          </span>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: "#fff6e5", color: "#9e5700" }}
          >
            Analyzing…
          </span>
        </div>
        <span className="text-lg leading-none text-neutral-400">⋯</span>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="button" variant="primary" onClick={onContinue}>
          I've connected all my revenue sources
        </Button>
      </div>
    </>
  )
}

const SourceRow = ({
  logo,
  name,
  subtitle,
  text,
}: {
  logo?: React.ReactNode
  name: string
  subtitle?: string
  text?: string
}) => (
  <button
    type="button"
    className="flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-neutral-50"
  >
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: "#f0f3f4", border: "1px solid #d7dee0" }}
    >
      {logo ?? <span className="text-xs font-bold text-text-secondary">{text}</span>}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-base font-semibold text-neutral-800">{name}</p>
      {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
    </div>
    <HugeiconsIcon icon={ArrowRight01SolidStandard} size={18} className="text-neutral-400" />
  </button>
)

// ===========================================================================
// Step 3 — Applicant information
// ===========================================================================

const NATIONALITIES = [
  "United States of America",
  "United Kingdom",
  "Canada",
  "Germany",
  "Netherlands",
  "Australia",
]

const ApplicantStep = ({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) => {
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [dm, setDm] = useState("")
  const [dd, setDd] = useState("")
  const [dy, setDy] = useState("")
  const [nationality, setNationality] = useState(NATIONALITIES[0])
  const [address, setAddress] = useState("")
  const complete = !!(first && last && dm && dd && dy)

  return (
    <>
      <PageHeading title="Applicant information" />

      <div
        className="flex items-center gap-3 rounded-2xl border p-4"
        style={{ borderColor: "#c1e5e6", backgroundColor: "#f1f9f9" }}
      >
        <BoxIcon
          icon={<HugeiconsIcon icon={SecurityCheckSolidRounded} size={14} />}
          severity="accent-1"
          size={6}
        />
        <div>
          <p className="text-sm font-bold text-neutral-800">
            Our Credit Score promise
          </p>
          <p className="text-sm text-text-secondary">
            The checks we make will never impact your credit score.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex gap-3">
          <Field id="first" label="First name" value={first} onChange={setFirst} placeholder="Joss" />
          <Field id="last" label="Last name" value={last} onChange={setLast} placeholder="Adeyemi" />
        </div>

        <div>
          <label className="text-sm font-semibold text-text-secondary">
            Date of birth
          </label>
          <div className="mt-0.5 flex gap-3">
            <input value={dm} onChange={(e) => setDm(e.target.value)} placeholder="MM" maxLength={2} className={`${inputBase} w-20 text-center`} />
            <input value={dd} onChange={(e) => setDd(e.target.value)} placeholder="DD" maxLength={2} className={`${inputBase} w-20 text-center`} />
            <input value={dy} onChange={(e) => setDy(e.target.value)} placeholder="YYYY" maxLength={4} className={`${inputBase} w-28 text-center`} />
          </div>
        </div>

        <div>
          <label htmlFor="nat" className="text-sm font-semibold text-text-secondary">
            Nationality
          </label>
          <select
            id="nat"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className={`${inputBase} mt-0.5 appearance-none`}
          >
            {NATIONALITIES.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="addr" className="text-sm font-semibold text-text-secondary">
            Home address
          </label>
          <div className="relative mt-0.5">
            <input
              id="addr"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search for the first line of your address"
              autoComplete="off"
              className={`${inputBase} pr-9`}
            />
            <HugeiconsIcon
              icon={Search01SolidStandard}
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>
          <button type="button" className="mt-1.5 text-sm font-bold text-brand-600 hover:underline">
            Enter address manually
          </button>
        </div>
      </div>

      <div
        className="mt-5 flex items-start gap-3 rounded-2xl border p-4"
        style={{ borderColor: "#c1e5e6", backgroundColor: "#f1f9f9" }}
      >
        <span
          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#128081" }}
        >
          <HugeiconsIcon icon={Tick02SolidStandard} size={11} className="text-white" />
        </span>
        <p className="text-sm text-text-secondary">
          By clicking continue you understand and agree that we are authorised to
          obtain a personal credit bureau report using your details. This is a
          soft credit check and won't affect your credit score.{" "}
          <span className="font-bold text-brand-600">privacy policy</span>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="link" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="primary" onClick={onContinue} disabled={!complete}>
          Continue
        </Button>
      </div>
    </>
  )
}

// Right-rail card shown only on the Applicant information step (Figma 5:11787)
const CreditDataCard = () => (
  <div className="w-[280px] rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
    <p className="text-base font-bold text-neutral-800">
      How we use your credit data to boost your application
    </p>
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <BoxIcon icon={<HugeiconsIcon icon={FlashSolidRounded} size={14} />} severity="accent-2" size={6} />
        <p className="text-sm text-text-secondary">
          Credit data allows us to provide better, faster offers to more
          businesses.
        </p>
      </div>
      <div className="flex items-start gap-3">
        <BoxIcon icon={<HugeiconsIcon icon={SecurityCheckSolidRounded} size={14} />} severity="accent-6" size={6} />
        <p className="text-sm text-text-secondary">
          We only conduct "soft" credit checks to provide a high-level view of
          your credit history.
        </p>
      </div>
    </div>
  </div>
)

const Field = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) => (
  <div className="flex flex-1 flex-col gap-y-0.5">
    <label htmlFor={id} className="text-sm font-semibold text-text-secondary">
      {label}
    </label>
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={inputBase}
    />
  </div>
)

// ===========================================================================
// Step 4 — Review & submit
// ===========================================================================

const BUSINESS = {
  name: "Gaston Express",
  address: "1780 Colorado Boulevard, Denver, Colorado, 80220, USA",
  incorporated: "10/07/2021",
  reg: "#06746373",
}

const ReviewStep = ({ onBack }: { onBack: () => void }) => {

  return (
    <>
      <div
        className="overflow-hidden rounded-3xl text-center text-white"
        style={{
          background:
            "radial-gradient(120% 160% at 30% 0%, #1ebdc0 0%, #0a5e60 55%, #004b4d 100%)",
          boxShadow: SHADOW_MD,
        }}
      >
        <div className="px-6 py-7">
          <p className="mb-1 text-sm font-semibold opacity-85">
            You're applying for up to
          </p>
          <p
            className="text-[44px] font-extrabold leading-none"
            style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
          >
            $100,000
          </p>
          <p className="mt-2 text-sm opacity-85">
            with a repayment term up to 12 months
          </p>
        </div>
      </div>

      <div className="mt-4">
        <InlineNotice variant="warning">
          <span className="font-bold">Ready to apply? It's time to check your data.</span>{" "}
          We detect gaps in your data during our analysis, and missing data can
          result in a lower offer or even a rejection. This is your chance to add
          everything we need to get you the best possible offer.
        </InlineNotice>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <SummarySection icon={<HugeiconsIcon icon={CreditCardSolidStandard} size={14} />} severity="accent-1" title="Bank connections" action="Add another bank account">
          <p className="mb-3 text-sm text-text-secondary">
            We need full coverage of your payout accounts and all bank accounts or
            credit cards used to run your business in the last 12 months.
          </p>
          <SummaryRow text="C" name="Chase Bank" detail="••••8625" />
          <SummaryRow text="B" name="Bank of America" detail="••••7548" />
        </SummarySection>

        <SummarySection icon={<HugeiconsIcon icon={Analytics01SolidStandard} size={14} />} severity="accent-4" title="Revenue sources" action="Add another revenue source">
          <p className="mb-3 text-sm text-text-secondary">
            We need to know about all of the places your business receives revenue
            from.
          </p>
          <SummaryRow logo={<AmazonLogo className="h-5 w-auto" />} name="Amazon" detail="gaston_express" />
        </SummarySection>

        <SummarySection icon={<HugeiconsIcon icon={Building06SolidStandard} size={14} />} severity="accent-3" title="Business details" action="Edit">
          <p className="mb-2 text-sm text-text-secondary">
            Check your business details are up to date and accurate.
          </p>
          <p className="text-base font-bold text-neutral-800">{BUSINESS.name}</p>
          <p className="text-sm text-text-secondary">{BUSINESS.address}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-sm text-text-secondary">{BUSINESS.incorporated}</span>
            <span className="text-sm font-bold text-neutral-800">{BUSINESS.reg}</span>
          </div>
        </SummarySection>

        <SummarySection icon={<HugeiconsIcon icon={Mail01SolidStandard} size={14} />} severity="accent-6" title="Contact details" action="Edit">
          <p className="mb-1 text-sm text-text-secondary">
            Check your contact details are up to date and accurate.
          </p>
          <div className="flex items-center justify-between border-t border-neutral-100 py-2.5">
            <span className="text-sm font-semibold text-neutral-800">Personal contact email</span>
            <span className="text-sm font-bold text-neutral-800">george@gastonexpress.com</span>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-100 py-2.5">
            <span className="text-sm font-semibold text-neutral-800">Personal contact phone number</span>
            <span className="text-sm font-bold text-neutral-800">+1 (308) 786-4983</span>
          </div>
        </SummarySection>

        <SummarySection icon={<HugeiconsIcon icon={UserShield01SolidStandard} size={14} />} severity="accent-1" title="Applicant information">
          <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ backgroundColor: "#eaf6f6" }}>
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#128081" }}>
              <HugeiconsIcon icon={Tick02SolidStandard} size={11} className="text-white" />
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#128081" }}>Complete</p>
              <p className="text-sm text-text-secondary">
                Applicant information cannot be changed while we're checking your
                details.
              </p>
            </div>
          </div>
        </SummarySection>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button type="button" variant="link" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => window.location.assign("/prototypes/underwriting")}
        >
          Apply for up to $100,000
        </Button>
      </div>
    </>
  )
}

const SummarySection = ({
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
  <div className="rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <BoxIcon icon={icon} severity={severity as never} size={6} />
        <span className="text-base font-bold text-neutral-800">{title}</span>
      </div>
      {action && (
        <button type="button" className="shrink-0 text-sm font-bold text-brand-600 hover:underline">
          {action}
        </button>
      )}
    </div>
    {children}
  </div>
)

const SummaryRow = ({
  logo,
  text,
  name,
  detail,
}: {
  logo?: React.ReactNode
  text?: string
  name: string
  detail: string
}) => (
  <div className="flex items-center gap-3 border-t border-neutral-100 py-2.5">
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: "#f0f3f4", border: "1px solid #d7dee0" }}
    >
      {logo ?? <span className="text-xs font-bold text-text-secondary">{text}</span>}
    </span>
    <div className="min-w-0 flex-1 truncate">
      <span className="text-base font-semibold text-neutral-800">{name}</span>{" "}
      <span className="text-sm text-text-secondary">— {detail}</span>
    </div>
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
      style={{ backgroundColor: "#eaf6f6", color: "#128081" }}
    >
      Connected
    </span>
    <span className="text-lg leading-none text-neutral-400">⋯</span>
  </div>
)

export default Application
