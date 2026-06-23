import useAgreements from "../../../hooks/useAgreements"
import useAuth from "../../../hooks/useAuth"
import useBalances from "../../../hooks/useBalances"
import { DetailedAgreementDTOStatusEnum } from "../../../services/api/agreements"
import { formatAsPercentage } from "../../../utils/money"

const useWithdrawCashLink = () => {
  const auth = useAuth()
  const { data, sortByLatest } = useAgreements()
  const balances = useBalances()

  const agreement = data
    ?.toSorted(sortByLatest)
    .find((item) => item.status === DetailedAgreementDTOStatusEnum.Active)

  const balance = balances.data?.aggregatedBalance!.values!.AVAILABLE_TOTAL || 0

  const allowed = agreement?.cashTransferAllowed

  if (!agreement || !allowed || balance === 0) {
    return false
  }

  return `https://weareuncapped.typeform.com/to/v17ARVLO#cash_convenience_fees=${encodeURIComponent(
    formatAsPercentage((agreement.fees?.cash || 0) * 100)
  )}&org=${auth.organisation?.organisationId}`
}

export default useWithdrawCashLink
