// "Example of how payments are charged" — Merchant Cash Advance weekly bar chart.
// Five weeks; bar height proportional to payment amount; Week 3 shows "No payment".

import Typography from "../../../../components/Basic/Typography"
import { stripeFill } from "./chart-bits"
import { formatCurrency } from "./primitives"

const MCA_CHART_WEEKS = [
  { week: 1, sales: 30000, payment: 3600 },
  { week: 2, sales: 45000, payment: 5400 },
  { week: 3, sales: 0,     payment: 0 },
  { week: 4, sales: 5000,  payment: 600 },
  { week: 5, sales: 12000, payment: 1440 },
]

export const McaBarChart = () => {
  const maxPayment = Math.max(...MCA_CHART_WEEKS.map((w) => w.payment))
  const PLOT_HEIGHT = 180

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-light-sm">
      <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: "#f0f3f4" }}>
        <Typography type="bodyTitle" color="neutral-800">
          Example of how payments are charged
        </Typography>
      </div>

      <div className="flex flex-col gap-4 px-2 py-2" style={{ backgroundColor: "#fbfaf9" }}>
        <div className="flex items-end gap-1 pt-2">
          {MCA_CHART_WEEKS.map((w) => {
            const barH = w.payment > 0 ? Math.max((w.payment / maxPayment) * PLOT_HEIGHT, 12) : 0
            return (
              <div key={w.week} className="flex flex-1 flex-col items-center">
                <div className="flex h-6 items-end pb-1">
                  {w.payment > 0 ? (
                    <span className="font-primary text-[14px] font-bold leading-[1.5]" style={{ color: "#374d53" }}>
                      {formatCurrency(w.payment)}
                    </span>
                  ) : null}
                </div>
                <div className="flex w-full items-end justify-center" style={{ height: PLOT_HEIGHT }}>
                  {w.payment > 0 ? (
                    <div
                      className="w-full max-w-[42px] rounded-t-[1px]"
                      style={{
                        height: barH,
                        backgroundColor: "#ffffff",
                        backgroundImage: stripeFill("#a5d3d4"),
                      }}
                      aria-label={`Week ${w.week} payment: ${formatCurrency(w.payment)}`}
                    />
                  ) : (
                    <span className="font-primary text-[14px] leading-[1.5]" style={{ color: "#374d53" }}>
                      No payment
                    </span>
                  )}
                </div>
                <div
                  className="w-full border-t pt-2 text-center font-primary text-[14px] leading-[1.5]"
                  style={{ borderColor: "#c1cacd", color: "#374d53" }}
                >
                  <div>Week {w.week}</div>
                  <div>{w.sales === 0 ? "$0" : formatCurrency(w.sales)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-2 pb-2">
          <span className="size-[14px] shrink-0 rounded-[2px]" style={{ backgroundColor: "#128081" }} aria-hidden />
          <span className="font-primary text-[14px] font-semibold leading-[1.5]" style={{ color: "#193a43" }}>
            Payments: 12% of weekly sales
          </span>
        </div>
      </div>
    </div>
  )
}
