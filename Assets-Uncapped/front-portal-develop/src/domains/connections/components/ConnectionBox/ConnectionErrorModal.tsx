import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import Alert from "../../../../components/UI/Alert"
import { useTracking } from "../../../../hooks/useTracking"
import { ConnectionResponse } from "../../../../services/api/connections"
import { ReactComponent as OpenNewIcon } from "../../../../svgs/open-new.svg"
import useConnections from "../../hooks/useConnections"
import platforms from "../../models/platforms"
import SimpleModal from "../SimpleModal"

const BANKS_WITH_TROUBLESHOOTING = ["chase", "lloyds"]

const ConnectionErrorModal = ({
  isOpen,
  onClose,
  onDelete,
  connection,
}: {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  connection: ConnectionResponse
}) => {
  const { t } = useTranslation("connections", {
    keyPrefix: "components.ConnectionErrorModal",
  })
  const { handleReconnect } = useConnections()
  const { trackEvent } = useTracking()

  const model = Object.values(platforms).find(
    ({ systemId }) => systemId === connection.systemId
  )

  const platform = Object.values(platforms).find(
    (item) => item.systemId === connection.systemId
  )

  const hasTroubleshooting = BANKS_WITH_TROUBLESHOOTING.some((el) =>
    connection.title?.toLowerCase().includes(el)
  )

  useEffect(() => {
    if (hasTroubleshooting && isOpen) {
      trackEvent({
        category: "connections",
        name: `troubleshooting-link`,
        action: "displayed",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const hasReconnect = model && "automatic" in model

  const getContent = () => {
    if (!hasReconnect) {
      return t("contentNoReconnect")
    }

    if (hasTroubleshooting) {
      return t("contentTroubleshooting")
    }

    return t("content")
  }

  return (
    <SimpleModal
      onClose={onClose}
      isOpen={isOpen}
      title={t("title")}
      footer={
        <>
          {hasTroubleshooting && (
            <>
              <Button
                fullWidth
                href="https://uncapped.notion.site/uncapped/Troubleshooting-connections-d5a89e3365574b31bfcb84643729b9c8"
                target="_blank"
                variant="secondary"
                onClick={() => {
                  trackEvent({
                    category: "connections",
                    name: `troubleshooting-link`,
                    action: "click",
                  })
                }}
              >
                <OpenNewIcon />
                {t("troubleshootingGuide")}
              </Button>
              {platform && hasReconnect && (
                <Button
                  className="mt-4"
                  type="button"
                  variant="primary"
                  loading={handleReconnect.isPending}
                  onClick={async () => {
                    await handleReconnect.mutateAsync({
                      connectionId: connection.id!,
                      platform,
                    })
                    onClose()
                  }}
                  fullWidth
                >
                  {t("reconnect")}
                </Button>
              )}
              <div className="mt-4 flex justify-center">
                <Button type="button" variant="link" onClick={onDelete}>
                  {t("delete")}
                </Button>
              </div>
            </>
          )}
          {!hasTroubleshooting && (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={onDelete}
                fullWidth
              >
                {t("delete")}
              </Button>
              {platform && hasReconnect && (
                <Button
                  fullWidth
                  className="mt-4"
                  type="button"
                  loading={handleReconnect.isPending}
                  onClick={async () => {
                    await handleReconnect.mutateAsync({
                      connectionId: connection.id!,
                      platform,
                    })
                    onClose()
                  }}
                >
                  {t("reconnect")}
                </Button>
              )}
            </>
          )}
          {handleReconnect.isError && (
            <ApiErrorAlert
              className="mt-2"
              error={handleReconnect.error as unknown as Response}
            />
          )}
        </>
      }
    >
      {connection.providerErrorMessage && (
        <Alert type="danger" showIcon={false} className="mb-4">
          {connection.providerErrorMessage}
        </Alert>
      )}
      <Typography type="body">{getContent()}</Typography>
    </SimpleModal>
  )
}

export default ConnectionErrorModal
