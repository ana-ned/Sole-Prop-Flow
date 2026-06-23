import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import { useTracking } from "../../../hooks/useTracking"
import { ReactComponent as AddCircleOutline } from "../../../svgs/add-circle-outline.svg"

const IntroduceClientButton = () => {
  const { t } = useTranslation("partner-dashboard")
  const { trackEvent } = useTracking()

  return (
    <Button
      href="/partner/application/create"
      onClick={() => {
        trackEvent({
          category: "partner-dashboard",
          name: "add-application",
          action: "click",
        })
      }}
    >
      <AddCircleOutline />
      {t("buttons.addApplication")}
    </Button>
  )
}

export default IntroduceClientButton
