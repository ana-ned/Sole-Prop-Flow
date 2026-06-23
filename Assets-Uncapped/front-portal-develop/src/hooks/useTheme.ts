import { useLayoutEffect } from "react"
import { useSessionStorage } from "usehooks-ts"
import { DEFAULT_THEME, isValidTheme, type Theme } from "../utils/themes"
import useAttribution from "./useAttribution"
import usePartnerToken from "./usePartnerToken"

const THEME_STORAGE_KEY = "theme"

function resolveTheme(
  attributionPartnerId: string | undefined,
  tokenPartnerId: string | undefined
): Theme {
  if (attributionPartnerId && isValidTheme(attributionPartnerId)) {
    return attributionPartnerId
  }
  if (tokenPartnerId && isValidTheme(tokenPartnerId)) {
    return tokenPartnerId
  }
  return DEFAULT_THEME
}

function useTheme(): [Theme, (theme: Theme) => void] {
  const [storedTheme, setStoredTheme] = useSessionStorage<string>(
    THEME_STORAGE_KEY,
    DEFAULT_THEME
  )
  const { parsedToken } = usePartnerToken()
  const attribution = useAttribution()

  const attributionPartnerId =
    attribution.data?.partnerId ?? attribution.data?.partner.toLowerCase()
  const tokenPartnerId = parsedToken?.partnerId

  const resolvedTheme = resolveTheme(attributionPartnerId, tokenPartnerId)
  const theme: Theme = isValidTheme(storedTheme) ? storedTheme : DEFAULT_THEME

  useLayoutEffect(() => {
    const hasExplicitTheme =
      sessionStorage.getItem(THEME_STORAGE_KEY) !== null &&
      isValidTheme(storedTheme)
    if (!hasExplicitTheme) {
      setStoredTheme(resolvedTheme)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only sync from partner data when no valid theme is stored yet
  }, [resolvedTheme])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return [theme, setStoredTheme]
}

export default useTheme
