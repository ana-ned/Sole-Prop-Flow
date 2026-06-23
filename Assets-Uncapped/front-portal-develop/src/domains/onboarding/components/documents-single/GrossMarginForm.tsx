import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import Alert from "../../../../components/UI/Alert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"

const GrossMarginForm = ({
  onSubmit,
}: {
  onSubmit: (grossMargin?: number) => void
}) => {
  const { t } = useTranslation("onboarding", { keyPrefix: "documents" })
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        grossMargin: yup
          .number()
          .min(0)
          .max(1000)
          .transform((value: string, originalValue: string) =>
            originalValue.trim() === "" ? null : value
          ),
      })
    ),
    mode: "all",
  })

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit((formData) => {
          onSubmit(formData.grossMargin)
        })}
      >
        <FormLayout.Content>
          <FormControl>
            <Input
              control={control}
              type="number"
              name="grossMargin"
              label={t("grossMarginForm.label")}
            />
          </FormControl>

          <Alert className="mb-2">{t("grossMarginForm.provideAverage")}</Alert>
          <Alert className="mb-2">
            {t("grossMarginForm.example")}
            <ul className="pl-[1em]">
              {t(`grossMarginForm.exampleList`, {
                returnObjects: true,
              }).map((item) => (
                <li key={item} className="not-last:mb-2">
                  <SanitizedHtml content={item} as="span" />
                </li>
              ))}
            </ul>
          </Alert>
          <Alert className="mb-2">{t("grossMarginForm.inboundCosts")}</Alert>
          <Alert className="mb-2">{t("grossMarginForm.supportingData")}</Alert>
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup>
            <Button type="submit" disabled={!isValid}>
              {t("submitSingle")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default GrossMarginForm
