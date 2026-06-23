import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { TransactionsApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

export const useTransactionDetails = ({
  transactionId,
  agreementId,
}: {
  transactionId: string
  agreementId: string
}) => {
  const { isAuthenticated, getToken, organisation } = useAuth()

  return useQuery({
    queryKey: ["transactionDetails", transactionId],
    queryFn: async () =>
      new TransactionsApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getTransactionById({
        accountId: agreementId,
        transactionId: transactionId,
        xXORGID: organisation?.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId,
    retry: 1,
  })
}
