import { HugeiconsIcon } from "@hugeicons/react"
import { Agreement02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import useRepaymentSchedule from "../../hooks/useRepaymentSchedule"
import CardTable from "../CardTable/CardTable"

const InterestRatePaymentDetails = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "InterestRate.PaymentDetails",
  })
  const scheduledTransactionsQuery = useRepaymentSchedule({
    agreementId: agreement.id,
  })

  const lastSchedule = scheduledTransactionsQuery.data?.findLast(
    (el) => (el.amount || 0) > 0
  )

  const frequency = agreement.repayments?.frequency
  const formattedFrequency = frequency ? titleCase(frequency) : "-"

  const isFasanara =
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara

  const projectedPayOffRow =
    agreement.status === DetailedAgreementDTOStatusEnum.Active &&
    lastSchedule?.scheduledDate
      ? [
          {
            th: t("projectedPayOff"),
            td: formatDate(lastSchedule.scheduledDate, {
              customFormat: "MMMM yyyy",
            }),
          },
        ]
      : []

  const interestRateRow = {
    th: tCommon("interestRate"),
    td: formatAsPercentage(agreement.interestRate! * 100, 2, {
      removeTrailingZeros: true,
    }),
  }

  const paymentFrequencyRow = {
    th: tCommon("paymentFrequency"),
    td: formattedFrequency,
  }

  const activationDateRow = agreement.activationDate
    ? [
        {
          th: tCommon("activationDate"),
          td: formatDate(new Date(agreement.activationDate), {
            format: DateFormat.LONG,
          }),
        },
      ]
    : []

  const data = isFasanara
    ? [
        ...projectedPayOffRow,
        paymentFrequencyRow,
        interestRateRow,
        ...activationDateRow,
      ]
    : [
        interestRateRow,
        paymentFrequencyRow,
        ...projectedPayOffRow,
        ...activationDateRow,
      ]

  return (
    <CardTable
      title={tCommon("paymentDetails")}
      icon={<HugeiconsIcon icon={Agreement02SolidStandard} />}
      severity="accent-4"
      data={data}
    />
  )
}

export default InterestRatePaymentDetails
