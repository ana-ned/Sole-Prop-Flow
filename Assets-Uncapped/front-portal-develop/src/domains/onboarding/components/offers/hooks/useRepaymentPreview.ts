import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../../../hooks/useAuth"
import { OfferControllerV3Api } from "../../../../../services/api/agreements"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"

const REPAYMENT_QUERY_KEY = "LOC_REPAYMENT_PREVIEW"

const useRepaymentPreview = ({
  offerId,
  advance,
  repaymentLength,
}: {
  offerId?: string
  advance?: number
  repaymentLength?: number
}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: [REPAYMENT_QUERY_KEY, offerId, advance, repaymentLength],
    queryFn: async () => {
      return new OfferControllerV3Api(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getRepaymentsSummary1({
        xXORGID: auth.organisation?.organisationId!,
        offerId: offerId!,
        advance: advance!,
        repaymentLength: repaymentLength!,
      })
    },
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!offerId &&
      !!advance &&
      !!repaymentLength,
  })
}

export default useRepaymentPreview
