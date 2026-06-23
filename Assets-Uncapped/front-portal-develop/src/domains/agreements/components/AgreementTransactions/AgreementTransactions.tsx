import { parseAsStringLiteral, useQueryState } from "nuqs"
import queryString from "query-string"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import SwitcherV2 from "../../../../components/Basic/Switcher/SwitcherV2"
import Chip from "../../../../components/UI/Chip"
import CardTable from "../CardTable/CardTable"
import {
  DetailedAgreementDTO,
  GetAllTransactionsExecutionTypesEnum,
  GetAllTransactionsTransactionTypesEnum,
} from "../../../../services/api/agreements"
import useAllTransactions from "../../../../hooks/useAllTransactions"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import {
  getTransactionStatusColor,
  TransactionTypeFilter,
} from "../../../transactions/utils/transacations"
import EmptyState from "../Payments/EmptyState"

const transactionsTabs = [
  GetAllTransactionsTransactionTypesEnum.Repayment,
  GetAllTransactionsTransactionTypesEnum.Cash,
] as const

type TransactionsTab = (typeof transactionsTabs)[number]

const AgreementTransactions = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "AgreementTransactions",
  })

  const [tab, setTab] = useQueryState(
    "transactions",
    parseAsStringLiteral(transactionsTabs).withDefault(
      GetAllTransactionsTransactionTypesEnum.Repayment
    )
  )

  const { data, isLoading } = useAllTransactions({
    params: {
      accountId: agreement.id,
      transactionTypes: new Set([tab]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Executed]),
      size: 3,
    },
  })

  const transactions = data?.content ?? []

  const currency = agreement.currency || DEFAULT_CURRENCY

  return (
    <CardTable
      title={
        <div className="flex items-center gap-4">
          {t("title")}
          <SwitcherV2
            values={[
              {
                value: GetAllTransactionsTransactionTypesEnum.Repayment,
                label: t("payments"),
              },
              {
                value: GetAllTransactionsTransactionTypesEnum.Cash,
                label: t("advances"),
              },
            ]}
            defaultValue={tab}
            onChange={(value) => setTab(value as TransactionsTab)}
          />
        </div>
      }
      severity="accent-11"
      actions={
        <Button
          variant="secondary"
          href={`/transactions?${queryString.stringify({
            agreementId: agreement.id,
            transactionTypeFilter:
              tab === GetAllTransactionsTransactionTypesEnum.Repayment
                ? TransactionTypeFilter.Payments
                : TransactionTypeFilter.Advances,
          })}`}
        >
          {t("viewAll")}
        </Button>
      }
      isLoading={isLoading}
      emptyState={
        <EmptyState
          message={
            tab === GetAllTransactionsTransactionTypesEnum.Repayment
              ? t("noPayments")
              : t("noAdvances")
          }
        />
      }
      data={transactions.map((transaction) => ({
        key: transaction.id,
        th: (
          <div className="flex items-center gap-2">
            {formatDate(transaction.createdAt, {
              format: DateFormat.SHORT,
            })}
            <Chip
              label={titleCase(transaction.status)}
              color={getTransactionStatusColor(transaction.status)}
            />
          </div>
        ),
        td: format(
          tab === GetAllTransactionsTransactionTypesEnum.Repayment
            ? -(transaction.transactionAmount?.amount || 0)
            : transaction.transactionAmount?.amount || 0,
          currency
        ),
      }))}
    />
  )
}

export default AgreementTransactions
