import { useShallow } from "zustand/shallow"
import useStore from "../../../hooks/useStore"
import { OfferResponse } from "../../../services/api/agreements"
import {
  getBusinessLoanOfferParams,
  getRepaymentsSummaryRequestParams,
  OFFER_SELECTED_STATUSES,
} from "../utils/offers"

const useDeferredRepaymentsParametersFixedOffer = (offer: OfferResponse) => {
  const { offerCustomizations, offerSelectedDeferredRepayment } = useStore(
    useShallow((state) => ({
      offerCustomizations: state.offerCustomizations,
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
    }))
  )
  const offerParams = getBusinessLoanOfferParams(offer)
  const params = getRepaymentsSummaryRequestParams(offer, offerCustomizations)

  const isOfferSelected = OFFER_SELECTED_STATUSES.includes(offer.offerStatus!)

  const deferredRepaymentPeriod = isOfferSelected
    ? offerParams.deferredRepaymentPeriod
    : offerSelectedDeferredRepayment?.deferredRepaymentPeriod

  const baseFee =
    isOfferSelected && offer.offerDetails?.fixedOfferDetails?.repaymentBaseFee
      ? offer.offerDetails.fixedOfferDetails.repaymentBaseFee -
        (offerParams.deferredRepaymentAdditionalFee || 0)
      : params.baseFee

  const customisationFee =
    isOfferSelected && offerParams.deferredRepaymentAdditionalFee
      ? offerParams.deferredRepaymentAdditionalFee
      : offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee

  return {
    deferredRepaymentPeriod: deferredRepaymentPeriod!,
    baseFee,
    customisationFee: customisationFee!,
    id: offer.id!,
    repaymentLength: params.repaymentLength,
    advance: params.advance,
    deferredRepayment:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters,
    currency: offerParams.currency!,
    offerType: offer.offerType!,
  }
}

export default useDeferredRepaymentsParametersFixedOffer
