import { Dispatch, SetStateAction } from "react"
import { useLocalStorage } from "react-use"
import { getCurrentEnv } from "../utils/env"

type Keys = [
  "organisation",
  "plaidLinkToken",
  "onboardingTypeformFeedback",
  "connections_v3",
  "gocardless_link",
  "sms_consent_at",
  "campaign_interactions",
  "offerExitIntentFeedback",
]

const useBrowserStorage = <T>(
  userId: string | undefined,
  key: Keys[number]
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  return useLocalStorage<T>(
    `uncapped_${userId || "generic"}_${getCurrentEnv()}_${key}`
  )
}

export default useBrowserStorage
