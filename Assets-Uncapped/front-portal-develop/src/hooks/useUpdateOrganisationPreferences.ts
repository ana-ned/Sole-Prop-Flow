import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import {
  OrganisationPreferencesControllerApi,
  OrganisationPreferencesDto,
} from "../services/api/organisation-users"
import useAuth, { getUserOverviewQueryKey } from "./useAuth"

const useUpdateOrganisationPreferences = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      organisationPreferencesDto: OrganisationPreferencesDto
    ) =>
      new OrganisationPreferencesControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).savePreferences({
        xXORGID: auth.organisation?.organisationId!,
        organisationPreferencesDto,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
      })
    },
  })
}

export default useUpdateOrganisationPreferences
