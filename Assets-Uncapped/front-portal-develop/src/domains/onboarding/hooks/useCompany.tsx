import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  OrganisationCompanyData,
  OrganisationCompanyDataApi,
} from "../../../services/api/organisation-users"
import QUERY_KEYS from "../../../utils/query-keys"

const useCompany = () => {
  const { isAuthenticated, getToken, organisation } = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const companyDetails = useQuery({
    queryKey: [QUERY_KEYS.organisationUsers.companyData],
    queryFn: async () =>
      new OrganisationCompanyDataApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).getOrganisationCompanyData({
        xXORGID: organisation?.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId,
    refetchOnWindowFocus: false,
  })

  const updateBusinessDetails = useMutation({
    mutationFn: async (organisationCompanyData: OrganisationCompanyData) => {
      return new OrganisationCompanyDataApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).updateCompanyInformation({
        xXORGID: organisation?.organisationId!,
        organisationCompanyData,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.organisationUsers.companyData],
        exact: true,
      })
    },
    onError: () => {
      toast.error(t("defaultErrorMessage"))
    },
  })

  return {
    companyDetails,
    updateBusinessDetails,
  }
}

export default useCompany
