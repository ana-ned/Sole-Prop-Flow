import useDeal from "../../../../hooks/useDeal"
import { OfferResponse } from "../../../../services/api/agreements"
import useAmazonConsentFlag from "../../../onboarding/hooks/useAmazonConsentFlag"
import useAmazonConsentStatus from "../../../onboarding/hooks/useAmazonConsentStatus"
import AmazonConsentBanner from "./AmazonConsentBanner"
import AwaitingActivationBanner from "./AwaitingActivationBanner"

const AwaitingDisbursementBanner = ({ offer }: { offer: OfferResponse }) => {
  const deal = useDeal()
  const amazonConsent = useAmazonConsentStatus()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()

  if (deal.isAmazonPartnership && amazonConsentFeatureFlag) {
    // Suppress any banner while consent status is still loading to avoid flash
    if (amazonConsent.isPending) {
      return null
    }

    // Amazon sellers must complete Seller Central consent before we show the
    // "processing your funds" banner — AmazonConsentBanner handles the CTA
    if (!amazonConsent.isConsentGiven) {
      return <AmazonConsentBanner offer={offer} />
    }
  }

  return <AwaitingActivationBanner />
}

export default AwaitingDisbursementBanner
