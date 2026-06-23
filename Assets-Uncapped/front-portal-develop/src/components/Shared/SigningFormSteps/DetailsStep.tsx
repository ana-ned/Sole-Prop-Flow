import React from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import FormControl from "../../Forms/FormControl/FormControl"
import Input from "../../Forms/Input"
import { StepProps } from "../../Headless/MultistepForm"
import Alert from "../../UI/Alert"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import { SigningFormFields, detailsStepSchema } from "./SigningFormSteps.types"

const DetailsStep = ({
  data,
  onSubmit,
  onBack,
  content,
  disclaimer,
}: StepProps<SigningFormFields> & {
  content?: React.ReactNode
  disclaimer?: string
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "SigningFormSteps",
  })

  const { handleSubmit, formState, control } = useForm({
    resolver: yupResolver(detailsStepSchema),
    defaultValues: data,
    mode: "onBlur",
  })

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          onClickBack={onBack}
          title={t("detailsStep.title")}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        {content}
        <form onSubmit={handleSubmit(onSubmit!)}>
          <FormLayout.Content>
            {t("detailsStep.content", {
              returnObjects: true,
            }).map((item) => (
              <Typography color="neutral-600" className="mb-4" key={item}>
                {item}
              </Typography>
            ))}

            <FormControl>
              <Input
                label={t("detailsStep.firstName")}
                name="firstName"
                control={control}
              />
            </FormControl>

            <FormControl>
              <Input
                label={t("detailsStep.lastName")}
                name="lastName"
                control={control}
              />
            </FormControl>

            <FormControl>
              <Input
                label={t("detailsStep.email")}
                name="email"
                control={control}
                type="email"
              />
            </FormControl>
          </FormLayout.Content>
          <FormLayout.Footer>
            {disclaimer && <Alert>{disclaimer}</Alert>}
            <ButtonGroup>
              <Button type="submit" disabled={!formState.isValid}>
                {t("detailsStep.submit")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default DetailsStep
