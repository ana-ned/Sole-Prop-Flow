import { useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import Layout from "../../../components/UI/Layout"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import { useTracking } from "../../../hooks/useTracking"
import useConnections from "../../connections/hooks/useConnections"
import {
  accountingPlatforms,
  featuredAccountingPlatforms,
} from "../../connections/models/platforms"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths } from "../constants"
import useAccountingDocuments from "../hooks/useAccountingDocuments"

const AccountingConnectionsAll = () => {
  const { t } = useTranslation("onboarding")
  const { trackEvent } = useTracking()
  const { handleOpenAuthorizationProvider } = useConnections()
  const { accountingDocumentsRequests } = useAccountingDocuments()

  return (
    <OnboardingGuard step="ACCOUNTING">
      <OnboardingLayout menu={<LogoOnlyMenu />}>
        <Layout.Parent>
          <PageBar
            title={t("accountingConnections.titleAll")}
            backUrl={`${OnboardingMenuPaths.Accounting}?ask=false`}
            withChat
            desktopHeaderType="h4"
          />
          <Typography>{t("accountingConnections.descriptionAll")}</Typography>

          <ListItemContainer className="my-6">
            {accountingPlatforms
              .filter(
                (platform) =>
                  !featuredAccountingPlatforms.some(
                    (item) => item.systemId === platform.systemId
                  )
              )
              .map((platform) => (
                <ListItemLarge
                  icon={
                    "iconUrl" in platform &&
                    typeof platform.iconUrl === "string" &&
                    platform.iconUrl ? (
                      <img src={platform.iconUrl} alt={platform.name} />
                    ) : undefined
                  }
                  key={platform.name}
                  title={platform.name}
                  more={{
                    type: "button",
                    onClick: async () => {
                      trackEvent({
                        category: "onboarding",
                        name: "accounting",
                        action: "clicked",
                        customFields: {
                          name: platform.name,
                          category: platform.category,
                        },
                      })

                      await handleOpenAuthorizationProvider(platform)
                    },
                  }}
                />
              ))}
          </ListItemContainer>

          {accountingDocumentsRequests.length > 0 && (
            <>
              <Typography type="bodyTitle">
                {t("accountingConnections.documents.title")}
              </Typography>
              <Typography>
                {t("accountingConnections.documents.description")}
              </Typography>
              <ListItemContainer className="mt-4">
                <ListItemLarge
                  title={t("accountingConnections.documents.button")}
                  subtitle={t("accountingConnections.documents.buttonDesc")}
                  href="/onboarding/accounting/documents"
                  eventTracker={{
                    category: "onboarding",
                    name: "accounting",
                    action: "upload-documents-clicked",
                  }}
                  more={{ type: "button-link" }}
                />
              </ListItemContainer>
            </>
          )}
        </Layout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default AccountingConnectionsAll
