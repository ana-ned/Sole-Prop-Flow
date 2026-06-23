import { useQuery } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { AttributionControllerApi } from "../services/api/organisation-users"
import useAuth from "./useAuth"
import { UserRoles } from "./useAuth.types"

export const attributionQueryKey = (orgId?: string) => [
  "organisationUsers-AttributionController@getCurrentAttribution",
  orgId,
]

const useAttribution = () => {
  const auth = useAuth()

  return useQuery({
    queryKey: attributionQueryKey(auth.organisation?.organisationId),
    queryFn: async () =>
      new AttributionControllerApi(
        apiConfig({
          service: ApiServicesEnum.OrganisationUsers,
          token: await auth.getToken(),
        })
      ).getCurrentAttribution({
        xXORGID: auth.organisation?.organisationId ?? "",
      }),
    enabled: auth.isAuthenticated && auth.hasRole(UserRoles.REGISTERED),
    staleTime: Infinity,
  })
}

export default useAttribution
