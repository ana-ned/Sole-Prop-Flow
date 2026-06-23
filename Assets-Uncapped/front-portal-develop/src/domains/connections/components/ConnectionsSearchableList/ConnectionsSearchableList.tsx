import { useLocation } from "react-router"
import SearchableList from "../../../../components/Collections/SearchableList"
import { ConnectionResponseStatusEnum } from "../../../../services/api/connections"
import useConnections from "../../hooks/useConnections"
import { Platform } from "../../models/platforms"

interface Props {
  platforms: Platform[]
  backUrl?: string
}

const ConnectionsSearchableList = ({ platforms, backUrl }: Props) => {
  const { handleOpenAuthorizationProvider, connections } = useConnections()
  const location = useLocation()

  return (
    <SearchableList
      grouped={false}
      items={platforms.map((platform) => {
        return {
          id: platform.systemId,
          label: platform.name,
          icon: platform.iconUrl,
          disabled:
            !platform.reuse &&
            connections.some(
              (item) =>
                item.connectionTemplateId === platform.connectionTemplateId &&
                [
                  ConnectionResponseStatusEnum.Connecting,
                  ConnectionResponseStatusEnum.Connected,
                ].includes(item.status!)
            ),
        }
      })}
      onClick={async (item) => {
        const platform = platforms.find(({ systemId }) => systemId === item.id)!
        location.state = {
          backUrl,
        }
        await handleOpenAuthorizationProvider(platform)
      }}
    />
  )
}

export default ConnectionsSearchableList
