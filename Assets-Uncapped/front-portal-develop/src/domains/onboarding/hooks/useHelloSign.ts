import HelloSign from "hellosign-embedded"
import { isDev, isLocal, isProduction } from "../../../utils/env"

const HELLOSING_CLIENT_ID = isProduction()
  ? "923c6888310d062336e368b74771a422"
  : "76fc98ffaf79fb73cdddfa9b2c1ab409"

const helloSignClient = new HelloSign()

const useHelloSign = () => {
  const openHelloSignDocument = (url: string) => {
    helloSignClient.open(url, {
      skipDomainVerification: isLocal(),
      testMode: isLocal() || isDev(),
      clientId: HELLOSING_CLIENT_ID,
    })
  }

  return {
    openHelloSignDocument,
    helloSignClient,
  }
}

export default useHelloSign
