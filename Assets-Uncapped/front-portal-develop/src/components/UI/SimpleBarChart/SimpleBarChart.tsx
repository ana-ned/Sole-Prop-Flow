import type { ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"

export const PRIMARY_SEGMENT_CLASS = "bg-brand-600"
export const BASE_SEGMENT_CLASS =
  "bg-brand-200 bg-[repeating-linear-gradient(-45deg,var(--color-brand-300),transparent_1px,transparent_4px,var(--color-brand-300)_4px,var(--color-brand-300)_5px)]"

export interface SegmentConfig {
  className?: string
  withOverlay?: boolean
}

export interface BarSegment {
  amount: number
  configIndex: number
}

export interface BarColumn {
  key?: string | number
  segments: BarSegment[]
  topLabel?: string
  bottomLabel: ReactNode
  emptyLabel?: string
}

export interface LegendItem {
  segmentIndex: number
  label: ReactNode
}

interface SimpleBarChartProps {
  segmentConfigs: SegmentConfig[]
  columns: BarColumn[]
  chartHeight?: number
  barWidth?: string
  emptyLabel?: string
  legend?: LegendItem[]
  ariaLabel?: string
  className?: string
}

const SimpleBarChart = ({
  segmentConfigs,
  columns,
  chartHeight = 151,
  barWidth = "w-10",
  emptyLabel,
  legend,
  ariaLabel,
  className,
}: SimpleBarChartProps) => {
  const maxValue =
    columns.length > 0
      ? Math.max(
          ...columns.map((c) =>
            c.segments.reduce((sum, s) => sum + s.amount, 0)
          )
        )
      : 0

  return (
    <div
      className={twMerge("flex w-full flex-col gap-4 select-none", className)}
      role="img"
      aria-label={ariaLabel}
    >
      <div className="flex w-full items-start justify-between">
        {columns.map((column, index) => {
          const columnTotal = column.segments.reduce(
            (sum, s) => sum + s.amount,
            0
          )
          const totalBarPx =
            maxValue > 0 ? (columnTotal / maxValue) * chartHeight : 0
          const showBar = columnTotal > 0

          return (
            <div
              key={column.key ?? index}
              className="relative flex min-w-0 flex-1 flex-col items-center justify-end"
              style={{ height: chartHeight + 44 }}
            >
              <div
                className="flex w-full flex-col items-center justify-end px-3"
                style={{ height: chartHeight }}
              >
                {showBar ? (
                  <div
                    className={twMerge(
                      "flex",
                      barWidth,
                      "flex-col",
                      "items-center",
                      "rounded-t-xs"
                    )}
                  >
                    {column.topLabel && (
                      <Typography type="smallTitle" color="neutral-700">
                        {column.topLabel}
                      </Typography>
                    )}
                    {column.segments.map((segment, segIndex) => {
                      const ratio =
                        columnTotal > 0 ? segment.amount / columnTotal : 0
                      const segPx = Math.round(ratio * totalBarPx)
                      if (segPx === 0) return null
                      const config = segmentConfigs[segment.configIndex] ?? {}
                      const isFirst = column.segments
                        .slice(0, segIndex)
                        .every((s) => {
                          const r = columnTotal > 0 ? s.amount / columnTotal : 0
                          return Math.round(r * totalBarPx) === 0
                        })
                      return (
                        <div
                          key={segIndex}
                          className={twMerge(
                            "w-full",
                            "overflow-hidden",
                            config.withOverlay && "relative",
                            config.className,
                            isFirst && "rounded-t-xs"
                          )}
                          style={{ height: segPx }}
                        >
                          {config.withOverlay && (
                            <div className="absolute inset-0 mix-blend-color" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mb-2 flex">
                    <Typography
                      type="smallCopy"
                      className="text-center leading-tight whitespace-pre-line"
                      color="neutral-700"
                    >
                      {column.emptyLabel ?? emptyLabel}
                    </Typography>
                  </div>
                )}
              </div>
              <div className="w-full border-t border-neutral-400 pt-2 text-center">
                <Typography
                  type="smallCopy"
                  className="whitespace-pre-line"
                  tag="p"
                  color="neutral-700"
                >
                  {column.bottomLabel}
                </Typography>
              </div>
            </div>
          )
        })}
      </div>
      {legend && legend.length > 0 && (
        <div className="flex w-full items-center justify-center gap-2 pl-3">
          {legend.map((item, legendIndex) => {
            const config = segmentConfigs[item.segmentIndex] ?? {}
            return (
              <div key={legendIndex} className="flex items-center gap-2">
                <div
                  className={twMerge(
                    "relative",
                    "size-3.5",
                    "shrink-0",
                    "overflow-hidden",
                    "rounded-sm",
                    config.className
                  )}
                >
                  {config.withOverlay && (
                    <div className="absolute inset-0 mix-blend-color" />
                  )}
                </div>
                <Typography type="smallTitle" className="font-medium!">
                  {item.label}
                </Typography>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SimpleBarChart
