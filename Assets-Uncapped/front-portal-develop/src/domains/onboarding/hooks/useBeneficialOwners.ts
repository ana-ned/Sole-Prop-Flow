import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { CustomerPersonControllerApi } from "../../../services/api/kyc"

export const BENEFICIAL_OWNERS_QUERY_KEY = "KYC_CUSTOMER_PERSONS"

const useBeneficialOwners = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: [BENEFICIAL_OWNERS_QUERY_KEY],
    queryFn: async () =>
      new CustomerPersonControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Kyc,
        })
      ).getCustomerPersons({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
    retry: false,
    refetchOnReconnect: false,
  })
}

export default useBeneficialOwners
