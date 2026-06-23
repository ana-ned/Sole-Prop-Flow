import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  GetRepaymentsSummary1CustomisationTypeEnum,
  OfferControllerV3Api,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const useDeferredRepayments = (
  offerParameters: {
    deferredRepaymentPeriod: number
    baseFee: number
    customisationFee?: number
    id: string
    repaymentLength: number
    advance: number
  },
  customDeferredRepaymentPeriod?: number,
  enabled = true
) => {
  const { isAuthenticated, getToken, organisation } = useAuth()

  const deferredRepaymentPeriod =
    customDeferredRepaymentPeriod ?? offerParameters.deferredRepaymentPeriod

  return useQuery({
    queryKey: [
      "deferred-repayments",
      offerParameters.id,
      offerParameters.advance,
      offerParameters.baseFee,
      offerParameters.repaymentLength,
      deferredRepaymentPeriod,
      offerParameters.customisationFee,
    ],
    queryFn: async () =>
      new OfferControllerV3Api(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getRepaymentsSummary1({
        xXORGID: organisation?.organisationId!,
        offerId: offerParameters.id,
        advance: offerParameters.advance,
        baseFee: offerParameters.baseFee,
        repaymentLength: offerParameters.repaymentLength,
        customisationType:
          GetRepaymentsSummary1CustomisationTypeEnum.DeferredRepayments,
        customisationPeriod: deferredRepaymentPeriod,
        customisationFee: offerParameters.customisationFee,
      }),
    enabled:
      isAuthenticated &&
      !!organisation?.organisationId &&
      (customDeferredRepaymentPeriod === 0 || !!deferredRepaymentPeriod) &&
      enabled,
    refetchOnWindowFocus: false,
  })
}

export default useDeferredRepayments
