import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import ConnectionsList from "../components/ConnectionsList"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths } from "../constants"

const ConnectionsIndex = () => {
  const { t } = useTranslation("onboarding")
  const locationState = useLocation().state as { backUrl?: string } | undefined

  const getBackUrl = () => {
    return locationState?.backUrl || OnboardingMenuPaths.Sales
  }

  return (
    <OnboardingLayout>
      <Layout.Parent>
        <PageBar
          title={t("connections.title")}
          backUrl={getBackUrl()}
          withChat
        />
        <ConnectionsList />
      </Layout.Parent>
    </OnboardingLayout>
  )
}

export default ConnectionsIndex
