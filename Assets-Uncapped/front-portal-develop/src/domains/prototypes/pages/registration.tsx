import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Rocket01SolidStandard,
  CheckmarkCircle02SolidStandard,
  Alert02SolidStandard,
  Logout03SolidStandard,
  Chart01SolidStandard,
  ArrowDown01SolidStandard,
  Tick02SolidStandard,
  Search01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  StarAward02SolidSharp,
  Location06SolidSharp,
} from "@hugeicons-pro/core-solid-sharp"
import {
  MoneyBag02SolidRounded,
  SecurityValidationSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import {
  ViewOffSlashStrokeStandard,
  ViewStrokeStandard,
} from "@hugeicons-pro/core-stroke-standard"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"
import Notice from "../../../components/UI/Notice"
import { ReactComponent as AmazonLogo } from "../../../svgs/partners/connections/amazon.svg"
import { ReactComponent as ConnectMask } from "../../../components/Collections/RegistrationSidebars/assets/mask.svg"
import { ReactComponent as OfferCardSvg } from "../../../components/Collections/RegistrationSidebars/assets/offer-card.svg"
import { ReactComponent as UncappedLogoCard } from "../../../components/Collections/RegistrationSidebars/assets/uncapped-logo-card.svg"

// ---------------------------------------------------------------------------
// Sandbox-safe onboarding flow: Registration → Eligibility check
// Figma: Main-Product-File · 5:12029 (Registration), 5:11994 (Eligibility),
//        5:12067 / 5:12077 / 5:12087 (Eligibility states)
// ---------------------------------------------------------------------------

type Step = "registration" | "readiness" | "eligibility"
type ServerResult = "success" | "email-in-use"

type RegErrors = Partial<{
  firstName: string
  lastName: string
  email: string
  password: string
}>

type EligErrors = Partial<{
  revenue: string
  fundingAmount: string
  timeHorizon: string
  mainSource: string
}>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TIME_HORIZONS = [
  "As soon as possible",
  "Within the next week",
  "Within the next month",
  "Within 2–6 months",
  "Not sure yet",
]

const REVENUE_SOURCES = [
  "Amazon",
  "Walmart",
  "Shopify",
  "Other ecommerce platform",
  "Retail stores / Wholesale",
  "Subscription / SaaS",
]

const validateReg = (v: {
  firstName: string
  lastName: string
  email: string
  password: string
}): RegErrors => {
  const errors: RegErrors = {}
  if (!v.firstName.trim()) errors.firstName = "Enter your first name"
  if (!v.lastName.trim()) errors.lastName = "Enter your last name"
  if (!v.email.trim()) errors.email = "Enter your email address"
  else if (!EMAIL_RE.test(v.email.trim()))
    errors.email = "That doesn't look like a valid email address"
  if (!v.password) errors.password = "Choose a password"
  else if (v.password.length < 8)
    errors.password = "Use at least 8 characters"
  return errors
}

const validateElig = (v: {
  revenue: string
  fundingAmount: string
  timeHorizon: string
  mainSource: string
}): EligErrors => {
  const errors: EligErrors = {}
  if (!v.revenue.trim()) errors.revenue = "Enter your average monthly revenue"
  if (!v.fundingAmount.trim())
    errors.fundingAmount = "Enter how much funding you need"
  if (!v.timeHorizon) errors.timeHorizon = "Select when you need funding"
  if (!v.mainSource) errors.mainSource = "Select your main revenue source"
  return errors
}

// ===========================================================================
// Root
// ===========================================================================

const readStepFromHash = (): Step => {
  if (typeof window === "undefined") return "registration"
  const h = window.location.hash.replace("#", "")
  if (h === "readiness") return "readiness"
  if (h === "eligibility") return "eligibility"
  return "registration"
}

const Onboarding = () => {
  // Step is mirrored to `window.location.hash` so reload, share, and browser
  // back/forward all preserve where the user was.
  // registration → readiness → eligibility → (application prototype)
  const [step, setStep] = useState<Step>(readStepFromHash)
  const [firstName, setFirstName] = useState("")

  // Push hash when step changes (replace, so we don't spam history)
  useEffect(() => {
    const target = `#${step}`
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target)
    }
  }, [step])

  // React to browser back/forward
  useEffect(() => {
    const handler = () => setStep(readStepFromHash())
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])

  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="flex min-h-screen w-full items-stretch">
        {step === "registration" && (
          <RegistrationView
            firstName={firstName}
            setFirstName={setFirstName}
            onAdvance={() => setStep("eligibility")}
          />
        )}
        {step === "eligibility" && (
          <EligibilityView
            firstName={firstName}
            onBack={() => setStep("registration")}
            onAdvance={() => setStep("readiness")}
          />
        )}
        {step === "readiness" && (
          <ReadinessView
            onBack={() => setStep("eligibility")}
            onAdvance={() => window.location.assign("/prototypes/application")}
          />
        )}
      </div>
    </div>
  )
}

// ===========================================================================
// Funding readiness step (Figma 5:12008)
// ===========================================================================

const COUNTRIES = [
  "United States of America",
  "United Kingdom",
  "Canada",
  "Germany",
  "Netherlands",
  "Australia",
]

const READINESS_BENEFITS = [
  "Control the amount and term of your offer",
  "Top-ups as you repay or as your business grows",
  "Unlock access to our line of credit as your business scales",
  "Clear, fixed cost with early prepayment options",
  "The most support from real people",
]

const mockBusinesses = (q: string) => {
  const s = q.trim()
  if (!s) return []
  return [
    { name: `${s} Ltd`, address: "242 Porter Blvd, Stamford, KY 89204", reg: "#7702264" },
    { name: `${s} Trading Co.`, address: "18 Market St, Austin, TX 73301", reg: "#5519830" },
    { name: `${s} Holdings`, address: "9 Riverside Ave, Brooklyn, NY 11201", reg: "#3320117" },
    { name: `${s} Supply`, address: "501 Oak Ave, Denver, CO 80202", reg: "#8841092" },
  ]
}

const PHONE_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dial: "+31" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dial: "+61" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dial: "+353" },
]

const PhoneField = ({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) => {
  const [sel, setSel] = useState(PHONE_COUNTRIES[0])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div className="flex h-11 items-stretch overflow-hidden rounded-lg border border-neutral-300 bg-white transition-all focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 border-r border-neutral-300 px-3 transition-colors hover:bg-neutral-50"
        >
          <span className="text-base leading-none">{sel.flag}</span>
          <span className="text-sm text-neutral-800">{sel.dial}</span>
          <HugeiconsIcon
            icon={ArrowDown01SolidStandard}
            size={14}
            className="text-neutral-400"
          />
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="(555) 000-0000"
          inputMode="tel"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm placeholder:text-neutral-500 outline-none"
        />
      </div>
      {open && (
        <div
          className="absolute left-0 top-full z-20 mt-1 w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white"
          style={{ boxShadow: "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)" }}
        >
          <ul className="max-h-64 overflow-y-auto">
            {PHONE_COUNTRIES.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    setSel(c)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-neutral-50"
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 truncate text-neutral-800">{c.name}</span>
                  <span className="text-text-secondary">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const ReadinessView = ({
  onBack,
  onAdvance,
}: {
  onBack: () => void
  onAdvance: () => void
}) => {
  const [country, setCountry] = useState(COUNTRIES[0])
  const [business, setBusiness] = useState("")
  const [businessOpen, setBusinessOpen] = useState(false)
  const [businessChosen, setBusinessChosen] = useState(false)
  const businessRef = useRef<HTMLDivElement | null>(null)
  const [phone, setPhone] = useState("")
  const [sms, setSms] = useState(false)
  const base =
    "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm placeholder:text-neutral-500 transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (businessRef.current && !businessRef.current.contains(e.target as Node))
        setBusinessOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  const results = business.trim() && !businessChosen ? mockBusinesses(business) : []

  return (
    <>
      <FormColumn maxWidth="540px">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onAdvance()
          }}
          className="flex flex-col gap-y-6"
        >
          <Typography
            type="h5"
            color="neutral-800"
            className="!text-[28px] !leading-[1.25]"
          >
            Check your funding readiness
          </Typography>

          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-0.5">
              <label htmlFor="country" className="text-sm font-semibold text-text-secondary">
                Country of incorporation
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${base} appearance-none`}
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="relative flex flex-col gap-y-0.5" ref={businessRef}>
              <label htmlFor="business" className="text-sm font-semibold text-text-secondary">
                Search for registered business name
              </label>
              <div className="relative">
                <input
                  id="business"
                  value={business}
                  onChange={(e) => {
                    setBusiness(e.target.value)
                    setBusinessChosen(false)
                    setBusinessOpen(true)
                  }}
                  onFocus={() => {
                    if (business.trim() && !businessChosen) setBusinessOpen(true)
                  }}
                  placeholder="Start typing your business name"
                  autoComplete="off"
                  className={`${base} pr-9`}
                />
                <HugeiconsIcon
                  icon={Search01SolidStandard}
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
              </div>
              {businessOpen && results.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-neutral-200 bg-white"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)" }}
                >
                  <ul className="max-h-72 overflow-y-auto">
                    {results.map((r) => (
                      <li key={r.reg}>
                        <button
                          type="button"
                          onClick={() => {
                            setBusiness(r.name)
                            setBusinessChosen(true)
                            setBusinessOpen(false)
                          }}
                          className="flex w-full items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-neutral-800">
                              {r.name}
                            </span>
                            <span className="block truncate text-xs text-text-secondary">
                              {r.address}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs text-neutral-400">{r.reg}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      setBusinessChosen(true)
                      setBusinessOpen(false)
                    }}
                    className="block w-full px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <span className="text-sm font-semibold text-brand-600">
                      Can&rsquo;t find your business? Add it manually
                    </span>
                    <span className="block text-xs text-text-secondary">
                      Use the name exactly as it&rsquo;s registered.
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-0.5">
              <label className="text-sm font-semibold text-text-secondary">
                Personal contact number
              </label>
              <PhoneField value={phone} onChange={setPhone} />
            </div>

            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex items-center gap-2 border-b border-neutral-100 bg-[#fbfaf9] px-4 py-3">
                <BoxIcon
                  icon={<HugeiconsIcon icon={SecurityValidationSolidRounded} size={14} />}
                  severity="accent-1"
                  size={6}
                />
                <p className="text-sm font-bold text-neutral-800">
                  We use SMS to notify you about offer updates
                </p>
              </div>
              <label className="flex cursor-pointer items-start gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  checked={sms}
                  onChange={(e) => setSms(e.target.checked)}
                  className="mt-0.5 size-4 accent-brand-600"
                />
                <span className="text-xs leading-5 text-text-secondary">
                  I agree to receive SMS messages from Uncapped. Message frequency
                  varies. Standard message and data rates apply.{" "}
                  <span className="font-bold text-brand-600">Privacy policy</span>
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="link" onClick={onBack}>
              Go back
            </Button>
            <Button type="submit" variant="primary">
              Check your eligibility
            </Button>
          </div>
        </form>
      </FormColumn>
      <ReadinessSidebar />
    </>
  )
}

const ReadinessSidebar = () => (
  <SidebarShell>
    <div className="flex flex-col gap-8 text-white">
      <div>
        <p className="text-base leading-6">You could be eligible for up to</p>
        <p
          className="text-[64px] font-extrabold leading-none"
          style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
        >
          $100,000
        </p>
        <p className="mt-3 text-base leading-6 text-white/90">
          Your final offer is based on the data you submit during your
          application.
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {READINESS_BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md"
              style={{ backgroundColor: "rgba(255,255,255,.12)", color: "#1ebdc0" }}
            >
              <HugeiconsIcon icon={Tick02SolidStandard} size={14} />
            </span>
            <span className="text-base leading-6">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  </SidebarShell>
)

// ===========================================================================
// Mock Google / Amazon sign-in (sandbox only — no real OAuth)
// ===========================================================================

const OAuthScreen = ({
  provider,
  onComplete,
  onCancel,
}: {
  provider: "google" | "amazon"
  onComplete: () => void
  onCancel: () => void
}) => {
  const isGoogle = provider === "google"
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isGoogle ? "Sign in with Google" : "Amazon Sign-In"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 p-4"
    >
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-2xl border border-neutral-200 bg-white"
        style={{ boxShadow: "0 2px 10px rgba(0,0,0,.07), 0 0 2px rgba(0,0,0,.08)" }}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2">
            {isGoogle ? (
              <GoogleGlyph />
            ) : (
              <AmazonLogo className="size-5" aria-hidden="true" />
            )}
            <span className="text-base font-semibold text-neutral-800">
              {isGoogle ? "Sign in with Google" : "Amazon Sign-In"}
            </span>
          </div>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            Demo
          </span>
        </div>
        <div className="px-6 py-7">
          <p className="text-lg font-bold text-neutral-800">Choose an account</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            to continue to Uncapped
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-5 flex w-full items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
          >
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: isGoogle ? "#1a73e8" : "#ff9900" }}
            >
              AN
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-neutral-800">
                Ana Ned
              </span>
              <span className="block truncate text-xs text-text-secondary">
                ana@wildgrove.example
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="mt-2 flex w-full items-center gap-3 rounded-xl border border-neutral-300 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-lg text-neutral-500">
              +
            </span>
            <span className="text-sm font-semibold text-neutral-800">
              Use another account
            </span>
          </button>
          <p className="mt-5 text-xs text-text-secondary">
            This is a sandbox demo — no real {isGoogle ? "Google" : "Amazon"}{" "}
            sign-in happens. Choosing an account continues your Uncapped
            application.
          </p>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="link" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Registration step
// ===========================================================================

const RegistrationView = ({
  firstName,
  setFirstName,
  onAdvance,
}: {
  firstName: string
  setFirstName: (v: string) => void
  onAdvance: () => void
}) => {
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<RegErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [forceResult, setForceResult] = useState<ServerResult>("success")
  const [oauth, setOauth] = useState<null | "google" | "amazon">(null)
  const submitTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!submitted) return
    setErrors(validateReg({ firstName, lastName, email, password }))
  }, [submitted, firstName, lastName, email, password])

  useEffect(
    () => () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current)
    },
    [],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setServerError(null)
    const nextErrors = validateReg({ firstName, lastName, email, password })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false)
      if (forceResult === "email-in-use") {
        setServerError(
          "An account already exists with this email. Try logging in instead.",
        )
      } else {
        // Go straight to the eligibility check — no "account ready" interstitial.
        onAdvance()
      }
    }, 1100)
  }

  const reset = () => {
    setLastName("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setErrors({})
    setSubmitted(false)
    setSubmitting(false)
    setServerError(null)
    setSuccess(false)
    setFirstName("")
  }

  return (
    <>
      <FormColumn>
        {success ? (
          <RegistrationSuccessPanel
            firstName={firstName}
            onAdvance={onAdvance}
            onReset={reset}
          />
        ) : (
          <RegistrationForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            errors={errors}
            submitting={submitting}
            serverError={serverError}
            onSubmit={handleSubmit}
            forceResult={forceResult}
            setForceResult={setForceResult}
            onReset={reset}
            onOAuth={setOauth}
          />
        )}
      </FormColumn>
      <RegistrationSidebar />
      {oauth && (
        <OAuthScreen
          provider={oauth}
          onComplete={onAdvance}
          onCancel={() => setOauth(null)}
        />
      )}
    </>
  )
}

const RegistrationForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  errors,
  submitting,
  serverError,
  onSubmit,
  forceResult,
  setForceResult,
  onReset,
  onOAuth,
}: {
  firstName: string
  setFirstName: (v: string) => void
  lastName: string
  setLastName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  showPassword: boolean
  setShowPassword: (fn: (v: boolean) => boolean) => void
  errors: RegErrors
  submitting: boolean
  serverError: string | null
  onSubmit: (e: React.FormEvent) => void
  forceResult: ServerResult
  setForceResult: (r: ServerResult) => void
  onReset: () => void
  onOAuth: (provider: "google" | "amazon") => void
}) => {
  const inputBase =
    "h-11 w-full rounded-lg border bg-white px-3 text-sm placeholder:text-neutral-500 transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
  const errorRing =
    "border-error-500 focus:border-error-500 focus:ring-error-200"

  return (
    <>
      {serverError && (
        <Notice
          variant="danger"
          icon={<HugeiconsIcon icon={Alert02SolidStandard} />}
        >
          {serverError}
        </Notice>
      )}

      <button
        type="button"
        disabled={submitting}
        onClick={() => onOAuth("google")}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-on-secondary transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <GoogleGlyph />
        Sign up with Google
      </button>
      <button
        type="button"
        disabled={submitting}
        onClick={() => onOAuth("amazon")}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-on-secondary transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200 outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <AmazonLogo className="size-5" aria-hidden="true" />
        Sign up with Amazon
      </button>

      <div className="flex items-center gap-2 py-2">
        <span className="h-px flex-1 bg-neutral-300" />
        <Typography type="body" color="neutral-700">
          or sign up with email
        </Typography>
        <span className="h-px flex-1 bg-neutral-300" />
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <Field
            id="firstName"
            label="First name"
            value={firstName}
            onChange={setFirstName}
            placeholder="First name"
            disabled={submitting}
            error={errors.firstName}
            inputClassName={`${inputBase} ${
              errors.firstName ? errorRing : "border-neutral-300"
            }`}
            autoComplete="given-name"
          />
          <Field
            id="lastName"
            label="Last name"
            value={lastName}
            onChange={setLastName}
            placeholder="Last name"
            disabled={submitting}
            error={errors.lastName}
            inputClassName={`${inputBase} ${
              errors.lastName ? errorRing : "border-neutral-300"
            }`}
            autoComplete="family-name"
          />
        </div>

        <Field
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          disabled={submitting}
          error={errors.email}
          inputClassName={`${inputBase} ${
            errors.email ? errorRing : "border-neutral-300"
          }`}
          autoComplete="email"
        />

        <div className="flex flex-col gap-y-0.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-text-secondary"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              disabled={submitting}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className={`${inputBase} pr-10 ${
                errors.password ? errorRing : "border-neutral-300"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-600 transition-colors duration-150 hover:bg-neutral-100 hover:text-text-secondary focus-visible:bg-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
            >
              <HugeiconsIcon
                icon={
                  showPassword
                    ? ViewStrokeStandard
                    : ViewOffSlashStrokeStandard
                }
                className="size-5"
                strokeWidth={2}
              />
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-text-error">
              {errors.password}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={submitting}
          >
            {submitting ? "Creating your account…" : "Sign up with email"}
          </Button>
        </div>
      </form>

      <p className="text-center text-base text-text-secondary">
        Already have an account? <InlineLink>Log in</InlineLink>
      </p>

      <p className="text-center text-xs text-text-secondary">
        By continuing you agree to our{" "}
        <InlineLink>Terms &amp; Conditions</InlineLink>. This site is protected
        by reCAPTCHA and the Google <InlineLink>Privacy Policy</InlineLink> and{" "}
        <InlineLink>Terms of Service</InlineLink> apply.
      </p>

      <DemoControls
        forceResult={forceResult}
        onChange={setForceResult}
        onReset={onReset}
      />
    </>
  )
}

const RegistrationSuccessPanel = ({
  firstName,
  onAdvance,
  onReset,
}: {
  firstName: string
  onAdvance: () => void
  onReset: () => void
}) => (
  <div className="flex flex-col items-center gap-y-5 py-6 text-center">
    <div className="flex size-14 items-center justify-center rounded-full bg-success-200">
      <HugeiconsIcon
        icon={CheckmarkCircle02SolidStandard}
        className="size-7 text-success-600"
      />
    </div>
    <div className="flex flex-col gap-y-2">
      <Typography type="h5" color="neutral-800">
        Welcome{firstName ? `, ${firstName}` : ""}
      </Typography>
      <Typography type="body" color="neutral-700">
        Your account is ready. Next we&rsquo;ll ask a few questions about your
        business to confirm your funding amount.
      </Typography>
    </div>
    <div className="w-full pt-2">
      <Button type="button" variant="primary" fullWidth onClick={onAdvance}>
        Start eligibility check
      </Button>
    </div>
    <button
      type="button"
      onClick={onReset}
      className="text-sm font-bold text-brand-600 transition-colors duration-150 hover:underline"
    >
      Reset prototype
    </button>
  </div>
)

// ===========================================================================
// Eligibility step
// ===========================================================================

const EligibilityView = ({
  firstName,
  onBack,
  onAdvance,
}: {
  firstName: string
  onBack: () => void
  onAdvance: () => void
}) => {
  const [revenue, setRevenue] = useState("")
  const [fundingAmount, setFundingAmount] = useState("")
  const [timeHorizon, setTimeHorizon] = useState("")
  const [mainSource, setMainSource] = useState("")
  const [errors, setErrors] = useState<EligErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const submitTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!submitted) return
    setErrors(validateElig({ revenue, fundingAmount, timeHorizon, mainSource }))
  }, [submitted, revenue, fundingAmount, timeHorizon, mainSource])

  useEffect(
    () => () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current)
    },
    [],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const nextErrors = validateElig({
      revenue,
      fundingAmount,
      timeHorizon,
      mainSource,
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSubmitting(true)
    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false)
      // Eligibility → funding readiness (next step).
      onAdvance()
    }, 1100)
  }

  const fill = () => {
    setRevenue("100000")
    setFundingAmount("100000")
    setTimeHorizon("As soon as possible")
    setMainSource("Amazon")
    setErrors({})
    setSubmitted(false)
  }

  const clear = () => {
    setRevenue("")
    setFundingAmount("")
    setTimeHorizon("")
    setMainSource("")
    setErrors({})
    setSubmitted(false)
    setSubmitting(false)
    setDone(false)
  }

  return (
    <>
      <FormColumn maxWidth="540px">
        {done ? (
          <EligibilityDonePanel firstName={firstName} onReset={onBack} />
        ) : (
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-1">
              <Typography
                type="h5"
                color="neutral-800"
                className="!text-[28px] !leading-[1.25]"
              >
                Discover your funding potential
              </Typography>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-y-4"
            >
              <CurrencyField
                id="revenue"
                label="Average monthly revenue"
                value={revenue}
                onChange={setRevenue}
                placeholder="0"
                disabled={submitting}
                error={errors.revenue}
              />
              <CurrencyField
                id="fundingAmount"
                label="How much money are you looking for?"
                value={fundingAmount}
                onChange={setFundingAmount}
                placeholder="0"
                disabled={submitting}
                error={errors.fundingAmount}
              />
              <SelectField
                id="timeHorizon"
                label="When do you need funding?"
                value={timeHorizon}
                onChange={setTimeHorizon}
                options={TIME_HORIZONS}
                placeholder="Please select"
                disabled={submitting}
                error={errors.timeHorizon}
              />
              <SelectField
                id="mainSource"
                label="Main revenue source"
                value={mainSource}
                onChange={setMainSource}
                options={REVENUE_SOURCES}
                placeholder="Please select"
                disabled={submitting}
                error={errors.mainSource}
                helper="If you use multiple platforms, select the one with the highest revenue."
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={submitting}
                >
                  {submitting ? "Checking…" : "Let's find out"}
                </Button>
              </div>
            </form>

            <EligibilityDemoControls
              onFill={fill}
              onClear={clear}
              onBack={onBack}
            />
          </div>
        )}
      </FormColumn>
      <EligibilitySidebar />
    </>
  )
}

const EligibilityDonePanel = ({
  firstName,
  onReset,
}: {
  firstName: string
  onReset: () => void
}) => (
  <div className="flex flex-col items-center gap-y-5 py-6 text-center">
    <div className="flex size-14 items-center justify-center rounded-full bg-brand-200">
      <HugeiconsIcon
        icon={CheckmarkCircle02SolidStandard}
        className="size-7 text-brand-600"
      />
    </div>
    <div className="flex flex-col gap-y-2">
      <Typography type="h5" color="neutral-800">
        Nice work{firstName ? `, ${firstName}` : ""}
      </Typography>
      <Typography type="body" color="neutral-700">
        We&rsquo;ve got everything we need. Next, we&rsquo;ll connect your
        marketplace so we can build your offer.
      </Typography>
    </div>
    <button
      type="button"
      onClick={onReset}
      className="text-sm font-bold text-brand-600 transition-colors duration-150 hover:underline"
    >
      Back to registration
    </button>
  </div>
)

// ===========================================================================
// Shared layout pieces
// ===========================================================================

const FormColumn = ({
  children,
  maxWidth = "400px",
}: {
  children: React.ReactNode
  maxWidth?: string
}) => (
  <div className="flex flex-1 flex-col justify-between p-10 min-w-[520px]">
    <div className="flex flex-col gap-y-10">
      <div className="h-[40px]">
        <Logo link={false} className="h-[40px] w-auto" />
      </div>
      <div className="flex w-full justify-center">
        <div
          className="flex w-full flex-col gap-y-4"
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </div>
    <LogoutButton />
  </div>
)

const LogoutButton = () => (
  <div className="flex">
    <button
      type="button"
      onClick={() => {
        window.location.hash = "#registration"
        window.location.reload()
      }}
      className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
    >
      <BoxIcon
        icon={<HugeiconsIcon icon={Logout03SolidStandard} size={16} />}
        severity="accent-2"
        size={6}
      />
      <Typography type="body" color="neutral-800" className="px-2">
        Log out
      </Typography>
    </button>
  </div>
)

// ===========================================================================
// Sidebars
// ===========================================================================

const SidebarShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative hidden w-[620px] shrink-0 overflow-hidden lg:block">
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 80% -10%, rgba(30, 189, 192, 0.55), transparent 55%), radial-gradient(circle at -10% 110%, rgba(0, 65, 107, 0.7), transparent 55%), linear-gradient(180deg, #004b4d 0%, #002a3c 100%)",
      }}
    />
    <div className="relative flex h-full flex-col items-stretch justify-start gap-6 p-20">
      {children}
    </div>
  </div>
)

const RegistrationSidebar = () => (
  <SidebarShell>
    <div className="flex flex-col items-center gap-4 pb-4 text-center text-white">
      <h2
        className="font-heading text-[48px] font-extrabold leading-[1.2]"
        style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
      >
        You&rsquo;re ready for funding!
      </h2>
      <p className="text-base leading-6">
        Based on the information you&rsquo;ve provided, you have a high chance
        of receiving an offer of{" "}
        <span className="font-bold">up to $100,000</span>
      </p>
    </div>

    <SidebarCard
      icon={<HugeiconsIcon icon={StarAward02SolidSharp} size={16} />}
      iconColor="#1ebdc0"
      title="Funding readiness check complete"
      body="You're ready to successfully apply for funding from Uncapped"
    />
    <SidebarCard
      icon={<HugeiconsIcon icon={Rocket01SolidStandard} size={16} />}
      iconColor="#ffac30"
      title="Highly likely to receive an offer"
      body="Your profile suggests you're highly likely to receive an offer when you complete an application"
    />
  </SidebarShell>
)

// Outer glass card matching production `EligibilityOneVariantSidebar` (size-18 ≈ 72px)
const GlassTile = ({
  children,
  checked,
}: {
  children: React.ReactNode
  checked?: boolean
}) => (
  <div
    className="relative flex size-[72px] items-center justify-center rounded-xl border backdrop-blur-sm"
    style={{
      borderColor: "rgba(141, 141, 141, 0.20)",
      background:
        "linear-gradient(225deg, rgba(255, 255, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
      boxShadow:
        "0 0.758px 3.034px 0 rgba(0, 0, 0, 0.21), 0 0 15.169px 0 rgba(0, 0, 0, 0.15), 0 11.376px 15.169px 0 rgba(0, 0, 0, 0.15)",
    }}
  >
    {children}
    {checked && (
      <span
        className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full"
        style={{
          backgroundColor: "#128081",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.15), 0 2px 9px 0 rgba(0, 0, 0, 0.15)",
        }}
      >
        <HugeiconsIcon
          icon={Tick02SolidStandard}
          className="size-3 text-white"
        />
      </span>
    )}
  </div>
)

// Inner accent box (size-10 = 40px) with explicit hex per Tailwind v4 safelist guard
const AccentInner = ({
  icon,
  hex,
}: {
  icon: React.ReactNode
  hex: string
}) => (
  <div
    className="flex size-10 items-center justify-center rounded-lg border"
    style={{
      color: hex,
      borderColor: `${hex}40`, // ~25% alpha border tint
      backgroundColor: `${hex}1f`, // ~12% alpha bg tint
    }}
  >
    {icon}
  </div>
)

const EligibilitySidebar = () => (
  <SidebarShell>
    <div className="flex flex-col items-center gap-y-14 text-center text-white">
      {/* ── Discover your potential ──────────────────────────────────── */}
      <div className="flex w-full flex-col items-center gap-y-8">
        <h3
          className="font-heading text-[32px] font-semibold leading-[1.2] text-white"
          style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
        >
          Discover your potential
        </h3>
        <div className="flex items-center justify-center gap-6">
          <GlassTile checked>
            <AccentInner
              icon={<HugeiconsIcon icon={Location06SolidSharp} size={24} />}
              hex="#1ebdc0"
            />
          </GlassTile>
          <GlassTile checked>
            <AccentInner
              icon={
                <HugeiconsIcon icon={SecurityValidationSolidRounded} size={24} />
              }
              hex="#37a7f1"
            />
          </GlassTile>
          <GlassTile checked>
            <AccentInner
              icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} size={24} />}
              hex="#ffac30"
            />
          </GlassTile>
        </div>
      </div>

      {/* ── Connect your data ────────────────────────────────────────── */}
      <div className="flex w-full flex-col items-center gap-y-3">
        <h3
          className="font-heading text-[32px] font-semibold leading-[1.2] text-white"
          style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
        >
          Connect your data
        </h3>
        <div className="flex items-center justify-center gap-0.5">
          <GlassTile>
            <AccentInner
              icon={<HugeiconsIcon icon={Chart01SolidStandard} size={24} />}
              hex="#9a73f6"
            />
          </GlassTile>
          <ConnectMask aria-hidden="true" />
          <UncappedLogoCard aria-hidden="true" className="mt-2 -mx-4" />
        </div>
      </div>

      {/* ── Receive offers ───────────────────────────────────────────── */}
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
  </SidebarShell>
)

const SidebarCard = ({
  icon,
  iconColor,
  title,
  body,
}: {
  icon: React.ReactNode
  iconColor: string
  title: string
  body: string
}) => (
  <div
    className="flex flex-col overflow-hidden rounded-xl border w-full"
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.10)",
      borderColor: "rgba(255, 255, 255, 0.10)",
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.2), 0 0 6px 0 rgba(0,0,0,0.16)",
    }}
  >
    <div
      className="flex items-center gap-3 px-4 py-3 border-b"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.10)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-md border"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          borderColor: "rgba(255, 255, 255, 0.10)",
          color: iconColor,
        }}
      >
        {icon}
      </span>
      <p className="text-base font-bold text-white leading-6">{title}</p>
    </div>
    <div className="px-4 py-3">
      <p className="text-center text-sm text-white/90 leading-5">{body}</p>
    </div>
  </div>
)

// ===========================================================================
// Form atoms
// ===========================================================================

const Field = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  error,
  inputClassName,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  error?: string
  inputClassName: string
  autoComplete?: string
}) => (
  <div className="flex flex-1 flex-col gap-y-0.5 min-w-0">
    <label htmlFor={id} className="text-sm font-semibold text-text-secondary">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-60`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs text-text-error">
        {error}
      </p>
    )}
  </div>
)

const CURRENCIES = ["USD", "GBP", "EUR"] as const
const CURRENCY_SYMBOLS: Record<(typeof CURRENCIES)[number], string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
}

const CurrencyField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
}) => {
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("USD")
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!currencyOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setCurrencyOpen(false)
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [currencyOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "")
    onChange(raw)
  }
  const formatted =
    value === "" ? "" : Number(value).toLocaleString("en-US")

  return (
    <div className="flex flex-col gap-y-1" ref={ref}>
      <label htmlFor={id} className="text-sm font-semibold text-text-secondary">
        {label}
      </label>
      <div
        className={`relative flex h-11 w-full items-center rounded-lg border bg-white pl-1 pr-3 transition-all duration-150 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-200 ${
          error
            ? "border-error-500 focus-within:border-error-500 focus-within:ring-error-200"
            : "border-neutral-300"
        } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setCurrencyOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={currencyOpen}
          aria-label="Select currency"
          className="mr-2 flex h-8 items-center gap-1 rounded-md border-r border-neutral-300 pr-2 pl-2 text-sm font-semibold text-text-secondary transition-colors duration-150 hover:bg-neutral-50 outline-none focus-visible:bg-neutral-100 disabled:cursor-not-allowed"
        >
          {currency}
          <HugeiconsIcon
            icon={ArrowDown01SolidStandard}
            className={`size-3.5 text-neutral-600 transition-transform duration-200 ${
              currencyOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <span className="pr-1 text-sm font-semibold text-text-secondary">
          {CURRENCY_SYMBOLS[currency]}
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={formatted}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed"
        />

        {currencyOpen && (
          <ul
            role="listbox"
            className="absolute left-0 top-full z-20 mt-1 w-[120px] overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-light-md"
          >
            {CURRENCIES.map((cur) => (
              <li key={cur}>
                <button
                  type="button"
                  role="option"
                  aria-selected={currency === cur}
                  onClick={() => {
                    setCurrency(cur)
                    setCurrencyOpen(false)
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-100 hover:bg-neutral-100 ${
                    currency === cur
                      ? "bg-brand-100 font-semibold text-brand-700"
                      : "text-text-primary"
                  }`}
                >
                  <span className="w-4 text-text-secondary">
                    {CURRENCY_SYMBOLS[cur]}
                  </span>
                  {cur}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-text-error">
          {error}
        </p>
      )}
    </div>
  )
}

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  error,
  helper,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  error?: string
  helper?: string
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div className="flex flex-col gap-y-1" ref={ref}>
      <label htmlFor={id} className="text-sm font-semibold text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 text-sm transition-all duration-150 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-200 ${
            error
              ? "border-error-500 focus:border-error-500 focus:ring-error-200"
              : "border-neutral-300"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <span className={value ? "text-text-primary" : "text-neutral-500"}>
            {value || placeholder || "Select"}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01SolidStandard}
            className={`size-4 text-neutral-600 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border border-neutral-300 bg-white shadow-light-md"
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === opt}
                  onClick={() => {
                    onChange(opt)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors duration-100 hover:bg-neutral-100 ${
                    value === opt
                      ? "bg-brand-100 font-semibold text-brand-700"
                      : "text-text-primary"
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {helper && !error && (
        <p className="text-xs text-text-secondary leading-5">{helper}</p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-text-error">
          {error}
        </p>
      )}
    </div>
  )
}

// ===========================================================================
// Misc atoms
// ===========================================================================

const InlineLink = ({ children }: { children: React.ReactNode }) => (
  <button
    type="button"
    onClick={(e) => e.preventDefault()}
    className="bg-transparent border-0 p-0 font-bold text-brand-600 no-underline hover:underline cursor-pointer"
  >
    {children}
  </button>
)

const GoogleGlyph = () => (
  <svg viewBox="0 0 18 18" className="size-5" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61Z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.47-.8 5.96-2.19l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.93v2.32A9 9 0 0 0 9 18Z"
    />
    <path
      fill="#FBBC05"
      d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.97H.93A9 9 0 0 0 0 9c0 1.45.35 2.83.93 4.03l3.04-2.32Z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.42 0 9 0A9 9 0 0 0 .93 4.97L3.97 7.3C4.68 5.18 6.66 3.58 9 3.58Z"
    />
  </svg>
)

// ===========================================================================
// Demo controls
// ===========================================================================

const DemoControls = ({
  forceResult,
  onChange,
  onReset,
}: {
  forceResult: ServerResult
  onChange: (r: ServerResult) => void
  onReset: () => void
}) => (
  <div className="mt-6 rounded-lg border border-dashed border-neutral-300 bg-white/60 p-3">
    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-neutral-600">
      Prototype demo controls
    </p>
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-text-secondary">On submit:</span>
      <DemoChip
        label="Success"
        active={forceResult === "success"}
        onClick={() => onChange("success")}
      />
      <DemoChip
        label="Email already in use"
        active={forceResult === "email-in-use"}
        onClick={() => onChange("email-in-use")}
      />
      <button
        type="button"
        onClick={onReset}
        className="ml-auto text-xs font-bold text-brand-600 hover:underline"
      >
        Reset
      </button>
    </div>
  </div>
)

const EligibilityDemoControls = ({
  onFill,
  onClear,
  onBack,
}: {
  onFill: () => void
  onClear: () => void
  onBack: () => void
}) => (
  <div className="rounded-lg border border-dashed border-neutral-300 bg-white/60 p-3">
    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-neutral-600">
      Prototype demo controls
    </p>
    <div className="flex flex-wrap items-center gap-2">
      <DemoChip label="Fill with sample data" active={false} onClick={onFill} />
      <DemoChip label="Clear" active={false} onClick={onClear} />
      <button
        type="button"
        onClick={onBack}
        className="ml-auto text-xs font-bold text-brand-600 hover:underline"
      >
        ← Back to registration
      </button>
    </div>
  </div>
)

const DemoChip = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 ${
      active
        ? "border-brand-600 bg-brand-100 text-brand-700"
        : "border-neutral-300 bg-white text-text-secondary hover:border-neutral-400"
    }`}
  >
    {label}
  </button>
)

export default Onboarding
