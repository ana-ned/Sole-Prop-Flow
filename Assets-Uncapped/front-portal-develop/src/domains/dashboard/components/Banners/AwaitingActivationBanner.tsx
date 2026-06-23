import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"

const AwaitingActivationBanner = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.awaitingActivation",
  })

  return (
    <MainBanner
      title={
        <Typography color="white" type="h4">
          {t("title")}
        </Typography>
      }
    >
      <Typography type="body">
        <SanitizedHtml as="span" content={t("content")} />
      </Typography>
    </MainBanner>
  )
}

export default AwaitingActivationBanner
