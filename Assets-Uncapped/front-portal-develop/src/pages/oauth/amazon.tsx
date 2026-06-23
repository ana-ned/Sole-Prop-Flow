import { useEffect } from "react"
import { Navigate } from "react-router"
import PageLoader from "../../components/Collections/PageLoader"
import useAuth from "../../hooks/useAuth"
import { UserRoles } from "../../hooks/useAuth.types"
import useTrackedQueryParams from "../../hooks/useTrackedQueryParams"

const AmazonLogin = () => {
  const { loginWithRedirect, hasRole } = useAuth()
  const registered = hasRole(UserRoles.REGISTERED)
  useTrackedQueryParams()

  useEffect(() => {
    if (!registered) {
      loginWithRedirect({
        authorizationParams: {
          connection: "amazon",
          redirect_uri: `${globalThis.location.origin}/auth/amazon/callback`,
        },
      })
    }
  }, [loginWithRedirect, registered])

  if (registered) {
    return <Navigate to="/auth/amazon/callback" />
  }

  return <PageLoader />
}

export default AmazonLogin
