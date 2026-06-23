import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import useStore from "../../../hooks/useStore"
import {
  OfferControllerV3Api,
  OfferResponseOfferTypeEnum,
  OfferResponse,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { getRepaymentsSummaryRequestParams } from "../utils/offers"

const REPAYMENT_SUMMARY_QUERY_KEY = "repayment-summary"

const useRepaymentSummary = (offer?: OfferResponse) => {
  const { isAuthenticated, getToken, organisation } = useAuth()
  const offerCustomizations = useStore((state) => state.offerCustomizations)

  const params =
    offer &&
    offer.offerType !== OfferResponseOfferTypeEnum.InterestRateLineOfCredit
      ? getRepaymentsSummaryRequestParams(offer, offerCustomizations)
      : undefined

  return useQuery({
    queryKey: [
      REPAYMENT_SUMMARY_QUERY_KEY,
      offer?.id,
      ...Object.values(params || {}),
    ],
    queryFn: async () =>
      new OfferControllerV3Api(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getRepaymentsSummary1({
        xXORGID: organisation?.organisationId!,
        offerId: offer?.id!,
        advance: params?.advance!,
        baseFee: params?.baseFee!,
        repaymentLength: params?.repaymentLength!,
      }),
    enabled:
      isAuthenticated &&
      !!organisation?.organisationId &&
      !!params &&
      !!offer?.id,
    refetchOnWindowFocus: false,
  })
}

export default useRepaymentSummary
