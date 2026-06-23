import { useCallback, useRef } from "react"
import queryString from "query-string"
import { CONNECTION_WINDOW_OPENER_NAME } from "../constants"
import platforms, { Platform } from "../models/platforms"

const useRedirectUri = (
  closedWindowCallback: () => Promise<void>,
  beforeOpenWindowCallback: () => Promise<void>
) => {
  const navigate = useCallback((url: string | URL): void => {
    globalThis.location.assign(url)
  }, [])
  const childWindow = useRef<Window | null>(null)
  const childInterval = useRef<any>(null)

  return useCallback(
    async (redirectUrl: string, platform: Platform) => {
      await beforeOpenWindowCallback()
      if (childInterval.current) {
        clearInterval(childInterval.current)
      }
      const width = Math.min(800, window.screen.width)
      const height = Math.min(600, window.screen.height)
      const screenx = (window.screen.width - width) / 2
      const screeny = (window.screen.height - height) / 2

      const child = window.open(
        redirectUrl,
        CONNECTION_WINDOW_OPENER_NAME,
        queryString
          .stringify({
            width,
            height,
            screenx,
            screeny,
            toolbar: "yes",
            location: "yes",
            menubar: "yes",
          })
          .replaceAll("&", ",")
      )

      if (child) {
        childWindow.current = child
        if (platform.systemId === platforms.Saltedge.systemId) {
          window.addEventListener("message", (event) => {
            if (event.origin.includes("saltedge.com") && event.data) {
              try {
                const payload = JSON.parse(event.data)
                if (payload.data?.api_stage === "fetch_recent") {
                  childWindow.current?.close()
                }
              } catch {
                // Noop - Saltedge returned string, like `cancel`.
              }
            }
          })
        }
        childInterval.current = setInterval(async () => {
          if (childWindow.current?.closed) {
            clearInterval(childInterval.current)
            await closedWindowCallback()
          }
        }, 100)
      }

      if (child) {
        try {
          child.focus()
        } catch {
          navigate(redirectUrl)
        }
      } else {
        navigate(redirectUrl)
      }
    },
    [beforeOpenWindowCallback, closedWindowCallback, navigate]
  )
}

export default useRedirectUri
