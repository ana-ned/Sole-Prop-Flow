import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button/Button"
import Alert from "../../../../components/UI/Alert"
import { useTracking } from "../../../../hooks/useTracking"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../../../line-of-credit/constants"

const LocMissingDocuments = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "notifications.locMissingDocuments",
  })
  const { trackEvent } = useTracking()
  const navigate = useNavigate()

  return (
    <Alert
      layout="horizontal"
      type="warning"
      title={t("title")}
      button={
        <Button
          type="button"
          onClick={async () => {
            trackEvent({
              category: "dashboard",
              name: `widget-missing_loc_documents`,
              action: "click",
            })
            await navigate(LINE_OF_CREDIT_DOCUMENTS_PATH)
          }}
        >
          {t("cta")}
        </Button>
      }
    >
      {t("copy")}
    </Alert>
  )
}

export default LocMissingDocuments
