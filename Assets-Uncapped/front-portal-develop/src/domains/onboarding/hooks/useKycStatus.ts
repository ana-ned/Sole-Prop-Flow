import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { CustomerPersonControllerApi } from "../../../services/api/kyc"

const useKycStatus = ({
  enabled,
  refetchInterval,
}: {
  enabled: boolean
  refetchInterval?: number | false
}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["kycStatus", auth.organisation?.organisationId],
    queryFn: async () =>
      new CustomerPersonControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Kyc,
        })
      ).getVerificationInfo({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled,
    refetchInterval: refetchInterval ?? false,
  })
}

export default useKycStatus
