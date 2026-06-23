import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../../../hooks/useAuth"
import useStore from "../../../../../hooks/useStore"
import {
  OfferResponse,
  OfferResponseOfferTypeEnum,
  PricingControllerApi,
} from "../../../../../services/api/agreements"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"
import { getBusinessLoanOfferParams } from "../../../utils/offers"

const PRICING_QUERY_KEY = "PRICING_RANGE_OFFER"

const usePricing = ({ offer }: { offer: OfferResponse }) => {
  const auth = useAuth()
  const { setOfferCustomizations, offerCustomizations } = useStore(
    (state) => state
  )
  const offerParams = getBusinessLoanOfferParams(offer, offerCustomizations)

  const query = useQuery({
    queryKey: [
      PRICING_QUERY_KEY,
      offer.id,
      offerParams.advance,
      offerParams.repaymentLength,
    ],
    queryFn: async () =>
      new PricingControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getByDurationAndAdvance1({
        advance: offerParams.advance,
        repaymentLength: offerParams.repaymentLength,
        offerId: offer.id!,
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!offer.id &&
      offer.offerType === OfferResponseOfferTypeEnum.FixedCustomizable,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (
      query.data &&
      offer.offerType !== OfferResponseOfferTypeEnum.LineOfCredit
    ) {
      setOfferCustomizations(offer, {
        customizableOfferParameters: {
          advanceAmount: offerParams.advance,
          fixedRepaymentLength: offerParams.repaymentLength,
          fixedRepaymentBaseFee: Number(query.data.baseFee || 0),
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data])

  return query
}

export default usePricing
