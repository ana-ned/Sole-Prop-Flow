// "Your competitors get paid every 14 days. You don't have to" — DP bar chart.
// Single tall striped bar on Day 14 only; nested cards with the calculate row below.

import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import { stripeFill, LegendSwatch } from "./chart-bits"

const STRIPE_MARKETPLACE = "#ffc266" // accent-2/secondary-400
const STRIPE_DAILY = "#a5d3d4"       // brand-400
const SOLID_DEFERRED = "#128081"     // brand-600

export const DpBarChart = () => {
  const days = Array.from({ length: 15 }, (_, i) => i + 1)
  return (
    <div className="flex flex-col gap-2 rounded-xl p-4 shadow-light-sm" style={{ backgroundColor: "#fbfaf9" }}>
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-light-sm">
        <p className="font-primary text-[16px] leading-[1.5]" style={{ color: "#193a43" }}>
          Your competitors get paid every 14 days.{" "}
          <strong className="font-semibold">You don&rsquo;t have to</strong>
        </p>

        <div className="flex border-b" style={{ height: 250, borderColor: "#c1cacd" }}>
          {days.map((d) => (
            <div key={d} className="flex h-full flex-1 flex-col justify-end px-1">
              {d === 14 && (
                <div
                  className="w-full rounded-t-[2px]"
                  style={{
                    height: "92%",
                    backgroundColor: "#ffffff",
                    backgroundImage: stripeFill(STRIPE_MARKETPLACE),
                  }}
                  aria-label="Marketplace payout on day 14"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex pt-2">
          {days.map((d) => (
            <div
              key={d}
              className="flex flex-1 justify-center font-primary text-[14px] leading-[1.5] text-center"
              style={{ color: "#374d53" }}
            >
              <span>Day<br />{d}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendSwatch fill={stripeFill(STRIPE_MARKETPLACE)} label="Marketplace Payout" />
          <LegendSwatch fill={stripeFill(STRIPE_DAILY)} label="Daily Payout" />
          <LegendSwatch fill={SOLID_DEFERRED} label="Deferred Balance Payout" solid />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-white p-1 shadow-light-sm">
        <div className="flex flex-1 items-center pl-[6px] pr-2 py-1">
          <Typography type="bodyMedium" color="neutral-800" className="flex-1">
            Calculate your advances and repayments over time
          </Typography>
        </div>
        <Button type="button" variant="secondary" size="sm">View</Button>
      </div>
    </div>
  )
}
