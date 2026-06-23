import { useQuery } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { AboutControllerApi } from "../services/api/partners"
import useAuth from "./useAuth"

const PARTNERS_ABOUT_QUERY_KEY = "PARTNERS_ABOUT"

const usePartnerInfo = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: [PARTNERS_ABOUT_QUERY_KEY],
    queryFn: async () =>
      new AboutControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).aboutMe({ xXPARTNERID: auth.partnerId! }),
    enabled: auth.isAuthenticated && !!auth.partnerId,
  })
}

export default usePartnerInfo
