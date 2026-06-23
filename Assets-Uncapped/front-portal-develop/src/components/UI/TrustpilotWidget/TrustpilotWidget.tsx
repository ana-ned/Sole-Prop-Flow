import { useEffect, useRef } from "react"
import { useLocation } from "react-router"
import { useScript } from "usehooks-ts"
import useIsOrganic from "../../../hooks/useIsOrganic"
import { useTracking } from "../../../hooks/useTracking"

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (el: HTMLElement, force?: boolean) => void
    }
  }
}

const TrustpilotWidget = ({ className }: { className?: string }) => {
  const isOrganic = useIsOrganic()
  const { trackEvent, isInitialized } = useTracking()
  const { pathname } = useLocation()
  const ref = useRef<HTMLDivElement>(null)
  const hasTrackedImpression = useRef(false)
  const isPointerOver = useRef(false)
  const status = useScript(
    isOrganic
      ? "https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
      : null,
    { id: "trustpilot-widget" }
  )

  useEffect(() => {
    if (isOrganic && status === "ready" && ref.current && window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true)
    }
  }, [isOrganic, status])

  useEffect(() => {
    if (!isOrganic || !isInitialized || !ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasTrackedImpression.current) {
          hasTrackedImpression.current = true
          trackEvent({
            category: "trust_signal",
            name: "trustpilot_widget",
            action: "viewed",
            customFields: { path: pathname },
          })
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isOrganic, isInitialized, trackEvent, pathname])

  useEffect(() => {
    if (!isOrganic || !isInitialized) return

    const handleBlur = () => {
      const active = document.activeElement
      if (
        isPointerOver.current &&
        active instanceof HTMLIFrameElement &&
        ref.current?.contains(active)
      ) {
        trackEvent({
          category: "trust_signal",
          name: "trustpilot_widget",
          action: "clicked",
          customFields: { path: pathname },
        })
      }
    }

    window.addEventListener("blur", handleBlur)
    return () => window.removeEventListener("blur", handleBlur)
  }, [isOrganic, isInitialized, trackEvent, pathname])

  if (!isOrganic) {
    return null
  }

  return (
    <div
      className={className}
      onPointerEnter={() => (isPointerOver.current = true)}
      onPointerLeave={() => (isPointerOver.current = false)}
    >
      <div
        ref={ref}
        className="trustpilot-widget outline-none"
        data-locale="en-GB"
        data-template-id="5419b732fbfb950b10de65e5"
        data-businessunit-id="5f80e399a7c6e8000169b19a"
        data-style-height="26px"
        data-style-width="300px"
        data-token="1643d2b6-9a17-4737-bd9b-4219fb25cd80"
      >
        <a
          href="https://uk.trustpilot.com/review/weareuncapped.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </div>
  )
}

export default TrustpilotWidget
