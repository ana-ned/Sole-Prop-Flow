import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import CardTable from "../CardTable/CardTable"

const DefaultBreakdown = ({
  agreement,
  currency,
}: {
  agreement: DetailedAgreementDTO
  currency: string
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "InterestRate.Breakdown",
  })

  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })

  const ledgerBalance = useLedgerBalance({ agreementId: agreement.id! })

  const principalPaid =
    (ledgerBalance.data?.totalPrincipal || 0) -
    (ledgerBalance.data?.currentPrincipal || 0)

  return (
    <CardTable
      title={tBreakdown("title", { product: t("product") })}
      icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: t("outstandingBalance"),
          td: format(ledgerBalance.data?.currentPrincipal || 0, currency),
        },
        {
          th: t("interestBalance"),
          td: format(ledgerBalance.data?.currentInterest || 0, currency),
        },
        {
          th: t("feeBalance"),
          td: format(ledgerBalance.data?.currentFees || 0, currency),
        },
        {
          th: t("principalPaid"),
          td: format(principalPaid, currency),
        },
      ]}
    />
  )
}

export default DefaultBreakdown
