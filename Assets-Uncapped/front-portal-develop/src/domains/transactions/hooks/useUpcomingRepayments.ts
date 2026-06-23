import useAllTransactions from "../../../hooks/useAllTransactions"
import {
  GetAllTransactionsExecutionTypesEnum,
  GetAllTransactionsTransactionTypesEnum,
} from "../../../services/api/agreements/apis/TransactionsApi"

const useUpcomingRepayments = ({
  agreementId,
}: { agreementId?: string } = {}) => {
  const query = useAllTransactions({
    params: {
      page: 0,
      size: 100,
      accountId: agreementId,
      transactionTypes: new Set([
        GetAllTransactionsTransactionTypesEnum.Repayment,
      ]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Scheduled]),
    },
  })

  const getUpcomingRepayments = () => {
    if (!query.data?.content) return []

    const repayments = query.data.content
      .filter((transaction) => transaction.operationScheduledDate)
      .toSorted(
        (a, b) =>
          new Date(a.operationScheduledDate!).getTime() -
          new Date(b.operationScheduledDate!).getTime()
      )

    if (agreementId) {
      return repayments.filter(
        (transaction) => transaction.account.id === agreementId
      )
    }

    return [...new Set(repayments.map((r) => r.account.id))].map(
      (id) => repayments.find((transaction) => transaction.account.id === id)!
    )
  }

  return {
    ...query,
    upcomingRepayments: getUpcomingRepayments(),
  }
}

export default useUpcomingRepayments
