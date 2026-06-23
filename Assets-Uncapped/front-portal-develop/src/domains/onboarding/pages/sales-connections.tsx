import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import PageLoader from "../../../components/Collections/PageLoader"
import Card from "../../../components/UI/Card"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import useStore from "../../../hooks/useStore"
import { useTracking } from "../../../hooks/useTracking"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import useConnections from "../../connections/hooks/useConnections"
import platforms, {
  featuredSalesPlatforms,
} from "../../connections/models/platforms"
import { getPotentiallySuccessfulConnections } from "../../connections/utils/connections"
import { ReactComponent as OtherIcon } from "../assets/sales-other.svg"
import ConnectionArrow from "../components/ConnectionArrow"
import { ConnectionsListedByType } from "../components/ConnectionsList"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import Revenue from "../components/revenue"
import SkipStepButton from "../components/SkipStepButton"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const SalesConnections = () => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "salesConnections",
  })
  const navigate = useNavigate()
  const { salesConnections, handleOpenAuthorizationProvider } = useConnections()
  const { handleCompleteStep, skipStep } = useApplicationSteps()
  const navigation = useOnboardingNavigation()
  const { trackEvent } = useTracking()
  const deal = useDeal()
  let computedPlatforms = featuredSalesPlatforms
  const customNextOnboardingPath = useStore(
    (state) => state.customNextOnboardingPath
  )

  useEffect(() => {
    trackEvent({
      category: "onboarding",
      name: "sales_v2",
      action: "viewed",
    })
  }, [])

  if (
    auth.organisationData?.organisationSource ===
    OrganisationOverviewOrganisationSourceEnum.Walmart
  ) {
    computedPlatforms = [
      platforms.WalmartV2,
      ...computedPlatforms.filter(
        (platform) => platform.systemId !== platforms.WalmartV2.systemId
      ),
    ]
  }

  if (auth.isLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingGuard step="SALES">
      <OnboardingLayout>
        <OnboardingLayout.Parent
          pageBar={
            <PageBar
              title={
                deal.isAmazonSeller && !customNextOnboardingPath
                  ? t("titleAmazon")
                  : t("title")
              }
              withChat
              desktopHeaderType="h4"
            />
          }
        >
          <Typography className="mb-6">
            {deal.isAmazonSeller && !customNextOnboardingPath
              ? t("descriptionAmazon")
              : t("description")}
          </Typography>

          <Card variant="tertiary">
            <Revenue
              isAmazonPartnership={deal.isAmazonPartnership}
              organisationData={auth.organisationData}
            />

            <ConnectionArrow>
              {deal.isAmazonSeller ? t("arrowAmazon") : t("arrow")}
            </ConnectionArrow>

            <ListItemContainer className="mt-1">
              {computedPlatforms.map((platform) => (
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
                  subtitle={
                    "subtitle" in platform &&
                    typeof platform.subtitle === "string" &&
                    salesConnections.some(
                      (item) => item.systemId === platform.systemId
                    )
                      ? platform.subtitle
                      : undefined
                  }
                  more={{
                    type: "button",
                    onClick: async () => {
                      trackEvent({
                        category: "onboarding",
                        name: "platform-box",
                        action: "clicked",
                        customFields: {
                          category: platform.category,
                          platform: platform.systemId,
                        },
                      })

                      if (platform.systemId === "AMAZON_V2") {
                        await navigate(OnboardingMenuPaths.SalesAmazon)
                        return
                      }

                      await handleOpenAuthorizationProvider(platform)
                    },
                  }}
                />
              ))}
              <ListItemLarge
                icon={<OtherIcon />}
                iconClassName="!p-1"
                title={t("other")}
                href="/onboarding/sales/all"
                eventTracker={{
                  category: "onboarding",
                  name: "platform-box",
                  action: "clicked-other",
                }}
                more={{ type: "button-link" }}
              />
            </ListItemContainer>

            {salesConnections.length > 0 && (
              <ListItemContainer
                className="border-brand-400 mt-4 border !p-0"
                size="sm"
              >
                <ConnectionsListedByType connections={salesConnections} />
              </ListItemContainer>
            )}
          </Card>

          <ButtonGroup
            withMargin
            onClickBack={
              deal.isAmazonSeller
                ? async () => {
                    if (customNextOnboardingPath) {
                      navigation.prev()
                    } else {
                      await navigate(OnboardingMenuPaths.SalesAmazon)
                    }
                  }
                : undefined
            }
          >
            {!deal.isAmazonSeller && (
              <SkipStepButton
                onClick={async () => {
                  await skipStep("SALES")
                  navigation.next()
                }}
              />
            )}
            <Button
              type="button"
              variant="primary"
              onClick={async () => {
                await handleCompleteStep("SALES")
                navigation.next()
              }}
              disabled={
                getPotentiallySuccessfulConnections(salesConnections).length ===
                0
              }
            >
              {t("submit")}
            </Button>
          </ButtonGroup>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default SalesConnections
