import { IconSvgElement } from "@hugeicons/react"
import { Call02SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import {
  DashboardCircleIcon,
  Logout05Icon,
  MessageMultiple01Icon,
  UserMultiple02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import useInvitations from "../../../domains/invitations/hooks/useInvitations"
import {
  ONBOARDING_BASE_PATH,
  OnboardingPaths,
} from "../../../domains/onboarding/constants"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import useDevice from "../../../hooks/useDevice"
import { useHubspotCalendarLink } from "../../../hooks/useHubspotCalendarLink"
import { useTracking } from "../../../hooks/useTracking"
import useUsers from "../../../hooks/useUsers"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../services/api/hubspot"
import { UserInvitationResponseStatusEnum } from "../../../services/api/organisation-users"
import { UserInvitationResponseStatusEnum as PartnerUserInvitationResponseStatusEnum } from "../../../services/api/partners"
import { BoxIconSeverity } from "../../Basic/BoxIcon/BoxIcon"

export interface ActionButtonConfig {
  key: string
  label: string
  icon: IconSvgElement
  iconSeverity: keyof typeof BoxIconSeverity
  onClick?: () => void
  href?: string
  state?: object
}

interface UseActionButtonsOptions {
  withChat?: boolean
  customChatUrl?: string
}

export const useActionButtons = ({
  withChat,
  customChatUrl,
}: UseActionButtonsOptions = {}): ActionButtonConfig[] => {
  const auth = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { trackEvent } = useTracking()
  const { t } = useTranslation("common", { keyPrefix: "actionButtons" })
  const { t: tOnboarding } = useTranslation("onboarding", {
    keyPrefix: "bookCall.button",
  })
  const { t: tInvitations } = useTranslation("invitations", {
    keyPrefix: "button",
  })
  const deal = useDeal()
  const { isMobile } = useDevice()
  const calendarLink = useHubspotCalendarLink({ dedicated: false })

  const usersQuery = useUsers({
    enabled:
      auth.isAuthenticated &&
      (!!auth.partnerId ||
        (!!auth.organisation?.organisationId &&
          pathname.includes("/onboarding"))),
  })
  const { invitationsQuery } = useInvitations()

  const bookCallPath = `${ONBOARDING_BASE_PATH}${OnboardingPaths.BookCall}`

  // Conditions
  const showChat =
    withChat &&
    deal.data?.tier === CustomerFacingDealDetailsResponseTierEnum.Big

  const showBookCall =
    !pathname.includes(bookCallPath) &&
    pathname.includes(ONBOARDING_BASE_PATH) &&
    auth.organisationData?.preferences &&
    !auth.organisationData.preferences.exploreCallBooked &&
    calendarLink.link &&
    !(
      auth.organisation?.activated ||
      deal.data?.tier === CustomerFacingDealDetailsResponseTierEnum.Small ||
      pathname.includes(ONBOARDING_BASE_PATH + OnboardingPaths.Review) ||
      pathname.includes(ONBOARDING_BASE_PATH + OnboardingPaths.Offers)
    )

  const showInviteMembers =
    !auth.partnerId &&
    !auth.organisation?.activated &&
    !pathname.includes(ONBOARDING_BASE_PATH + OnboardingPaths.Rejected) &&
    pathname.includes(ONBOARDING_BASE_PATH) &&
    !usersQuery.isLoading &&
    !invitationsQuery.isLoading

  const showBackToDashboard =
    auth.organisationData?.activated &&
    !auth.organisationData.onboardingFinished &&
    pathname.includes(ONBOARDING_BASE_PATH)

  // Invite members data
  const invitations = (invitationsQuery.data || []).filter(
    (el) =>
      el.status === PartnerUserInvitationResponseStatusEnum.New ||
      el.status === PartnerUserInvitationResponseStatusEnum.Sent ||
      el.status === UserInvitationResponseStatusEnum.InvitationSent ||
      el.status === UserInvitationResponseStatusEnum.InvitationCreated
  )
  const users = (usersQuery.data || []).filter((el) => !el.disabled)
  const teamTotal = invitations.length + users.length

  const items: ActionButtonConfig[] = []

  if (showChat) {
    items.push({
      key: "chat",
      label: t("chat"),
      icon: MessageMultiple01Icon,
      iconSeverity: "accent-brand",
      onClick: async () => {
        await navigate(customChatUrl || `/chat?back=${pathname}`)
        trackEvent({
          category: "todos",
          name: "todo-item",
          action: "contactSupport",
        })
      },
    })
  }

  if (showBookCall) {
    items.push({
      key: "book-call",
      label: tOnboarding("cta"),
      icon: Call02SolidRounded,
      iconSeverity: "accent-brand",
      onClick: async () => {
        trackEvent({
          category: "onboarding",
          name: "book-a-call-inventory",
          action: "click",
        })
        await navigate(bookCallPath)
      },
    })
  }

  if (showInviteMembers) {
    const inviteLabel =
      teamTotal <= 1 ? tInvitations("inviteTeam") : tInvitations("yourTeam")
    items.push({
      key: "invite-members",
      label: inviteLabel,
      icon: UserMultiple02SolidStandard,
      iconSeverity: "accent-6",
      href: teamTotal <= 1 ? "/invite-members" : "/invite-members/list",
      state: teamTotal > 1 ? { from: pathname } : undefined,
    })
  }

  if (showBackToDashboard) {
    items.push({
      key: "back-to-dashboard",
      label: t("backToDashboard"),
      icon: DashboardCircleIcon,
      iconSeverity: "accent-brand",
      onClick: async () => {
        await navigate(`/`)
      },
    })
  }

  if (auth.isAuthenticated && isMobile) {
    items.push({
      key: "logout",
      label: t("logout"),
      icon: Logout05Icon,
      iconSeverity: "accent-2",
      onClick: async () => {
        await auth.logout()
      },
    })
  }

  return items
}
