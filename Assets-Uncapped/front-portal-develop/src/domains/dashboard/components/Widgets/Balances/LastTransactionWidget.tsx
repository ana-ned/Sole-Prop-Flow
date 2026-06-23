import { HugeiconsIcon } from "@hugeicons/react"
import { PropertySearchSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Typography from "../../../../../components/Basic/Typography"
import Chip from "../../../../../components/UI/Chip"
import Widget from "../../../../../components/UI/Widget"
import useAllTransactions from "../../../../../hooks/useAllTransactions"
import {
  GetAllTransactionsExecutionTypesEnum,
  TransactionTypeEnum,
} from "../../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../../utils/date"
import { titleCase } from "../../../../../utils/string"
import { getTransactionStatusColor } from "../../../../transactions/utils/transacations"
import FormattedAmount from "./FormattedAmount"

interface LastTransactionWidgetProps {
  fallbackCurrency: string
}

const LastTransactionWidget = ({
  fallbackCurrency,
}: LastTransactionWidgetProps) => {
  const { t } = useTranslation("dashboard", { keyPrefix: "widgets.balances" })

  const { data, isLoading } = useAllTransactions({
    params: {
      size: 1,
      transactionTypes: new Set([
        TransactionTypeEnum.Cash,
        TransactionTypeEnum.Card,
        TransactionTypeEnum.Invoice,
        TransactionTypeEnum.Refund,
        TransactionTypeEnum.Repayment,
      ]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Executed]),
    },
  })

  if (isLoading) {
    return null
  }

  const transaction = data?.content?.[0]

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-8"
          icon={<HugeiconsIcon icon={PropertySearchSolidRounded} />}
        />
      }
      title={t("lastTransaction.title")}
    >
      <div className="flex grow flex-col items-center gap-y-1 text-center">
        <Typography type="smallCopy">
          {transaction
            ? formatDate(transaction.createdAt, {
                format: DateFormat.SHORT,
              })
            : t("lastTransaction.emptyState")}
        </Typography>
        <FormattedAmount
          amount={transaction?.transactionAmount.amount ?? 0}
          currency={transaction?.transactionAmount.currency ?? fallbackCurrency}
        />
        {transaction && (
          <Chip
            label={titleCase(transaction.status)}
            color={getTransactionStatusColor(transaction.status)}
          />
        )}
      </div>
      <Button href="/transactions" variant="secondary" className="mt-4">
        {t("lastTransaction.button")}
      </Button>
    </Widget>
  )
}

export default LastTransactionWidget
