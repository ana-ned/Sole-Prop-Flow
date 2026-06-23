import {
  ConnectionResponse,
  ConnectionResponseStatusEnum,
} from "../../../services/api/connections"

export const getPotentiallySuccessfulConnections = (
  items: ConnectionResponse[]
) =>
  items.filter((item) =>
    [
      ConnectionResponseStatusEnum.Connecting,
      ConnectionResponseStatusEnum.Connected,
    ].includes(item.status!)
  )
