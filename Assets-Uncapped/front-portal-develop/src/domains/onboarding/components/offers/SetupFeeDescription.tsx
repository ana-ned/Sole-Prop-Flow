import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import {
  InterestRateLocDetailsSetupFeeTypeEnum,
  OfferResponse,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"

const SetupFeeDescription = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", { keyPrefix: "offers" })

  const locDetails = offer.offerDetails?.interestRateLocDetails
  const currency = offer.offerDetails?.commonOfferDetails?.advanceCurrency!

  if (!locDetails?.setupFeeMaxCreditLimitPercent) return null

  const isConditional =
    locDetails.setupFeeType ===
    InterestRateLocDetailsSetupFeeTypeEnum.Conditional

  const setupFeeAmount =
    (locDetails.setupFeeMaxCreditLimitPercent || 0) *
    (locDetails.maximumCreditLimit || 0)

  const formattedAmount = format(setupFeeAmount, currency, {
    minimumFractionDigits: 0,
  })

  if (isConditional) {
    return (
      <Typography type="smallCopy" color="neutral-700">
        <SanitizedHtml
          as="span"
          content={t("setupFeeDescription.conditional", {
            amount: formattedAmount,
            percentage: formatAsPercentage(
              locDetails.setupFeeUtilizationPercent! * 100,
              2,
              { removeTrailingZeros: true }
            ),
            days: locDetails.setupFeeDaysToCharge,
          })}
        />
      </Typography>
    )
  }

  return (
    <Typography type="smallCopy" color="neutral-700">
      <SanitizedHtml
        as="span"
        content={t("setupFeeDescription.unconditional", {
          amount: formattedAmount,
        })}
      />
    </Typography>
  )
}

export default SetupFeeDescription
