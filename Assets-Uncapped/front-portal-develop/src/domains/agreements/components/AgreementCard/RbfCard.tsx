import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import useAgreementDetails from "../../../../hooks/useAgreementDetails"
import { DetailedAgreementDTOStatusEnum } from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import { getProductConfig } from "../../product-config"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import { useTransferTitle } from "./useCardBase"

const RbfCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const { t: tAgreements } = useTranslation("agreements")
  const agreementDetails = useAgreementDetails(agreement)
  const config = getProductConfig(agreement)

  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed
  const { amount: repayAmount, currency: repayCurrency } = isClosed
    ? agreementDetails.getTotalRepaid()
    : agreementDetails.getLeftToRepay()

  const frequency = agreement.repayments?.frequency
  const revenueShare = agreement.repayments?.revenueShare
  let paymentFrequency: string
  if (revenueShare != null && frequency) {
    const share = formatAsPercentage(revenueShare * 100, 0)
    const frequencyLabel = tAgreements(
      `frequency.${frequency}` as "frequency.DAILY"
    )
    paymentFrequency = t("rbfPaymentFrequency", {
      share,
      frequencyLabel: frequencyLabel?.toLowerCase(),
    })
  } else {
    paymentFrequency = frequency
      ? tAgreements(`frequency.${frequency}` as "frequency.DAILY") ||
        titleCase(frequency)
      : ""
  }

  const transferTitle = useTransferTitle(agreement)
  const isTransferred = !!transferTitle
  const title = transferTitle ?? t(config.titleKey)

  return (
    <CardTable
      icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
      severity="accent-9"
      title={title}
      propertyFontWeight="normal"
      data={[
        {
          th: isClosed ? t("totalRepaid") : t("totalOutstanding"),
          td: format(repayAmount, repayCurrency || agreement.currency!),
          fontWeight: "bold",
        },
        ...(agreement.advanceAmount && agreement.advanceAmount > 0
          ? [
              {
                th: t("capital"),
                td: format(agreement.advanceAmount, agreement.currency!),
              },
            ]
          : []),
        { th: t("paymentFrequency"), td: paymentFrequency },
        {
          th: t("activationDate"),
          td: formatDate(agreement.activationDate!, {
            format: DateFormat.LONG,
          }),
        },
      ]}
      actions={
        <Button variant="secondary" href={`/loans/${agreement.id}`}>
          {isTransferred
            ? t("viewTransfer")
            : t("view", { type: t(config.titleKey) })}
        </Button>
      }
    />
  )
}

export default RbfCard
