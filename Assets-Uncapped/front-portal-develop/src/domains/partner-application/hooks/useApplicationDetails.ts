import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ApplicationControllerApi,
  ApplicationDetailsResponse,
} from "../../../services/api/partners"
import partnerApplicationQueryKeys from "../partner-application.queries"

const useApplicationDetails = (id?: string) => {
  const auth = useAuth()

  return useQuery<ApplicationDetailsResponse, Response>({
    queryKey: partnerApplicationQueryKeys.detail(id),
    queryFn: async () =>
      new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).getApplicationDetails({
        xXPARTNERID: auth.partnerId!,
        applicationId: id!,
      }),
    enabled: auth.isAuthenticated && !!auth.partnerId && !!id,
    retry: 1,
  })
}

export default useApplicationDetails
