import { IConfig } from "unleash-proxy-client"
import packageJson from "../../package.json"
import env from "../utils/runtime-env"

export const unleashConfig: IConfig = {
  url:
    env("REACT_APP_UNLEASH_URL") ||
    "https://unleash.prod.internal.weareuncapped.com/api/frontend",
  clientKey: env("REACT_APP_UNLEASH_CLIENT_KEY") || "CLIENT_KEY",
  refreshInterval: 15,
  appName: packageJson.name,
}
