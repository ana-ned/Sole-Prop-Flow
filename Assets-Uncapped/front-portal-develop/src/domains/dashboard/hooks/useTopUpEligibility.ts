import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { EligibilityControllerApi } from "../../../services/api/reengagement"
import useOffers from "../../onboarding/hooks/useOffers"

const TOPUP_ELIGIBLITY_QUERY_KEY = "AGREEMENTS_TOPUP_ELIGIBILITY"

const useTopUpEligibility = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const auth = useAuth()
  const offers = useOffers()
  const deal = useDeal()

  const query = useQuery({
    queryKey: [TOPUP_ELIGIBLITY_QUERY_KEY],
    queryFn: async () =>
      new EligibilityControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Reengagement,
        })
      ).checkTopUpEligibility({
        xXORGID: auth.organisation?.organisationId!,
      }),

    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      auth.organisation.activated &&
      enabled,
  })

  return (
    query.data?.isEligible &&
    !offers.isLoading &&
    offers.signeableOffers.length === 0 &&
    !deal.isLoading &&
    !deal.inPipeline &&
    !deal.awaitingForDisbursement
  )
}

export default useTopUpEligibility
