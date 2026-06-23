import { useShallow } from "zustand/shallow"
import useStore from "../../../hooks/useStore"
import { OfferResponse } from "../../../services/api/agreements"
import {
  deferredRepaymentsVisible,
  getBusinessLoanOfferParams,
} from "../utils/offers"
import useDeferredRepayments from "./useDeferredRepayments"
import useDeferredRepaymentsParametersFixedOffer from "./useDeferredRepaymentsParametersFixedOffer"
import useOffers from "./useOffers"

export const useFixedTermOfferCalculations = (
  offer: OfferResponse
): {
  isDeferredRepaymentVisible: boolean
  deferredRepaymentsParameters: ReturnType<
    typeof useDeferredRepaymentsParametersFixedOffer
  >
  deferredRepaymentFees: (number | undefined)[]
  deferredRepaymentDates: ReturnType<typeof useDeferredRepayments>[]
  deferredRepaymentAdditionalFee: number
  baseFee: number
  baseFeeWithDeferredRepayment: number
  fixedFeeAmount: number
  minTotalRepayable: number
  totalRepayable: number
} => {
  const { selectedOffer } = useOffers()
  const offerSelectedDeferredRepayment = useStore(
    useShallow((state) => state.offerSelectedDeferredRepayment)
  )

  const offerParams = getBusinessLoanOfferParams(offer)
  const isSelected = selectedOffer?.id === offer.id
  const baseFee = offerParams.baseFee || 0

  // Deferred repayment calculations
  const isDeferredRepaymentVisible = deferredRepaymentsVisible(offer)
  const deferredRepaymentsParameters =
    useDeferredRepaymentsParametersFixedOffer(offer)

  const deferredRepaymentFees = [
    0,
    deferredRepaymentsParameters.deferredRepayment?.oneMonthFee,
    deferredRepaymentsParameters.deferredRepayment?.twoMonthsFee,
    deferredRepaymentsParameters.deferredRepayment?.threeMonthsFee,
  ]

  const deferredRepaymentDates = [
    useDeferredRepayments(
      deferredRepaymentsParameters,
      0,
      isDeferredRepaymentVisible ||
        (isSelected && offerParams.deferredRepaymentPeriod === 0)
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      1,
      isDeferredRepaymentVisible ||
        (isSelected && offerParams.deferredRepaymentPeriod === 1)
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      2,
      isDeferredRepaymentVisible ||
        (isSelected && offerParams.deferredRepaymentPeriod === 2)
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      3,
      isDeferredRepaymentVisible ||
        (isSelected && offerParams.deferredRepaymentPeriod === 3)
    ),
  ]

  const deferredRepaymentAdditionalFee =
    offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee || 0

  const baseFeeWithDeferredRepayment =
    baseFee + (isDeferredRepaymentVisible ? deferredRepaymentAdditionalFee : 0)

  const fixedFeeAmount = offerParams.advance * baseFeeWithDeferredRepayment
  const minTotalRepayable = offerParams.advance * (1 + baseFee)
  const totalRepayable = offerParams.advance + fixedFeeAmount

  return {
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    deferredRepaymentAdditionalFee,
    baseFee,
    baseFeeWithDeferredRepayment,
    fixedFeeAmount,
    minTotalRepayable,
    totalRepayable,
  }
}
