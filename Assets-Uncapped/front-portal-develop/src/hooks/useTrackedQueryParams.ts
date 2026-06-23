import { useEffect, useMemo } from "react"
import queryString from "query-string"
import { useLocation } from "react-router"
import { useCookie } from "react-use"
import type { UtmTags } from "../services/api/hubspot"

const COOKIE_KEY = "uncapped_query_params"
const COOKIE_EXPIRATION_DAYS = 30

const UTM_KEY_MAP: Partial<Record<string, keyof UtmTags>> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  utm_intent: "utmIntent",
}

const useTrackedQueryParams = () => {
  const location = useLocation()
  const [value, setValue] = useCookie(COOKIE_KEY)

  const parsedCookie = useMemo<Record<string, string>>(
    () => JSON.parse(value || "{}"),
    [value]
  )

  const parsedQueryString = useMemo(
    () => queryString.parse(location.search),
    [location.search]
  )

  const merged = useMemo(
    () => ({ ...parsedCookie, ...parsedQueryString }),
    [parsedCookie, parsedQueryString]
  )

  useEffect(() => {
    if (Object.keys(merged).length > 0) {
      setValue(JSON.stringify(merged), {
        expires: COOKIE_EXPIRATION_DAYS,
      })
    }
  }, [setValue, merged])

  const trackedQueryParams = useMemo(
    () => (Object.keys(parsedCookie).length > 0 ? parsedCookie : undefined),
    [parsedCookie]
  )

  const trackedUTMs = useMemo((): UtmTags | undefined => {
    const utmTags: UtmTags = {}
    let hasUtm = false

    for (const [rawKey, rawValue] of Object.entries(merged)) {
      const mappedKey = UTM_KEY_MAP[rawKey.toLowerCase()]
      if (mappedKey !== undefined && typeof rawValue === "string") {
        utmTags[mappedKey] = rawValue
        hasUtm = true
      }
    }

    return hasUtm ? utmTags : undefined
  }, [merged])

  return {
    trackedQueryParams,
    trackedUTMs,
  }
}

export default useTrackedQueryParams
