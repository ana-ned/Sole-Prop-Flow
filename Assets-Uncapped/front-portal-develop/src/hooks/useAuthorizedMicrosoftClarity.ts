import { useEffect } from "react"
import useAuth from "./useAuth"

const useAuthorizedMicrosoftClarity = () => {
  const { user, organisation } = useAuth()

  useEffect(() => {
    if (user?.sub) {
      globalThis.clarity?.("identify", user.sub.split("|")[1])
    }
    if (user?.email) {
      globalThis.clarity?.("set", "email", user.email)
    }
  }, [user?.sub, user?.email])

  useEffect(() => {
    if (organisation?.organisationId) {
      globalThis.clarity?.("set", "organisationId", organisation.organisationId)
    }
  }, [organisation?.organisationId])
}

export default useAuthorizedMicrosoftClarity
