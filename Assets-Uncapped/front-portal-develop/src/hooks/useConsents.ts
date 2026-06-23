import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { UserControllerApi } from "../services/api/organisation-users/apis/UserControllerApi"
import { ChangeUserPhoneRequest } from "../services/api/organisation-users/models/ChangeUserPhoneRequest"
import useAuth, { getUserOverviewQueryKey } from "./useAuth"

const useConsents = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()

  const grantSmsConsent = useMutation({
    mutationFn: async (variables: ChangeUserPhoneRequest) => {
      return new UserControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).updatePhone({
        xXORGID: auth.organisation?.organisationId!,
        changeUserPhoneRequest: {
          phone: variables.phone,
          smsConsentGranted: variables.smsConsentGranted,
        },
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
        type: "all",
      })
    },
  })

  return {
    grantSmsConsent,
  }
}

export default useConsents
