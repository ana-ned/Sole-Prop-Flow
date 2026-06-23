import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar01SolidStandard,
  Call02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import Notice from "../../../components/UI/Notice"
import Card from "../../../components/UI/Card"

// ---------------------------------------------------------------------------
// Daily Payouts — expired offer state
// ---------------------------------------------------------------------------

const DailyPayoutsExpired = () => {
  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="flex flex-col gap-y-6">

          {/* Page header */}
          <div className="flex flex-col gap-y-2">
            <Typography type="h2">Your Daily Payouts offer</Typography>
            <Typography type="body" color="neutral-700">
              This offer is no longer valid.
            </Typography>
          </div>

          {/* Expired notice */}
          <Notice
            variant="danger"
            icon={<HugeiconsIcon icon={Calendar01SolidStandard} />}
            title="This offer expired on 17 Nov 2025"
          >
            Offers are valid for 7 days from issue. After that, we need to
            reassess your eligibility using your latest sales data.
          </Notice>

          {/* Hero card — muted version */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-300 opacity-60">
            <div className="flex items-center justify-center bg-neutral-200 px-4 py-10">
              <Typography type="h2" className="text-center text-neutral-700">
                Get Paid Daily
              </Typography>
            </div>
            <div className="flex flex-col gap-y-2 bg-white px-4 py-4">
              <Typography type="body" color="neutral-700">
                Receive <strong className="font-bold">$100,000</strong> now,
                then <strong className="font-bold">80% of your net sales every day.</strong>
              </Typography>
            </div>
          </div>

          {/* What you can do */}
          <Card>
            <div className="flex flex-col gap-y-4">
              <Typography type="bodyTitle" color="neutral-800">
                What you can do
              </Typography>
              <div className="flex flex-col gap-y-3">
                <Typography type="body" color="neutral-700">
                  • Reapply for funding — most reapplications get a fresh
                  decision in under 24 hours.
                </Typography>
                <Typography type="body" color="neutral-700">
                  • Talk to your account manager about your options. They can
                  walk you through what changed.
                </Typography>
                <Typography type="body" color="neutral-700">
                  • Connect more sales data — additional accounts can improve
                  your next offer.
                </Typography>
              </div>
              <div className="flex flex-col gap-y-2 pt-2">
                <Button type="button" variant="primary" fullWidth>
                  Reapply for funding
                </Button>
                <Button type="button" variant="secondary" fullWidth>
                  <span className="flex items-center gap-x-2">
                    <HugeiconsIcon icon={Call02SolidStandard} size={16} />
                    Talk to your account manager
                  </span>
                </Button>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default DailyPayoutsExpired
