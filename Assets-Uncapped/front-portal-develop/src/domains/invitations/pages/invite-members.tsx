import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation, Trans } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import FormControl from "../../../components/Forms/FormControl"
import Input from "../../../components/Forms/Input"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import Alert from "../../../components/UI/Alert"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import InviteMembersSuccessModal from "../components/InviteMembersForm/InviteMembersFormSuccessModal"
import useInvitations from "../hooks/useInvitations"

const InviteMembers = () => {
  const { inviteMutation } = useInvitations()
  const { t } = useTranslation("invitations", {
    keyPrefix: "invite-members",
  })
  const navigate = useNavigate()
  const { state } = useLocation()
  const { control, handleSubmit, formState } = useForm<{
    firstName: string
    lastName: string
    email: string
  }>({
    resolver: yupResolver(
      yup.object().shape({
        firstName: yup.string().required().min(2),
        lastName: yup.string().required().min(2),
        email: yup.string().email().required(),
      })
    ),
    mode: "onBlur",
  })

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <>
          <FormLayout>
            <PageBar
              onClickBack={async () => {
                await navigate(state?.from || -1)
              }}
              title={t("title")}
            />

            <Typography className="mt-6 mb-4">{t("header")}</Typography>
            <Alert className="mb-4">{t("info")}</Alert>
            <form
              onSubmit={handleSubmit((formData) => {
                inviteMutation.mutate({
                  formData,
                })
              })}
            >
              <FormLayout.Content>
                <FormControl>
                  <Input
                    control={control}
                    name="firstName"
                    label={t("firstName")}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    control={control}
                    name="lastName"
                    label={t("lastName")}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="email"
                    control={control}
                    name="email"
                    label={t("email")}
                  />
                </FormControl>
                <Typography type="smallCopy" className="text-center">
                  <Trans
                    i18nKey="invite-members.t&c"
                    ns="invitations"
                    components={{
                      bold: <strong />,
                      href: (
                        // eslint-disable-next-line jsx-a11y/anchor-has-content
                        <a
                          href="https://weareuncapped.com/legal"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "none",
                            color: "var(--color-brand-600)",
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              </FormLayout.Content>
              <FormLayout.Footer>
                <ApiErrorAlert
                  error={inviteMutation.error as unknown as Response}
                />
                <ButtonGroup>
                  <Button
                    type="submit"
                    loading={inviteMutation.isPending}
                    disabled={!formState.isValid}
                  >
                    {t("sendInvite")}
                  </Button>
                </ButtonGroup>
              </FormLayout.Footer>
            </form>
          </FormLayout>
          {inviteMutation.isSuccess && <InviteMembersSuccessModal />}
        </>
      </Layout.Parent>
    </Layout>
  )
}

export default InviteMembers
