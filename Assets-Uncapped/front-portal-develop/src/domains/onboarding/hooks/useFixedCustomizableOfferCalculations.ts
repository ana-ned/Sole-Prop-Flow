import { useShallow } from "zustand/shallow"
import useStore from "../../../hooks/useStore"
import { OfferResponse } from "../../../services/api/agreements"
import { deferredRepaymentsVisible } from "../utils/offers"
import useDeferredRepayments from "./useDeferredRepayments"
import useDeferredRepaymentsParametersFixedOffer from "./useDeferredRepaymentsParametersFixedOffer"

export const useFixedCustomizableOfferCalculations = (
  offer: OfferResponse,
  params: {
    amount: number
    baseFee: number
  }
): {
  isDeferredRepaymentVisible: boolean
  deferredRepaymentsParameters: ReturnType<
    typeof useDeferredRepaymentsParametersFixedOffer
  >
  deferredRepaymentFees: (number | undefined)[]
  deferredRepaymentDates: ReturnType<typeof useDeferredRepayments>[]
  deferredRepaymentAdditionalFee: number
  baseFeeWithDeferredRepayment: number
  fixedFeeAmount: number
  totalRepayable: number
  minTotalRepayable: number
} => {
  const { amount, baseFee } = params
  const offerSelectedDeferredRepayment = useStore(
    useShallow((state) => state.offerSelectedDeferredRepayment)
  )

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
      isDeferredRepaymentVisible
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      1,
      isDeferredRepaymentVisible
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      2,
      isDeferredRepaymentVisible
    ),
    useDeferredRepayments(
      deferredRepaymentsParameters,
      3,
      isDeferredRepaymentVisible
    ),
  ]

  const deferredRepaymentAdditionalFee =
    offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee || 0

  const baseFeeWithDeferredRepayment = baseFee + deferredRepaymentAdditionalFee

  const fixedFeeAmount = amount * baseFeeWithDeferredRepayment
  const totalRepayable = amount + fixedFeeAmount
  const minTotalRepayable = amount * (1 + baseFee)

  return {
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    deferredRepaymentAdditionalFee,
    baseFeeWithDeferredRepayment,
    fixedFeeAmount,
    totalRepayable,
    minTotalRepayable,
  }
}
