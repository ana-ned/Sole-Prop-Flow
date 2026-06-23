import { useEffect, useRef } from "react"
import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import PageLoader from "../../components/Collections/PageLoader"
import Alert from "../../components/UI/Alert"
import Layout from "../../components/UI/Layout"
import PageBar from "../../components/UI/PageBar"
import { getStoredProspectId } from "../../domains/registration/components/registration/RegistrationPageContent"
import useAuth from "../../hooks/useAuth"
import { UserRoles } from "../../hooks/useAuth.types"
import usePartnerToken from "../../hooks/usePartnerToken"
import useTrackedQueryParams from "../../hooks/useTrackedQueryParams"
import useTrackExperiment from "../../hooks/useTrackExperiment"
import { useTracking } from "../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../services/api/api-config"
import { RegistrationControllerApi } from "../../services/api/organisation-users"
import { reportErrorLog } from "../../utils/error-handling"
import { getClientId } from "../../utils/ga"

const OauthIndex = () => {
  const { t } = useTranslation()
  const { user, logout, ...auth } = useAuth()
  const registered = auth.hasRole(UserRoles.REGISTERED)
  const { trackEvent } = useTracking()
  const { trackedQueryParams } = useTrackedQueryParams()
  const mutationSentRef = useRef<boolean>(false)
  const isAmazonAccount = user?.sub?.includes("amazon")
  const isComingFromAmazonSellerPortal = !!trackedQueryParams?.hmac
  const partnerToken = usePartnerToken()
  const prospectId = useRef(getStoredProspectId()).current
  const { trackExperimentConverted } = useTrackExperiment()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () =>
      new RegistrationControllerApi(
        apiConfig({ service: ApiServicesEnum.OrganisationUsers })
      ).registerUserWithSocial({
        xXORGID: "",
        registrationRequest: {
          email: user?.email!,
          externalUserId: user?.sub,
          prospectId: prospectId ?? undefined,
          marketingData: {
            cid: getClientId(),
            source: trackedQueryParams?.source,
            referralId: trackedQueryParams?.referral,
            externalId: trackedQueryParams?.external,
            applicantUserId: partnerToken.parsedToken?.applicantUserId,
          },
        },
      }),
    onSuccess: async () => {
      if (prospectId) {
        trackExperimentConverted("ROME-1458-Login-Shuffle-Experiment", "v2")
      }

      trackEvent({
        category: "registration",
        name: "client-info-clientForm",
        action: "registration-create-account",
      })
      trackEvent({
        category: "registration",
        name: "oauth",
        action: "created-account",
        customFields: {
          name: isAmazonAccount ? "amazon" : "google",
        },
      })
      await auth.getToken({ cacheMode: "off" })
    },
    onError: (error) => {
      if (error instanceof Error) {
        reportErrorLog(
          `OAuth flow failed: ${error.message}`,
          "error",
          {},
          error
        )
      } else {
        reportErrorLog("OAuth flow failed: unknown error", "error", {}, error)
      }
    },
  })

  // Register new user account
  useEffect(() => {
    if (
      !isPending &&
      !isError &&
      !registered &&
      auth.isAuthenticated &&
      !mutationSentRef.current
    ) {
      mutationSentRef.current = true
      mutate()
    }
  }, [mutate, isPending, isError, registered, auth.isAuthenticated])

  // Exclude Amazon Seller Portal from redirecting. They'll end up on the callback page.
  if (registered && auth.isAuthenticated) {
    if (isComingFromAmazonSellerPortal) {
      return <Navigate to="/auth/amazon/callback" />
    }
    return <Navigate to="/" />
  }

  // Guest entered the page
  if (!auth.isLoading && !auth.isAuthenticated) {
    return <Navigate to="/" />
  }

  if (isError) {
    return (
      <Layout menu={false}>
        <Layout.Parent>
          <PageBar onClickBack={logout} />
          <Alert type="danger" className="mt-8">
            {t("common:defaultErrorMessage")}
          </Alert>
        </Layout.Parent>
      </Layout>
    )
  }

  return <PageLoader />
}

export default OauthIndex
