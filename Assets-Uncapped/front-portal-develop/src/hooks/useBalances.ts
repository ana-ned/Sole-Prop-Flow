import { useQuery } from "@tanstack/react-query"
import { BalanceControllerApi } from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

export const BALANCES_QUERY_KEY = ["AGREEMENTS_BALANCES"]

const useBalances = ({
  refetchInterval,
  enabled = true,
}: {
  refetchInterval?: number
  enabled?: boolean
} = {}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: BALANCES_QUERY_KEY,
    queryFn: async () =>
      new BalanceControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getAggregatedBalanceForOrganisation({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      enabled && auth.isAuthenticated && !!auth.organisation?.organisationId,
    refetchInterval,
  })
}

export default useBalances
