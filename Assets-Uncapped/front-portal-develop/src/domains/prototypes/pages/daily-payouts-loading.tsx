import Typography from "../../../components/Basic/Typography"

// ---------------------------------------------------------------------------
// Daily Payouts — loading skeleton state
// ---------------------------------------------------------------------------

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-md bg-neutral-200 ${className ?? ""}`}
    aria-hidden="true"
  />
)

const DailyPayoutsLoading = () => {
  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="flex flex-col gap-y-6">

          {/* Live region announces loading to screen readers */}
          <div role="status" aria-live="polite" className="sr-only">
            Loading your offer details
          </div>

          {/* Visible loading label */}
          <div className="flex flex-col gap-y-2">
            <Typography type="h2">Loading your offer</Typography>
            <Typography type="body" color="neutral-700">
              This usually takes a few seconds.
            </Typography>
          </div>

          {/* Hero card skeleton */}
          <div className="flex flex-col overflow-hidden rounded-2xl shadow-light-sm">
            <div className="flex items-center justify-center bg-neutral-200 px-4 py-10">
              <Skeleton className="h-12 w-2/3" />
            </div>
            <div className="flex flex-col gap-y-3 bg-white px-4 py-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Notice skeleton */}
          <Skeleton className="h-12 w-full" />

          {/* Breakdown card skeleton */}
          <div className="flex flex-col gap-y-3 rounded-2xl bg-white p-6 shadow-light-sm">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-px w-full" />
            <div className="flex flex-col gap-y-3 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-11 w-32" />
          </div>

        </div>
      </div>
    </div>
  )
}

export default DailyPayoutsLoading
