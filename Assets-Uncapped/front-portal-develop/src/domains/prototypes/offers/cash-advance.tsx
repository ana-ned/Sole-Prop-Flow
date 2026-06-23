// Cash Advance offer module.
// Owns: CA config screen (hero "Your offer, up to", 3-up offer card grid, offer summary)
// + the CA right panel (MCA bar chart + why-we're-better-CA).

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  File01SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import Typography from "../../../components/Basic/Typography"
import { formatCurrency, SectionCardHeader } from "./_shared/primitives"
import { OfferHeroBanner } from "./_shared/hero-banner"
import { OfferExpiryNotice } from "./_shared/notice"
import { McaBarChart } from "./_shared/mca-bar-chart"
import type { OfferModule, SummaryRowData } from "./_types"

// ---------------------------------------------------------------------------
// Offer options (3-up grid)
// ---------------------------------------------------------------------------

type OptionId = "opt-100k" | "opt-80k" | "opt-50k"

type CaOption = {
  id: OptionId
  amount: number
  fee: number
  paymentRate: number // % of weekly sales (decimal)
}

const OPTIONS: CaOption[] = [
  { id: "opt-100k", amount: 100000, fee: 15000, paymentRate: 0.12 },
  { id: "opt-80k",  amount: 80000,  fee: 12000, paymentRate: 0.10 },
  { id: "opt-50k",  amount: 50000,  fee: 7500,  paymentRate: 0.07 },
]

const MAX_AMOUNT = 100000

// ---------------------------------------------------------------------------
// CA Config screen (middle column)
// ---------------------------------------------------------------------------

const CaSummaryRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-2 rounded-lg pl-1.5 pr-2 py-1">
    <span className="flex-1 font-primary text-[16px] font-semibold leading-[1.5]" style={{ color: "#193a43" }}>
      {label}
    </span>
    <span className="shrink-0 font-primary text-[16px] font-bold leading-[1.5] text-right" style={{ color: "#193a43" }}>
      {value}
    </span>
  </div>
)

const CashAdvanceConfig = () => {
  const [selectedId, setSelectedId] = useState<OptionId>("opt-100k")
  const selected = OPTIONS.find((o) => o.id === selectedId) ?? OPTIONS[0]

  return (
    <div className="flex flex-col gap-y-4">
      {/* Hero — "Your offer, up to" + max amount */}
      <OfferHeroBanner caption="Your offer, up to" amount={MAX_AMOUNT} />

      <OfferExpiryNotice />

      {/* 3-up offer card grid */}
      <div className="flex flex-col gap-2">
        <Typography type="bodyTitle" color="neutral-800">Select an offer</Typography>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Cash advance offer options">
          {OPTIONS.map((opt) => {
            const isSelected = opt.id === selectedId
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelectedId(opt.id)}
                className={[
                  "flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all duration-150",
                  "focus-visible:shadow-focus focus:outline-none active:scale-[0.99]",
                  isSelected ? "shadow-light-lg" : "shadow-light-sm hover:shadow-light-md",
                ].join(" ")}
                style={{
                  backgroundColor: "#ffffff",
                  border: isSelected ? "1px solid #128081" : "1px solid transparent",
                }}
              >
                <span
                  className="font-heading text-[24px] font-bold leading-[1.3]"
                  style={{ color: "#193a43", fontVariationSettings: "'FLAR' 0, 'VOLM' 0" }}
                >
                  {formatCurrency(opt.amount)}
                </span>
                <span
                  className="inline-flex flex-wrap items-baseline gap-1 rounded-sm px-2 py-0.5 text-[12px] leading-[1.5]"
                  style={{ backgroundColor: "#eaf6f6", color: "#00696b" }}
                >
                  <span>Fixed fee:</span>
                  <strong className="font-bold">{formatCurrency(opt.fee)}</strong>
                </span>
                <span
                  className="inline-flex w-full flex-wrap items-baseline gap-1 rounded-sm px-2 py-0.5 text-[12px] leading-[1.5]"
                  style={{ backgroundColor: "#e5f5ff", color: "#005c99" }}
                >
                  <span>Payments:</span>
                  <strong className="font-bold">{Math.round(opt.paymentRate * 100)}% of weekly sales</strong>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Offer summary */}
      <div className="overflow-hidden rounded-xl shadow-light-sm">
        <SectionCardHeader
          icon={<HugeiconsIcon icon={File01SolidStandard} size={14} style={{ color: "#9a73f6" }} />}
          title="Offer summary"
          accentBg="#f4f0fe"
          accentBorder="#e0d5fb"
        />
        <div className="flex flex-col gap-2 px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
          <Typography type="body" color="neutral-700">
            Cash upfront. Flexible payments. Pay back with a percentage of your sales, so slow
            periods mean smaller payments.
          </Typography>
          <div className="flex flex-col gap-1 rounded-lg bg-white px-1.5 py-3 shadow-light-sm">
            <CaSummaryRow label="Capital you receive" value={formatCurrency(selected.amount)} />
            <CaSummaryRow label="Fixed fee" value={formatCurrency(selected.fee)} />
            <CaSummaryRow label="Total payable" value={formatCurrency(selected.amount + selected.fee)} />
            <CaSummaryRow label="Payment frequency" value="Weekly" />
            <CaSummaryRow label="Payment amount" value={`${Math.round(selected.paymentRate * 100)}% of weekly sales`} />
          </div>
        </div>
      </div>

      {/* MCA bar chart — moved from right panel to central column */}
      <McaBarChart />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Static agreement summary rows
// ---------------------------------------------------------------------------

const AGREEMENT_ROWS: SummaryRowData[] = [
  { label: "Capital you receive", value: "$100,000" },
  { label: "Fixed fee", value: "$15,000" },
  { label: "Total payable", value: "$115,000" },
  { label: "Payment frequency", value: "Weekly" },
  { label: "Payment amount", value: "12% of weekly sales" },
]

// ---------------------------------------------------------------------------
// Module export
// ---------------------------------------------------------------------------

const cashAdvance: OfferModule = {
  id: "cash-advance",
  navLabel: "Cash Advance",
  agreementName: "Cash Advance Agreement",
  ConfigContent: CashAdvanceConfig,
  summaryTitle: "Cash Advance",
  summaryChip: { tone: "success", label: "Main offer" },
  summaryRows: AGREEMENT_ROWS,
  summaryTeaser: "$100K, 12% of weekly sales",
}

export default cashAdvance
