import { useFlag } from "@unleash/proxy-client-react"

const useAmazonConsentFlag = () =>
  useFlag("JKT-3445-Amazon-refinance-and-multiproduct")

export default useAmazonConsentFlag
