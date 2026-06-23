import { HugeiconsIcon, HugeiconsIconProps } from "@hugeicons/react"
import { MoneyExchange03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { BoxIconSeverity } from "../../../../components/Basic/BoxIcon/BoxIcon"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import EarlyRepaymentsButton from "../../../transactions/components/EarlyRepaymentsButton"
import useUpcomingRepayments from "../../../transactions/hooks/useUpcomingRepayments"
import useProductType from "../../hooks/useProductType"
import CardTable from "../CardTable/CardTable"
import EmptyState from "./EmptyState"

interface PaymentsProps {
  agreement: DetailedAgreementDTO
  title?: string
  icon?: HugeiconsIconProps["icon"]
  iconColor?: keyof typeof BoxIconSeverity
}

const UPCOMING_LIMIT = 3

const Payments = ({
  agreement,
  title,
  icon = MoneyExchange03SolidStandard,
  iconColor = "accent-3",
}: PaymentsProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "common" })
  const { isRbf } = useProductType(agreement)

  const { upcomingRepayments, isLoading } = useUpcomingRepayments({
    agreementId: agreement.id,
  })

  if (agreement.status !== DetailedAgreementDTOStatusEnum.Active) {
    return null
  }

  const currency = agreement.currency || DEFAULT_CURRENCY
  const repayments = upcomingRepayments.slice(0, UPCOMING_LIMIT)

  const renderAmount = (amount: number | undefined, curr: string) =>
    isRbf
      ? `${formatAsPercentage((agreement.repayments?.revenueShare || 0) * 100, 0)} ${t(
          "ofYourSales",
          { frequency: agreement.repayments?.frequency }
        )}`
      : format(amount ?? 0, curr)

  return (
    <CardTable
      title={title ?? t("nextPayments")}
      icon={<HugeiconsIcon icon={icon} />}
      severity={iconColor}
      actions={<EarlyRepaymentsButton agreement={agreement} />}
      isLoading={isLoading}
      emptyState={<EmptyState message={t("noUpcoming")} />}
      data={repayments.map((repayment) => ({
        key: repayment.id,
        th: formatDate(new Date(repayment.operationScheduledDate!), {
          format: DateFormat.SHORT,
        }),
        td: renderAmount(
          repayment.transactionAmount.amount,
          repayment.transactionAmount.currency ?? currency
        ),
      }))}
    />
  )
}

export default Payments
