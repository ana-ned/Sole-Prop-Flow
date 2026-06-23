import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ApplicationControllerApi } from "../../../services/api/partners"
import partnerApplicationQueryKeys from "../partner-application.queries"

const useApplications = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: partnerApplicationQueryKeys.all(),
    queryFn: async () =>
      new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).getApplications({
        xXPARTNERID: auth.partnerId!,
        page: 0,
        size: 999,
        sort: ["createdAt,desc"],
      }),
    enabled: auth.isAuthenticated && !!auth.partnerId,
  })
}

export default useApplications
