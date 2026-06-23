import { Trans, useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import Button from "../../../../components/Basic/Button"
import Alert from "../../../../components/UI/Alert"
import useHubSpotChat from "../../../../hooks/useHubSpotChat"

const LateFeesAlert = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "notifications.lateFees",
  })
  const { openChat } = useHubSpotChat()
  const location = useLocation()

  return (
    <Alert
      layout="horizontal"
      type="danger"
      title={t("title")}
      button={
        <Button
          href="/transactions/"
          state={{
            backUrl: location.pathname,
          }}
        >
          {t("cta")}
        </Button>
      }
    >
      <Trans
        i18nKey="notifications.lateFees.content"
        ns="dashboard"
        components={{
          button: (
            <button
              type="button"
              className="text-brand-600 font-bold no-underline hover:underline"
              onClick={openChat}
            />
          ),
        }}
      />
    </Alert>
  )
}

export default LateFeesAlert
