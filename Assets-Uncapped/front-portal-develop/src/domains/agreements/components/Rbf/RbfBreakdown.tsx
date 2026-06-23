import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
} from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, formatAsPercentage } from "../../../../utils/money"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import CardTable from "../CardTable/CardTable"

const RbfBreakdown = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "Rbf.Breakdown",
  })
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })

  const { currency, total, capital, baseFee, feeRate } = useAgreementBalance(
    agreement,
    balance
  )

  return (
    <CardTable
      title={tBreakdown("title", { product: t("product") })}
      icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: tCommon("totalPayable"),
          td: format(total, currency),
        },
        {
          th: tCommon("capital"),
          td: format(capital, currency),
          child: true,
          fontWeight: "normal" as const,
        },
        {
          th: `${tCommon("fixedFee")} (${formatAsPercentage(feeRate * 100, 2)})`,
          td: format(baseFee, currency, { signDisplay: "negative" }),
          child: true,
          fontWeight: "normal" as const,
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

export default RbfBreakdown
