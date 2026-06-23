import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import YupPassword from "yup-password"
import Button from "../../../../components/Basic/Button"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"
import useLogin from "../../../../hooks/useLogin"
import usePartnerToken from "../../../../hooks/usePartnerToken"
import useRecaptcha from "../../../../hooks/useRecaptcha"
import useTrackedQueryParams from "../../../../hooks/useTrackedQueryParams"
import useTrackExperiment from "../../../../hooks/useTrackExperiment"
import { useTracking } from "../../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import { CaptchaApi } from "../../../../services/api/organisation-users"
import { getClientId } from "../../../../utils/ga"

YupPassword(yup)

const schema = yup.object().shape({
  firstName: yup.string().required("Name is a required field").min(2),
  lastName: yup.string().required("Name is a required field").min(2),
  email: yup.string().email().required(),
  password: yup
    .string()
    .password()
    .min(8)
    .minLowercase(1)
    .minUppercase(1)
    .minNumbers(1)
    .required(),
})

type ClientInformationForm = yup.InferType<typeof schema>

const RegistrationForm = ({ prospectId }: { prospectId?: string }) => {
  const { t } = useTranslation("registration", {
    keyPrefix: "RegistrationForm",
  })
  const { control, handleSubmit } = useForm<ClientInformationForm>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })
  const { login } = useLogin()
  const { trackEvent } = useTracking()
  const { trackExperimentConverted } = useTrackExperiment()
  const { openChat } = useHubSpotChat()
  const { trackedQueryParams } = useTrackedQueryParams()
  const recaptcha = useRecaptcha()
  const partnerToken = usePartnerToken()

  const registerUser = useMutation({
    mutationFn: async (formData: ClientInformationForm) =>
      new CaptchaApi(
        apiConfig({ service: ApiServicesEnum.OrganisationUsers })
      ).registerUser({
        xXORGID: "",
        xXCAPTCHA: (await recaptcha.getToken()) || "",
        registrationRequest: {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          marketingData: {
            cid: getClientId(),
            source: trackedQueryParams?.source,
            referralId: trackedQueryParams?.referral,
            externalId: trackedQueryParams?.external,
            applicantUserId: partnerToken.parsedToken?.applicantUserId,
          },
          prospectId,
        },
      }),
    onSuccess: (requestData, formData) => {
      trackEvent({
        category: "registration",
        name: "client-info-clientForm",
        action: "registration-create-account",
      })

      trackEvent({
        category: "registration",
        name: "form",
        action: "submit",
      })

      if (prospectId) {
        trackExperimentConverted("ROME-1458-Login-Shuffle-Experiment", "v2")
      }

      login(formData.email, formData.password, "/")
    },
    onError: (error: { status: number }) => {
      trackEvent({
        category: "registration",
        name: "form",
        action: "fail",
      })

      if (error.status === 409) {
        openChat()
      }
    },
  })

  return (
    <form
      onSubmit={handleSubmit((formData) => {
        registerUser.mutate(formData)
      })}
    >
      <FormLayout.Content>
        <div className="flex gap-3">
          <FormControl className="w-full">
            <Input control={control} name="firstName" label={t("firstName")} />
          </FormControl>
          <FormControl className="w-full">
            <Input control={control} name="lastName" label={t("lastName")} />
          </FormControl>
        </div>
        <FormControl>
          <Input
            type="email"
            control={control}
            name="email"
            label={t("email")}
          />
        </FormControl>
        <FormControl>
          <Input
            type="password"
            control={control}
            name="password"
            label={t("password")}
          />
        </FormControl>
        {registerUser.isError && (
          <ApiErrorAlert error={registerUser.error as Response} />
        )}
        <Button
          type="submit"
          className="mt-2"
          fullWidth
          loading={registerUser.isPending}
        >
          {t("signUp")}
        </Button>
      </FormLayout.Content>
    </form>
  )
}

export default RegistrationForm
