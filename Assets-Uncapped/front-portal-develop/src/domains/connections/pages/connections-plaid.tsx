import { useEffect } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router"
import usePlaid, { PlaidAction } from "../../../hooks/usePlaid"
import { url } from "../../../utils/url"
import useConnections from "../hooks/useConnections"

const ConnectionsPlaid = () => {
  const [searchParams] = useSearchParams()
  const plaidOAuth = searchParams.get("oauth_state_id")
  const { refetchConnections } = useConnections()
  const navigate = useNavigate()
  const { open, ready } = usePlaid({
    redirectUrl: url("/connections/plaid", true),
    method: PlaidAction.OAUTH,
    onSuccessCallback: async () => {
      await refetchConnections()
      await navigate("/connections")
    },
    onExitCallback: async () => {
      await navigate("/connections")
    },
  })

  useEffect(() => {
    if (ready && plaidOAuth) {
      open()
    }
  }, [ready, open, plaidOAuth])

  if (!plaidOAuth) {
    return <Navigate to="/connections" />
  }

  return null
}

export default ConnectionsPlaid
