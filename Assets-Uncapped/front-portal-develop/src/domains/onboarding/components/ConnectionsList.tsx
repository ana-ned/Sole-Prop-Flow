import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import { ConnectionResponse } from "../../../services/api/connections"
import ConnectionBox from "../../connections/components/ConnectionBox"
import useConnections from "../../connections/hooks/useConnections"
import useBankVerification from "../hooks/useBankVerification"

export const ConnectionsListedByType = ({
  title,
  connections,
}: {
  title?: string
  connections: ConnectionResponse[]
}) => {
  const bankVerification = useBankVerification()

  if (connections.length === 0) {
    return null
  }

  return (
    <div>
      {title && (
        <Typography type="bodyTitle" className="mt-4 mb-2">
          {title}
        </Typography>
      )}
      <div>
        {connections.map((connection) => (
          <ConnectionBox
            key={connection.id}
            connection={connection}
            isAnalyzing={
              (connection.type === "BANK" || connection.type === "SALES") &&
              bankVerification.inProgress
            }
          />
        ))}
      </div>
    </div>
  )
}

const ConnectionsList = () => {
  const {
    salesConnections,
    accountingConnections,
    bankingConnections,
    connections,
  } = useConnections()
  const { t } = useTranslation("onboarding")

  if (connections.length === 0) return null

  const connectionGroups = [
    <ConnectionsListedByType
      key="banking"
      title={t("list.banking")}
      connections={bankingConnections}
    />,
    <ConnectionsListedByType
      key="sales"
      title={t("list.sales")}
      connections={salesConnections}
    />,
    <ConnectionsListedByType
      key="accounting"
      title={t("list.accounting")}
      connections={accountingConnections}
    />,
  ]

  return connectionGroups.map((group) => (
    <React.Fragment key={group.key}>{group}</React.Fragment>
  ))
}

export default ConnectionsList
