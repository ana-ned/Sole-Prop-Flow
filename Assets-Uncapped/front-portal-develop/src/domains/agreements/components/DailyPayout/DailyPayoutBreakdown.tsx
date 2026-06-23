import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import CardTable from "../CardTable/CardTable"

const DailyPayoutBreakdown = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "DailyPayout.Breakdown",
  })
  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  const advanceRate = agreement.dailyPayoutDetails?.principalBalanceRate ?? 0
  const advanceLimit = agreement.dailyPayoutDetails?.advanceLimit ?? 0
  const dailyFee = agreement.dailyPayoutDetails?.dailyFeeRate ?? 0

  return (
    <CardTable
      title={tBreakdown("title", { product: t("product") })}
      icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: t("advanceRate"),
          td: formatAsPercentage(advanceRate * 100, 4, {
            removeTrailingZeros: true,
          }),
          fontWeight: "bold" as const,
          description: (
            <Typography type="smallCopy" color="neutral-600">
              {t("advanceRateDescription", {
                share: formatAsPercentage(advanceRate * 100, 4, {
                  removeTrailingZeros: true,
                }),
                limit: format(advanceLimit || 0, agreement.currency!),
              })}
            </Typography>
          ),
        },
        {
          th: t("dailyFee"),
          td: formatAsPercentage(dailyFee * 100, 6, {
            removeTrailingZeros: true,
          }),
          fontWeight: "bold" as const,
          description: (
            <Typography type="smallCopy" color="neutral-600">
              {t("dailyFeeDescription")}
            </Typography>
          ),
        },
        {
          th: t("repayments"),
          td: "",
          description: (
            <Typography type="smallCopy" color="neutral-600">
              {t("repaymentsDescription", {
                share: formatAsPercentage(advanceRate * 100, 4, {
                  removeTrailingZeros: true,
                }),
              })}
            </Typography>
          ),
        },
        ...(agreement.activationDate
          ? [
              {
                th: tCommon("activationDate"),
                td: formatDate(new Date(agreement.activationDate), {
                  format: DateFormat.LONG,
                }),
                fontWeight: "bold" as const,
              },
            ]
          : []),
      ]}
    />
  )
}

export default DailyPayoutBreakdown
