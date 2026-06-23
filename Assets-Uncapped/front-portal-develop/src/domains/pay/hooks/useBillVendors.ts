import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { BillVendorControllerApi } from "../../../services/api/loan-operations"
import payQueryKeys from "../queries"

const useBillVendors = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: payQueryKeys.vendors(),
    queryFn: async () =>
      new BillVendorControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).getByOrganisation({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })
}

export default useBillVendors
