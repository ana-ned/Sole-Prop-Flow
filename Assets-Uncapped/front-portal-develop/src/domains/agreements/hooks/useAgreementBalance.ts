import { useMemo } from "react"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
} from "../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../utils/currency"

const useAgreementBalance = (
  agreement: DetailedAgreementDTO,
  balance: BalanceWithAgreementStatusDTO
) => {
  return useMemo(() => {
    const currency = balance.currency ?? agreement.currency ?? DEFAULT_CURRENCY
    const total = balance.values?.REPAYABLE_TOTAL ?? 0
    const capital = balance.values?.ADVANCE ?? 0
    const baseFee =
      (balance.values?.FEES_BASE ?? 0) +
      (balance.values?.BASE_FEE_DISCOUNT ?? 0)
    const feeRate = agreement.fees?.base ?? 0
    const repaid = balance.values?.COLLECTION_COMPLETED ?? 0
    const pending = balance.values?.COLLECTION_PENDING ?? 0
    const leftToRepay = Math.max(0, total - repaid - pending)
    const outstanding = total - repaid

    return {
      currency,
      total,
      capital,
      baseFee,
      feeRate,
      repaid,
      pending,
      leftToRepay,
      outstanding,
    }
  }, [agreement, balance])
}

export default useAgreementBalance
