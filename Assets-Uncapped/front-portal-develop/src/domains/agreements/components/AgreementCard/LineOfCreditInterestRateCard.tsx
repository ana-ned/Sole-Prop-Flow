import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import useLineOfCreditAgreements from "../../../../hooks/useLineOfCreditAgreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import { getProductConfig } from "../../product-config"
import CardTable from "../CardTable/CardTable"
import type { AgreementCardProps } from "./types"
import useCardBase from "./useCardBase"

const LineOfCreditInterestRateCard = ({ agreement }: AgreementCardProps) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementCard" })
  const { isClosed, repayAmount, repayCurrency, paymentFrequency, viewHref } =
    useCardBase(agreement)
  const { locAgreements } = useLineOfCreditAgreements()
  const config = getProductConfig(agreement)

  const locAgreement = useMemo(
    () =>
      locAgreements.data?.content?.find(
        (el) => el.agreementId?.id === agreement.id
      ) ?? null,
    [locAgreements.data?.content, agreement.id]
  )

  if (locAgreements.isLoading) return null

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
        ...(locAgreement
          ? [
              {
                th: t("maximumCreditLimit"),
                td: format(
                  locAgreement.limit?.amount || 0,
                  agreement.currency!
                ),
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

export default LineOfCreditInterestRateCard
