import { useQuery } from "@tanstack/react-query"
import { RepaymentScheduleControllerApi } from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

const useRepaymentsSearch = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["AGREEMENTS_REPAYMENTS_SEARCH"],
    queryFn: async () =>
      new RepaymentScheduleControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).findSchedule({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })
}

export default useRepaymentsSearch
