import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import useInvitations from "../../../domains/invitations/hooks/useInvitations"
import useAuth from "../../../hooks/useAuth"
import useUsers from "../../../hooks/useUsers"
import { UserInvitationResponseStatusEnum } from "../../../services/api/organisation-users"
import { UserInvitationResponseStatusEnum as PartnerUserInvitationResponseStatusEnum } from "../../../services/api/partners"
import { ReactComponent as PersonIcon } from "../../../svgs/person.svg"
import Button from "../../Basic/Button"

const InviteMembersButton = () => {
  const { t } = useTranslation("invitations", { keyPrefix: "button" })
  const auth = useAuth()
  const { pathname } = useLocation()
  const usersQuery = useUsers({
    enabled:
      auth.isAuthenticated &&
      (!!auth.partnerId ||
        (!!auth.organisation?.organisationId &&
          pathname.includes("/onboarding"))),
  })

  const { invitationsQuery } = useInvitations()

  if (
    (!auth.partnerId && !pathname.includes("/onboarding")) ||
    usersQuery.isLoading ||
    invitationsQuery.isLoading
  ) {
    return null
  }
  const invitations = (invitationsQuery.data || []).filter(
    (el) =>
      el.status === PartnerUserInvitationResponseStatusEnum.New ||
      el.status === PartnerUserInvitationResponseStatusEnum.Sent ||
      el.status === UserInvitationResponseStatusEnum.InvitationSent ||
      el.status === UserInvitationResponseStatusEnum.InvitationCreated
  )
  const users = (usersQuery.data || []).filter((el) => !el.disabled)

  const total = invitations.length + users.length

  return total <= 1 ? (
    <Button variant="secondary" href="/invite-members">
      <PersonIcon />
      {t("inviteTeam")}
    </Button>
  ) : (
    <Button
      variant="secondary"
      href="/invite-members/list"
      state={{
        from: pathname,
      }}
    >
      <span className="bg-brand-600 mr-2 flex size-6 items-center justify-center rounded-full text-white">
        {total}
      </span>
      {t("yourTeam")}
    </Button>
  )
}

export default InviteMembersButton
