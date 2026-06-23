import { useEffect } from "react"
import { Navigate, useNavigate, useSearchParams } from "react-router"
import usePlaid, { PlaidAction } from "../../../hooks/usePlaid"
import { url } from "../../../utils/url"
import useConnections from "../../connections/hooks/useConnections"
import { OnboardingMenuPaths } from "../constants"

const BankingPlaidAuth = () => {
  const [searchParams] = useSearchParams()
  const plaidOAuth = searchParams.get("oauth_state_id")
  const { refetchConnections } = useConnections()
  const navigate = useNavigate()
  const { open, ready } = usePlaid({
    redirectUrl: url(`${OnboardingMenuPaths.Banking}/plaid-auth`, true),
    method: PlaidAction.OAUTH,
    onSuccessCallback: () => refetchConnections(),
    onExitCallback: async () => {
      await navigate(OnboardingMenuPaths.Banking)
    },
  })

  useEffect(() => {
    if (ready && plaidOAuth) {
      open()
    }
  }, [ready, open, plaidOAuth])

  if (!plaidOAuth) {
    return <Navigate to={OnboardingMenuPaths.Banking} />
  }

  return null
}

export default BankingPlaidAuth
