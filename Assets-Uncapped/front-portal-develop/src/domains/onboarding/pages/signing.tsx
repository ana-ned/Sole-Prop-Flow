import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Navigate, Route, Routes, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import FeatureContent from "../../../components/Collections/FeatureContent"
import PageLoader from "../../../components/Collections/PageLoader"
import OnboardingMenu from "../components/OnboardingMenu"
import TopUpMenu from "../components/TopUpMenu"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import {
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
  SigningDocumentsAPIV2ViaHelloSignApi,
  SigningDetailsSigningTypeEnum,
  CommonOfferDetailsLoanProductTypeEnum,
  DocumentDetailsSigningStatusEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import WorkingOnItIcon from "../../../svgs/illustrations/working-on-it.svg"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import NextSteps from "../components/signing/NextSteps"
import SigningCompleted from "../components/signing/SigningCompleted"
import SigningForm from "../components/signing/SigningForm"
import SigningSent from "../components/signing/SigningSent"
import Summary from "../components/signing/Summary"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOffers from "../hooks/useOffers"
import useOnboarding from "../hooks/useOnboarding"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"
import { signingQueryKeys } from "../queries"
import useDeal from "../../../hooks/useDeal"
import useAmazonConsentFlag from "../hooks/useAmazonConsentFlag"

const Sign = () => {
  const { t } = useTranslation("onboarding", { keyPrefix: "signing" })
  const auth = useAuth()
  const { isLoading, selectedOffer } = useOffers()
  const { handleCompleteStep } = useApplicationSteps()
  const { isMobile } = useDevice()
  const [justSigned, setJustSigned] = useState(false)
  const [sentModalOpen, setSentModalOpen] = useState(false)
  const [step, setStep] = useState(1)
  const navigation = useOnboardingNavigation()
  const { fullyCompleted } = useOnboarding()
  const { isAmazonPartnership } = useDeal()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()
  const navigate = useNavigate()

  const isLocWithDraw =
    selectedOffer?.offerType === OfferResponseOfferTypeEnum.LineOfCredit &&
    !!selectedOffer.offerDetails?.lineOfCreditDetails?.firstDrawAmount

  const statusQuery = useQuery({
    queryKey: signingQueryKeys.status(selectedOffer),
    queryFn: async () =>
      new SigningDocumentsAPIV2ViaHelloSignApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getStatuses({
        xXORGID: auth.organisation?.organisationId!,
        // @ts-expect-error schema expects set here
        requestBody: [
          ...(selectedOffer?.offerDetails?.signingDetails?.documentIds || [
            selectedOffer?.id!,
          ]),
        ],
      }),

    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!selectedOffer &&
      selectedOffer.offerStatus !== OfferResponseOfferStatusEnum.Selected &&
      !selectedOffer.offerDetails?.commonOfferDetails?.signedOffline &&
      selectedOffer.offerDetails?.signingDetails?.signingType ===
        SigningDetailsSigningTypeEnum.Embedded,
    refetchOnWindowFocus: false,
  })

  if (!isLoading && !selectedOffer) {
    return <Navigate to={OnboardingMenuPaths.Offers} />
  }

  if (isLoading || !selectedOffer) {
    return <PageLoader />
  }

  const isSigned =
    (!!selectedOffer.offerDetails?.commonOfferDetails?.signedOffline &&
      selectedOffer.offerDetails.commonOfferDetails.loanProductType ===
        CommonOfferDetailsLoanProductTypeEnum.LineOfCreditFrame &&
      selectedOffer.offerDetails.lineOfCreditDetails?.firstDrawAmount === 0) ||
    (!!selectedOffer.offerDetails?.commonOfferDetails?.signedOffline &&
      selectedOffer.offerDetails.commonOfferDetails.loanProductType !==
        CommonOfferDetailsLoanProductTypeEnum.LineOfCreditFrame) ||
    ((statusQuery.data || []).length > 0 &&
      statusQuery.data?.every(
        (el) => el.signingStatus === DocumentDetailsSigningStatusEnum.Completed
      )) ||
    justSigned

  // For activated Amazon sellers in the top-up flow, skip the signed summary
  // screen only when signing just completed in this session — not on a manual revisit
  if (
    justSigned &&
    auth.organisation?.activated &&
    isAmazonPartnership &&
    amazonConsentFeatureFlag &&
    fullyCompleted
  ) {
    return <Navigate to={OnboardingMenuPaths.AmazonConsent} />
  }

  return (
    <OnboardingGuard step="SIGNING">
      <OnboardingLayout
        menu={fullyCompleted ? <TopUpMenu /> : <OnboardingMenu />}
        sidebar={
          <>
            {!isMobile &&
              selectedOffer.offerDetails?.signingDetails?.signingType !==
                SigningDetailsSigningTypeEnum.Email &&
              step === 4 &&
              !isSigned && (
                <OnboardingLayout.Child withBackground={false}>
                  <Summary offer={selectedOffer} />
                </OnboardingLayout.Child>
              )}
            <Routes>
              <Route
                path="/more"
                element={
                  <OnboardingLayout.Child
                    desktopTitle={t("nextStepsTitle")}
                    redirectOnClose={OnboardingMenuPaths.Signing}
                  >
                    <NextSteps />
                  </OnboardingLayout.Child>
                }
              />
            </Routes>
          </>
        }
      >
        {isSigned ? (
          <SigningCompleted offer={selectedOffer} />
        ) : selectedOffer.offerDetails?.signingDetails?.signingType ===
          SigningDetailsSigningTypeEnum.Email ? (
          <SigningSent offer={selectedOffer} />
        ) : (
          <SigningForm
            offer={selectedOffer}
            onEmailSentCallback={async () => {
              setSentModalOpen(true)
              await handleCompleteStep("SIGNING")
            }}
            onSignCallback={async () => {
              setJustSigned(true)
              await handleCompleteStep("SIGNING")
            }}
            onStepChange={(current) => {
              setStep(current)
            }}
          />
        )}

        <Modal isOpen={sentModalOpen} shouldCloseOnOverlayClick={false}>
          <FeatureContent
            img={WorkingOnItIcon}
            title={
              isLocWithDraw
                ? t("sentModal.agreementsSent")
                : t("sentModal.agreementSent")
            }
            content={
              <Typography color="neutral-600">{t("sentModal.copy")}</Typography>
            }
            footerContent={
              <Button
                type="button"
                dataTestId="modal-cta"
                onClick={() => {
                  if (fullyCompleted) {
                    navigate("/")
                  } else {
                    navigation.next()
                  }
                }}
              >
                {t("sentModal.cta")}
              </Button>
            }
          />
        </Modal>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default Sign
