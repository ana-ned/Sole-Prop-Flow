import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RefreshSolidStandard,
  Tick02SolidStandard,
  CreditCardSolidStandard,
  ArrowDown01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { ShoppingCart01StrokeStandard } from "@hugeicons-pro/core-stroke-standard"
import {
  Call02SolidRounded,
  UserMultiple02SolidRounded,
  InformationCircleSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"

// ---------------------------------------------------------------------------
// Sandbox-safe underwriting screen: progress + "what happens now" + book a call
// (calendar). Reached after the application is submitted; offers a demo jump to
// the offer once "ready". Figma: 5:11847 / 5:11859 / 5:11877
// ---------------------------------------------------------------------------

const SHADOW_SM = "0 0 6px rgba(0,0,0,.03), 0 1px 2px rgba(0,0,0,.07)"
const SHADOW_MD = "0 1px 8px rgba(0,0,0,.05), 0 1px 2px rgba(0,0,0,.08)"

// September 2025 — 1st falls on a Monday (Sun-first grid → one leading blank)
const CAL_OFFSET = 1
const CAL_DAYS = Array.from({ length: 30 }, (_, i) => i + 1)
const TIME_SLOTS = ["3:00 pm", "3:30 pm", "3:45 pm", "4:00 pm", "5:15 pm"]

const Underwriting = () => {
  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto flex w-full max-w-[1320px] gap-12 px-6 py-10 lg:px-10">
        <Sidebar />
        <div className="flex w-full min-w-0 flex-1 justify-between gap-10">
          <main className="w-full min-w-0 max-w-[680px] flex-1">
            <Content />
          </main>
          <TopActions />
        </div>
      </div>
    </div>
  )
}

// ===========================================================================
// Shell
// ===========================================================================

const Sidebar = () => (
  <aside
    className="hidden w-[240px] shrink-0 flex-col lg:flex"
    style={{ minHeight: "calc(100vh - 80px)" }}
  >
    <div className="px-2 pb-6 pt-1">
      <Logo link={false} className="h-7 w-auto" />
    </div>
    <nav className="flex flex-col gap-1">
      {/* Your application — done */}
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <span
          className="flex size-4 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#128081" }}
        >
          <HugeiconsIcon icon={Tick02SolidStandard} className="size-2.5 text-white" />
        </span>
        <span className="text-base text-neutral-800">Your application</span>
      </div>
      {/* Your offers — active (highlighted pill), stroke cart, 0 offers */}
      <div
        className="flex items-center gap-3 rounded-lg bg-white px-3 py-2"
        style={{ boxShadow: SHADOW_SM }}
      >
        <HugeiconsIcon
          icon={ShoppingCart01StrokeStandard}
          size={18}
          className="shrink-0 text-neutral-500"
        />
        <span className="flex-1 text-base text-neutral-800">Your offers</span>
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
// Content
// ===========================================================================

const Content = () => {
  const [date, setDate] = useState(8)
  const [time, setTime] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  return (
    <>
      {/* gradient banner + progress */}
      <div className="overflow-hidden rounded-3xl bg-white" style={{ boxShadow: SHADOW_MD }}>
        <div
          className="px-6 py-6 text-center text-white"
          style={{
            background:
              "linear-gradient(105deg, #138a86 0%, #0f6b78 45%, #1c5b86 100%)",
          }}
        >
          <p className="text-sm font-semibold opacity-85">Underwriting offers up to</p>
          <p
            className="text-[40px] font-extrabold leading-none"
            style={{ fontFamily: "Commissioner, var(--font-heading), sans-serif" }}
          >
            $100,000
          </p>
          <p className="mt-1 text-sm opacity-85">
            Repayment term <span className="font-bold">up to 12 Months</span>
          </p>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BoxIcon
                icon={<HugeiconsIcon icon={CreditCardSolidStandard} size={14} />}
                severity="accent-1"
                size={6}
              />
              <span className="text-base font-bold text-neutral-800">
                Checking for missing bank accounts…
              </span>
            </div>
            <span className="text-sm text-text-secondary">
              ETA: <span className="font-bold text-neutral-800">36 hours</span>
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: "#128081" }} />
            <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: "#e7eaeb" }} />
            <span className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: "#e7eaeb" }} />
          </div>
        </div>
      </div>

      {/* what happens now */}
      <div className="mt-4 rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
        <div className="mb-2 flex items-center gap-3">
          <BoxIcon
            icon={<HugeiconsIcon icon={InformationCircleSolidRounded} size={14} />}
            severity="accent-11"
            size={6}
          />
          <span className="text-base font-bold text-neutral-800">What happens now?</span>
        </div>
        <p className="text-sm text-text-secondary">
          We'll notify you via SMS and email when underwriting is complete or if we
          need more information. Sometimes our analysis takes longer than expected —
          this does not mean your application will be rejected.
        </p>
      </div>

      {/* book a call */}
      <div className="mt-4 rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
        <div className="mb-2 flex items-center gap-3">
          <BoxIcon
            icon={<HugeiconsIcon icon={Call02SolidRounded} size={14} />}
            severity="accent-2"
            size={6}
          />
          <span className="text-base font-bold text-neutral-800">
            Book a call with your account manager
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          We want to make sure we fully understand the unique needs of your
          business. Book a call with your account manager today to discuss your
          application.
        </p>

        {booked ? (
          <div
            className="mt-4 flex items-start gap-3 rounded-xl p-4"
            style={{ backgroundColor: "#eaf6f6" }}
          >
            <span
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "#128081" }}
            >
              <HugeiconsIcon icon={Tick02SolidStandard} size={11} className="text-white" />
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#128081" }}>
                Call booked!
              </p>
              <p className="text-sm text-text-secondary">
                {time} on September {date}, 2025 with David. We've sent you an
                email confirming the details.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* calendar */}
            <div className="rounded-xl border border-neutral-100 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: "#128081" }}
                >
                  D
                </span>
                <p className="text-sm font-bold text-neutral-800">
                  Discuss your application with David
                </p>
              </div>
              <p className="mb-2 text-sm font-semibold text-text-secondary">
                September 2025
              </p>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="py-1 text-[11px] font-bold text-text-secondary">
                    {d}
                  </span>
                ))}
                {Array.from({ length: CAL_OFFSET }).map((_, i) => (
                  <span key={`b${i}`} />
                ))}
                {CAL_DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`mx-auto flex size-8 items-center justify-center rounded-full text-sm transition-colors ${
                      d === date
                        ? "font-bold text-white"
                        : "text-neutral-800 hover:bg-neutral-100"
                    }`}
                    style={d === date ? { backgroundColor: "#193a43" } : undefined}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* duration + time slots */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-text-secondary">
                Meeting duration
              </label>
              <div className="mt-0.5 flex h-11 items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-800">
                30 min
                <HugeiconsIcon icon={ArrowDown01SolidStandard} size={16} className="text-neutral-400" />
              </div>
              <p className="mt-3 text-sm font-bold text-neutral-800">
                What time works best?
              </p>
              <p className="text-xs text-text-secondary">
                Showing times for September {date}, 2025
              </p>
              <p className="mb-2 text-xs text-text-secondary">
                UTC +00:00 Dublin, London, Lisbon
              </p>
              <div className="flex flex-col gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTime(t)}
                    className={`h-10 rounded-lg border text-sm font-semibold transition-colors ${
                      t === time
                        ? "border-brand-600 text-brand-600"
                        : "border-neutral-300 text-neutral-800 hover:border-brand-400 hover:bg-[#fbfaf9]"
                    }`}
                    style={t === time ? { backgroundColor: "#eaf6f6" } : undefined}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  disabled={!time}
                  onClick={() => setBooked(true)}
                >
                  Confirm booking
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SMS consent */}
      <div className="mt-4 rounded-2xl bg-white p-4" style={{ boxShadow: SHADOW_SM }}>
        <p className="mb-2 text-base font-bold text-neutral-800">
          Get notified about next steps
        </p>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-100 p-3">
          <p className="text-sm text-text-secondary">
            Agree to receive SMS messages from Uncapped. Message frequency varies.
            Standard message and data rates apply.{" "}
            <span className="font-bold text-brand-600">Privacy policy</span>
          </p>
          <Button type="button" variant="primary" size="sm">
            I Agree
          </Button>
        </div>
      </div>

      {/* demo jump to the offer (dev environment) */}
      <div
        className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-dashed p-4"
        style={{ borderColor: "#c1e5e6", backgroundColor: "#f1f9f9" }}
      >
        <p className="text-sm text-text-secondary">
          <span className="font-bold text-neutral-800">Demo:</span> skip the wait —
          jump ahead to when your offer is ready.
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => window.location.assign("/prototypes/multi-offers")}
        >
          View your offer
        </Button>
      </div>
    </>
  )
}

export default Underwriting
