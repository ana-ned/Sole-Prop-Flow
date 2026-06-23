// Marketplace card with Amazon partner logo (used in DP right panel).

import { HugeiconsIcon } from "@hugeicons/react"
import { Store02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import Typography from "../../../../components/Basic/Typography"
import amazonConnectionUrl from "../../../../svgs/partners/connections/amazon.svg?url"
import { SectionCardHeader } from "./primitives"

export const MarketplaceCard = () => (
  <div className="overflow-hidden rounded-xl shadow-light-sm">
    <SectionCardHeader
      icon={<HugeiconsIcon icon={Store02SolidStandard} size={14} style={{ color: "#128081" }} />}
      title="Marketplace"
      accentBg="#eaf6f6"
      accentBorder="#c1e5e6"
    />
    <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
      <div className="flex flex-col gap-2 overflow-hidden rounded-xl bg-white p-2 shadow-light-sm">
        {["gaston_express", "gaston_ltd"].map((account) => (
          <div key={account} className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg border"
              style={{ backgroundColor: "#fbfaf9", borderColor: "#d7dee0" }}
              aria-label="Amazon"
            >
              <img src={amazonConnectionUrl} alt="" className="size-7" />
            </div>
            <div className="flex flex-1 items-center gap-1">
              <Typography type="bodyMedium" color="neutral-800">Amazon</Typography>
              <Typography type="smallCopy" color="neutral-700">—</Typography>
              <Typography type="smallCopy" color="neutral-700">{account}</Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
