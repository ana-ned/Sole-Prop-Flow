import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { isPast } from "date-fns"
import { Navigate, useNavigate } from "react-router"
import PageLoader from "../../components/Collections/PageLoader"
import { attributionQueryKey } from "../../hooks/useAttribution"
import useAuth from "../../hooks/useAuth"
import { UserRoles } from "../../hooks/useAuth.types"
import useTrackedQueryParams from "../../hooks/useTrackedQueryParams"
import apiConfig, { ApiServicesEnum } from "../../services/api/api-config"
import {
  AttributionRequestProductCodeEnum,
  ErrorResponse,
} from "../../services/api/organisation-users"
import { AttributionControllerApi } from "../../services/api/organisation-users/apis/AttributionControllerApi"
import {
  logError,
  parseServerErrors,
  reportErrorLog,
} from "../../utils/error-handling"

const AmazonCallback = () => {
  const attributionRequestSent = useRef(false)
  const auth = useAuth()
  const { trackedQueryParams } = useTrackedQueryParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isRegistered = auth.hasRole(UserRoles.REGISTERED)
  const isLoading = auth.isLoading || !auth.isAuthenticated
  const isUnregisteredSocialAccount =
    auth.isSocialAccount && auth.isAuthenticated && auth.user && !isRegistered

  const applyAttribution = async () => {
    if (attributionRequestSent.current) {
      reportErrorLog(
        "applyAttribution: attributionRequestSent already sent, skipping",
        "warning",
        trackedQueryParams
      )
      return
    }

    if (
      trackedQueryParams?.expirationDate &&
      isPast(new Date(trackedQueryParams.expirationDate))
    ) {
      reportErrorLog(
        "applyAttribution: expirationDate is in the past. Skipping attribution.",
        "error",
        trackedQueryParams
      )
      return
    }

    if (!auth.isAuthenticated || !auth.hasRole(UserRoles.REGISTERED)) {
      reportErrorLog(
        "applyAttribution: Unauthorized. Shouldn't be called",
        "error",
        {
          isAuthenticated: auth.isAuthenticated,
          hasRole: auth.hasRole(UserRoles.REGISTERED),
          ...trackedQueryParams,
        }
      )
      return
    }

    if (!trackedQueryParams?.hmac) {
      reportErrorLog(
        "applyAttribution: Attribution not found. Shouldn't be called",
        "error",
        trackedQueryParams
      )
      return
    }

    if (
      auth.userData?.attribution?.attributionOfferId ===
      trackedQueryParams.offerId
    ) {
      reportErrorLog(
        "applyAttribution: Attribution offer ID already applied. Skipping.",
        "warning",
        trackedQueryParams
      )
      await navigate("/")
      return
    }

    attributionRequestSent.current = true

    reportErrorLog(
      "applyAttribution: Applying attribution",
      "warning",
      trackedQueryParams
    )

    try {
      await new AttributionControllerApi(
        apiConfig({
          service: ApiServicesEnum.OrganisationUsers,
          token: await auth.getToken(),
        })
      ).applyAttribution({
        xXORGID: auth.organisation?.organisationId ?? "",
        attributionRequest: {
          offerMaxAmount: Number(trackedQueryParams.offerMaxAmount),
          attributionOfferId: trackedQueryParams.offerId,
          averageMonthlyRevenue: Number(
            trackedQueryParams.averageMonthlyRevenue
          ),
          countryCode: trackedQueryParams.countryCode,
          currencyCode: trackedQueryParams.currencyCode,
          productCode:
            trackedQueryParams.productCode as AttributionRequestProductCodeEnum,
          hmac: trackedQueryParams.hmac,
          expirationDate: new Date(trackedQueryParams.expirationDate),
          partner: "AMAZON",
        },
      })

      await queryClient.refetchQueries({
        queryKey: attributionQueryKey(auth.organisation?.organisationId),
        type: "all",
      })
      await navigate(
        auth.organisationData?.notEligibleReason
          ? "/funding/eligibility-check"
          : "/"
      )
    } catch (error: unknown) {
      const parsedError =
        error instanceof Error && error.name === "ResponseError"
          ? await parseServerErrors(error as ErrorResponse)
          : null
      if (parsedError?.code === "ATTRIBUTION_DENIED") {
        await navigate("/registration/blocked")
      } else {
        logError(error)
        await navigate("/")
      }
    }
  }

  useEffect(() => {
    if (isRegistered) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      applyAttribution()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegistered])

  if (isLoading) {
    return <PageLoader overlay />
  }

  if (isUnregisteredSocialAccount) {
    return <Navigate to="/auth/oauth" />
  }

  return <PageLoader overlay />
}

export default AmazonCallback
