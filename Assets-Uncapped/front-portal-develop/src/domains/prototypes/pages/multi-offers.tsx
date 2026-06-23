import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02SolidStandard,
  Call02SolidStandard,
  UserMultiple02SolidStandard,
  Logout03SolidStandard,
  ArrowRight01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  MoneyBag02SolidRounded,
  MoneyReceive02SolidRounded,
  FlashSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"
import dashPatternUrl from "../../../svgs/patterns/dash-pattern-light.png"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ScalingOfferId = "term-loan" | "cash-advance"
type CardId = ScalingOfferId | "daily-payouts"

// ---------------------------------------------------------------------------
// Mock data (placeholders — copy will be filled in later)
// ---------------------------------------------------------------------------

// Bar viz heights (0–100) per card. Term Loan = uniform max, Cash Advance =
// varied, Daily Payouts = many tiny uniform bars.
const TERM_LOAN_BARS = Array(12).fill(100)
const CASH_ADVANCE_BARS = [100, 38, 52, 67, 29, 100, 67, 90, 100, 67, 100, 81]
const DAILY_PAYOUTS_BARS = Array(25).fill(57)

type CardStat = { title: string; value: string; label: string }

type CardCfg = {
  name: string
  icon: typeof MoneyBag02SolidRounded
  iconSeverity: "accent-brand" | "accent-3" | "accent-2"
  chip: { label: string; tone: "success" | "warning" } | null
  headline: string
  subline: string
  bars: number[]
  barFill: string
  barOverlay: string
  stats: CardStat[]
}

const CARDS: Record<CardId, CardCfg> = {
  "term-loan": {
    name: "Term Loan",
    icon: MoneyBag02SolidRounded,
    iconSeverity: "accent-brand",
    chip: { label: "Best fit", tone: "success" },
    headline: "$80,000",
    subline: "Fixed monthly repayments",
    bars: TERM_LOAN_BARS,
    barFill: "#eaf6f6", // brand-200
    barOverlay: "#128081", // brand-600
    stats: [
      { title: "Fee", value: "12%", label: "flat" },
      { title: "Max Term", value: "9 mo", label: "fixed" },
      { title: "Start", value: "day 60", label: "holidays available" },
    ],
  },
  "cash-advance": {
    name: "Cash Advance",
    icon: MoneyReceive02SolidRounded as typeof MoneyBag02SolidRounded,
    iconSeverity: "accent-3",
    chip: null,
    headline: "$80,000",
    subline: "Repay with % of weekly sales",
    bars: CASH_ADVANCE_BARS,
    barFill: "#e5f5ff", // info-200
    barOverlay: "#0a7bc7", // info-600
    stats: [
      { title: "Fee", value: "$12,000", label: "fixed" },
      { title: "Revenue Share", value: "12%", label: "of weekly sales" },
    ],
  },
  "daily-payouts": {
    name: "Daily Payouts",
    icon: FlashSolidRounded,
    iconSeverity: "accent-2",
    chip: { label: "Optional", tone: "warning" },
    headline: "Get paid daily",
    subline: "Cashflow on demand",
    bars: DAILY_PAYOUTS_BARS,
    barFill: "#fff0d6", // secondary-200
    barOverlay: "#9e5700", // secondary-600
    stats: [
      { title: "Advance Rate", value: "80%", label: "of net sales" },
      { title: "Daily Fee %", value: "0.3%", label: "no end date" },
    ],
  },
}

// ---------------------------------------------------------------------------
// Detail panel content — copy lifted from Figma. The first card title +
// content differ between the two scaling offers; the third card flips between
// the "add" promo (when DP is off) and the "benefits" view (when DP is on).
// ---------------------------------------------------------------------------

const SCALING_DETAILS: Record<
  ScalingOfferId,
  {
    benefitsTitle: string
    benefits: string[]
    howItWorksTitle: string
    howItWorks: string[]
  }
> = {
  "term-loan": {
    benefitsTitle: "Term Loan benefits",
    benefits: [
      "Predictable repayments cashflow",
      "No early repayment fees",
      "Top up available as you repay",
    ],
    howItWorksTitle: "How Term Loan works",
    howItWorks: [
      "12 equal monthly payments",
      "Automatic direct debit each month",
      "Total cost fixed at signing",
    ],
  },
  "cash-advance": {
    benefitsTitle: "Cash Advance benefits",
    benefits: [
      "Flexible repayments — pay as you sell",
      "Invest before revenues catch up",
      "Simple fixed fee — no interest",
    ],
    howItWorksTitle: "How Cash Advance works",
    howItWorks: [
      "Weekly automatic payments",
      "No fixed end date",
      "Repayments pause if sales pause",
    ],
  },
}

const DAILY_PAYOUTS_ADD = {
  title: "Add Daily Payouts",
  body: "Stack Daily Payouts on top to smooth your day-to-day cashflow. Add now or activate any time from your dashboard.",
}

const DAILY_PAYOUTS_BENEFITS = {
  title: "Daily Payouts benefits",
  bullets: [
    "Faster cashflow vs 14-day cycle",
    "Use anytime, pause anytime",
    "No fixed term or commitment",
  ],
}

// ---------------------------------------------------------------------------
// Bar visualisation
// ---------------------------------------------------------------------------

const BarViz = ({
  bars,
  fill,
  overlay,
}: {
  bars: number[]
  fill: string
  overlay: string
}) => {
  const maxH = 21
  const minH = 6
  return (
    <div
      className="flex h-[21px] w-[166px] items-end gap-x-[2px]"
      aria-hidden
    >
      {bars.map((h, i) => {
        const heightPx = Math.max(minH, Math.round((h / 100) * maxH))
        return (
          <div
            key={i}
            className="relative flex-1 overflow-hidden rounded-[2px]"
            style={{ height: `${heightPx}px`, backgroundColor: fill }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${dashPatternUrl})`,
                backgroundSize: "10px 10px",
                backgroundRepeat: "repeat",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: overlay,
                mixBlendMode: "color",
                opacity: 0.4,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Small chip used in card titles
// ---------------------------------------------------------------------------

const CardChip = ({
  label,
  tone,
}: {
  label: string
  tone: "success" | "warning"
}) => {
  const palette =
    tone === "success"
      ? { bg: "#f1f9f9", border: "#c1e5e6", color: "#128081" }
      : { bg: "#fff5d6", border: "#ffe48a", color: "#9e5700" }
  return (
    <span
      className="inline-flex h-5 items-center justify-center rounded-full border px-2"
      style={{ backgroundColor: palette.bg, borderColor: palette.border }}
    >
      <span
        className="font-primary leading-none whitespace-nowrap"
        style={{ fontSize: "12px", fontWeight: 600, color: palette.color }}
      >
        {label}
      </span>
    </span>
  )
}

// ---------------------------------------------------------------------------
// Offer card — used in both the Scaling and Liquidity sections
// ---------------------------------------------------------------------------

const OfferCard = ({
  cardId,
  selected,
  onToggle,
  control = "radio",
  accent = "#128081",
}: {
  cardId: CardId
  selected: boolean
  onToggle: () => void
  control?: "radio" | "checkbox"
  accent?: string
}) => {
  const cfg = CARDS[cardId]
  const isRadio = control === "radio"

  return (
    <button
      type="button"
      role={isRadio ? "radio" : "checkbox"}
      aria-checked={selected}
      onClick={onToggle}
      className={[
        "group relative flex w-full flex-col gap-y-3 rounded-lg border bg-white p-4 text-left",
        "transition-all duration-150 focus-visible:shadow-focus focus:outline-none",
        selected
          ? "shadow-light-md"
          : "border-neutral-300 shadow-light-sm hover:border-brand-400 hover:shadow-light-md",
      ].join(" ")}
      style={selected ? { borderColor: accent } : undefined}
    >
      {/* Title row: icon + name + chip + control */}
      <div className="flex items-center gap-x-2">
        <BoxIcon
          icon={<HugeiconsIcon icon={cfg.icon} size={16} />}
          severity={cfg.iconSeverity}
          size={6}
        />
        <Typography type="bodyMedium" color="neutral-800">
          {cfg.name}
        </Typography>
        {cfg.chip && (
          <CardChip label={cfg.chip.label} tone={cfg.chip.tone} />
        )}
        <span className="flex-1" />
        {/* Selection control */}
        {isRadio ? (
          <span
            aria-hidden
            className={[
              "flex size-4 shrink-0 items-center justify-center rounded-full border bg-white transition-colors duration-150",
              selected
                ? ""
                : "border-neutral-400 group-hover:border-brand-400",
            ].join(" ")}
            style={selected ? { borderColor: accent } : undefined}
          >
            {selected && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
            )}
          </span>
        ) : (
          <span
            aria-hidden
            className={[
              "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150",
              selected
                ? ""
                : "border-neutral-400 bg-white group-hover:border-brand-400",
            ].join(" ")}
            style={
              selected
                ? { backgroundColor: accent, borderColor: accent }
                : undefined
            }
          >
            {selected && (
              <svg
                viewBox="0 0 12 12"
                width="10"
                height="10"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 6 L5 9 L10 3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        )}
      </div>

      {/* Headline amount */}
      <span
        style={{
          fontFamily: "'Commissioner', sans-serif",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: 1,
          color: "var(--color-neutral-800, #193a43)",
        }}
      >
        {cfg.headline}
      </span>

      {/* Subline */}
      <Typography
        type="smallCopy"
        color="neutral-700"
        className="block min-h-[1.25rem]"
      >
        {cfg.subline}
      </Typography>

      {/* Bar viz */}
      <BarViz bars={cfg.bars} fill={cfg.barFill} overlay={cfg.barOverlay} />

      {/* Divider */}
      <div className="border-t border-neutral-200" />

      {/* Stats — card-specific copy from Figma */}
      <div className="flex items-start gap-x-8">
        {cfg.stats.map((stat, i) => (
          <div key={i} className="flex flex-col gap-y-0.5">
            <Typography type="smallCopy" color="neutral-700">
              {stat.title}
            </Typography>
            <Typography type="bodyTitle" color="neutral-800">
              {stat.value}
            </Typography>
            <Typography type="footnote" color="neutral-700">
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Triangle pointer + detail panel (3 placeholder cards)
// ---------------------------------------------------------------------------

const DetailPanel = ({
  selectedOffer,
  dailyPayoutsAdded,
  accent,
}: {
  selectedOffer: ScalingOfferId
  dailyPayoutsAdded: boolean
  accent: string
}) => {
  // Triangle X positions are computed against the actual layout:
  // Scaling section width = (panel width − Liquidity 348px − gap 20px).
  // Inside Scaling: 16px padding, two equal cards with an 8px gap.
  // Liquidity section is fixed 348px on the right; its card has 16px padding,
  // so its centre is 174px from the section's left edge → (100% − 174px).
  const scalingW = "(100% - 368px)" // 348 + 20
  const cardW = `((${scalingW} - 40px) / 2)`
  const scalingTriangleX =
    selectedOffer === "term-loan"
      ? `calc(16px + ${cardW} / 2)`
      : `calc(16px + ${cardW} + 8px + ${cardW} / 2)`
  const dailyPayoutsTriangleX = `calc(100% - 174px)`

  // One triangle per active card (always at least the scaling one)
  const triangleXs = dailyPayoutsAdded
    ? [scalingTriangleX, dailyPayoutsTriangleX]
    : [scalingTriangleX]

  return (
    <div className="relative w-full">
      {/* Pointer area — sits above the panel body.
          Updated to match Figma 10572:11600 — 32px tall, 1px outline, 2px teal strip. */}
      <div
        className="flex h-[32px] w-full flex-col items-stretch justify-end"
        aria-hidden
      >
        {/* Accent bar with accent triangle(s) on top.
            -mb-[14px] overlap leaves a 2px teal strip visible at the top. */}
        <div className="relative -mb-[14px] h-4 w-full">
          <div
            className="h-full w-full rounded-t-[8px] transition-colors duration-200"
            style={{ backgroundColor: accent }}
          />
          {triangleXs.map((x, i) => (
            <svg
              key={`accent-${i}`}
              className="absolute -top-[13px] transition-[left,fill] duration-200"
              style={{ left: x, transform: "translateX(-50%)" }}
              width="30"
              height="13"
              viewBox="0 0 30 13"
              fill="none"
            >
              <path d="M0 13 L15 0 L30 13 Z" fill={accent} />
            </svg>
          ))}
        </div>

        {/* White bar with smaller white triangle(s) — masks the teal triangle interior, leaving a 1px accent outline. */}
        <div className="relative h-4 w-full">
          <div
            className="h-full w-full rounded-t-[8px]"
            style={{ backgroundColor: "#ffffff" }}
          />
          {triangleXs.map((x, i) => (
            <svg
              key={`white-${i}`}
              className="absolute -top-[12px] transition-[left] duration-200"
              style={{ left: x, transform: "translateX(-50%)" }}
              width="28"
              height="12"
              viewBox="0 0 28 12"
              fill="none"
            >
              <path d="M0 12 L14 0 L28 12 Z" fill="#ffffff" />
            </svg>
          ))}
        </div>
      </div>

      {/* Panel body — three content cards lifted from Figma */}
      <div className="flex gap-x-3 rounded-b-[8px] bg-white px-4 pb-4 shadow-light-sm">
        <DetailCard
          heading={SCALING_DETAILS[selectedOffer].benefitsTitle}
          bullets={SCALING_DETAILS[selectedOffer].benefits}
        />
        <DetailCard
          heading={SCALING_DETAILS[selectedOffer].howItWorksTitle}
          bullets={SCALING_DETAILS[selectedOffer].howItWorks}
        />
        {dailyPayoutsAdded ? (
          <DetailCard
            heading={DAILY_PAYOUTS_BENEFITS.title}
            bullets={DAILY_PAYOUTS_BENEFITS.bullets}
          />
        ) : (
          <DetailCard
            heading={DAILY_PAYOUTS_ADD.title}
            body={DAILY_PAYOUTS_ADD.body}
            tone="warning"
          />
        )}
      </div>
    </div>
  )
}

const DetailCard = ({
  heading,
  bullets,
  body,
  tone = "neutral",
}: {
  heading: string
  bullets?: string[]
  body?: string
  tone?: "neutral" | "warning"
}) => {
  const isWarning = tone === "warning"
  return (
    <div
      className={[
        "flex flex-1 flex-col gap-y-2 rounded-lg border p-4",
        isWarning ? "" : "border-neutral-300",
      ].join(" ")}
      style={
        isWarning
          ? { backgroundColor: "#fff8eb", borderColor: "#ffd68f" }
          : undefined
      }
    >
      <Typography type="bodyMedium" color="neutral-800">
        {heading}
      </Typography>
      {bullets && (
        <ul className="list-disc pl-5 marker:text-neutral-500">
          {bullets.map((b, i) => (
            <li key={i}>
              <Typography type="smallCopy" color="neutral-700">
                {b}
              </Typography>
            </li>
          ))}
        </ul>
      )}
      {body && (
        <Typography type="smallCopy" color="neutral-700">
          {body}
        </Typography>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile / Tablet top bar — sticky header that replaces the sidebar at < lg.
// Two segment buttons indicate progress: Your Application (completed) and
// Your Offers (active, with `3` badge).
// ---------------------------------------------------------------------------

const MobileTopBar = () => (
  <header
    className="sticky top-0 z-30 flex flex-col gap-y-3 border-b border-neutral-200 bg-white px-4 pt-3 pb-3 xl:hidden"
    aria-label="Application progress"
  >
    {/* Top row: centered logo + overflow menu button on right */}
    <div className="relative flex h-9 items-center justify-center">
      <Logo link={false} className="h-6 w-auto" />
      <button
        type="button"
        className="absolute right-0 flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
        aria-label="More options"
      >
        <span aria-hidden className="flex items-center gap-x-[3px]">
          <span className="size-1 rounded-full bg-neutral-700" />
          <span className="size-1 rounded-full bg-neutral-700" />
          <span className="size-1 rounded-full bg-neutral-700" />
        </span>
      </button>
    </div>

    {/* Bottom row: progress steps */}
    <nav
      className="flex items-center gap-x-2"
      aria-label="Application steps"
    >
      {/* Step 1 — completed */}
      <div className="flex h-9 items-center gap-x-2 rounded-lg px-2">
        <HugeiconsIcon
          icon={CheckmarkCircle02SolidStandard}
          className="size-5 shrink-0 text-brand-600"
        />
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#193a43",
          }}
        >
          Your Application
        </span>
      </div>
      {/* Step 2 — active */}
      <div
        className="flex h-9 items-center gap-x-2 rounded-lg px-2 shadow-light-sm"
        aria-current="step"
        style={{ backgroundColor: "#fbfaf9" }}
      >
        <BoxIcon
          icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} size={14} />}
          severity="accent-2"
          size={6}
        />
        <span
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#193a43",
          }}
        >
          Your Offers
        </span>
        <span
          className="inline-flex h-5 items-center justify-center rounded-full border px-2"
          style={{ backgroundColor: "#f1f9f9", borderColor: "#c1e5e6" }}
        >
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: "#128081",
            }}
          >
            3
          </span>
        </span>
      </div>
    </nav>
  </header>
)

// ---------------------------------------------------------------------------
// Selection Summary — replaces the triangle DetailPanel at < lg.
// Single white card with header + 3 stacked sub-cards whose titles change
// based on the current selection.
// ---------------------------------------------------------------------------

const SelectionSummary = ({
  selectedOffer,
  dailyPayoutsAdded,
}: {
  selectedOffer: ScalingOfferId
  dailyPayoutsAdded: boolean
}) => {
  const scaling = SCALING_DETAILS[selectedOffer]
  return (
    <div className="flex flex-col gap-y-3 rounded-xl bg-white p-4 shadow-light-sm xl:hidden">
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "#193a43",
        }}
      >
        Your selection summary
      </span>
      <div className="flex flex-col gap-y-3">
        <DetailCard
          heading={scaling.benefitsTitle}
          bullets={scaling.benefits}
        />
        <DetailCard
          heading={scaling.howItWorksTitle}
          bullets={scaling.howItWorks}
        />
        {dailyPayoutsAdded ? (
          <DetailCard
            heading={DAILY_PAYOUTS_BENEFITS.title}
            bullets={DAILY_PAYOUTS_BENEFITS.bullets}
          />
        ) : (
          <DetailCard
            heading={DAILY_PAYOUTS_ADD.title}
            body={DAILY_PAYOUTS_ADD.body}
            tone="warning"
          />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Book-a-call card
// ---------------------------------------------------------------------------

const BookACallCard = () => (
  <div
    className="flex w-full items-center justify-between gap-x-10 rounded-2xl px-4 py-4 shadow-light-sm"
    style={{ backgroundColor: "#fbfaf9" }}
  >
    <div className="flex flex-1 items-center gap-x-3">
      <BoxIcon
        icon={<HugeiconsIcon icon={Call02SolidStandard} size={16} />}
        severity="accent-brand"
        size={6}
      />
      <div className="flex flex-1 flex-col">
        <Typography type="bodyMedium" color="neutral-800">
          Want to talk it through?
        </Typography>
        <Typography type="footnote" color="neutral-700">
          We want to ensure we fully understand the unique needs of your
          business. Book a call with your account manager today to discuss
          your application.
        </Typography>
      </div>
    </div>
    <Button type="button" variant="secondary" size="sm" className="shrink-0">
      Book a call
    </Button>
  </div>
)

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

const MultiOffers = () => {
  const [scalingOffer, setScalingOffer] =
    useState<ScalingOfferId>("term-loan")
  const [dailyPayouts, setDailyPayouts] = useState(false)

  const selectedName = CARDS[scalingOffer].name
  // Single accent shared across the panel strip + selected card borders
  // — teal when Term Loan is the scaling offer, blue when Cash Advance.
  const accent = CARDS[scalingOffer].barOverlay

  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      {/* ── Mobile / Tablet top bar ─────────────────────────────────── */}
      <MobileTopBar />

      <div className="flex items-start px-4 pt-4 pb-8 xl:px-10 xl:pt-10 xl:pb-10">
        {/* ── Sidebar — desktop only ──────────────────────────────────── */}
        <aside className="hidden xl:flex w-[270px] shrink-0 flex-col justify-between self-stretch pr-12">
          <div className="flex flex-col gap-y-8">
            <div className="px-2 pt-2">
              <Logo link={false} className="h-10 w-auto" />
            </div>
            <nav className="flex flex-col gap-y-2" aria-label="Application steps">
              {/* Step 1: completed */}
              <div className="flex h-[38px] items-center gap-x-1 rounded-lg px-2">
                <HugeiconsIcon
                  icon={CheckmarkCircle02SolidStandard}
                  className="size-6 shrink-0 text-brand-600"
                />
                <Typography type="body" color="neutral-800" className="px-2">
                  Your application
                </Typography>
              </div>
              {/* Step 2: active */}
              <div
                className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 shadow-light-sm"
                aria-current="step"
                style={{ backgroundColor: "#fbfaf9" }}
              >
                <BoxIcon
                  icon={
                    <HugeiconsIcon icon={MoneyBag02SolidRounded} size={16} />
                  }
                  severity="accent-2"
                  size={6}
                />
                <Typography
                  type="body"
                  color="neutral-800"
                  className="flex-1 px-2"
                >
                  Your Offers
                </Typography>
                <span
                  className="inline-flex h-5 items-center justify-center rounded-full border px-2"
                  style={{
                    backgroundColor: "#f1f9f9",
                    borderColor: "#c1e5e6",
                  }}
                >
                  <span
                    className="font-primary leading-none"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#128081",
                    }}
                  >
                    3
                  </span>
                </span>
              </div>
            </nav>
          </div>

          {/* Log out */}
          <div className="flex pt-8">
            <button
              type="button"
              onClick={() => window.location.assign("/prototypes/registration")}
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
        </aside>

        {/* ── Main column ─────────────────────────────────────────────── */}
        <main
          className="flex flex-1 flex-col gap-y-4 pb-24 xl:pb-0"
          aria-label="Offer selection"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-x-4">
            <div className="flex max-w-[700px] flex-col gap-y-3">
              <h1
                style={{
                  fontFamily: "'Commissioner', sans-serif",
                  fontSize: "40px",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: "var(--color-neutral-800, #193a43)",
                  margin: 0,
                }}
              >
                Your offers
              </h1>
              <Typography type="body" color="neutral-700">
                Pick what works for your business. Tap any option to see the
                full breakdown.
              </Typography>
            </div>
            {/* Top-right actions — desktop only (already covered by top bar on mobile) */}
            <div className="hidden xl:flex flex-wrap justify-end gap-x-1">
              <button
                type="button"
                className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
              >
                <BoxIcon
                  icon={<HugeiconsIcon icon={Call02SolidStandard} size={16} />}
                  severity="accent-brand"
                  size={6}
                />
                <Typography type="body" color="neutral-800" className="px-2">
                  Book a call
                </Typography>
              </button>
              <button
                type="button"
                className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
              >
                <BoxIcon
                  icon={
                    <HugeiconsIcon
                      icon={UserMultiple02SolidStandard}
                      size={16}
                    />
                  }
                  severity="accent-9"
                  size={6}
                />
                <Typography type="body" color="neutral-800" className="px-2">
                  Invite team
                </Typography>
              </button>
            </div>
          </div>

          {/* Offers + detail panel — wrapped together so the triangle
              connects naturally to the cards above (lg+ only). */}
          <div className="flex flex-col gap-y-4 xl:gap-y-0">
            <div className="flex flex-col items-stretch gap-y-4 xl:flex-row xl:gap-x-5 xl:gap-y-0">
              {/* Scaling — main offers */}
              <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-light-sm xl:flex-1">
                <div className="flex flex-col gap-y-1 px-4 py-4">
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      lineHeight: 1.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#879092",
                    }}
                  >
                    Offers
                  </span>
                  <Typography type="bodyTitle" color="neutral-800">
                    Capital to grow your business
                  </Typography>
                </div>
                {/* Card grid — stacked < lg, 2-col lg+ */}
                <div
                  className="flex flex-col gap-y-3 px-4 py-4 xl:grid xl:grid-cols-2 xl:gap-x-2 xl:gap-y-0"
                  style={{ backgroundColor: "#fbfaf9" }}
                  role="radiogroup"
                  aria-label="Choose scaling offer"
                >
                  <OfferCard
                    cardId="term-loan"
                    selected={scalingOffer === "term-loan"}
                    onToggle={() => setScalingOffer("term-loan")}
                    accent={accent}
                  />
                  <OfferCard
                    cardId="cash-advance"
                    selected={scalingOffer === "cash-advance"}
                    onToggle={() => setScalingOffer("cash-advance")}
                    accent={accent}
                  />
                </div>
              </div>

              {/* Liquidity — add-on. Full-width < lg, fixed 348px lg+ */}
              <div className="flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-light-sm xl:w-[348px] xl:shrink-0">
                <div className="flex flex-col gap-y-1 px-4 py-4">
                  <span
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      lineHeight: 1.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#879092",
                    }}
                  >
                    Optional add-on
                  </span>
                  <Typography type="bodyTitle" color="neutral-800">
                    Unlock your daily cashflow
                  </Typography>
                </div>
                <div
                  className="px-4 py-4"
                  style={{ backgroundColor: "#fff6e5" }}
                >
                  <OfferCard
                    cardId="daily-payouts"
                    selected={dailyPayouts}
                    onToggle={() => setDailyPayouts(!dailyPayouts)}
                    control="checkbox"
                    accent={accent}
                  />
                </div>
              </div>
            </div>

            {/* Desktop detail panel with triangle pointer (lg+ only) */}
            <div className="hidden xl:block">
              <DetailPanel
                selectedOffer={scalingOffer}
                dailyPayoutsAdded={dailyPayouts}
                accent={accent}
              />
            </div>

            {/* Mobile / Tablet selection summary (< xl only) */}
            <SelectionSummary
              selectedOffer={scalingOffer}
              dailyPayoutsAdded={dailyPayouts}
            />
          </div>

          {/* Book a call card */}
          <BookACallCard />

          {/* Bottom CTA row — sticky at viewport bottom on mobile / tablet
              with a gradient backdrop fading from transparent (top) to
              solid white (bottom) so content scrolls into it naturally.
              Inline within the main flow on desktop (xl+). */}
          <div
            className="fixed bottom-0 left-0 right-0 z-30 flex w-full items-center justify-between gap-x-4 px-4 pt-8 pb-4 xl:static xl:!bg-none xl:p-0 xl:pt-2"
            style={{
              background:
                "linear-gradient(to bottom, rgba(247, 244, 242, 0) 0%, rgba(255, 255, 255, 0.92) 45%, rgba(255, 255, 255, 1) 100%)",
            }}
          >
            <Typography type="bodyMedium" color="neutral-800">
              {/* Status — matches Figma: "X selected" or "X + Daily Payout selected" */}
              {dailyPayouts
                ? `${selectedName} + Daily Payout selected`
                : `${selectedName} selected`}
            </Typography>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                if (scalingOffer === "term-loan" && dailyPayouts) {
                  window.location.href = "/prototypes/accept-term-loan-daily-payouts"
                } else if (scalingOffer === "cash-advance" && dailyPayouts) {
                  window.location.href = "/prototypes/accept-cash-advance-daily-payouts"
                } else if (scalingOffer === "term-loan") {
                  window.location.href = "/prototypes/accept-term-loan"
                } else if (scalingOffer === "cash-advance") {
                  window.location.href = "/prototypes/accept-cash-advance"
                }
              }}
            >
              {/* Short label on mobile, full label on desktop */}
              <span className="xl:hidden">Continue</span>
              <span className="hidden xl:inline">
                {dailyPayouts
                  ? `Continue with ${selectedName} + Daily Payouts`
                  : `Continue with ${selectedName}`}
              </span>
              <HugeiconsIcon
                icon={ArrowRight01SolidStandard}
                className="ml-2 size-4"
              />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MultiOffers
