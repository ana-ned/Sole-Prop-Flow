import { HugeiconsIcon } from "@hugeicons/react"
import { Wallet03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import CardTable from "../CardTable/CardTable"

const FasanaraActiveBreakdown = ({
  agreement,
  currency,
}: {
  agreement: DetailedAgreementDTO
  currency: string
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "InterestRate.Breakdown",
  })

  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })

  const { t: tBreakdown } = useTranslation("agreements", {
    keyPrefix: "Breakdown",
  })

  const ledgerBalance = useLedgerBalance({ agreementId: agreement.id! })

  const outstandingAmount =
    (ledgerBalance.data?.currentPrincipal || 0) +
    (ledgerBalance.data?.currentInterest || 0)

  return (
    <CardTable
      title={tBreakdown("title", { product: t("sellersfiProduct") })}
      icon={<HugeiconsIcon icon={Wallet03SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: tCommon("totalOutstanding"),
          td: format(outstandingAmount, currency),
          fontWeight: "bold" as const,
        },
        {
          th: t("principalBalance"),
          td: format(ledgerBalance.data?.currentPrincipal || 0, currency),
          child: true,
          propertyFontWeight: "normal" as const,
        },
        {
          th: t("interestBalance"),
          td: format(ledgerBalance.data?.currentInterest || 0, currency),
          child: true,
          propertyFontWeight: "normal" as const,
        },
      ]}
    />
  )
}

export default FasanaraActiveBreakdown
