import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { MarcusLoanViewControllerApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const useMarcusImportDetails = ({
  agreementId,
  enabled = true,
}: {
  agreementId: string
  enabled?: boolean
}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["MARCUS-IMPORT-DETAILS", agreementId],
    queryFn: async () =>
      new MarcusLoanViewControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getMarcusImportedViewDetails({
        agreementId,
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated && !!auth.organisation?.organisationId && enabled,
  })
}

export default useMarcusImportDetails
