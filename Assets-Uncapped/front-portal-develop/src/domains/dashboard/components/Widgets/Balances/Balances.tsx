import useAgreements from "../../../../../hooks/useAgreements"
import useLateFeesSummary from "../../../../../hooks/useLateFeesSummary"
import LastTransactionWidget from "./LastTransactionWidget"
import LoansWidget from "./LoansWidget"
import NextRepaymentWidget from "./NextRepaymentWidget"
import OverdueRepaymentsWidget from "./OverdueRepaymentsWidget"

const Balances = () => {
  const agreements = useAgreements()
  const lateFeesSummary = useLateFeesSummary()

  const fallbackCurrency = agreements.data?.[0]?.currency
  const isOverdue =
    (lateFeesSummary.lateFeesSummaryQuery.data?.totalOverdueRepayments ?? 0) > 0

  if (agreements.data?.length === 0 || !fallbackCurrency) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:auto-cols-fr md:grid-flow-col">
      <LoansWidget />
      {isOverdue ? (
        <OverdueRepaymentsWidget />
      ) : (
        <NextRepaymentWidget fallbackCurrency={fallbackCurrency} />
      )}
      <LastTransactionWidget fallbackCurrency={fallbackCurrency} />
    </div>
  )
}

export default Balances
