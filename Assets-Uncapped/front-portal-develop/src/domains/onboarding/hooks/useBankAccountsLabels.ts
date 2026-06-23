import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { BankAccountsControllerApi } from "../../../services/api/underwriting"

export const getQueryKeyForBankAccountLabels = () => [
  "underwriting:BankAccountsControllerApi@getBankAccountsLabels",
]

const useBankAccountsLabels = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: getQueryKeyForBankAccountLabels(),
    queryFn: async () => {
      return new BankAccountsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Underwriting,
        })
      ).getBankAccountsLabels({
        xXORGID: auth.organisation?.organisationId!,
      })
    },
    enabled: !!auth.organisation?.organisationId && enabled,
  })
}

export default useBankAccountsLabels
