// Term Loan offer module.
// Owns: TL config screen (hero, notice, capital, repayments selector, offer summary)
// + the TL right panel (balance chart + why-we're-better-TL).

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Invoice02SolidStandard,
  Calendar02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import Typography from "../../../components/Basic/Typography"
import { formatCurrency, PChip, SectionCardHeader } from "./_shared/primitives"
import { OfferHeroBanner } from "./_shared/hero-banner"
import { OfferExpiryNotice } from "./_shared/notice"
import { BalanceChart } from "./_shared/balance-chart"
import type { OfferModule, SummaryRowData } from "./_types"

// ---------------------------------------------------------------------------
// Constants & data
// ---------------------------------------------------------------------------

const AMOUNT_MIN = 10000
const AMOUNT_MAX = 100000
const AMOUNT_DEFAULT = 100000

type RepaymentStart = "day-30" | "day-60"

// ---------------------------------------------------------------------------
// Internal: Range slider + amount text input (only used by TL config)
// ---------------------------------------------------------------------------

const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  ariaLabel = "Adjust amount",
}: {
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  ariaLabel?: string
}) => {
  const pct = Math.round(((value - min) / (max - min)) * 100)
  return (
    <div className="relative flex h-[8px] w-full items-center">
      <div
        className="absolute left-0 h-[8px] rounded-l-full transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%`, backgroundColor: "#128081" }}
        aria-hidden
      />
      <div
        className="absolute h-[8px] rounded-r-full bg-neutral-300 transition-[left] duration-150 ease-out"
        style={{ left: `${pct}%`, right: 0 }}
        aria-hidden
      />
      <div className="absolute transition-[left] duration-150 ease-out" style={{ left: `calc(${pct}% - 9px)` }} aria-hidden>
        <div
          className="size-[18px] rounded-full border-2 border-white shadow-md transition-transform duration-100 active:scale-110"
          style={{ backgroundColor: "#128081" }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label={ariaLabel}
      />
    </div>
  )
}

const AmountInput = ({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (v: number) => void
  label: string
}) => {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw] = useState("")
  return (
    <div className="flex h-[44px] w-[175px] items-center justify-center rounded-lg border border-neutral-300 bg-white px-[10px] transition-colors focus-within:border-brand-500">
      <input
        type="text"
        value={editing ? raw : formatCurrency(value)}
        onFocus={() => { setEditing(true); setRaw(String(value)) }}
        onBlur={() => {
          setEditing(false)
          const parsed = parseInt(raw.replace(/[^0-9]/g, ""), 10)
          if (!isNaN(parsed)) onChange(Math.min(Math.max(parsed, AMOUNT_MIN), AMOUNT_MAX))
        }}
        onChange={(e) => setRaw(e.target.value)}
        className="w-full bg-transparent text-center font-primary text-[16px] font-bold text-neutral-800 outline-none"
        aria-label={label}
      />
    </div>
  )
}

const RepaymentStartSelector = ({
  value,
  onChange,
}: {
  value: RepaymentStart
  onChange: (v: RepaymentStart) => void
}) => {
  const options: { id: RepaymentStart; label: string; chip: string; chipTone: "default" | "success"; fee: string }[] = [
    { id: "day-30", label: "Start repaying on day 30", chip: "Default", chipTone: "default", fee: "10% fixed fee" },
    { id: "day-60", label: "Start repaying on day 60", chip: "Payment holiday", chipTone: "success", fee: "12% fixed fee" },
  ]
  return (
    <div className="flex flex-col gap-2 overflow-hidden rounded-xl bg-white p-4 shadow-light-sm" role="radiogroup" aria-label="Repayment start date">
      {options.map((opt) => {
        const selected = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={[
              "group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left",
              "transition-all duration-150 ease-out focus-visible:shadow-focus focus:outline-none active:scale-[0.99]",
              selected ? "bg-brand-50" : "hover:bg-neutral-100",
            ].join(" ")}
          >
            <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
              <Typography type="bodyMedium" color="neutral-800" className="shrink-0">{opt.label}</Typography>
              <PChip tone={opt.chipTone}>{opt.chip}</PChip>
            </div>
            <span
              className={[
                "ml-2 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                selected ? "border-brand-600" : "border-neutral-400 group-hover:border-brand-400",
              ].join(" ")}
              aria-hidden
            >
              {selected && <span className="size-2 rounded-full bg-brand-600" />}
            </span>
            <Typography type="smallTitle" color="neutral-800" className="shrink-0 text-right">{opt.fee}</Typography>
          </button>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TL Config screen (middle column)
//
// Per the latest Figma (node 10739:14708) the standalone "Offer summary" card
// has been removed — its data now lives in the right-panel agreement-summary
// card managed by the shell. The Balance chart moved into the central column,
// appearing under the Repayments card.
// ---------------------------------------------------------------------------

const TermLoanConfig = () => {
  const [amount, setAmount] = useState(AMOUNT_DEFAULT)
  const [repaymentStart, setRepaymentStart] = useState<RepaymentStart>("day-60")

  return (
    <div className="flex flex-col gap-y-4">
      <OfferHeroBanner
        caption="Your offer"
        amount={amount}
        description={
          <>
            This is a <strong>Term Loan</strong>. You can borrow up to a maximum of{" "}
            {formatCurrency(AMOUNT_MAX)} and pay a simple fixed fee. You&rsquo;ll repay
            in fixed equal instalments.
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
          <div className="flex flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 shadow-light-sm">
            <div className="flex items-center justify-between gap-3">
              <Typography type="bodyTitle" color="neutral-800">Amount</Typography>
              <AmountInput value={amount} onChange={setAmount} label="Capital amount" />
            </div>
            <RangeSlider min={AMOUNT_MIN} max={AMOUNT_MAX} value={amount} onChange={setAmount} ariaLabel="Capital amount" />
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
          <Typography type="body" color="neutral-700">
            The available options <strong className="text-neutral-800">will depend</strong> on the{" "}
            <strong className="text-neutral-800">repayment term</strong> you select
          </Typography>
          <div className="flex flex-col gap-4 overflow-hidden rounded-xl bg-white p-4 shadow-light-sm">
            <div className="flex items-center justify-between gap-3">
              <Typography type="bodyTitle" color="neutral-800">Amount</Typography>
              <AmountInput value={amount} onChange={setAmount} label="Repayment term amount" />
            </div>
            <RangeSlider min={AMOUNT_MIN} max={AMOUNT_MAX} value={amount} onChange={setAmount} ariaLabel="Repayment term amount" />
            <div className="flex items-center justify-between gap-3">
              <Typography type="bodyMedium" color="neutral-800">Repayment frequency</Typography>
              <Typography type="smallTitle" color="neutral-800">Monthly</Typography>
            </div>
          </div>
          <RepaymentStartSelector value={repaymentStart} onChange={setRepaymentStart} />
        </div>
      </div>

      {/* Balance chart — moved from right panel to central column */}
      <BalanceChart />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Static agreement summary rows (shown in right panel during config + sign)
// ---------------------------------------------------------------------------

const AGREEMENT_ROWS: SummaryRowData[] = [
  { label: "Advance amount", value: "$100,000" },
  { label: "Fixed fee (12%)", value: "$22,500", subLabel: "APR equivalent of 21.57%" },
  { label: "Repayment term", value: "12 months" },
  { label: "Initial repayment", value: "On day 30" },
  { label: "12 monthly repayments", value: "$9,166.67" },
]

// ---------------------------------------------------------------------------
// Module export
// ---------------------------------------------------------------------------

const termLoan: OfferModule = {
  id: "term-loan",
  navLabel: "Term Loan",
  agreementName: "Term Loan Agreement",
  ConfigContent: TermLoanConfig,
  summaryTitle: "Term Loan",
  summaryChip: { tone: "success", label: "Main offer" },
  summaryRows: AGREEMENT_ROWS,
  summaryTeaser: "$100K, 12 months, 12% fee",
}

export default termLoan
