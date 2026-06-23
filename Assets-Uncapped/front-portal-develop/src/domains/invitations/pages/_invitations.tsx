import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { useParams } from "react-router"
import * as yup from "yup"
import YupPassword from "yup-password"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import PartnerInvitationSidebar from "../../../components/Collections/RegistrationSidebars/variants/PartnerInvitationSidebar"
import QuoteSidebar from "../../../components/Collections/RegistrationSidebars/variants/QuoteSidebar"
import Checkbox from "../../../components/Forms/Checkbox"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import Alert from "../../../components/UI/Alert"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import TrustpilotWidget from "../../../components/UI/TrustpilotWidget"
import Logo from "../../../components/UI/Logo"
import { useTracking } from "../../../hooks/useTracking"
import ErrorIndex from "../../../pages/error/_error"
import {
  RegistrationInvitationInfoResponseSourceEnum,
  RegistrationInvitationInfoResponseStatusEnum,
} from "../../../services/api/organisation-users"
import RegistrationLayout from "../../registration/components/RegistrationLayout"
import InvitationFailedCard from "../components/InvitationFailedCard"
import useInvitations from "../hooks/useInvitations"
import ButtonGroup from "../../../components/Basic/ButtonGroup"

YupPassword(yup)

const ERROR_STATUSES = new Set([
  RegistrationInvitationInfoResponseStatusEnum.InvitationFailed,
  RegistrationInvitationInfoResponseStatusEnum.InvitationExpired,
  RegistrationInvitationInfoResponseStatusEnum.InvitationRegisteredUser,
])

const Invitation = () => {
  const { t } = useTranslation("invitations", { keyPrefix: "invitation" })
  const { trackEvent } = useTracking()
  const { code } = useParams()
  const { invitationAcceptMutation, invitationData } = useInvitations(code)

  const hasPhoneNumber =
    invitationData.data &&
    "phoneNumber" in invitationData.data &&
    !!invitationData.data.phoneNumber

  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        password: yup
          .string()
          .password()
          .min(8)
          .minLowercase(1)
          .minUppercase(1)
          .minNumbers(1)
          .required(),
        repeatPassword: yup
          .string()
          .oneOf([yup.ref("password")], t("errors.passwordsDontMatch")),
        smsConsentGranted: yup.boolean(),
      })
    ),
    defaultValues: {},
    mode: "onBlur",
  })

  // FIXME: This should also handle 404 from API, but API doesn't support error handling at the moment.
  if (!code) {
    return <ErrorIndex type="404" />
  }

  if (invitationData.isLoading) {
    return <PageLoader overlay />
  }

  const sidebar =
    invitationData.data &&
    "source" in invitationData.data &&
    invitationData.data.source &&
    [
      RegistrationInvitationInfoResponseSourceEnum.Marcus,
      RegistrationInvitationInfoResponseSourceEnum.Sellersfi,
    ].includes(invitationData.data.source as any) ? (
      <PartnerInvitationSidebar source={invitationData.data.source} />
    ) : (
      <QuoteSidebar />
    )

  if (
    (invitationData.data?.status &&
      // @ts-expect-error api schema missmatch
      ERROR_STATUSES.has(invitationData.data.status)) ||
    invitationData.data?.status === undefined
  ) {
    return (
      <RegistrationLayout sidebar={sidebar}>
        <InvitationFailedCard status={invitationData.data?.status} />
      </RegistrationLayout>
    )
  }

  return (
    <RegistrationLayout sidebar={sidebar}>
      <FormLayout>
        <div className="space-y-6">
          <div>
            <Typography color="neutral-700">{t("welcome")}</Typography>
            <Logo className="max-w-42.5" />
          </div>
          <TrustpilotWidget className="ml-[-13px]" />
          <Typography color="neutral-700">
            <SanitizedHtml
              as="span"
              content={t("description", {
                organisationName:
                  // @ts-expect-error GREAT API 11111
                  invitationData.data.invitingPartnerName ??
                  // @ts-expect-error GREAT API 1111
                  invitationData.data.invitingOrganisationName ??
                  "Unknown",
              })}
            />
          </Typography>
          <Alert type="success" showIcon={false}>
            <Typography color="neutral-700">{t("descriptionEmail")}</Typography>
            <Typography color="neutral-700" type="bodyTitle">
              {invitationData.data.invitedUserEmail}
            </Typography>
          </Alert>

          <form
            onSubmit={handleSubmit((formData) => {
              trackEvent({
                category: "registration",
                name: "invitation",
                action: "registration-by-invitation",
              })
              invitationAcceptMutation.mutate({
                code,
                userInvitationRegistrationRequest: {
                  password: formData.password,
                  ...(hasPhoneNumber && {
                    smsConsentGranted: formData.smsConsentGranted,
                  }),
                },
              })
            })}
          >
            <FormLayout.Content>
              <FormControl>
                <Input
                  type="password"
                  control={control}
                  name="password"
                  label={t("passwordInput")}
                />
              </FormControl>
              <FormControl>
                <Input
                  type="password"
                  control={control}
                  name="repeatPassword"
                  label={t("repeatPasswordInput")}
                />
              </FormControl>
              {hasPhoneNumber && (
                <Checkbox
                  name="smsConsentGranted"
                  label={
                    <Trans
                      i18nKey="invitation.consent.sms"
                      ns="invitations"
                      components={{
                        href: (
                          // eslint-disable-next-line jsx-a11y/anchor-has-content
                          <a
                            href="https://www.weareuncapped.com/privacy-policy"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              textDecoration: "none",
                              fontWeight: "bold",
                              color: "var(--color-brand-600)",
                            }}
                          />
                        ),
                      }}
                    />
                  }
                  control={control}
                />
              )}
              <ButtonGroup withMargin>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={invitationAcceptMutation.isPending}
                >
                  {t("cta")}
                </Button>
              </ButtonGroup>
            </FormLayout.Content>
          </form>
        </div>
      </FormLayout>
    </RegistrationLayout>
  )
}

export default Invitation
