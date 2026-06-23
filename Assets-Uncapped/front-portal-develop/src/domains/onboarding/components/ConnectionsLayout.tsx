import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import { useAsync } from "react-use"
import Typography from "../../../components/Basic/Typography"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import useDevice from "../../../hooks/useDevice"
import useConnections from "../../connections/hooks/useConnections"
import { ONBOARDING_BASE_PATH } from "../constants"
import ConnectionsChild from "./connections-child"
import OnboardingLayout from "./OnboardingLayout"

const ConnectionsLayout = ({
  pageBar,
  children,
  footer,
}: {
  pageBar: ReactNode
  children: ReactNode
  footer: ReactNode
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("onboarding")
  const { connections, refetchConnections } = useConnections()
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()

  useAsync(async () => {
    await refetchConnections()
  }, [refetchConnections])

  return (
    <OnboardingLayout
      sidebar={
        !isMobile && connections.length > 0 ? <ConnectionsChild /> : undefined
      }
    >
      <OnboardingLayout.Parent pageBar={pageBar}>
        <main>{children}</main>
        <footer className="mt-6">
          {isMobile && connections.length > 0 && (
            <ListItemLarge
              className="!mb-4 !min-h-14 border-0! pt-4 pb-4"
              title={t("connections.connectionsCount", {
                count: connections.length,
              })}
              more={{
                type: "element",
                element: (
                  <Typography type="bodyTitle" color="secondary">
                    {t("actions.viewAll")}
                  </Typography>
                ),
                onClick: async () => {
                  await navigate(`${ONBOARDING_BASE_PATH}/connections`, {
                    state: { backUrl: pathname },
                  })
                },
              }}
            />
          )}
          {footer}
        </footer>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default ConnectionsLayout
