import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as yup from "yup"
import YupPassword from "yup-password"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import Checkbox from "../../../components/Forms/Checkbox"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import { StepProps } from "../../../components/Headless/MultistepForm"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import RegistrationLayout from "../../registration/components/RegistrationLayout"
import PartnerRegistrationSidebar from "./PartnerRegistrationSidebar"

YupPassword(yup)

interface CredentialsForm {
  firstName: string
  lastName: string
  email: string
  password: string
  terms: boolean
}

const PartnerRegistrationCredentials = ({
  onSubmit,
  data,
}: StepProps<CredentialsForm>) => {
  const { t } = useTranslation("partner-registration", {
    keyPrefix: "partnerRegistrationCredentials",
  })
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required().min(2),
        lastName: yup.string().required().min(2),
        email: yup.string().email().required(),
        password: yup
          .string()
          .password()
          .min(8)
          .minLowercase(1)
          .minUppercase(1)
          .minNumbers(1)
          .required(),
        terms: yup.bool().oneOf([true], t("mustBeAccepted")),
      })
    ),
    mode: "onBlur",
    defaultValues: data,
  })

  return (
    <RegistrationLayout
      sidebar={<PartnerRegistrationSidebar />}
      title={t("title")}
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit((formData) => {
            onSubmit?.(formData)
          })}
        >
          <FormLayout.Content>
            <FormControl>
              <Input
                control={control}
                name="firstName"
                label={t("form.firstName")}
              />
            </FormControl>
            <FormControl>
              <Input
                control={control}
                name="lastName"
                label={t("form.lastName")}
              />
            </FormControl>
            <FormControl>
              <Input
                type="email"
                control={control}
                name="email"
                label={t("form.email")}
              />
            </FormControl>
            <FormControl>
              <Input
                type="password"
                control={control}
                name="password"
                label={t("form.password")}
              />
            </FormControl>
            <FormControl>
              <Checkbox control={control} name="terms" label={t("checkbox")} />
            </FormControl>

            <Typography className="mt-6">
              <Trans
                ns="partner-registration"
                i18nKey="partnerRegistrationCredentials.tc"
                components={{
                  href: (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                      href="https://weareuncapped.com/legal"
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
                }}
              />
            </Typography>
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button type="submit" disabled={!formState.isValid}>
                {t("createAccount")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default PartnerRegistrationCredentials
