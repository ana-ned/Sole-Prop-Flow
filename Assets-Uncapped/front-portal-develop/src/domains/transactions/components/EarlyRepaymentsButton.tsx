import { HugeiconsIcon } from "@hugeicons/react"
import { Appointment02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import { DetailedAgreementDTO } from "../../../services/api/agreements"
import useEarlyRepayments from "../hooks/useEarlyRepayments"

const EarlyRepaymentsButton = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t } = useTranslation("agreements", { keyPrefix: "EarlyRepayment" })
  const earlyRepaymentsQuery = useEarlyRepayments()

  if (!agreement.repayments?.earlyRepaymentAllowed) {
    return null
  }

  const isEligible = earlyRepaymentsQuery.data?.some(
    (repayment) => repayment.agreementId === agreement.id
  )

  if (!isEligible) {
    return null
  }

  return (
    <Button
      variant="secondary"
      href={`/loans/early-repayments/${agreement.id}`}
      state={{ backUrl: `/loans/${agreement.id}` }}
    >
      <HugeiconsIcon icon={Appointment02SolidStandard} />
      {t("title")}
    </Button>
  )
}

export default EarlyRepaymentsButton
