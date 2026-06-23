import clsx from "clsx"
import { format } from "../../../utils/money"
import Typography from "../../Basic/Typography"

interface AmountBarSegment {
  amount: number
  label: string
  color: string
  stripeColor?: string
  emphasis?: boolean
}

interface AmountBarProps {
  segments: AmountBarSegment[]
  currency: string
  className?: string
  showLegend?: boolean
}

const getStripeBg = (stripeColor: string) => {
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${stripeColor}`)
    .trim()

  if (!color) return undefined

  return `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='5' height='5'><path d='M0,5 L5,0 M-0.5,0.5 L0.5,-0.5 M4.5,5.5 L5.5,4.5' stroke='${color}' stroke-width='1' stroke-linecap='square'/></svg>`
  )}")`
}

const AmountBar = ({
  segments,
  currency,
  className = "",
  showLegend = true,
}: AmountBarProps) => {
  const totalAmount = segments.reduce((sum, segment) => sum + segment.amount, 0)

  if (totalAmount === 0) {
    return null
  }

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <div className="flex h-[10px] w-full gap-0.5 overflow-hidden rounded-full">
        {segments.map((segment, index) => {
          if (segment.amount === 0) return null

          return (
            <div
              key={index}
              className={clsx("h-[10px]", `bg-${segment.color}`)}
              style={{
                width: `${(segment.amount / totalAmount) * 100}%`,
                ...(segment.stripeColor && {
                  backgroundImage: getStripeBg(segment.stripeColor),
                }),
              }}
            />
          )
        })}
      </div>

      {showLegend && (
        <div className="flex flex-wrap gap-4">
          {segments.map((segment, index) => {
            if (segment.amount === 0) return null

            const formattedAmount = format(segment.amount, currency, {
              minimumFractionDigits: 2,
            })

            return (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={clsx(
                    "h-4 w-4 shrink-0 rounded",
                    `bg-${segment.color}`
                  )}
                  style={{
                    ...(segment.stripeColor && {
                      backgroundImage: getStripeBg(segment.stripeColor),
                    }),
                  }}
                />
                <Typography
                  type="smallCopy"
                  color={segment.emphasis ? "neutral-800" : "neutral-700"}
                  className={segment.emphasis ? "!font-bold" : "!font-semibold"}
                >
                  {formattedAmount} - {segment.label}
                </Typography>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AmountBar
