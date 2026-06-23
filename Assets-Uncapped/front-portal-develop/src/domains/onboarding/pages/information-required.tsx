import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import PageBar from "../../../components/UI/PageBar"
import OnboardingLayout from "../components/OnboardingLayout"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const InformationRequired = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "informationRequired",
  })
  const navigation = useOnboardingNavigation()
  const { missingSteps } = useApplicationSteps()

  useEffect(() => {
    if (missingSteps.length === 0) {
      navigation.next()
    }
  }, [missingSteps, navigation])

  return (
    <OnboardingLayout>
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("title")}
            onClickBack={navigation.prev}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <Typography>{t("copy")}</Typography>
        <ListItemContainer className="mt-6">
          {missingSteps.map((el) => (
            <ListItemLarge
              title={el.title}
              more={{ type: "link" }}
              href={el.link}
              key={el.step}
            />
          ))}
        </ListItemContainer>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default InformationRequired
