import { useMemo } from "react"
import { useSearchParams } from "react-router"
import { useSessionStorage } from "usehooks-ts"

export const PARTNER_TOKEN_STORAGE_KEY = "partner_token"

interface ParsedPartnerToken {
  partnerId: string
  applicationId?: string
  partnerApplicantId: string
  applicantUserId?: string
  applicantUserStatus?: "NOT_REGISTERED" | "REGISTERED"
}

/**
 * Hook for managing partner tokens in session storage.
 * Used to persist tokens across registration/login flows.
 */
function usePartnerToken(): {
  parsedToken: ParsedPartnerToken | null
  token: string | null
} {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get("token")
  const [tokenFromStorage] = useSessionStorage<string | null>(
    PARTNER_TOKEN_STORAGE_KEY,
    null
  )

  const token = tokenFromUrl || tokenFromStorage

  const parsedToken = useMemo(() => {
    if (!token) return null
    try {
      return JSON.parse(atob(token.split(".")[1])) as ParsedPartnerToken
    } catch {
      console.error("Failed to parse partner token")
      return null
    }
  }, [token])

  return { parsedToken, token }
}

export default usePartnerToken
