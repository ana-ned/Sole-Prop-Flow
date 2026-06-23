import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageBar from "../../../components/UI/PageBar"
import useStore from "../../../hooks/useStore"
import { url } from "../../../utils/url"
import BankAccountCountrySearchableList from "../../connections/components/BankAccountCountrySearchableList"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths } from "../constants"

const BankingSearch = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "bankingSearch",
  })
  const location = useLocation()
  const { backUrl = OnboardingMenuPaths.Banking } =
    location.state || ({} as { backUrl?: string })
  const customNextOnboardingPath = useStore(
    (state) => state.customNextOnboardingPath
  )

  return (
    <OnboardingGuard step="BANKING">
      <OnboardingLayout>
        <OnboardingLayout.Parent>
          <PageBar title={t("title")} withChat desktopHeaderType="h4" />
          <Typography className="mb-6">
            <SanitizedHtml as="span" content={t("description")} />
          </Typography>

          <BankAccountCountrySearchableList
            plaidFallback={url(
              `${OnboardingMenuPaths.Banking}/plaid-auth`,
              true
            )}
          />

          <ButtonGroup
            backUrl={customNextOnboardingPath || backUrl}
            withMargin
          />
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default BankingSearch
