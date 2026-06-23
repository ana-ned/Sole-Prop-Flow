import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { RepaymentScheduleControllerApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { repaymentQueryKeys } from "../../transactions/queries"

const useRepaymentSchedule = ({
  agreementId,
}: {
  agreementId?: string
} = {}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: agreementId
      ? repaymentQueryKeys.scheduled({
          agreementId,
        })
      : repaymentQueryKeys.all(),
    queryFn: async () =>
      new RepaymentScheduleControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).findSchedule({
        xXORGID: String(auth.organisation?.organisationId),
        agreementId,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })
}

export default useRepaymentSchedule
