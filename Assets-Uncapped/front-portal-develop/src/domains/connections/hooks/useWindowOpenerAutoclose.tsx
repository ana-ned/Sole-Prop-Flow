import { useEffect } from "react"
import { CONNECTION_WINDOW_OPENER_NAME } from "../constants"
import platforms from "../models/platforms"

const useWindowOpenerAutoclose = () => {
  useEffect(() => {
    // For some reason, Shopify V2 (via Sugar) is losing window.name and window.opener when Shopify
    // redirects to their auth service.
    const isShopifyFallback =
      new URLSearchParams(globalThis.location.search).get("linkSystemId") ===
      platforms.ShopifyV2.systemId

    if (
      (window.name !== CONNECTION_WINDOW_OPENER_NAME || !window.opener) &&
      !isShopifyFallback
    ) {
      return
    }

    if (isShopifyFallback) {
      try {
        globalThis.localStorage.setItem("refetch-connections", "true")
      } catch {
        // localStorage can be null in some Safari contexts
      }
    }

    window.close()
  }, [])
}

export default useWindowOpenerAutoclose
