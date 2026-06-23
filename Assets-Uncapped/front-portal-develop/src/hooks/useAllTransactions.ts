import { useQuery } from "@tanstack/react-query"
import type { GetAllTransactionsRequest } from "../services/api/agreements"
import { TransactionsApi } from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { stringifyWithSets } from "../utils/lists"
import useAuth from "./useAuth"

const useAllTransactions = ({
  params: customParams,
}: {
  params: Omit<GetAllTransactionsRequest, "xXORGID">
}) => {
  const auth = useAuth()

  const params: GetAllTransactionsRequest = {
    xXORGID: auth.organisation?.organisationId!,
    ...customParams,
  }

  return useQuery({
    queryKey: [
      "agreements:TransactionsApi@getAllTransactions",
      stringifyWithSets(params),
    ],
    queryFn: async () =>
      new TransactionsApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getAllTransactions(params),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })
}

export default useAllTransactions
