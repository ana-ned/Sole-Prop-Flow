import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { OfferApi, ResponseError } from "../../../services/api/amazon-gateway"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import useAmazonConsentFlag from "./useAmazonConsentFlag"

const AMAZON_CONSENT_STATUS_QUERY_KEY = (organisationId?: string) => [
  "AMAZON_CONSENT_STATUS",
  organisationId,
]

const useAmazonConsentStatus = ({
  refetchInterval,
  refetchOnWindowFocus = false,
  enabled = true,
}: {
  refetchInterval?:
    | number
    | false
    | ((query: {
        state: { data?: { isConsentGiven: boolean } }
      }) => number | false)
  refetchOnWindowFocus?: boolean
  enabled?: boolean
} = {}) => {
  const auth = useAuth()
  const { isAmazonPartnership, data: dealData } = useDeal()
  const amazonConsentFeatureFlag = useAmazonConsentFlag()

  const query = useQuery({
    queryKey: AMAZON_CONSENT_STATUS_QUERY_KEY(
      auth.organisation?.organisationId
    ),
    queryFn: async () => {
      try {
        const result = await new OfferApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.AmazonGateway,
          })
        ).getSellersCentralOfferDetailsUrl({
          xXORGID: auth.organisation?.organisationId!,
          dealId: dealData!.id!,
        })

        return {
          sellerCentralUrl: result.redirectUrl ?? null,
          isConsentGiven: !result.redirectUrl,
        }
      } catch (err) {
        if (err instanceof ResponseError && err.response.status === 404) {
          return { sellerCentralUrl: null, isConsentGiven: false }
        }
        throw err
      }
    },
    enabled:
      enabled &&
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!dealData?.id &&
      isAmazonPartnership &&
      amazonConsentFeatureFlag,
    staleTime:
      refetchInterval !== undefined || refetchOnWindowFocus ? 0 : 5 * 60 * 1000,
    refetchOnWindowFocus,
    refetchInterval: refetchInterval ?? false,
  })

  return {
    isConsentGiven: query.data?.isConsentGiven ?? false,
    sellerCentralUrl: query.data?.sellerCentralUrl ?? null,
    isLoading: query.isLoading,
    isPending: query.isPending,
  }
}

export default useAmazonConsentStatus
