import { useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Navigate, useNavigate, useSearchParams } from "react-router"
import { useSessionStorage } from "usehooks-ts"
import PageLoader from "../../../components/Collections/PageLoader"
import { attributionQueryKey } from "../../../hooks/useAttribution"
import useAuth, { getUserOverviewQueryKey } from "../../../hooks/useAuth"
import usePartnerToken, {
  PARTNER_TOKEN_STORAGE_KEY,
} from "../../../hooks/usePartnerToken"
import ErrorIndex from "../../../pages/error/_error"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  AttributionControllerApi,
  AttributionTokenRequest,
  ErrorResponse,
} from "../../../services/api/organisation-users"
import {
  ApplicationsApi,
  ApplicationDetailsTokenizedResponseApplicantUserStatusEnum,
  ApplicationTokenizedCreationRequest,
} from "../../../services/api/partners"
import {
  logError,
  parseServerErrors,
  reportErrorLog,
} from "../../../utils/error-handling"

const ENRICHMENT_WAIT_MS = 1500

/**
 * Partner callback page - handles ALL partner token operations.
 * - Stores tokens from URL
 * - Waits for partner enrichment data ingestion if enrichment_details flag is set
 * - Creates application if it doesn't exist
 * - Applies token's attribution when user is authenticated
 * - Redirects to registration/login when needed
 *
 * Flow: registration -> /auth/partner (apply) -> dashboard
 */
const PartnerCallback = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [, setToken, removeToken] = useSessionStorage<string | null>(
    PARTNER_TOKEN_STORAGE_KEY,
    null
  )
  const { token, parsedToken } = usePartnerToken()
  const hasProcessedRef = useRef(false)
  const [hasError, setHasError] = useState(false)
  const queryClient = useQueryClient()

  // Store token from URL immediately to persist across auth redirects
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    }
  }, [searchParams, setToken])

  const createApplication = useMutation({
    mutationFn: (
      applicationTokenizedCreationRequest: ApplicationTokenizedCreationRequest
    ) =>
      new ApplicationsApi(
        apiConfig({
          token: "",
          service: ApiServicesEnum.Partners,
        })
      ).createApplication({
        applicationTokenizedCreationRequest,
      }),
  })

  const applyAttributionByToken = useMutation({
    mutationFn: async (attributionTokenRequest: AttributionTokenRequest) =>
      new AttributionControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).applyAttributionV2({
        attributionTokenRequest,
        xXORGID: auth.organisation?.organisationId || "",
      }),
    onSuccess: async () => {
      await auth.getToken({ cacheMode: "off" })
      await queryClient.refetchQueries({
        queryKey: attributionQueryKey(auth.organisation?.organisationId),
        type: "all",
      })
      await queryClient.refetchQueries({
        queryKey: getUserOverviewQueryKey(
          auth.organisation?.organisationId ?? ""
        ),
        type: "all",
      })
    },
  })

  useEffect(() => {
    if (auth.isLoading || !token || hasProcessedRef.current) {
      return
    }

    const handlePartnerCallback = async () => {
      hasProcessedRef.current = true
      console.log({ parsedToken })

      let currentToken = token

      // Step 1: Create application if needed (token has no applicationId)
      if (
        parsedToken &&
        !parsedToken.applicationId &&
        parsedToken.partnerApplicantId
      ) {
        // Wait for enrichment data if partner flagged it (only relevant before creating application)
        const enrichmentDetails = searchParams.get("enrichment_details")
        if (enrichmentDetails === "true") {
          console.log(`Waiting ${ENRICHMENT_WAIT_MS}ms for enrichment data`)
          await new Promise((resolve) =>
            setTimeout(resolve, ENRICHMENT_WAIT_MS)
          )
        }
        console.log("Creating application")
        try {
          const application = await createApplication.mutateAsync({
            tokenizedData: token,
          })
          console.log("Created application", application)
          currentToken = application.tokenizedData!
          setToken(currentToken)
        } catch (error) {
          reportErrorLog(
            "PartnerCallback: Failed to create application",
            "error",
            { error }
          )
          setHasError(true)
          return
        }
      }

      // Step 3: Check authentication and redirect if needed
      if (!auth.isAuthenticated) {
        const isNewUser =
          parsedToken?.applicantUserStatus ===
          ApplicationDetailsTokenizedResponseApplicantUserStatusEnum.NotRegistered

        await (isNewUser
          ? navigate("/registration")
          : auth.loginWithRedirect({
              authorizationParams: {
                redirect_uri: `${globalThis.location.origin}/auth/partner`,
              },
            }))
        return
      }

      // Step 4: User is authenticated - apply the attribution token
      try {
        console.log("Applying attribution token")
        await applyAttributionByToken.mutateAsync({
          attributionToken: currentToken,
        })
        // Step 5: Clean up and redirect to dashboard
        removeToken()
        await navigate("/")
      } catch (error: unknown) {
        removeToken()
        const parsedError =
          error instanceof Error && error.name === "ResponseError"
            ? await parseServerErrors(error as ErrorResponse)
            : null
        if (parsedError?.code === "ATTRIBUTION_DENIED") {
          await navigate("/registration/blocked")
        } else {
          logError(error, false)
          await navigate("/")
        }
      }
    }

    void handlePartnerCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, auth.isLoading, auth.isAuthenticated])

  if (!token) {
    return <Navigate to="/" />
  }

  if (hasError) {
    return <ErrorIndex type="500" />
  }

  return <PageLoader />
}

export default PartnerCallback
