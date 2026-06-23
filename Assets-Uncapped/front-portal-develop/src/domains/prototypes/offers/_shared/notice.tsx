// Offer-expires warning notice (orange). Inline-styled to bypass
// the Tailwind v4 dev safelist that drops the design-system <Notice variant="warning">.

import { HugeiconsIcon } from "@hugeicons/react"
import { DateTimeSolidStandard } from "@hugeicons-pro/core-solid-standard"

const formatExpiryDate = (d: Date) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const OFFER_EXPIRY_DATE = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return formatExpiryDate(d)
})()

const MOCK_EXPIRY_DAYS = 7

export const OfferExpiryNotice = () => (
  <div
    className="flex items-center gap-2 rounded-xl border px-3 py-2"
    style={{ backgroundColor: "#fff6e5", borderColor: "#ffd68f" }}
  >
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-md border"
      style={{ backgroundColor: "#fff0d6", borderColor: "#ffd68f" }}
    >
      <HugeiconsIcon icon={DateTimeSolidStandard} size={14} style={{ color: "#ffac30" }} />
    </span>
    <p className="text-[14px] leading-[1.5]" style={{ color: "#374d53" }}>
      Offer expires in {MOCK_EXPIRY_DAYS} days on <strong>{OFFER_EXPIRY_DATE}</strong>
    </p>
  </div>
)
