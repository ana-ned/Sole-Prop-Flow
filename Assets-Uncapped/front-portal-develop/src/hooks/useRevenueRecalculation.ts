import { useQuery } from "@tanstack/react-query"
import { CreditLimitRevenueRecalculationControllerApi } from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

interface UseRevenueRecalculationOptions {
  agreementId?: string
  enabled?: boolean
}

const useRevenueRecalculation = ({
  agreementId,
  enabled = true,
}: UseRevenueRecalculationOptions) => {
  const { getToken, organisation } = useAuth()

  return useQuery({
    queryKey: ["revenue-recalculation", agreementId],
    queryFn: async () => {
      return new CreditLimitRevenueRecalculationControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getLatest({
        agreementId: agreementId!,
        xXORGID: organisation?.organisationId!,
      })
    },
    enabled: !!agreementId && !!organisation?.organisationId && enabled,
  })
}

export default useRevenueRecalculation
