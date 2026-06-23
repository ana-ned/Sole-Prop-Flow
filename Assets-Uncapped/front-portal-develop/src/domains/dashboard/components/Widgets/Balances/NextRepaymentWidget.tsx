import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Typography from "../../../../../components/Basic/Typography"
import Widget from "../../../../../components/UI/Widget"
import useAgreements from "../../../../../hooks/useAgreements"
import useAllTransactions from "../../../../../hooks/useAllTransactions"
import {
  DetailedAgreementDTOProductTypeEnum,
  GetAllTransactionsExecutionTypesEnum,
  TransactionTypeEnum,
} from "../../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../../utils/date"
import { formatAsPercentage } from "../../../../../utils/money"
import FormattedAmount from "./FormattedAmount"

interface NextRepaymentWidgetProps {
  fallbackCurrency: string
}

const NextRepaymentWidget = ({
  fallbackCurrency,
}: NextRepaymentWidgetProps) => {
  const { t } = useTranslation("dashboard", { keyPrefix: "widgets.balances" })
  const agreements = useAgreements()

  const { data, isLoading } = useAllTransactions({
    params: {
      size: 1,
      transactionTypes: new Set([TransactionTypeEnum.Repayment]),
      executionTypes: new Set([GetAllTransactionsExecutionTypesEnum.Scheduled]),
    },
  })

  if (isLoading) {
    return null
  }

  const transaction = data?.content?.[0]
  const agreement = agreements.data?.find(
    (a) => a.id === transaction?.account.id
  )
  const isRbf =
    agreement?.productType === DetailedAgreementDTOProductTypeEnum.Rbf
  const rbfRevenueShare = agreement?.repayments?.revenueShare ?? 0
  const frequency = agreement?.repayments?.frequency

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-4"
          icon={<HugeiconsIcon icon={Calendar02SolidStandard} />}
        />
      }
      title={t("nextRepayment.title")}
    >
      <div className="flex grow flex-col items-center gap-y-1 text-center">
        <Typography type="smallCopy">
          {transaction
            ? formatDate(transaction.operationScheduledDate!, {
                format: DateFormat.SHORT,
              })
            : t("nextRepayment.emptyState")}
        </Typography>
        {isRbf ? (
          <>
            <Typography type="h5">
              {formatAsPercentage(rbfRevenueShare * 100, 0)}
            </Typography>
            <Typography type="body" color="neutral-800">
              {t("nextRepayment.ofSales", {
                frequency: frequency,
              })}
            </Typography>
          </>
        ) : (
          <FormattedAmount
            amount={transaction?.transactionAmount.amount ?? 0}
            currency={
              transaction?.transactionAmount.currency ?? fallbackCurrency
            }
          />
        )}
      </div>

      <Button href="/transactions" variant="secondary" className="mt-4">
        {t("nextRepayment.button")}
      </Button>
    </Widget>
  )
}

export default NextRepaymentWidget
