// Hero banner used at the top of every offer's config screen.
// Supports two modes:
//   - amount mode: small caption + huge amount (TL: "Your offer" + $100,000, CA: "Your offer, up to" + $100,000)
//   - headline-only mode: a single large headline (DP: "Get Paid Daily")
// Optional white footer with a description paragraph.

import type { ReactNode } from "react"
import Typography from "../../../../components/Basic/Typography"
import { formatCurrency } from "./primitives"

const GRADIENT_BG = [
  "radial-gradient(ellipse 60% 80% at 110% 100%, rgba(30,189,192,0.55) 0%, rgba(30,189,192,0) 60%)",
  "radial-gradient(ellipse 60% 80% at -10% 100%, rgba(30,189,192,0.45) 0%, rgba(30,189,192,0) 60%)",
  "linear-gradient(180deg, #003335 0%, #004b4d 60%, #00595c 100%)",
].join(", ")

export const OfferHeroBanner = ({
  caption,
  amount,
  description,
}: {
  caption: string
  amount: number
  description?: ReactNode
}) => (
  <div className="overflow-hidden rounded-2xl shadow-light-sm">
    <div
      className="relative flex flex-col items-center gap-1 overflow-hidden px-4 pb-4 pt-4"
      style={{ backgroundImage: GRADIENT_BG }}
    >
      <Typography type="bodyMedium" color="neutral-100" className="relative text-center text-white">
        {caption}
      </Typography>
      <span
        className="relative font-heading text-[48px] font-bold leading-none text-white"
        style={{ fontVariationSettings: "'FLAR' 0, 'VOLM' 0" }}
      >
        {formatCurrency(amount)}
      </span>
    </div>
    {description && (
      <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
        <Typography type="body" color="neutral-700">
          {description}
        </Typography>
      </div>
    )}
  </div>
)

export const HeadlineHeroBanner = ({
  headline,
  description,
}: {
  headline: string
  description?: ReactNode
}) => (
  <div className="overflow-hidden rounded-2xl shadow-light-sm">
    <div
      className="relative flex h-20 items-center justify-center px-4"
      style={{ backgroundImage: GRADIENT_BG }}
    >
      <span
        className="relative font-heading text-[32px] font-bold leading-none text-white"
        style={{ fontVariationSettings: "'FLAR' 0, 'VOLM' 0" }}
      >
        {headline}
      </span>
    </div>
    {description && (
      <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
        <Typography type="body" color="neutral-700">
          {description}
        </Typography>
      </div>
    )}
  </div>
)
