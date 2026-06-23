import { useSearchParams } from "react-router"
import { CustomerFacingDealDetailsResponseSourceEnum } from "../services/api/hubspot"
import useAttribution from "./useAttribution"
import useAuth from "./useAuth"
import useDeal from "./useDeal"
import usePartnerToken from "./usePartnerToken"
import useTrackedQueryParams from "./useTrackedQueryParams"

const useIsOrganic = (): boolean => {
  const auth = useAuth()
  const deal = useDeal()
  const attribution = useAttribution()
  const partnerToken = usePartnerToken()
  const { trackedQueryParams } = useTrackedQueryParams()
  const [searchParams] = useSearchParams()

  if (partnerToken.token) {
    return false
  }

  if (!auth.isAuthenticated) {
    const referral =
      trackedQueryParams?.referral ?? searchParams.get("referral")
    const source = trackedQueryParams?.source ?? searchParams.get("source")
    return !referral && !source
  }

  if (attribution.isLoading) {
    return false
  }

  if (auth.organisation?.organisationId) {
    if (deal.isLoading) {
      return false
    }
    if (deal.data) {
      return (
        deal.data.source === CustomerFacingDealDetailsResponseSourceEnum.Portal
      )
    }
  }

  return !attribution.data
}

export default useIsOrganic
