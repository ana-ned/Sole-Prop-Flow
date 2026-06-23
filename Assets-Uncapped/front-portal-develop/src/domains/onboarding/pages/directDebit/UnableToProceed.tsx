import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu/LogoOnlyMenu"
import PageBar from "../../../../components/UI/PageBar"
import UnableToProceedImage from "../../assets/unable-to-proceed.webp"
import OnboardingLayout from "../../components/OnboardingLayout"

const UnableToProceed = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "directDebit.UnableToProceed",
  })

  return (
    <OnboardingLayout menu={<LogoOnlyMenu />}>
      <OnboardingLayout.Parent
        pageBar={<PageBar title={t("title")} desktopHeaderType="h4" />}
      >
        <img src={UnableToProceedImage} alt={t("title")} className="mb-4" />

        <div className="flex flex-col gap-y-4">
          {t("content", {
            returnObjects: true,
          }).map((item, index) => (
            <Typography key={index}>{item}</Typography>
          ))}
        </div>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default UnableToProceed
