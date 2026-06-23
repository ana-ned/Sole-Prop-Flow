import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01SolidStandard,
  CheckmarkCircle02SolidStandard,
  CreditCardAddSolidStandard,
  Forward02SolidStandard,
  ChartUpSolidStandard,
  StarAward02SolidStandard,
  Call02SolidStandard,
  UserMultiple02SolidStandard,
  Logout03SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  MoneyBag02SolidRounded,
  PauseCircleSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Notice from "../../../components/UI/Notice"
import CardV2 from "../../../components/UI/CardV2"
import Logo from "../../../components/UI/Logo"
import amazonConnectionUrl from "../../../svgs/partners/connections/amazon.svg?url"
import dashPatternUrl from "../../../svgs/patterns/dash-pattern-light.png"

// ---------------------------------------------------------------------------
// Mock data — no real API calls anywhere in this file
// ---------------------------------------------------------------------------

const TERMS = [
  {
    label: "Initial advance",
    value: "$100,000",
    description:
      "Receive 80% of what Amazon already owes you today, instead of waiting weeks for Amazon's next payout.",
    link: "Learn how we calculate your initial advance",
  },
  {
    label: "Daily advance",
    value: "80% of net sales",
    description:
      "Receive 80% of each day's sales the next business day, with up to $10,000 advanced at any time.",
  },
  {
    label: "Daily fee",
    value: "0.3% per day",
    description: "Applied to the outstanding advance balance each day.",
  },
  {
    label: "Repayments",
    value: null,
    description:
      "When Amazon pays out, we collect our fees and only what's needed to keep us at 80% of your new marketplace balance.",
  },
]

const BENEFITS = [
  {
    icon: CreditCardAddSolidStandard,
    severity: "accent-brand" as const,
    text: "Unlock your available and deferred balance today",
  },
  {
    icon: Forward02SolidStandard,
    severity: "accent-3" as const,
    text: "Payout sent to your bank account every day",
  },
  {
    icon: ChartUpSolidStandard,
    severity: "accent-11" as const,
    text: "No need to change the bank account connected to your marketplace",
  },
  {
    icon: PauseCircleSolidRounded,
    severity: "accent-2" as const,
    text: "Pause anytime, with no penalties or minimum commitment",
  },
]

const MARKETPLACE_CONNECTIONS = [
  { name: "Amazon", account: "gaston_express" },
  { name: "Amazon", account: "gaston_ltd" },
]

const NAV_ITEMS = [
  {
    label: "Your application",
    icon: CheckmarkCircle02SolidStandard,
    severity: "accent-4" as const,
    active: false,
  },
  {
    label: "Daily Payouts",
    icon: MoneyBag02SolidRounded,
    severity: "accent-2" as const,
    active: true,
  },
  {
    label: "Term Loan",
    icon: MoneyBag02SolidRounded,
    severity: "accent-2" as const,
    active: false,
  },
]

// ---------------------------------------------------------------------------
// 14-day comparison chart — visual only, illustrative
// ---------------------------------------------------------------------------

const PayoutComparisonChart = () => {
  const days = Array.from({ length: 15 }, (_, i) => i + 1)

  return (
    <div
      className="flex flex-col gap-y-4"
      role="img"
      aria-label="Bar chart comparing marketplace 14-day payouts to daily Uncapped payouts. Marketplace pays once at day 14; Uncapped pays a small portion every day from day 1."
    >
      <div className="flex items-end gap-x-1">
        {days.map((day) => {
          const isMarketplaceDay = day === 14

          return (
            <div key={day} className="flex flex-1 flex-col items-center">
              <div className="flex h-[230px] w-full items-end justify-center">
                {isMarketplaceDay && (
                  <div className="relative h-full w-full overflow-hidden rounded-t bg-white">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${dashPatternUrl})`,
                        backgroundSize: "10px 10px",
                        backgroundRepeat: "repeat",
                      }}
                    />
                    <div className="absolute inset-0 bg-neutral-300 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#ffc266] mix-blend-overlay" />
                  </div>
                )}
              </div>
              <div className="mt-2 w-full border-t border-neutral-400 pt-2">
                <Typography
                  type="smallCopy"
                  color="neutral-700"
                  className="text-center"
                >
                  Day
                  <br />
                  {day}
                </Typography>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend — forced single line to match Figma */}
      <div className="flex flex-nowrap gap-x-4 pt-2">
        <LegendItem
          label="Marketplace Payout"
          pattern={dashPatternUrl}
          patternOverlay="#ffc266"
        />
        <LegendItem
          label="Daily Payout"
          pattern={dashPatternUrl}
          patternOverlay="#a5d3d4"
        />
        <LegendItem colorClass="bg-brand-600" label="Deferred Balance Payout" />
      </div>
    </div>
  )
}

const LegendItem = ({
  colorClass = "",
  label,
  pattern,
  patternOverlay,
}: {
  colorClass?: string
  label: string
  pattern?: string
  patternOverlay?: string
}) => (
  <div className="flex shrink-0 items-center gap-x-2">
    {pattern ? (
      <div className="relative size-[14px] shrink-0 overflow-hidden rounded-sm bg-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${pattern})`,
            backgroundSize: "10px 10px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="absolute inset-0 bg-neutral-300 mix-blend-multiply" />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{ backgroundColor: patternOverlay ?? "#ffc266" }}
        />
      </div>
    ) : (
      <div className={`size-[14px] shrink-0 rounded-sm ${colorClass}`} />
    )}
    <Typography
      type="smallCopy"
      color="neutral-800"
      className="font-semibold whitespace-nowrap"
    >
      {label}
    </Typography>
  </div>
)

// ---------------------------------------------------------------------------
// Daily Payouts offer screen prototype
// ---------------------------------------------------------------------------

const DailyPayouts = () => {
  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="flex items-start px-10 pt-10 pb-10">

        {/* ── Left column: portal nav (270px) ─────────────────────────────── */}
        <aside className="flex w-[270px] shrink-0 flex-col justify-between self-stretch pr-12">
          <div className="flex flex-col gap-y-8">
            {/* Logo */}
            <div className="px-2 pt-2">
              <Logo link={false} className="h-10 w-auto" />
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={[
                    "flex h-11 items-center gap-x-1 rounded-lg px-2 text-left transition-colors duration-150 focus-visible:shadow-focus focus:outline-none",
                    item.active
                      ? "bg-[#fbfaf9] shadow-light-sm"
                      : "hover:bg-neutral-100",
                  ].join(" ")}
                >
                  <BoxIcon
                    icon={<HugeiconsIcon icon={item.icon} />}
                    severity={item.severity}
                    size={6}
                  />
                  <Typography
                    type="body"
                    color="neutral-800"
                    className="px-2"
                  >
                    {item.label}
                  </Typography>
                </button>
              ))}
            </nav>
          </div>

          {/* Log out at bottom */}
          <button
            type="button"
            onClick={() => window.location.assign("/prototypes/registration")}
            className="flex h-11 items-center gap-x-1 rounded-lg px-2 text-left transition-colors duration-150 focus-visible:shadow-focus focus:outline-none hover:bg-neutral-100"
          >
            <BoxIcon
              icon={<HugeiconsIcon icon={Logout03SolidStandard} />}
              severity="accent-2"
              size={6}
            />
            <Typography type="body" color="neutral-800" className="px-2">
              Log out
            </Typography>
          </button>
        </aside>

        {/* ── Center column: offer content — fills available space ────────── */}
        <main className="flex flex-1 flex-col gap-y-6 pr-10">

          {/* Pre-Offer hero — gradient teal with display headline */}
          <div className="flex flex-col overflow-hidden rounded-2xl shadow-light-sm">
            <div
              className="relative flex items-center justify-center p-4"
              style={{
                background:
                  "radial-gradient(circle at 0% 80%, var(--color-brand-500, #1ebdc0) 0%, var(--color-brand-800, #004b4d) 50%, var(--color-brand-900, #002829) 100%)",
              }}
            >
              <Typography
                type="h2"
                className="text-center text-white !font-bold"
              >
                Get Paid Daily
              </Typography>
            </div>
            <div className="bg-[#fbfaf9] px-4 py-4">
              <Typography type="body" color="neutral-700">
                Receive <strong className="font-bold">$100,000</strong> now,
                then{" "}
                <strong className="font-bold">
                  80% of your net sales every day.
                </strong>
                <br />
                Pause anytime, with no penalties or minimum commitment.
              </Typography>
            </div>
          </div>

          {/* Expiry notice */}
          <Notice
            variant="warning"
            icon={<HugeiconsIcon icon={Calendar01SolidStandard} />}
          >
            Offer expires in 7 days on{" "}
            <strong className="font-bold">24 Nov 2025</strong>
          </Notice>

          {/* Breakdown — Understanding Daily Payouts */}
          <CardV2
            title="Understanding your Daily Payouts"
            icon={<HugeiconsIcon icon={StarAward02SolidStandard} />}
            severity="accent-9"
          >
            <div className="flex flex-col gap-y-2 rounded-lg bg-white p-1 shadow-light-sm">
              {TERMS.map((term) => (
                <div
                  key={term.label}
                  className="flex flex-col gap-y-1 rounded-lg px-2 py-1"
                >
                  <div className="flex items-center justify-between gap-x-2">
                    <Typography
                      type="bodyMedium"
                      color="neutral-800"
                      className="flex-1"
                    >
                      {term.label}
                    </Typography>
                    {term.value && (
                      <Typography
                        type="bodyTitle"
                        color="neutral-800"
                        className="text-right"
                      >
                        {term.value}
                      </Typography>
                    )}
                  </div>
                  <Typography type="smallCopy" color="neutral-700">
                    {term.description}
                    {term.link && (
                      <>
                        {" "}
                        <span className="font-bold text-brand-600">
                          {term.link}
                        </span>
                      </>
                    )}
                  </Typography>
                </div>
              ))}
            </div>
          </CardV2>

          {/* Comparison chart card — title inside body (matches Figma, no card header) */}
          <div className="rounded-xl bg-[#fbfaf9] p-4">
            <div className="flex flex-col gap-y-4 rounded-xl bg-white p-4 shadow-light-sm">
              <Typography type="body" color="neutral-800">
                Your competitors get paid every 14 days.{" "}
                <strong className="font-bold">You don't have to</strong>
              </Typography>
              <PayoutComparisonChart />
            </div>
          </div>

          {/* Calculator link card */}
          <div className="rounded-lg bg-white p-1 shadow-light-sm">
            <div className="flex items-center gap-x-3 rounded-lg px-2 py-1">
              <Typography
                type="bodyMedium"
                color="neutral-800"
                className="flex-1"
              >
                Calculate your advances and repayments over time
              </Typography>
              <Button type="button" variant="secondary" size="sm">
                View
              </Button>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex justify-end">
            <Button type="button" variant="primary">
              Accept offer
            </Button>
          </div>
        </main>

        {/* ── Right column: contextual rail ───────────────────────────────── */}
        <aside className="flex w-[400px] shrink-0 flex-col gap-y-6">

          {/* Quick action chips */}
          <div className="flex flex-wrap justify-end gap-1">
            <button
              type="button"
              className="flex h-11 items-center gap-x-1 rounded-lg px-2 transition-colors duration-150 focus-visible:shadow-focus focus:outline-none hover:bg-neutral-100"
            >
              <BoxIcon
                icon={<HugeiconsIcon icon={Call02SolidStandard} />}
                severity="accent-brand"
                size={6}
              />
              <Typography type="body" color="neutral-800" className="px-2">
                Book a call
              </Typography>
            </button>
            <button
              type="button"
              className="flex h-11 items-center gap-x-1 rounded-lg px-2 transition-colors duration-150 focus-visible:shadow-focus focus:outline-none hover:bg-neutral-100"
            >
              <BoxIcon
                icon={<HugeiconsIcon icon={UserMultiple02SolidStandard} />}
                severity="accent-9"
                size={6}
              />
              <Typography type="body" color="neutral-800" className="px-2">
                Invite team
              </Typography>
            </button>
          </div>

          {/* Marketplace connections card */}
          <CardV2
            title="Marketplace"
            icon={<HugeiconsIcon icon={StarAward02SolidStandard} />}
            severity="accent-9"
          >
            <div className="flex flex-col gap-y-2 rounded-lg bg-white p-1 shadow-light-sm">
              {MARKETPLACE_CONNECTIONS.map((conn) => (
                <div
                  key={conn.account}
                  className="flex items-center gap-x-3 rounded-lg px-2 py-1"
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-300 bg-neutral-100"
                    aria-label="Amazon"
                  >
                    <img
                      src={amazonConnectionUrl}
                      alt=""
                      className="size-7"
                    />
                  </div>
                  <div className="flex flex-1 items-center gap-x-1">
                    <Typography type="bodyMedium" color="neutral-800">
                      {conn.name}
                    </Typography>
                    <Typography type="smallCopy" color="neutral-700">
                      —
                    </Typography>
                    <Typography type="smallCopy" color="neutral-700">
                      {conn.account}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </CardV2>

          {/* Why we're better card */}
          <div className="flex flex-col overflow-hidden rounded-xl shadow-light-sm">
            <div className="flex items-center gap-x-3 border-b border-neutral-200 bg-white px-4 py-3">
              <Typography type="bodyTitle" color="neutral-800" className="flex-1">
                Benefits to your business
              </Typography>
            </div>
            <div className="flex flex-col gap-y-6 bg-[#fbfaf9] px-6 py-6">
              {BENEFITS.map((benefit) => (
                <div key={benefit.text} className="flex items-start gap-x-4">
                  <BoxIcon
                    icon={<HugeiconsIcon icon={benefit.icon} />}
                    severity={benefit.severity}
                    size={6}
                  />
                  <Typography
                    type="body"
                    color="neutral-800"
                    className="flex-1"
                  >
                    {benefit.text}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default DailyPayouts
