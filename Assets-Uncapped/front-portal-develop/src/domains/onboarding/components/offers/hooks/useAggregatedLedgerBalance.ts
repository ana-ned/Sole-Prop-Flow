import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../../../hooks/useAuth"
import { LedgerControllerApi } from "../../../../../services/api/agreements"
import apiConfig, {
  ApiServicesEnum,
} from "../../../../../services/api/api-config"

const useAggregatedLedgerBalance = ({ enabled }: { enabled?: boolean }) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["aggregatedLedgerBalanceQuery"],
    queryFn: async () =>
      new LedgerControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getOrganisationBalance({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated && !!auth.organisation?.organisationId && !!enabled,
    refetchOnWindowFocus: false,
  })
}

export default useAggregatedLedgerBalance
