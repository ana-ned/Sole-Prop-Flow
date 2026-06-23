import { useTranslation } from "react-i18next"

import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import useDeal from "../../../hooks/useDeal"
import { useTracking } from "../../../hooks/useTracking"
import { initials } from "../../../utils/string"
import useConnections from "../../connections/hooks/useConnections"
import {
  featuredSalesPlatforms,
  salesPlatforms,
} from "../../connections/models/platforms"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths } from "../constants"

const SalesConnectionsIndex = () => {
  const { t } = useTranslation("onboarding")

  const { handleOpenAuthorizationProvider } = useConnections()
  const { trackEvent } = useTracking()
  const deal = useDeal()

  return (
    <OnboardingGuard step="SALES">
      <OnboardingLayout menu={<LogoOnlyMenu />}>
        <OnboardingLayout.Parent
          pageBar={
            <PageBar
              title={t("salesConnections.titleAmazon")}
              withChat
              desktopHeaderType="h4"
            />
          }
        >
          <Typography className="mb-6">
            {deal.isAmazonSeller
              ? t("salesConnections.descriptionAmazon")
              : t("salesConnections.description")}
          </Typography>

          <FormLayout>
            <ListItemContainer>
              {salesPlatforms()
                .filter(
                  (platform) =>
                    !featuredSalesPlatforms.some(
                      (item) => item.systemId === platform.systemId
                    )
                )
                .filter((platform) => platform.systemId !== "AMAZON_ADS")
                .map((platform) => (
                  <ListItemLarge
                    initialIcon={
                      "iconUrl" in platform && platform.iconUrl
                        ? undefined
                        : initials(platform.name)
                    }
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
                          name: "platform-box",
                          action: "clicked",
                          customFields: {
                            category: platform.category,
                            platform: platform.systemId,
                          },
                        })

                        await handleOpenAuthorizationProvider(platform)
                      },
                    }}
                  />
                ))}
            </ListItemContainer>

            <FormLayout.Footer>
              <ButtonGroup withMargin backUrl={OnboardingMenuPaths.Sales} />
            </FormLayout.Footer>
          </FormLayout>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default SalesConnectionsIndex
