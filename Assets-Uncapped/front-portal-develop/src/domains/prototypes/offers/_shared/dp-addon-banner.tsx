// "Add Daily Payouts" upsell banner — shown on the RHS during a single-offer
// config step when Daily Payouts isn't already in the flow. Click sends the
// user to the +DP variant of the current flow.

import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import { PChip } from "./primitives"

export const DpAddOnBanner = ({ onAdd }: { onAdd: () => void }) => (
  <div
    className="flex flex-col gap-3 rounded-xl p-3"
    style={{ backgroundColor: "#fff6e5", borderColor: "#ffd68f", borderWidth: 1 }}
  >
    <div className="flex items-center gap-2">
      <Typography type="bodyTitle" color="neutral-800">
        Add Daily Payouts
      </Typography>
      <PChip tone="warning">Optional</PChip>
    </div>
    <div className="h-px w-full" style={{ backgroundColor: "#ffd68f" }} aria-hidden />
    <Typography type="body" color="neutral-700">
      80% advance rate, 0.3% daily fee. Stack Daily Payouts on top to smooth your
      day-to-day cashflow. Add now or activate any time from your dashboard.
    </Typography>
    <Button type="button" variant="secondary" onClick={onAdd} className="w-full">
      Add to Offer
    </Button>
  </div>
)
