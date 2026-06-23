import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import { getProductConfig } from "../../product-config"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import useCardBase from "./useCardBase"

const LineOfCreditFixedDrawCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const { isClosed, repayAmount, repayCurrency, paymentFrequency, viewHref } =
    useCardBase(agreement)
  const config = getProductConfig(agreement)

  return (
    <CardTable
      icon={<HugeiconsIcon icon={Wallet03SolidStandard} />}
      severity="accent-3"
      title={t(config.titleKey)}
      propertyFontWeight="normal"
      data={[
        {
          th: isClosed ? t("totalRepaid") : t("totalOutstanding"),
          td: format(repayAmount, repayCurrency),
          fontWeight: "bold",
        },
        ...(agreement.advanceAmount && agreement.advanceAmount > 0
          ? [
              {
                th: t("drawAmount"),
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
        <Button variant="secondary" href={viewHref}>
          {t("view", { type: t(config.titleKey) })}
        </Button>
      }
    />
  )
}

export default LineOfCreditFixedDrawCard
