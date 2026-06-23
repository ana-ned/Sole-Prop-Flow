import { useScript } from "usehooks-ts"
import { isDev, isLocal, isPrototypeMode } from "../utils/env"

const HUBSPOT_SANDBOX_PORTAL_ID = "51249992"
const isEnabled = (isLocal() || isDev()) && !isPrototypeMode()

const useHubSpotScript = () => {
  useScript(
    isEnabled
      ? `https://js-na1.hs-scripts.com/${HUBSPOT_SANDBOX_PORTAL_ID}.js`
      : null,
    { id: "hs-script-loader" }
  )
}

export default useHubSpotScript
