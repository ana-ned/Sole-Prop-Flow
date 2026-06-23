import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  RepaymentScheduleResponse,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import useLocAgreement from "../../hooks/useLocAgreement"
import CardTable from "../CardTable/CardTable"

const LineOfCreditFixedBreakdown = ({
  agreement,
  balance,
  repaymentSchedule,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
  repaymentSchedule: RepaymentScheduleResponse[] | undefined
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "LineOfCreditFixed.Breakdown",
  })
  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })
  const locAgreement = useLocAgreement(agreement.id, { includeDraws: true })
  const draw = locAgreement?.draws?.find((d) => d.agreementId === agreement.id)

  const {
    currency,
    capital: drawAmount,
    baseFee: drawFeeAmount,
    feeRate: drawFeeRate,
  } = useAgreementBalance(agreement, balance)

  const frequency =
    agreement.repayments?.frequency ?? locAgreement?.collectionFrequency
  const frequencyLabel = frequency ? titleCase(frequency) : ""

  const numberOfRepayments =
    draw?.numberOfRepayments ?? repaymentSchedule?.length
  const firstRepayment = repaymentSchedule?.find(
    (item) => item.agreementId === agreement.id
  )

  return (
    <CardTable
      title={tBreakdown("title", { product: t("product") })}
      icon={<HugeiconsIcon icon={Calendar03SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: t("drawAmount"),
          td: format(drawAmount, currency),
        },
        {
          th: `${t("drawFee")} (${formatAsPercentage(drawFeeRate * 100, 2, { removeTrailingZeros: true })})`,
          td: format(drawFeeAmount, currency),
        },
        ...(numberOfRepayments && firstRepayment?.amount !== undefined
          ? [
              {
                th: t("repayments", {
                  count: numberOfRepayments,
                  frequency: frequencyLabel,
                }),
                td: format(firstRepayment.amount, currency),
              },
            ]
          : []),
      ]}
    />
  )
}

export default LineOfCreditFixedBreakdown
