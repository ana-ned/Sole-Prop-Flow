import { IConfig } from "unleash-proxy-client"
import { unleashConfig } from "../inits/unleash"
import useAuth from "./useAuth"

const useAuthorizedUnleashConfig = (): IConfig => {
  const auth = useAuth()

  return {
    ...unleashConfig,
    context: {
      ...unleashConfig.context,
      userId: auth.organisation?.organisationId || auth.user?.sub,
      properties: {
        ...unleashConfig.context?.properties,
        ...(auth.organisation?.organisationId && {
          organisationId: auth.organisation.organisationId,
        }),
      },
    },
  }
}

export default useAuthorizedUnleashConfig
