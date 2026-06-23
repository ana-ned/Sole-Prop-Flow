import { useQuery } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { AccountsControllerApi } from "../services/api/loan-operations"
import useAuth from "./useAuth"

export const BANK_ACCOUNTS_QUERY_KEY = "LOAN_OPERATIONS_ACCOUNTS"

const useBankAccounts = ({
  refetchInterval,
}: { refetchInterval?: number | false } = {}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: [BANK_ACCOUNTS_QUERY_KEY],
    queryFn: async () =>
      new AccountsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).fetchAccounts({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
    refetchInterval,
  })
}

export default useBankAccounts
