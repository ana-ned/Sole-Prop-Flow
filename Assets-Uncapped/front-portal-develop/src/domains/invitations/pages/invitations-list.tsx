import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import PageLoader from "../../../components/Collections/PageLoader"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../components/UI/Layout"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useUsers from "../../../hooks/useUsers"
import { UserInvitationResponseStatusEnum } from "../../../services/api/organisation-users"
import { UserInvitationResponseStatusEnum as PartnerUserInvitationResponseStatusEnum } from "../../../services/api/partners"
import { ReactComponent as AddIcon } from "../../../svgs/add-circle-outline.svg"
import ActionPromptModal from "../components/ActionPromptModal/action-prompt-modal"
import useInvitations, { CommonInvitationDTO } from "../hooks/useInvitations"

const InvitationsList = () => {
  const auth = useAuth()
  const usersQuery = useUsers({
    enabled: auth.partnerId
      ? auth.isAuthenticated && !!auth.partnerId
      : auth.isAuthenticated && !!auth.organisation?.organisationId,
  })
  const { invitationsQuery } = useInvitations()
  const navigate = useNavigate()
  const { t } = useTranslation("invitations", {
    keyPrefix: "invitations-list",
  })
  const [currentInvitation, setCurrentInvitation] =
    useState<CommonInvitationDTO>()
  const { state } = useLocation()

  if (
    invitationsQuery.isLoading ||
    usersQuery.isLoading ||
    !invitationsQuery.data ||
    !usersQuery.data
  ) {
    return <PageLoader overlay />
  }

  const invitations = invitationsQuery.data.filter(
    (el) =>
      el.status === UserInvitationResponseStatusEnum.InvitationSent ||
      el.status === UserInvitationResponseStatusEnum.InvitationCreated ||
      el.status === PartnerUserInvitationResponseStatusEnum.Sent ||
      el.status === PartnerUserInvitationResponseStatusEnum.New
  )

  const users = usersQuery.data.filter((el) => !el.disabled)

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <>
          <FormLayout>
            <FormLayout.Content>
              <PageBar
                onClickBack={async () => {
                  await navigate(state?.from || "/")
                }}
                title={t("title")}
              />
              {invitations.length > 0 && (
                <>
                  <Typography
                    className="mb-2"
                    type="bodyTitle"
                    color="neutral-600"
                  >
                    {t("pendingInvite")}
                  </Typography>
                  <ListItemContainer>
                    {invitations.map((el) => (
                      <ListItemLarge
                        key={el.id}
                        title={`${el.firstName} ${el.lastName}`}
                        subtitle={el.email}
                        initialIcon={el.firstName}
                        more={{
                          type: "button",
                          onClick: () => {
                            setCurrentInvitation(el)
                          },
                        }}
                      />
                    ))}
                  </ListItemContainer>
                </>
              )}
              {users.length > 0 && (
                <>
                  <Typography
                    className="mt-8 mb-2"
                    type="bodyTitle"
                    color="neutral-600"
                  >
                    {t("yourTeam")}
                  </Typography>
                  <ListItemContainer>
                    {users.map((el) => (
                      <ListItemLarge
                        key={el.id}
                        title={`${el.firstName} ${el.lastName}`}
                        subtitle={el.email}
                        initialIcon={el.firstName}
                      />
                    ))}
                  </ListItemContainer>
                </>
              )}
            </FormLayout.Content>
            <FormLayout.Footer>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  href="/invite-members"
                  state={{ from: state?.from }}
                >
                  <>
                    <AddIcon className="mr-3" />
                    {t("add")}
                  </>
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </FormLayout>
          {currentInvitation && (
            <ActionPromptModal
              invitation={currentInvitation}
              onClose={() => {
                setCurrentInvitation(undefined)
              }}
            />
          )}
        </>
      </Layout.Parent>
    </Layout>
  )
}

export default InvitationsList
