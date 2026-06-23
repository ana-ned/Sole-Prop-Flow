import React, { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import useAuthorizedHubSpot from "../../../hooks/useAuthorizedHubSpot"
import { useTracking } from "../../../hooks/useTracking"

const Page = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation()
  const { trackPageView, isInitialized } = useTracking()
  const { trackPageView: trackPageViewInHubSpot } = useAuthorizedHubSpot()
  const trackRef = useRef<string>("")

  useEffect(() => {
    if (isInitialized && globalThis.location.pathname !== trackRef.current) {
      trackRef.current = globalThis.location.pathname
      trackPageView()
      trackPageViewInHubSpot()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isInitialized])

  return children
}

export default Page
