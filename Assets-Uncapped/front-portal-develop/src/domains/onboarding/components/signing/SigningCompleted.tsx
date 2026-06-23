import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Alert from "../../../../components/UI/Alert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import useDeal, { getDealQueryKey } from "../../../../hooks/useDeal"
import useAmazonConsentFlag from "../../hooks/useAmazonConsentFlag"
import {
  OfferResponse,
  OfferResponseOfferStatusEnum,
} from "../../../../services/api/agreements"
import { OnboardingMenuPaths } from "../../constants"
import useApplicationSteps from "../../hooks/useApplicationSteps"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "../../hooks/useOffers"
import useOnboarding from "../../hooks/useOnboarding"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"
import OnboardingLayout from "../OnboardingLayout"
import Summary from "./Summary"

const SigningCompleted = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", { keyPrefix: "signing" })
  const { handleCompleteStep } = useApplicationSteps()
  const navigation = useOnboardingNavigation()
  const navigate = useNavigate()
  const { handleSubmit } = useForm()
  const queryClient = useQueryClient()
  const { organisation } = useAuth()
  const { isAmazonPartnership } = useDeal()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()
  const { fullyCompleted } = useOnboarding()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const waitForSignedStatus = async (): Promise<boolean> => {
    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts && isMountedRef.current) {
      await queryClient.invalidateQueries({
        queryKey: [AGREEMENTS_OFFERS_QUERY_KEY],
        type: "all",
      })

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (!isMountedRef.current) break

      const currentData = queryClient.getQueryData<OfferResponse[]>([
        AGREEMENTS_OFFERS_QUERY_KEY,
      ])
      const currentOffer = currentData?.find((o) => o.id === offer.id)

      if (currentOffer?.offerStatus === OfferResponseOfferStatusEnum.Signed) {
        return true
      }

      attempts++
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return false
  }

  const onSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      await handleCompleteStep("SIGNING")

      if (
        organisation?.activated &&
        !(
          offer.offerStatus === OfferResponseOfferStatusEnum.Selected &&
          offer.offerDetails?.commonOfferDetails?.signedOffline
        )
      ) {
        await waitForSignedStatus()
      }
    } finally {
      setIsSubmitting(false)
      await queryClient.invalidateQueries({
        queryKey: getDealQueryKey(),
        type: "all",
      })
      // Note: signing.tsx has a <Navigate> that redirects to Amazon Consent
      // immediately when justSigned is true (same session). This navigate
      // handles the revisit case — when the user returns to a previously signed
      // offer (isSigned via signedOffline/document status) and clicks the button.
      if (
        organisation?.activated &&
        isAmazonPartnership &&
        amazonConsentFeatureFlag
      ) {
        navigate(OnboardingMenuPaths.AmazonConsent)
      } else if (fullyCompleted) {
        navigate(OnboardingMenuPaths.ReviewBankDetails)
      } else {
        navigation.next()
      }
    }
  }

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          title={t("signingCompleted.title")}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLayout.Content>
            <Alert className="mt-3 mb-6">{t("signingCompleted.notice")}</Alert>

            <Summary offer={offer} />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                {t("signingCompleted.submit")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default SigningCompleted
