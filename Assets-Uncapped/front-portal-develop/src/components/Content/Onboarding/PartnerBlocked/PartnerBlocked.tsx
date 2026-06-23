import { useTranslation } from "react-i18next"
import OnboardingLayout from "../../../../domains/onboarding/components/OnboardingLayout"
import Button from "../../../Basic/Button"
import ButtonGroup from "../../../Basic/ButtonGroup"
import SanitizedHtml from "../../../Basic/SanitizedHtml"
import Typography from "../../../Basic/Typography"
import LogoOnlyMenu from "../../../UI/LogoOnlyMenu"
import PageBar from "../../../UI/PageBar"
import WelcomeBackImage from "./assets/welcome-back.svg"

const PartnerBlocked = ({
  active,
  redirectTo,
}: {
  active?: boolean
  redirectTo: string
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "PartnerBlocked",
  })

  return (
    <OnboardingLayout menu={<LogoOnlyMenu withLogout />}>
      <OnboardingLayout.Parent
        pageBar={<PageBar title={t("title")} withChat desktopHeaderType="h4" />}
      >
        <img src={WelcomeBackImage} alt={t("title")} className="mx-auto mb-4" />

        <div className="flex flex-col gap-y-4">
          {t(active ? "contentActive" : "content", { returnObjects: true }).map(
            (item) => {
              return (
                <Typography key={item}>
                  <SanitizedHtml as="span" content={item} />
                </Typography>
              )
            }
          )}
        </div>

        <ButtonGroup withMargin>
          <Button href={redirectTo}>
            {active ? t("buttonActive") : t("button")}
          </Button>
        </ButtonGroup>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default PartnerBlocked
