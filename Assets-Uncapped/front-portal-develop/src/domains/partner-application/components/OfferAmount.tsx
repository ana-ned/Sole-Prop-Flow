import { useTranslation } from "react-i18next"
import { ApplicationDetailsResponse } from "../../../services/api/partners"
import { format } from "../../../utils/money"

const OfferAmount = ({
  application,
}: {
  application: ApplicationDetailsResponse
}) => {
  const { offerDetailsResponse } = application
  const { t } = useTranslation("partner-application", {
    keyPrefix: "offerAmount",
  })

  if (!offerDetailsResponse?.amount || !offerDetailsResponse.currency) {
    return <>-</>
  }

  return (
    <span className="text-neutral-600">
      {format(offerDetailsResponse.amount, offerDetailsResponse.currency)}
      {` (${t("estimated")})`}
    </span>
  )
}

export default OfferAmount
