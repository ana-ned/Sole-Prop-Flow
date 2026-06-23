import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import {
  CustomerFacingDealDetailsResponseMainPlatformEnum,
  CustomerFacingDealDetailsResponseSourceEnum,
  CustomerFacingDealDetailsResponseStageEnum,
  CustomerFacingDealDetailsResponseTypeEnum,
  DealAttributeObjectAttributeEnum,
  DealControllerApi,
} from "../services/api/hubspot"
import useAuth from "./useAuth"
import usePartnerToken from "./usePartnerToken"
import useTrackedQueryParams from "./useTrackedQueryParams"

export const getDealQueryKey = () => [
  "HubSpot@DealControllerApi@createOrGetCurrentDeal",
]

const EXCLUDED_DEAL_TYPES = new Set([
  CustomerFacingDealDetailsResponseTypeEnum.LocDraw,
  CustomerFacingDealDetailsResponseTypeEnum.LocExtension,
]) as Set<CustomerFacingDealDetailsResponseTypeEnum>

const useDeal = () => {
  const auth = useAuth()
  const fullyCompleted =
    auth.organisationData?.activated && auth.organisationData.onboardingFinished
  const location = useLocation()
  const partnerToken = usePartnerToken()
  const { trackedUTMs } = useTrackedQueryParams()

  const query = useQuery({
    queryKey: getDealQueryKey(),
    queryFn: async () => {
      try {
        return await new DealControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.HubSpot,
          })
        ).createOrGetCurrentDeal({
          xXORGID: auth.organisation?.organisationId!,
          ...(trackedUTMs && {
            dealCreationRequest: { utmTags: trackedUTMs },
          }),
        })
      } catch {
        /// We don't want to crash the application if there is no deal (eg. fresh Marcus client)
        return null
      }
    },
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      // Ensure we don't trigger a new deal creation during registration or auth routes
      // so that attribution always kicks in before this request.
      !location.pathname.startsWith("/registration") &&
      !location.pathname.startsWith("/auth") &&
      !partnerToken.token,
  })

  const isDealTypeExcluded = EXCLUDED_DEAL_TYPES.has(query.data?.type!)
  const isAmazonPartnership =
    query.data?.source === CustomerFacingDealDetailsResponseSourceEnum.Amazon

  return {
    ...query,
    shouldRedirectToRejection:
      !fullyCompleted &&
      (
        [
          CustomerFacingDealDetailsResponseStageEnum.Rejected,
          CustomerFacingDealDetailsResponseStageEnum.Lost,
        ] as CustomerFacingDealDetailsResponseStageEnum[]
      ).includes(query.data?.stage!),
    inPipeline:
      (
        [
          CustomerFacingDealDetailsResponseStageEnum.DataCompleteness,
          CustomerFacingDealDetailsResponseStageEnum.DataValidation,
          CustomerFacingDealDetailsResponseStageEnum.Underwriting,
        ] as CustomerFacingDealDetailsResponseStageEnum[]
      ).includes(query.data?.stage!) && !isDealTypeExcluded,
    awaitingForDisbursement:
      (
        [
          CustomerFacingDealDetailsResponseStageEnum.Offering,
          CustomerFacingDealDetailsResponseStageEnum.DueDiligence,
        ] as CustomerFacingDealDetailsResponseStageEnum[]
      ).includes(query.data?.stage!) && !isDealTypeExcluded,
    isAmazonSeller:
      isAmazonPartnership ||
      query.data?.mainPlatform ===
        CustomerFacingDealDetailsResponseMainPlatformEnum.Amazon,
    isAmazonPartnership,
    hasAmazonPartnerOffer: !!(
      isAmazonPartnership &&
      query.data?.attributes?.some(
        (item) =>
          item.attribute === DealAttributeObjectAttributeEnum.HasPartnerOffer &&
          Boolean(item.value)
      )
    ),
    isDealTypeExcluded,
  }
}

export default useDeal
