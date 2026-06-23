import { useTranslation } from "react-i18next"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import Layout from "../../../../components/UI/Layout"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import useDevice from "../../../../hooks/useDevice"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"
import { useTracking } from "../../../../hooks/useTracking"

const AccountingHelpChild = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "accountingConnections.help",
  })
  const { isMobile } = useDevice()
  const { openChat } = useHubSpotChat()
  const { trackEvent } = useTracking()

  if (isMobile) {
    return null
  }

  return (
    <Layout.Child desktopTitle={t("title")} autoHeight>
      <ListItemContainer>
        <ListItemLarge
          more={{ type: "button-link" }}
          title={t("inviteAccountant")}
          href="/invite-members"
          eventTracker={{
            category: "onboarding",
            name: "accounting",
            action: "help-link-clicked",
            customFields: {
              name: "inviteAccountant",
            },
          }}
        />
        <ListItemLarge
          more={{ type: "button-link" }}
          href="/invite-members"
          title={t("inviteUser")}
          eventTracker={{
            category: "onboarding",
            name: "accounting",
            action: "help-link-clicked",
            customFields: {
              name: "inviteUser",
            },
          }}
        />
        <ListItemLarge
          more={{
            type: "button",
            onClick: () => {
              trackEvent({
                category: "onboarding",
                name: "accounting",
                action: "help-link-clicked",
                customFields: {
                  name: "openChat",
                },
              })
              openChat()
            },
          }}
          title={t("openChat")}
        />
      </ListItemContainer>
    </Layout.Child>
  )
}

export default AccountingHelpChild
