import { useCallback, useEffect, useRef } from "react"
import { useFlagsStatus } from "@unleash/proxy-client-react"
import { reportErrorLog } from "../utils/error-handling"
import { useTracking } from "./useTracking"

const FLAGS_READY_TIMEOUT_MS = 2000

type UseTrackExperimentViewedArgs = {
  name: string
  variant: string
  enabled?: boolean
  fallbackOnTimeout?: boolean
}

/**
 * Declaratively tracks an "experiment viewed" event with built-in safeguards:
 *
 * - Waits for Segment to initialize (retries when it does).
 * - Waits for Unleash `flagsReady` before firing.
 * - When `fallbackOnTimeout` is true, fires the current `variant` after a
 *   timeout if flags never resolve (e.g. ad blockers). Only enable this when
 *   the UI renders without waiting for `flagsReady` — the current `variant`
 *   is what the UI is actually showing, so the fallback stays truthful.
 *   Omit when UI gates on `flagsReady` (shows a loader).
 * - Fires at most once per mount regardless of how flags/init settle later.
 *
 * @example
 * ```tsx
 * useTrackExperimentViewed({
 *   name: "FOO-1234",
 *   variant: isB ? "B" : "A",
 *   fallbackOnTimeout: true,
 * })
 * ```
 */
export const useTrackExperimentViewed = ({
  name,
  variant,
  enabled = true,
  fallbackOnTimeout = false,
}: UseTrackExperimentViewedArgs) => {
  const { trackEvent, isInitialized } = useTracking()
  const { flagsReady } = useFlagsStatus()
  const hasTrackedRef = useRef(false)
  const warnedRef = useRef(false)

  const latestRef = useRef({ name, variant, trackEvent, isInitialized })
  latestRef.current = { name, variant, trackEvent, isInitialized }

  const fire = useCallback(() => {
    if (hasTrackedRef.current) return
    const {
      name: latestName,
      variant: latestVariant,
      trackEvent: latestTrackEvent,
      isInitialized: latestIsInitialized,
    } = latestRef.current
    if (!latestIsInitialized) {
      if (!warnedRef.current) {
        warnedRef.current = true
        reportErrorLog(
          "useTrackExperimentViewed skipped: tracking not initialized",
          "warning",
          { experimentName: latestName, version: latestVariant }
        )
      }
      return
    }
    hasTrackedRef.current = true
    latestTrackEvent({
      category: "experiment",
      name: latestName,
      action: "viewed",
      customFields: { version: latestVariant },
    })
  }, [])

  useEffect(() => {
    if (!enabled || !flagsReady) return
    fire()
  }, [enabled, flagsReady, isInitialized, fire])

  useEffect(() => {
    if (!enabled || !fallbackOnTimeout) return
    const timeout = setTimeout(fire, FLAGS_READY_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [enabled, fallbackOnTimeout, fire])
}

/**
 * Imperative hook for firing "experiment converted" events.
 *
 * @example
 * ```tsx
 * const { trackExperimentConverted } = useTrackExperiment()
 *
 * const handleSubmit = () => {
 *   trackExperimentConverted("FOO-1234", "B")
 * }
 * ```
 */
const useTrackExperiment = () => {
  const { trackEvent } = useTracking()

  const trackExperimentConverted = useCallback(
    (experimentName: string, version: string) => {
      trackEvent({
        category: "experiment",
        name: experimentName,
        action: "converted",
        customFields: {
          version,
        },
      })
    },
    [trackEvent]
  )

  return {
    trackExperimentConverted,
  }
}

export default useTrackExperiment
