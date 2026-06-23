import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import { ConnectionResponse } from "../../../../services/api/connections"
import { isBankConnection } from "../../hooks/useConnections"
import platforms from "../../models/platforms"
import SimpleModal from "../SimpleModal"

const ConnectionDetailsModal = ({
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
    keyPrefix: "components.ConnectionDetailsModal",
  })

  const model = Object.values(platforms).find(
    ({ systemId }) => systemId === connection.systemId
  )

  return (
    <SimpleModal
      onClose={onClose}
      isOpen={isOpen}
      title={
        isBankConnection(connection)
          ? t("titleBank", { count: connection.items?.length })
          : connection.title!
      }
      footer={
        <Button type="button" variant="secondary" onClick={onDelete} fullWidth>
          {isBankConnection(connection)
            ? t("deleteBank", { count: connection.items?.length })
            : t("delete")}
        </Button>
      }
    >
      {connection.items && connection.items.length > 0 && (
        <ListItemContainer>
          {connection.items.map((item) => (
            <ListItemLarge
              key={item.id}
              truncate={false}
              initialIcon={connection.title || "X"}
              icon={
                model && "iconUrl" in model ? (
                  <img src={model.iconUrl} alt={model.name} />
                ) : undefined
              }
              contentClassName="max-w-[calc(100%-65px)]"
              title={
                <div className="flex max-w-full items-center overflow-hidden">
                  <b className="min-w-0 flex-1 truncate">{connection.title}</b>
                  {[connection.title, item.displayName].filter(Boolean)
                    .length === 2 && (
                    <span className="mx-1 flex-shrink-0">-</span>
                  )}
                  <span className="ml-1 flex-shrink-0">{item.displayName}</span>
                </div>
              }
            />
          ))}
        </ListItemContainer>
      )}
    </SimpleModal>
  )
}

export default ConnectionDetailsModal
