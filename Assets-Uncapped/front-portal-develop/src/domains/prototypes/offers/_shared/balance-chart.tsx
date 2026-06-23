// "Your balance over time" — stepped line chart for the Term Loan config step.
// 5 plateaus dropping 100k each, plotted against a 6-row grid (500k → 0).
//
// Layout is pixel-aligned: every grid line, label and step sits on the same
// 24px rhythm.  The SVG stroke uses `vector-effect="non-scaling-stroke"` so
// the line stays a constant 2px regardless of horizontal scaling.

import { HugeiconsIcon } from "@hugeicons/react"
import { ChartDownSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { SectionCardHeader } from "./primitives"

const LABELS = ["500k", "400k", "300k", "200k", "100K", "0"]
const ROW = 24                // px between adjacent y-axis grid lines
const PLOT_H = ROW * 5        // 5 rows of vertical space = 120px

// Stepped descent: 5 plateaus, each one row lower than the previous.
// Plateaus sit halfway between adjacent grid lines (≈450k, 350k, 250k, 150k, 50k).
// viewBox is 240 × 120 — same proportions as PLOT_H so vertical scale is 1:1.
const LINE_PATH =
  "M 0,12 L 48,12 L 48,36 L 96,36 L 96,60 L 144,60 L 144,84 L 192,84 L 192,108 L 240,108"
const FILL_PATH = `${LINE_PATH} L 240,${PLOT_H} L 0,${PLOT_H} Z`

export const BalanceChart = ({
  title = "Your balance over time",
  labels = LABELS,
}: {
  title?: string
  labels?: string[]
} = {}) => (
  <div className="overflow-hidden rounded-xl shadow-light-sm">
    <SectionCardHeader
      icon={<HugeiconsIcon icon={ChartDownSolidStandard} size={14} style={{ color: "#33c655" }} />}
      title={title}
      accentBg="#e7f8eb"
      accentBorder="#c9e9d0"
    />
    <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
      <div className="flex gap-3" style={{ height: PLOT_H }}>
        {/* Y-axis label column — each label centered on its grid line */}
        <div className="relative w-9 shrink-0">
          {labels.map((label, i) => (
            <span
              key={label}
              className="absolute right-0 font-primary text-[12px] font-bold leading-none"
              style={{ top: i * ROW, transform: "translateY(-50%)", color: "#374d53" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Plot area — grid lines + SVG step chart */}
        <div className="relative flex-1">
          {labels.map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-dashed"
              style={{ top: i * ROW, borderColor: "#d7dee0" }}
              aria-hidden
            />
          ))}
          <svg
            viewBox={`0 0 240 ${PLOT_H}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            aria-label="Balance declining over loan term"
            role="img"
          >
            <path d={FILL_PATH} fill="#1ebdc0" fillOpacity="0.12" />
            <path
              d={LINE_PATH}
              fill="none"
              stroke="#1ebdc0"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className="flex justify-between pl-[48px] pt-3">
        <span className="font-primary text-[12px] font-bold" style={{ color: "#374d53" }}>16 Sept 2024</span>
        <span className="font-primary text-[12px] font-bold" style={{ color: "#374d53" }}>27 Aug 2025</span>
      </div>
    </div>
  </div>
)
