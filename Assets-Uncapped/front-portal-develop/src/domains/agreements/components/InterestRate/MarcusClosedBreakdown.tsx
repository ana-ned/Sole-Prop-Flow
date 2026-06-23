import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import useMarcusImportDetails from "../../hooks/useMarcusImportDetails"
import CardTable from "../CardTable/CardTable"

const MarcusClosedBreakdown = ({
  agreement,
  currency,
}: {
  agreement: DetailedAgreementDTO
  currency: string
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "MarcusClosedAgreementInfo",
  })

  const marcusDetails = useMarcusImportDetails({
    agreementId: agreement.id!,
  })

  const marcusData = marcusDetails.data?.importedParentAgreement

  return (
    <CardTable
      title={t("breakdownTitle")}
      icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
      severity="accent-11"
      data={[
        {
          th: t("loanAmount"),
          td: format(marcusData?.totalRepayable || 0, currency),
        },
        {
          th: t("principalPaidBefore"),
          td: format(
            marcusData?.totalPrincipalRepaidBeforeTransfer || 0,
            currency
          ),
        },
        {
          th: t("interestPaidBefore"),
          td: format(
            marcusData?.totalInterestRepaidBeforeTransfer || 0,
            currency
          ),
        },
      ]}
    />
  )
}

export default MarcusClosedBreakdown
