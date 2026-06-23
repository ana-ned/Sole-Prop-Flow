import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Route, Routes, useNavigate } from "react-router"
import { useShallow } from "zustand/shallow"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import Layout from "../../../../components/UI/Layout"
import useAuth from "../../../../hooks/useAuth"
import useDeal from "../../../../hooks/useDeal"
import useDevice from "../../../../hooks/useDevice"
import useStore from "../../../../hooks/useStore"
import {
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../../services/api/agreements"
import OfferExitIntentModal from "../../components/OfferExitIntentModal"
import OffersMenu from "../../components/OfferMenu"
import TopUpMenu from "../../components/TopUpMenu"
import FixedCustomizableTabContent from "../../components/offers/FixedCustomizableTabContent"
import FixedTermTabContent from "../../components/offers/FixedTermTabContent"
import LineOfCreditTabContent from "../../components/offers/LineOfCreditTabContent"
import LineOfCreditV2TabContent from "../../components/offers/LineOfCreditV2TabContent"
import RefinanceFixedCustomizableTabContent from "../../components/offers/RefinanceFixedCustomizableTabContent"
import RefinanceFixedTermTabContent from "../../components/offers/RefinanceFixedTermTabContent"
import RefinanceLineOfCreditV2 from "../../components/offers/RefinanceLineOfCreditV2"
import RevenueBasedFinancing, {
  useVariantQueryState,
} from "../../components/offers/RevenueBasedFinancingTabContent"
import OnboardingGuard from "../../components/OnboardingGuard"
import OnboardingLayout from "../../components/OnboardingLayout"
import OnboardingMenu from "../../components/OnboardingMenu"
import SkipStepButton from "../../components/SkipStepButton"
import { OnboardingMenuPaths } from "../../constants"
import useApplicationSteps from "../../hooks/useApplicationSteps"
import useOffers from "../../hooks/useOffers"
import useOnboarding from "../../hooks/useOnboarding"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"
import useSelectOffer from "../../hooks/useSelectOffer"
import DailyPayoutTabContent from "../../components/offers/DailyPayoutTabContent"
import CollectionsDetails from "../collections-details"
import DailyPayoutSidebar from "./DailyPayoutSidebar"
import LocV2OfferSidebar from "./LocV2OfferSidebar"
import RefinanceOfferSidebar from "./RefinanceOfferSidebar"

const isRefinancedOffer = (offer: OfferResponse) =>
  (offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds || []).length >
  0

const OfferTabContent = ({
  offer,
  selectedOffer,
}: {
  offer: OfferResponse
  selectedOffer?: OfferResponse
}) => {
  if (isRefinancedOffer(offer)) {
    if (
      offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit
    ) {
      return <RefinanceLineOfCreditV2 offer={offer} />
    }
    if (
      offer.offerType === OfferResponseOfferTypeEnum.FixedCustomizable &&
      offer.id !== selectedOffer?.id
    ) {
      return <RefinanceFixedCustomizableTabContent offer={offer} />
    }
    return <RefinanceFixedTermTabContent offer={offer} />
  }

  if (offer.offerType === OfferResponseOfferTypeEnum.Rbf) {
    return <RevenueBasedFinancing offer={offer} />
  }
  if (offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) {
    return <LineOfCreditTabContent offer={offer} />
  }
  if (offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit) {
    return <LineOfCreditV2TabContent offer={offer} />
  }
  if (offer.offerType === OfferResponseOfferTypeEnum.DailyPayout) {
    return <DailyPayoutTabContent offer={offer} />
  }
  if (
    offer.offerType === OfferResponseOfferTypeEnum.FixedCustomizable &&
    offer.id !== selectedOffer?.id
  ) {
    return <FixedCustomizableTabContent offer={offer} />
  }
  return <FixedTermTabContent offer={offer} />
}

const OffersSingle = ({
  onSubmit,
  offer,
}: StepProps & { offer: OfferResponse }) => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding")
  const { isMobile } = useDevice()
  const { handleCompleteStep, skipStep, hasCompletedStep } =
    useApplicationSteps()
  const { selectedOffer } = useOffers()
  const navigate = useNavigate()
  const { offerSelectedDeferredRepayment, offerCustomizations } = useStore(
    useShallow((state) => ({
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
      offerCustomizations: state.offerCustomizations,
    }))
  )
  const navigation = useOnboardingNavigation()
  const selectOffer = useSelectOffer()
  const customizations = offerCustomizations[offer.id!]
  const deal = useDeal()
  const { fullyCompleted } = useOnboarding()
  const [variant] = useVariantQueryState()

  const menu = useMemo(() => {
    if (!!selectedOffer && fullyCompleted) {
      return <TopUpMenu />
    }

    if (!selectedOffer) {
      return <OffersMenu />
    }

    return <OnboardingMenu />
  }, [fullyCompleted, selectedOffer])

  const hasOnboardingReady =
    hasCompletedStep("REVIEW") || auth.organisation?.activated

  const renderActionButton = () => {
    const isOfferSelected = offer.id === selectedOffer?.id
    const isLocOffer = [
      OfferResponseOfferTypeEnum.LineOfCredit,
      OfferResponseOfferTypeEnum.InterestRateLineOfCredit,
    ].includes(offer.offerType as any)

    // Case 1: Onboarding incomplete - show "Finish Onboarding" button
    if (!hasOnboardingReady) {
      return (
        <Button href={navigation.lastMissingStep?.href!}>
          {t("offers.finishOnboarding")}
        </Button>
      )
    }

    // Case 2: Offer already selected - show "Continue to Signing" button
    if (isOfferSelected) {
      return (
        <Button
          type="button"
          onClick={async () => {
            await handleCompleteStep("OFFERS")
            await navigate(OnboardingMenuPaths.Signing)
          }}
        >
          {t("offers.selected.button")}
        </Button>
      )
    }

    // Case 3: Line of Credit offer - show "Select and Customize" button
    if (isLocOffer) {
      return (
        <Button
          type="button"
          onClick={() => onSubmit?.({})}
          disabled={
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, sonarjs/different-types-comparison
            (customizations === undefined &&
              offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) ||
            !offer.expirationDate ||
            offer.expirationDate.getTime() < Date.now()
          }
        >
          {t("offers.selectAndCustomise")}
        </Button>
      )
    }

    // Case 4: Standard offer - show "Select Offer" button
    return (
      <Button
        type="button"
        loading={selectOffer.isPending}
        onClick={async () => {
          if (offer.id) {
            await selectOffer.mutateAsync({
              offerId: offer.id,
              selectOfferRequest: {
                ...(offer.offerType ===
                  OfferResponseOfferTypeEnum.FixedCustomizable && {
                  customizableOfferParameters:
                    customizations.customizableOfferParameters,
                }),
                ...(offer.offerType === OfferResponseOfferTypeEnum.Rbf && {
                  rbfOfferParameters: {
                    variantName: variant,
                  },
                }),
                deferredRepaymentsParameters: offerSelectedDeferredRepayment,
              },
            })
          }
        }}
        disabled={
          !offer.expirationDate || offer.expirationDate.getTime() < Date.now()
        }
      >
        {t("offers.selectOffer")}
      </Button>
    )
  }

  const renderFooterButtons = () => {
    const showSkip =
      !fullyCompleted && !deal.hasAmazonPartnerOffer && hasOnboardingReady

    return (
      <ButtonGroup withMargin backUrl={fullyCompleted ? "/" : undefined}>
        {showSkip && (
          <SkipStepButton
            onClick={async () => {
              await skipStep("OFFERS")
              await navigate(OnboardingMenuPaths.Owners)
            }}
          />
        )}
        {renderActionButton()}
      </ButtonGroup>
    )
  }

  return (
    <OnboardingGuard step="OFFERS">
      <OnboardingLayout
        menu={menu}
        sidebar={
          <Routes>
            {!isMobile && isRefinancedOffer(offer) && offer.id && (
              <Route
                path="/"
                element={
                  <Layout.Child withChat autoHeight withBackground={false}>
                    <RefinanceOfferSidebar />
                  </Layout.Child>
                }
              />
            )}
            {!isMobile &&
              !isRefinancedOffer(offer) &&
              offer.offerType !==
                OfferResponseOfferTypeEnum.InterestRateLineOfCredit &&
              offer.offerType !== OfferResponseOfferTypeEnum.LineOfCredit &&
              offer.offerType !== OfferResponseOfferTypeEnum.DailyPayout &&
              offer.id && (
                <Route
                  path="/"
                  element={
                    <Layout.Child withChat withBackground={false}>
                      <CollectionsDetails offer={offer} />
                    </Layout.Child>
                  }
                />
              )}
            {!isMobile &&
              !isRefinancedOffer(offer) &&
              offer.offerType ===
                OfferResponseOfferTypeEnum.InterestRateLineOfCredit &&
              offer.id && (
                <Route
                  path="/"
                  element={
                    <Layout.Child withChat autoHeight withBackground={false}>
                      <LocV2OfferSidebar offer={offer} />
                    </Layout.Child>
                  }
                />
              )}
            {!isMobile &&
              !isRefinancedOffer(offer) &&
              offer.offerType === OfferResponseOfferTypeEnum.DailyPayout &&
              offer.id && (
                <Route
                  path="/"
                  element={
                    <Layout.Child withChat autoHeight withBackground={false}>
                      <DailyPayoutSidebar offer={offer} />
                    </Layout.Child>
                  }
                />
              )}
            {offer.id && (
              <Route
                path="/collections"
                element={
                  <Layout.Child
                    redirectOnClose={`${OnboardingMenuPaths.Offers}/${offer.id}`}
                    desktopTitle={t("offers.collectionsDetails.title")}
                    withChat
                  >
                    <CollectionsDetails offer={offer} />
                  </Layout.Child>
                }
              />
            )}
          </Routes>
        }
      >
        <OnboardingLayout.Parent>
          <>
            <main className="relative">
              <OfferTabContent offer={offer} selectedOffer={selectedOffer} />
            </main>
            <footer className="mt-6">{renderFooterButtons()}</footer>
          </>
        </OnboardingLayout.Parent>
      </OnboardingLayout>

      <OfferExitIntentModal />
    </OnboardingGuard>
  )
}

export default OffersSingle
