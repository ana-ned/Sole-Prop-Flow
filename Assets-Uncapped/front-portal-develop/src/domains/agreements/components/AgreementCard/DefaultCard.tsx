import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import { DetailedAgreementDTODetailedProductTypeEnum } from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import { getProductConfig } from "../../product-config"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import useCardBase, { useTransferTitle } from "./useCardBase"

const DefaultCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const { isClosed, repayAmount, repayCurrency, paymentFrequency, viewHref } =
    useCardBase(agreement)
  const config = getProductConfig(agreement)

  const productType = agreement.detailedProductType ?? agreement.productType
  const transferTitle = useTransferTitle(agreement)
  const isTransferred = !!transferTitle
  const title = transferTitle ?? t(config.titleKey)

  type Row = { th: string; td: string; fontWeight?: "bold" }
  const rows: Row[] = [
    {
      th: isClosed ? t("totalRepaid") : t("totalOutstanding"),
      td: format(repayAmount, repayCurrency),
      fontWeight: "bold",
    },
  ]

  if (agreement.advanceAmount && agreement.advanceAmount > 0) {
    rows.push({
      th: t("capital"),
      td: format(agreement.advanceAmount, agreement.currency!),
    })
  }

  if (
    productType !== DetailedAgreementDTODetailedProductTypeEnum.Rbf &&
    agreement.repayments?.length
  ) {
    rows.push({
      th: t("paymentTerm"),
      td: t("months", { count: agreement.repayments.length }),
    })
  }

  rows.push(
    { th: t("paymentFrequency"), td: paymentFrequency },
    {
      th: t("activationDate"),
      td: formatDate(agreement.activationDate!, { format: DateFormat.LONG }),
    }
  )

  return (
    <CardTable
      icon={<HugeiconsIcon icon={config.icon} />}
      severity={config.severity}
      title={title}
      propertyFontWeight="normal"
      data={rows}
      actions={
        <Button variant="secondary" href={viewHref}>
          {isTransferred
            ? t("viewTransfer")
            : t("view", { type: t(config.titleKey) })}
        </Button>
      }
    />
  )
}

export default DefaultCard
