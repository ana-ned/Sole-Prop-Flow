import { useEffect } from "react"
import useAuth from "./useAuth"

const useAuthorizedHubSpot = () => {
  const { user } = useAuth()

  useEffect(() => {
    const hsq = globalThis._hsq

    if (hsq && user) {
      hsq.push([
        "identify",
        {
          email: user.email,
          name: user.name,
        },
      ])
    }
  }, [user])

  return {
    trackPageView: () => {
      const hsq = globalThis._hsq

      if (hsq) {
        hsq.push(["trackPageView"])
      }
    },
  }
}

export default useAuthorizedHubSpot
