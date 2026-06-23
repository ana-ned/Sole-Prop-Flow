import { useEffect, useState } from "react"

const DESKTOP_QUERY = "(min-width: 1024px)"

const useDevice = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof globalThis.matchMedia === "function"
      ? globalThis.matchMedia(DESKTOP_QUERY).matches
      : true
  )

  useEffect(() => {
    if (typeof globalThis.matchMedia !== "function") return
    const mql = globalThis.matchMedia(DESKTOP_QUERY)
    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }
    mql.addEventListener("change", handler)
    return () => {
      mql.removeEventListener("change", handler)
    }
  }, [])

  return {
    isDesktop,
    isMobile: !isDesktop,
  }
}

export default useDevice
