import {
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Link02Icon,
} from "@hugeicons-pro/core-solid-rounded"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import { OnboardingMenuPaths } from "../constants"
import Button from "../../../components/Basic/Button"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Typography from "../../../components/Basic/Typography"
import Notice from "../../../components/UI/Notice/Notice"
import CardV2 from "../../../components/UI/CardV2/CardV2"
import useDeal from "../../../hooks/useDeal"
import { OfferResponseOfferTypeEnum } from "../../../services/api/agreements"
import useOffers from "../hooks/useOffers"
import useAmazonConsentStatus from "../hooks/useAmazonConsentStatus"
import useAmazonConsentFlag from "../hooks/useAmazonConsentFlag"
import useOnboarding from "../hooks/useOnboarding"
import OnboardingLayout from "../components/OnboardingLayout"
import OnboardingMenu from "../components/OnboardingMenu"
import TopUpMenu from "../components/TopUpMenu"
import PageLoader from "../../../components/Collections/PageLoader"

const AmazonConsent = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "signing.amazonConsent",
  })
  const { selectedOffer, isLoading: isOffersLoading } = useOffers()
  const {
    isConsentGiven,
    sellerCentralUrl,
    isLoading: isConsentLoading,
  } = useAmazonConsentStatus({
    refetchInterval: (query) =>
      query.state.data?.isConsentGiven ? false : 3000,
  })
  const { fullyCompleted } = useOnboarding()
  const { isAmazonPartnership } = useDeal()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()

  if (!isAmazonPartnership || !amazonConsentFeatureFlag) {
    return <Navigate to="/" replace />
  }

  if (isConsentGiven) {
    return <Navigate to={OnboardingMenuPaths.ReviewBankDetails} replace />
  }

  if (isOffersLoading) {
    return <PageLoader />
  }

  const getProductType = (
    offerType: OfferResponseOfferTypeEnum | undefined
  ) => {
    if (
      offerType === OfferResponseOfferTypeEnum.LineOfCredit ||
      offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit
    ) {
      return t("productType.lineOfCredit")
    }
    if (offerType === OfferResponseOfferTypeEnum.Rbf) {
      return t("productType.cashAdvance")
    }
    return t("productType.termLoan")
  }

  const productType = getProductType(selectedOffer?.offerType)

  const steps = t("steps", {
    returnObjects: true,
  }) as string[]

  return (
    <OnboardingLayout
      menu={fullyCompleted ? <TopUpMenu /> : <OnboardingMenu />}
    >
      <OnboardingLayout.Parent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Typography type="h4">
              {t("pageBarTitle", { productType })}
            </Typography>
            <Typography color="neutral-700">
              {t("intro", { productType })}
            </Typography>
          </div>

          <CardV2 title={t("whatHappensNext")}>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <BoxIcon
                  icon={<HugeiconsIcon icon={CheckmarkCircle01Icon} />}
                  severity="accent-brand"
                  size={6}
                />
                <Typography color="neutral-800">{steps[0]}</Typography>
              </div>
              <div className="flex items-start gap-4">
                <BoxIcon
                  icon={<HugeiconsIcon icon={CheckmarkCircle01Icon} />}
                  severity="accent-brand"
                  size={6}
                />
                <Typography color="neutral-800">{steps[1]}</Typography>
              </div>
            </div>
          </CardV2>

          <Notice
            variant="warning"
            icon={<HugeiconsIcon icon={AlertCircleIcon} />}
          >
            {t("accountDisclaimer", { productType })}
          </Notice>

          <CardV2
            title={t("toDo")}
            icon={<HugeiconsIcon icon={Link02Icon} />}
            severity="accent-9"
          >
            <div className="shadow-light-sm border-card rounded-card-md bg-white">
              <div className="rounded-card-md flex items-center justify-between gap-3 px-3 py-2">
                <Typography type="bodyMedium" color="neutral-800">
                  {t("linkItem", { productType })}
                </Typography>
                {sellerCentralUrl ? (
                  <Button
                    variant="primary"
                    size="sm"
                    href={sellerCentralUrl}
                    target="_blank"
                  >
                    {t("linkCta")}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    type="button"
                    loading={isConsentLoading}
                    disabled={!isConsentLoading}
                  >
                    {t("linkCta")}
                  </Button>
                )}
              </div>
            </div>
          </CardV2>
        </div>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default AmazonConsent
