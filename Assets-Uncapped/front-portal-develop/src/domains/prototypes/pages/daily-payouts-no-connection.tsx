import { HugeiconsIcon } from "@hugeicons/react"
import {
  Link04SolidStandard,
  CheckmarkCircle02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import Notice from "../../../components/UI/Notice"
import Card from "../../../components/UI/Card"
import BoxIcon from "../../../components/Basic/BoxIcon"

// ---------------------------------------------------------------------------
// Daily Payouts — no marketplace connected (empty state)
// ---------------------------------------------------------------------------

const REASSURANCES = [
  "Read-only access — we never move funds without your approval",
  "Takes about 2 minutes",
  "Applying does not affect your credit score",
]

const DailyPayoutsNoConnection = () => {
  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="flex flex-col gap-y-6">

          {/* Page header */}
          <div className="flex flex-col gap-y-2">
            <Typography type="h2">Daily Payouts</Typography>
            <Typography type="body" color="neutral-700">
              Get paid every day instead of waiting weeks for your marketplace
              to pay out.
            </Typography>
          </div>

          {/* Empty state card */}
          <Card spacing="big">
            <div className="flex flex-col items-center gap-y-4 py-6 text-center">
              <BoxIcon
                icon={<HugeiconsIcon icon={Link04SolidStandard} />}
                severity="accent-brand"
                size={10}
              />
              <Typography type="h4">Connect your Amazon account</Typography>
              <Typography type="body" color="neutral-700">
                We need a read-only connection to your Amazon Seller Central to
                calculate your offer. We&apos;ll show you exactly what you can
                receive in advance and on what terms.
              </Typography>

              <div className="flex flex-col gap-y-2 pt-2 w-full">
                {REASSURANCES.map((line) => (
                  <div key={line} className="flex items-start gap-x-2">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02SolidStandard}
                      size={16}
                      className="mt-1 shrink-0 text-brand-600"
                    />
                    <Typography type="smallCopy" color="neutral-700">
                      {line}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="w-full pt-4">
                <Button type="button" variant="primary" fullWidth>
                  Connect Amazon
                </Button>
              </div>
            </div>
          </Card>

          {/* Alternative path */}
          <Notice variant="info">
            Don&apos;t use Amazon? You can still apply with a Term Loan — connect
            another sales platform or upload your bank statements instead.
          </Notice>

        </div>
      </div>
    </div>
  )
}

export default DailyPayoutsNoConnection
