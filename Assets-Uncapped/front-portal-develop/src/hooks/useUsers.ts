import { useQuery } from "@tanstack/react-query"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import { UserControllerApi } from "../services/api/organisation-users"
import { PartnerControllerApi } from "../services/api/partners"
import useAuth from "./useAuth"

interface CommonUserDTO {
  id: string
  firstName: string
  lastName: string
  email: string
  disabled: boolean
}

const useUsers = ({ enabled }: { enabled?: boolean } = {}) => {
  const auth = useAuth()

  return useQuery({
    queryKey: ["USERS_QUERY"],
    queryFn: async () => {
      if (auth.partnerId) {
        const res = await new PartnerControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Partners,
          })
        ).getPartnerUsers({ xXPARTNERID: auth.partnerId })

        return res.map<CommonUserDTO>((item) => ({
          id: item.partnerId,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          disabled: item.disabled!,
        }))
      }

      const res = await new UserControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).getUsers({ xXORGID: auth.organisation?.organisationId! })

      return res.map<CommonUserDTO>((item) => ({
        id: item.id!,
        firstName: item.name!,
        lastName: item.surname!,
        email: item.email!,
        disabled: item.disabled!,
      }))
    },
    enabled:
      enabled ?? (auth.isAuthenticated && !!auth.organisation?.organisationId),
  })
}

export default useUsers
