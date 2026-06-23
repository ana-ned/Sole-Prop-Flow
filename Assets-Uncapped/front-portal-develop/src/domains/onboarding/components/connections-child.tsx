import { useTranslation } from "react-i18next"
import useDevice from "../../../hooks/useDevice"
import useConnections from "../../connections/hooks/useConnections"
import ConnectionsList from "./ConnectionsList"
import OnboardingLayout from "./OnboardingLayout"

const ConnectionsChild = () => {
  const { connections } = useConnections()
  const { t } = useTranslation("onboarding")
  const { isMobile } = useDevice()

  if (connections.length === 0 || isMobile) {
    return null
  }

  return (
    <OnboardingLayout.Child desktopTitle={t("connections.title")} autoHeight>
      <ConnectionsList />
    </OnboardingLayout.Child>
  )
}

export default ConnectionsChild
