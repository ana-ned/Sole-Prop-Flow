import { useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  EarlyRepaymentsControllerApi,
  StartProcessRequest,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const useEarlyRepaymentsMutation = () => {
  const auth = useAuth()

  return useMutation({
    mutationFn: async ({
      agreementId,
      amount,
    }: Omit<StartProcessRequest, "xXORGID">) =>
      new EarlyRepaymentsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).startProcess({
        xXORGID: auth.organisation?.organisationId!,
        agreementId,
        amount,
      }),
  })
}

export default useEarlyRepaymentsMutation
