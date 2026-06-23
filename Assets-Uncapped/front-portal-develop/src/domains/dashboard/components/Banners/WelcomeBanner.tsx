import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"

const WelcomeBanner = () => {
  const { t } = useTranslation("dashboard", { keyPrefix: "banners.welcome" })
  return (
    <MainBanner
      title={
        <div className="text-left">
          <Typography type="h4" color="white" className="mb-4">
            {t("title")}
          </Typography>
          <Typography color="white">
            <SanitizedHtml as="span" content={t("content")} />
          </Typography>
        </div>
      }
    />
  )
}

export default WelcomeBanner
