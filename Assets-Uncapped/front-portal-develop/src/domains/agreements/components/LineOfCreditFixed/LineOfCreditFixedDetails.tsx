import { HugeiconsIcon } from "@hugeicons/react"
import { GoogleDocSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import useLocAgreement from "../../hooks/useLocAgreement"
import CardTable from "../CardTable/CardTable"

const LineOfCreditFixedDetails = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "LineOfCreditFixed.Details",
  })
  const locAgreement = useLocAgreement(agreement.id, { includeDraws: true })

  if (!locAgreement) return null

  const currency =
    locAgreement.limit?.currency ?? agreement.currency ?? DEFAULT_CURRENCY
  const drawFeeRate =
    locAgreement.fees?.drawPercentFee ?? agreement.fees?.base ?? 0
  const termLength = agreement.repayments?.length
  const frequency =
    locAgreement.collectionFrequency ?? agreement.repayments?.frequency
  const formattedFrequency = frequency ? titleCase(frequency) : "-"
  const minimumDrawAmount = locAgreement.drawParameters?.minimumDrawAmount
  const facilityFeeRate = locAgreement.fees?.facilityPercentFee ?? 0
  const facilityFeeAmount = (locAgreement.limit?.amount ?? 0) * facilityFeeRate
  const drawFundsUntil = locAgreement.drawDownPeriodEndDate

  return (
    <CardTable
      title={t("title")}
      icon={<HugeiconsIcon icon={GoogleDocSolidStandard} />}
      severity="accent-4"
      data={[
        {
          th: t("drawFee"),
          td: formatAsPercentage(drawFeeRate * 100, 2, {
            removeTrailingZeros: true,
          }),
        },
        ...(termLength
          ? [
              {
                th: t("repaymentTerm"),
                td: tCommon("month", { count: termLength }),
              },
            ]
          : []),
        {
          th: t("repaymentCycle"),
          td: formattedFrequency,
        },
        ...(minimumDrawAmount?.amount === undefined
          ? []
          : [
              {
                th: t("minimumDraw"),
                td: format(
                  minimumDrawAmount.amount,
                  minimumDrawAmount.currency ?? currency
                ),
              },
            ]),
        {
          th: `${t("facilityFee")} (${formatAsPercentage(facilityFeeRate * 100, 2, { removeTrailingZeros: true })})`,
          td: format(facilityFeeAmount, currency),
        },
        ...(drawFundsUntil
          ? [
              {
                th: t("drawFundsUntil"),
                td: formatDate(drawFundsUntil, { format: DateFormat.SHORT }),
              },
            ]
          : []),
      ]}
    />
  )
}

export default LineOfCreditFixedDetails
