import { useShallow } from "zustand/shallow"
import useStore from "../../../hooks/useStore"
import { OfferResponse } from "../../../services/api/agreements/models"
import { getBusinessLoanOfferParams } from "../utils/offers"
import useDeferredRepayments from "./useDeferredRepayments"
import useDeferredRepaymentsParametersFixedOffer from "./useDeferredRepaymentsParametersFixedOffer"
import useRepaymentSummary from "./useRepaymentSummary"

export const useOfferRepaymentDetails = (
  offer: OfferResponse
): {
  repaymentAmount: number
  repaymentsNumber: number
  isLoading: boolean
} => {
  const offerSelectedDeferredRepayment = useStore(
    useShallow((state) => state.offerSelectedDeferredRepayment)
  )

  const offerParams = getBusinessLoanOfferParams(offer)
  const repaymentSummary = useRepaymentSummary(offer)
  const deferredRepaymentsParameters =
    useDeferredRepaymentsParametersFixedOffer(offer)

  const hasDeferredRepayments =
    offerParams.deferredRepaymentPeriod > 0 ||
    (!!offerSelectedDeferredRepayment?.deferredRepaymentPeriod &&
      offerSelectedDeferredRepayment.deferredRepaymentPeriod !== 0)

  const deferredRepayments = useDeferredRepayments(
    deferredRepaymentsParameters,
    undefined,
    hasDeferredRepayments
  )

  const repaymentAmount = hasDeferredRepayments
    ? deferredRepayments.data?.firstRepaymentAmount || 0
    : repaymentSummary.data?.firstRepaymentAmount || 0

  const repaymentsNumber = hasDeferredRepayments
    ? deferredRepayments.data?.repaymentsNumber || 0
    : repaymentSummary.data?.repaymentsNumber || 0

  return {
    repaymentAmount,
    repaymentsNumber,
    isLoading:
      repaymentSummary.isLoading ||
      (hasDeferredRepayments && deferredRepayments.isLoading),
  }
}
