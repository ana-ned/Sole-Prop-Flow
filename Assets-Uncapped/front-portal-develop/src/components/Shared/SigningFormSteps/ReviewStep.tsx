import React from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import SectionHeader from "../../../domains/onboarding/components/verify-owners/SectionHeader"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import FieldsSummary from "../../Collections/FieldsSummary"
import MultipleRadio from "../../Forms/MultipleRadio"
import { StepProps } from "../../Headless/MultistepForm"
import Alert from "../../UI/Alert"
import ContentDivider from "../../UI/ContentDivider"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import { SigningFormFields } from "./SigningFormSteps.types"

const ReviewStep = ({
  data,
  onBack,
  setStep,
  title,
  disclaimer,
  setCustomSubmit,
  content,
}: StepProps<SigningFormFields> & {
  title?: string
  disclaimer?: string
  content?: React.ReactNode
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "SigningFormSteps",
  })

  const { formState, control, handleSubmit } = useForm({
    defaultValues: data,
    mode: "onBlur",
  })

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          onClickBack={onBack}
          title={title || t("authorityStep.title")}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        {content}
        <form
          onSubmit={handleSubmit(() => {
            setCustomSubmit?.(data!, 5)
          })}
        >
          <FormLayout.Content>
            <MultipleRadio
              label={t("authorityStep.header")}
              subtitle={t("authorityStep.copy")}
              name="authority"
              control={control}
              disabled
            />

            <SectionHeader
              title={t("reviewStep.details")}
              onEdit={() => setStep?.(2)}
            />
            <ContentDivider className="mb-4">
              <FieldsSummary
                className=""
                data={[
                  {
                    th: t("reviewStep.name"),
                    td: [data?.firstName, data?.lastName].join(" "),
                  },
                  { th: t("detailsStep.email"), td: data?.email },
                ]}
              />
            </ContentDivider>
          </FormLayout.Content>
          <FormLayout.Footer>
            {disclaimer && <Alert>{disclaimer}</Alert>}
            <ButtonGroup>
              <Button type="submit" disabled={!formState.isValid}>
                {t("reviewStep.continue")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default ReviewStep
