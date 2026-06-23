import { Trans, useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import PageBar from "../../../components/UI/PageBar"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"

const Submitted = () => {
  const { t } = useTranslation("onboarding", { keyPrefix: "submit" })

  return (
    <OnboardingGuard step="SUBMIT">
      <OnboardingLayout>
        <OnboardingLayout.Parent
          pageBar={
            <PageBar withChat desktopHeaderType="h4" title={t("title")} />
          }
        >
          <Typography type="bodyTitle" className="mb-4">
            {t("subtitle")}
          </Typography>
          <Typography type="body">
            <Trans ns="onboarding" i18nKey="submit.content">
              <a href="mailto:support@weareuncapped.com">
                support@weareuncapped.com
              </a>
            </Trans>
          </Typography>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default Submitted
