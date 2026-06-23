import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import FieldsSummary from "../../../../components/Collections/FieldsSummary"
import Alert from "../../../../components/UI/Alert/Alert"
import ContentDivider from "../../../../components/UI/ContentDivider"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import { OfferResponse } from "../../../../services/api/agreements"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"
import OnboardingLayout from "../OnboardingLayout"
import SectionHeader from "../verify-owners/SectionHeader"
import Summary from "./Summary"
import useOnboarding from "../../hooks/useOnboarding"
import { useNavigate } from "react-router"
import { OnboardingMenuPaths } from "../../constants"

const SigningSent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation(["common", "onboarding"])
  const navigation = useOnboardingNavigation()
  const { handleSubmit } = useForm()
  const { fullyCompleted } = useOnboarding()
  const navigate = useNavigate()

  const onSubmit = () => {
    if (fullyCompleted) {
      navigate("/")
    } else {
      navigation.next()
    }
  }

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          onClickBack={fullyCompleted ? undefined : navigation.prev}
          backUrl={fullyCompleted ? OnboardingMenuPaths.Offers : undefined}
          title={t("onboarding:signing.signingSent.title")}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLayout.Content>
            <Alert className="mt-3 mb-6">
              {t("onboarding:signing.signingSent.notice")}
            </Alert>

            <SectionHeader title={t("SigningFormSteps.reviewStep.details")} />

            <ContentDivider className="mb-6">
              <FieldsSummary
                className=""
                data={[
                  {
                    th: t("SigningFormSteps.reviewStep.name"),
                    td: [
                      offer.offerDetails?.signingDetails?.signerFirstName,
                      offer.offerDetails?.signingDetails?.signerLastName,
                    ].join(" "),
                  },
                  {
                    th: t("SigningFormSteps.detailsStep.email"),
                    td: offer.offerDetails?.signingDetails?.signerEmail,
                  },
                ]}
              />
            </ContentDivider>

            <Summary offer={offer} />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button type="submit" variant="primary">
                {t("onboarding:signing.signingSent.submit")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default SigningSent
