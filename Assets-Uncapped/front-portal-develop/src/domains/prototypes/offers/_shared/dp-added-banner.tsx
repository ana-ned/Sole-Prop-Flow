// Confirmation banner shown on the Daily Payout review page to reassure the
// user they've added DP as an add-on (Figma node 10659:15624). Replaces the
// generic offer-expires notice on the DP step.

import { HugeiconsIcon } from "@hugeicons/react"
import { FlashSolidRounded } from "@hugeicons-pro/core-solid-rounded"

export const DpAddedBanner = () => (
  <div
    className="flex items-center gap-2 rounded-xl border px-3 py-2"
    style={{ backgroundColor: "#fff6e5", borderColor: "#ffd68f" }}
  >
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-md border"
      style={{ backgroundColor: "#fff0d6", borderColor: "#ffd68f" }}
    >
      <HugeiconsIcon icon={FlashSolidRounded} size={14} style={{ color: "#ffac30" }} />
    </span>
    <p className="text-[14px] leading-[1.5]" style={{ color: "#374d53" }}>
      <strong className="font-bold">You added Daily Payouts to your package.</strong>{" "}
      You can pause it anytime.
    </p>
  </div>
)
