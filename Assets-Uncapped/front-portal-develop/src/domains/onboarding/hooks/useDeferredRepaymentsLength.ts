import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  GetFeeOnlyValidPeriodsForFrequencyOfferScoreEnum,
  GetFeeOnlyValidPeriodsForFrequencyRepaymentFrequencyEnum,
  GetFeeOnlyValidPeriodsForFrequencyTypeEnum,
  OfferAttributesControllerApi,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const useDeferredRepaymentsLength = (
  offerParameters: {
    advance: number
    baseFee?: number
    repaymentLength: number
    repaymentFrequency:
      | "DAILY"
      | "WEEKLY"
      | "EVERY_14_DAYS"
      | "EVERY_15_DAYS"
      | "MONTHLY"
      | "ON_DEMAND"
      | "UNKNOWN"
    dealId: string
    offerScore?: GetFeeOnlyValidPeriodsForFrequencyOfferScoreEnum
  },
  enabled = true
) => {
  const { isAuthenticated, getToken, organisation } = useAuth()

  return useQuery({
    queryKey: ["deferred-repayments-length", ...Object.values(offerParameters)],
    queryFn: async () =>
      new OfferAttributesControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getFeeOnlyValidPeriodsForFrequency({
        type: GetFeeOnlyValidPeriodsForFrequencyTypeEnum.DeferredRepayments,
        xXORGID: organisation?.organisationId!,
        advance: offerParameters.advance,
        baseFee: offerParameters.baseFee,
        repaymentLength: offerParameters.repaymentLength,
        repaymentFrequency:
          offerParameters.repaymentFrequency as GetFeeOnlyValidPeriodsForFrequencyRepaymentFrequencyEnum,
        dealId: offerParameters.dealId,
        offerScore: offerParameters.offerScore,
      }),
    enabled:
      isAuthenticated &&
      !!organisation?.organisationId &&
      enabled &&
      ![
        offerParameters.advance,
        offerParameters.baseFee,
        offerParameters.repaymentLength,
        offerParameters.repaymentFrequency,
      ].includes(undefined),
    refetchOnWindowFocus: false,
  })
}

export default useDeferredRepaymentsLength
