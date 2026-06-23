import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import { DetailedAgreementDTOStatusEnum } from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import { getProductConfig } from "../../product-config"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import useCardBase from "./useCardBase"

const DailyPayoutCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const config = getProductConfig(agreement)
  const { data: ledgerBalance } = useLedgerBalance({
    agreementId: agreement.id!,
  })
  const { paymentFrequency, viewHref } = useCardBase(agreement)

  const currency = agreement.currency ?? DEFAULT_CURRENCY
  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed
  const advanceRate = agreement.dailyPayoutDetails?.principalBalanceRate

  return (
    <CardTable
      icon={<HugeiconsIcon icon={config.icon} />}
      severity={config.severity}
      title={t(config.titleKey)}
      propertyFontWeight="normal"
      data={[
        {
          th: isClosed ? t("totalRepaid") : t("totalOutstanding"),
          td: format(
            (isClosed
              ? ledgerBalance?.totalAmount
              : ledgerBalance?.currentAmount) ?? 0,
            currency
          ),
          fontWeight: "bold",
        },
        ...(advanceRate != null
          ? [
              {
                th: t("advanceRate"),
                td: formatAsPercentage(advanceRate * 100, 0),
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

export default DailyPayoutCard
