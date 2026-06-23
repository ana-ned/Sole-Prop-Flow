import { useEffect } from "react"
import * as Sentry from "@sentry/react"
import useAuth from "./useAuth"

const useAuthorizedSentry = () => {
  const { user, organisation, partnerId } = useAuth()

  useEffect(() => {
    if (user?.email) {
      Sentry.setUser({ email: user.email })
    }
  }, [user?.email])

  useEffect(() => {
    if (organisation?.organisationId) {
      Sentry.setTag("organisationId", organisation.organisationId)
    }
  }, [organisation?.organisationId])

  useEffect(() => {
    if (partnerId) {
      Sentry.setTag("partnerId", partnerId)
    }
  }, [partnerId])
}

export default useAuthorizedSentry
