import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router"
import useDevice from "../../../../hooks/useDevice"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"
import { useTracking } from "../../../../hooks/useTracking"
import countries from "../../../../models/countries"
import { RegisterOrganisationResponseNotEligibleReasonEnum } from "../../../../services/api/organisation-users"
import { format } from "../../../../utils/money"
import { joinWithConjunction } from "../../../../utils/string"
import Button from "../../../Basic/Button"
import FeatureContent from "../../../Collections/FeatureContent"
import Layout from "../../../UI/Layout"
import LogoOnlyMenu from "../../../UI/LogoOnlyMenu"
import EligibilityImg from "./assets/eligibility.svg"

const NotEligible = ({
  reason,
  requiredRevenue,
  requiredCurrency,
  onReapply,
  isReapplyPending,
}: {
  reason: RegisterOrganisationResponseNotEligibleReasonEnum
  requiredRevenue?: number
  requiredCurrency?: string
  onReapply: () => void
  isReapplyPending: boolean
}) => {
  const { t } = useTranslation("registration", {
    keyPrefix: "eligibility.infoScreens",
  })
  const { isMobile } = useDevice()
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const { openChat } = useHubSpotChat()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!isMobile) {
      openChat()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout menu={<LogoOnlyMenu withLogout />}>
      <Layout.FullWidth>
        <div className="mx-auto my-0 h-full max-w-85">
          <FeatureContent
            size="large"
            img={EligibilityImg}
            title={t(`${reason}.title`)}
            fluidIcon
            content={t(`${reason}.content`, {
              returnObjects: true,
            }).map((paragraph) => {
              return (
                <p key={paragraph}>
                  {paragraph
                    .replace(
                      "{{minimumRequiredRevenue}}",
                      requiredRevenue && requiredCurrency
                        ? format(requiredRevenue, requiredCurrency, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        : ""
                    )
                    .replace(
                      "{{unsupportedProvinces}}",
                      joinWithConjunction(
                        countries
                          .find((country) => country["alpha-3"] === "CAN")
                          ?.regions?.filter((region) => !region.eligible)
                          .map((region) => region.name) || []
                      )
                    )
                    .replace(
                      "{{unsupportedStates}}",
                      joinWithConjunction(
                        countries
                          .find((country) => country["alpha-3"] === "USA")
                          ?.regions?.filter((region) => !region.eligible)
                          .map((region) => region.name) || []
                      )
                    )}
                </p>
              )
            })}
            footerContent={
              <>
                {isMobile && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      trackEvent({
                        category: "registration",
                        name: "chat-button",
                        action: "click",
                        customFields: {
                          place: "not-eligible-screen",
                          reason,
                        },
                      })
                      await navigate(`/chat?back=${pathname}`)
                    }}
                  >
                    {t("buttons.chatToUs")}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="primary"
                  loading={isReapplyPending}
                  onClick={() => {
                    trackEvent({
                      category: "registration",
                      name: "re-apply-for-funding",
                      action: "click",
                      customFields: {
                        reason,
                      },
                    })
                    onReapply()
                  }}
                >
                  {t("buttons.reapply")}
                </Button>
              </>
            }
          />
        </div>
      </Layout.FullWidth>
    </Layout>
  )
}

export default NotEligible
