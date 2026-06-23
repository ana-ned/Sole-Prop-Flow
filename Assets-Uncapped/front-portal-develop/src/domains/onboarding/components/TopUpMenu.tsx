import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import StepperMenu from "../../../components/UI/StepperMenu"
import useDeal from "../../../hooks/useDeal"
import useAmazonConsentFlag from "../hooks/useAmazonConsentFlag"
import useAmazonConsentStatus from "../hooks/useAmazonConsentStatus"
import { OfferResponseOfferStatusEnum } from "../../../services/api/agreements"
import useOffers from "../hooks/useOffers"
import useOnboarding, { OnboardingStep } from "../hooks/useOnboarding"
import { OnboardingMenuPaths } from "../constants"

const TopUpMenu = () => {
  const { t } = useTranslation("onboarding")
  const { pathname } = useLocation()
  const { data: offers, selectedOffer } = useOffers()
  const { isAmazonPartnership } = useDeal()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()
  const isOnAmazonConsent = pathname.includes(OnboardingMenuPaths.AmazonConsent)
  const amazonConsent = useAmazonConsentStatus({ enabled: isOnAmazonConsent })
  const { fullyCompleted } = useOnboarding()

  const isOnReviewBankDetails = pathname.includes(
    OnboardingMenuPaths.ReviewBankDetails
  )
  const isOnOffers = pathname.includes(OnboardingMenuPaths.Offers)
  const isOnSigning = pathname.includes(OnboardingMenuPaths.Signing)
  const showAmazonConsent =
    fullyCompleted && isAmazonPartnership && amazonConsentFeatureFlag

  const signingCompleted =
    selectedOffer?.offerStatus === OfferResponseOfferStatusEnum.Signed ||
    (selectedOffer?.offerStatus === OfferResponseOfferStatusEnum.Selected &&
      !!selectedOffer?.offerDetails?.commonOfferDetails?.signedOffline)

  const amazonConsentCompleted =
    !showAmazonConsent || amazonConsent.isConsentGiven

  const steps: OnboardingStep[] = [
    {
      caption: t("menu.offers"),
      href: OnboardingMenuPaths.Offers,
      active: isOnOffers,
      completed: !isOnOffers,
      count: offers?.length,
      custom: "offer",
    },
    {
      caption: t("menu.signing"),
      href: OnboardingMenuPaths.Signing,
      active: isOnSigning,
      completed: signingCompleted || isOnAmazonConsent || isOnReviewBankDetails,
    },
    ...(showAmazonConsent
      ? [
          {
            caption: t("menu.amazonConsent"),
            href: OnboardingMenuPaths.AmazonConsent,
            active: isOnAmazonConsent,
            completed: amazonConsent.isConsentGiven,
            disabled: !isOnAmazonConsent && !signingCompleted,
          },
        ]
      : []),
    {
      caption: t("menu.reviewBankDetails"),
      href: OnboardingMenuPaths.ReviewBankDetails,
      active: isOnReviewBankDetails,
      completed: false,
      disabled:
        !isOnReviewBankDetails &&
        (!signingCompleted || !amazonConsentCompleted),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <LogoOnlyMenu withSeparator={false} />
      <StepperMenu steps={steps} />
    </div>
  )
}

export default TopUpMenu
