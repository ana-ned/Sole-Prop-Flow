import { useTranslation } from "react-i18next"
import MultistepForm from "../../../../components/Headless/MultistepForm/MultistepForm"
import AuthorityStep from "../../../../components/Shared/SigningFormSteps/AuthorityStep"
import DetailsStep from "../../../../components/Shared/SigningFormSteps/DetailsStep"
import ReviewOfferNoAuthority from "../../../../components/Shared/SigningFormSteps/ReviewOfferNoAuthority"
import ReviewOfferStep from "../../../../components/Shared/SigningFormSteps/ReviewOfferStep"
import ReviewStep from "../../../../components/Shared/SigningFormSteps/ReviewStep"
import { OfferResponse } from "../../../../services/api/agreements"

const SigningForm = ({
  offer,
  onEmailSentCallback,
  onSignCallback,
  onStepChange,
}: {
  offer: OfferResponse
  onEmailSentCallback: () => void
  onSignCallback: () => void
  onStepChange: (current: number) => void
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "signing",
  })
  return (
    <MultistepForm onStepChange={onStepChange}>
      <AuthorityStep resource={offer} title={t("agreementSignatory")} />
      <DetailsStep />
      <ReviewStep />
      <ReviewOfferStep resource={offer} onSignCallback={onSignCallback} />
      <ReviewOfferNoAuthority
        resource={offer}
        onEmailSentCallback={onEmailSentCallback}
      />
    </MultistepForm>
  )
}

export default SigningForm
