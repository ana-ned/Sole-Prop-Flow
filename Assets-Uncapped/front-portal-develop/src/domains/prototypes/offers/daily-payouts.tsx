// Daily Payouts offer module.
// Per the latest Figma the right panel is now reserved for the agreement
// summary (shared shell), so the marketplace card moved into the center
// column above the bar chart.

import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  StarAward02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import Typography from "../../../components/Basic/Typography"
import { SectionCardHeader } from "./_shared/primitives"
import { HeadlineHeroBanner } from "./_shared/hero-banner"
import { DpAddedBanner } from "./_shared/dp-added-banner"
import { MarketplaceCard } from "./_shared/marketplace-card"
import { DpBarChart } from "./_shared/dp-bar-chart"
import type { OfferModule, SummaryRowData } from "./_types"

// ---------------------------------------------------------------------------
// "Understanding your Daily Payouts" row helper
// ---------------------------------------------------------------------------

const DpUnderstandingRow = ({
  label,
  value,
  description,
}: {
  label: string
  value: string | null
  description: ReactNode
}) => (
  <div className="flex flex-col gap-1 rounded-lg px-2 py-3 transition-colors hover:bg-neutral-50">
    <div className="flex items-center justify-between gap-2">
      <Typography type="bodyTitle" color="neutral-800">{label}</Typography>
      {value && (
        <Typography type="bodyTitle" color="neutral-800" className="shrink-0 text-right">
          {value}
        </Typography>
      )}
    </div>
    <Typography type="smallCopy" color="neutral-600">{description}</Typography>
  </div>
)

// ---------------------------------------------------------------------------
// DP Config screen (middle column)
// ---------------------------------------------------------------------------

const DailyPayoutsConfig = () => (
  <div className="flex flex-col gap-y-4">
    <HeadlineHeroBanner
      headline="Get Paid Daily"
      description={
        <>
          Receive <strong>$100,000</strong> now, then{" "}
          <strong>80% of your net sales every day.</strong>{" "}
          Pause anytime, with no penalties or minimum commitment
        </>
      }
    />

    <DpAddedBanner />

    {/* Understanding your Daily Payouts */}
    <div className="overflow-hidden rounded-xl shadow-light-sm">
      <SectionCardHeader
        icon={<HugeiconsIcon icon={StarAward02SolidStandard} size={14} style={{ color: "#7286f6" }} />}
        title="Understanding your Daily Payouts"
        accentBg="#f0f2fe"
        accentBorder="#d5dbfb"
      />
      <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
        <div className="flex flex-col gap-2 overflow-hidden rounded-xl bg-white p-3 shadow-light-sm">
          <DpUnderstandingRow
            label="Initial advance"
            value="$100,000"
            description={
              <>
                Receive 80% of what Amazon already owes you today, instead of waiting weeks
                for Amazon&rsquo;s next payout.{" "}
                <span style={{ color: "#128081", fontWeight: 600 }}>
                  Learn how we calculate your initial advance
                </span>
              </>
            }
          />
          <DpUnderstandingRow
            label="Daily advance"
            value="80% of net sales"
            description="Receive 80% of each day's sales the next business day, with up to $10,000 advanced at any time"
          />
          <DpUnderstandingRow
            label="Daily fee"
            value="0.3% per day"
            description="This is applied to the outstanding advance balance each day"
          />
          <DpUnderstandingRow
            label="Repayments"
            value={null}
            description="When Amazon pays out, we collect our fees and only what's needed to keep us at 80% of your new marketplace balance"
          />
        </div>
      </div>
    </div>

    <MarketplaceCard />
    <DpBarChart />
  </div>
)

// ---------------------------------------------------------------------------
// Static agreement summary rows
// ---------------------------------------------------------------------------

const AGREEMENT_ROWS: SummaryRowData[] = [
  { label: "Advance amount", value: "$100,000" },
  { label: "Daily advance", value: "80% of net sales" },
  { label: "Daily fee", value: "0.3% per day" },
  { label: "Repayments", value: "After marketplace pay out" },
]

// ---------------------------------------------------------------------------
// Module export
// ---------------------------------------------------------------------------

const dailyPayouts: OfferModule = {
  id: "daily-payouts",
  navLabel: "Daily Payout",
  agreementName: "Daily Payout Agreement",
  ConfigContent: DailyPayoutsConfig,
  summaryTitle: "Daily Payout",
  summaryChip: { tone: "warning", label: "Additional" },
  summaryRows: AGREEMENT_ROWS,
  summaryTeaser: "80% advance rate, 0.3% daily fee",
}

export default dailyPayouts
