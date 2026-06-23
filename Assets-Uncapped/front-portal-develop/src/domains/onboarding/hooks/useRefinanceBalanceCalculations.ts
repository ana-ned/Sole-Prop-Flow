import useBalances from "../../../hooks/useBalances"
import { OfferResponse } from "../../../services/api/agreements"
import { useRefinanceAgreementsFees } from "./useRefinanceAgreementsFees"

export const useRefinanceBalanceCalculations = (
  offer: OfferResponse,
  enabled = true
): {
  balancesQuery: ReturnType<typeof useBalances>
  feesData: ReturnType<typeof useRefinanceAgreementsFees>
  refinancedAgreementIds: string[]
  balanceToPayOff: number
  balanceToPayOffNet: number
  isLoading: boolean
} => {
  const balancesQuery = useBalances({ enabled })
  const refinancedAgreementIds =
    offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds || []
  const feesData = useRefinanceAgreementsFees(refinancedAgreementIds, enabled)

  // eslint-disable-next-line unicorn/no-array-reduce
  const balanceToPayOff = refinancedAgreementIds.reduce((sum, agreementId) => {
    const agreementBalance = balancesQuery.data?.balances?.find(
      (balance) => balance.agreementId === agreementId
    )

    return (
      sum +
      (agreementBalance?.values?.CURRENT_TO_REPAY || 0) -
      (agreementBalance?.values?.COLLECTION_PENDING || 0)
    )
  }, 0)

  const balanceToPayOffNet = balanceToPayOff - feesData.totalFeesWaived

  return {
    balancesQuery,
    feesData,
    refinancedAgreementIds,
    balanceToPayOff,
    balanceToPayOffNet,
    isLoading: balancesQuery.isLoading || feesData.isLoading,
  }
}
