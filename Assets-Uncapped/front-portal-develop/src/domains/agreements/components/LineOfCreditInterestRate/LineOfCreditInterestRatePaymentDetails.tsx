import { HugeiconsIcon } from "@hugeicons/react"
import { GoogleDocSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import { DetailedAgreementDTO } from "../../../../services/api/agreements"
import { titleCase } from "../../../../utils/string"
import useLocAgreement from "../../hooks/useLocAgreement"
import CardTable from "../CardTable/CardTable"

const LineOfCreditInterestRatePaymentDetails = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t: tCommon } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t } = useTranslation("agreements", {
    keyPrefix: "LineOfCreditInterestRate.PaymentDetails",
  })
  const locAgreement = useLocAgreement(agreement.id)

  if (!locAgreement) return null

  const drawMonths = locAgreement.drawParameters?.drawDownTermInMonths ?? 0
  const repaymentMonths =
    locAgreement.repaymentTerms?.repaymentPhaseDuration ?? 0
  const totalMonths = drawMonths + repaymentMonths

  const frequency = locAgreement.collectionFrequency
  const formattedFrequency = frequency ? titleCase(frequency) : "-"

  return (
    <CardTable
      title={tCommon("paymentDetails")}
      icon={<HugeiconsIcon icon={GoogleDocSolidStandard} />}
      severity="accent-4"
      data={[
        {
          th: (
            <div>
              <div>{tCommon("paymentTerm")}</div>
              <Typography type="smallCopy" color="neutral-700">
                {t("drawPhasePlusRepaymentPhase")}
              </Typography>
            </div>
          ),
          td: tCommon("month", { count: totalMonths }),
        },
        {
          th: tCommon("paymentFrequency"),
          td: formattedFrequency,
        },
      ]}
    />
  )
}

export default LineOfCreditInterestRatePaymentDetails
