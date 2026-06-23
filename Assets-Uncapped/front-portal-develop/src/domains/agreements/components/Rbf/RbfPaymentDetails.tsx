import { HugeiconsIcon } from "@hugeicons/react"
import { GoogleDocSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import CardTable from "../CardTable/CardTable"

const RbfPaymentDetails = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "Rbf.PaymentDetails",
  })
  const frequency = agreement.repayments?.frequency
  const revenueShare = agreement.repayments?.revenueShare ?? 0

  return (
    <CardTable
      title={tCommon("paymentDetails")}
      icon={<HugeiconsIcon icon={GoogleDocSolidStandard} />}
      severity="accent-4"
      data={[
        {
          th: tCommon("paymentFrequency"),
          td: frequency ? titleCase(frequency) : "-",
        },
        {
          th: t("payWith"),
          td: frequency
            ? `${formatAsPercentage(revenueShare * 100, 0)} ${tCommon("ofYourSales", { frequency })}`
            : "-",
        },
      ]}
    />
  )
}

export default RbfPaymentDetails
