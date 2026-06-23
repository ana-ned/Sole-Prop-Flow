import { useTranslation } from "react-i18next"
import Alert from "../../../../components/UI/Alert"

const SellersfiNotice = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "notifications.sellersFi",
  })

  return (
    <Alert title={t("title")} type="info" showIcon={false}>
      {t("copy")}
    </Alert>
  )
}

export default SellersfiNotice
