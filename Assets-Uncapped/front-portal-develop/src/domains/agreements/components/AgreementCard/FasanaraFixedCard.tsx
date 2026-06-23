import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import useCardBase from "./useCardBase"

const FasanaraFixedCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const { isClosed, repayAmount, repayCurrency, paymentFrequency, viewHref } =
    useCardBase(agreement)

  const sourceType = t("sellersfiAccountType.capitalLoan")
  const title = `${t("transferredFrom", { sourceType })} – ${t("balanceTransfer")}`

  return (
    <CardTable
      icon={<HugeiconsIcon icon={Calendar03SolidStandard} />}
      severity="accent-4"
      title={title}
      propertyFontWeight="normal"
      data={[
        {
          th: isClosed ? t("totalRepaid") : t("totalOutstanding"),
          td: format(repayAmount, repayCurrency),
          fontWeight: "bold",
        },
        ...(agreement.repayments?.length
          ? [
              {
                th: t("paymentTerm"),
                td: t("months", { count: agreement.repayments.length }),
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
          {t("viewTransfer")}
        </Button>
      }
    />
  )
}

export default FasanaraFixedCard
