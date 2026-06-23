import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import AmazonRegionCards from "../../connections/components/AmazonRegionCards"
import useConnections from "../../connections/hooks/useConnections"
import { getPotentiallySuccessfulConnections } from "../../connections/utils/connections"
import ConnectionsLayout from "../components/ConnectionsLayout"
import OnboardingGuard from "../components/OnboardingGuard"
import { OnboardingMenuPaths } from "../constants"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const SalesConnectionsAmazon = () => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", { keyPrefix: "salesConnections" })
  const navigate = useNavigate()
  const { salesConnections } = useConnections()
  const navigation = useOnboardingNavigation()
  const location = useLocation()
  const state = location.state as { nextPath?: string } | undefined

  if (auth.isLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingGuard step="SALES">
      <ConnectionsLayout
        pageBar={
          <PageBar
            title={t("connectYourStoreRegion")}
            withChat
            desktopHeaderType="h4"
            onClickBack={
              state?.nextPath
                ? () => {
                    navigation.prev()
                  }
                : undefined
            }
          />
        }
        footer={
          getPotentiallySuccessfulConnections(salesConnections).length > 0 ? (
            <ButtonGroup withMargin>
              <Button
                type="button"
                variant="primary"
                onClick={async () => {
                  await (state?.nextPath
                    ? navigate(state.nextPath)
                    : navigate(OnboardingMenuPaths.Sales))
                }}
              >
                {t("addedAllAmazon")}
              </Button>
            </ButtonGroup>
          ) : undefined
        }
      >
        <Typography className="mb-2">
          <SanitizedHtml as="span" content={t("descriptionAmazon")} />
        </Typography>

        <AmazonRegionCards />
      </ConnectionsLayout>
    </OnboardingGuard>
  )
}

export default SalesConnectionsAmazon
