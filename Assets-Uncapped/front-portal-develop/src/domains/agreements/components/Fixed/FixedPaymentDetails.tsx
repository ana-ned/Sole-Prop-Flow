import { HugeiconsIcon } from "@hugeicons/react"
import { GoogleDocSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import {
  DetailedAgreementDTO,
  RepaymentScheduleResponse,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { format } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import CardTable from "../CardTable/CardTable"

const FixedPaymentDetails = ({
  agreement,
  repaymentSchedule,
}: {
  agreement: DetailedAgreementDTO
  repaymentSchedule: RepaymentScheduleResponse[] | undefined
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "Fixed.PaymentDetails",
  })
  const frequency = agreement.repayments?.frequency
  const termLength = agreement.repayments?.length
  const formattedFrequency = frequency ? titleCase(frequency) : "-"

  const firstRepayment = repaymentSchedule?.find(
    (item) => item.agreementId === agreement.id
  )
  const currency = agreement.currency ?? DEFAULT_CURRENCY

  return (
    <CardTable
      title={tCommon("paymentDetails")}
      icon={<HugeiconsIcon icon={GoogleDocSolidStandard} />}
      severity="accent-4"
      data={[
        ...(termLength
          ? [
              {
                th: tCommon("paymentTerm"),
                td: tCommon("month", { count: termLength }),
              },
            ]
          : []),
        {
          th: tCommon("paymentFrequency"),
          td: formattedFrequency,
        },
        {
          th: t("paymentAmount"),
          td: firstRepayment?.amount
            ? format(firstRepayment.amount, currency)
            : "-",
        },
      ]}
    />
  )
}

export default FixedPaymentDetails
