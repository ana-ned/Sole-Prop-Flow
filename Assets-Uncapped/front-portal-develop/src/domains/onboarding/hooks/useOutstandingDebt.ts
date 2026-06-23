import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { OutstandingDebtDocumentControllerApi } from "../../../services/api/organisation-users"
import { OutstandingDebtDocumentControllerApi as PartnersOutstandingDebtDocumentControllerApi } from "../../../services/api/partners"

export const DEBT_LIST_QUERY_KEY = "documents-debt-list"

const useOutstandingDebt = ({
  id,
}: {
  id?: string
} = {}) => {
  const auth = useAuth()
  const debtList = useQuery({
    queryKey: [DEBT_LIST_QUERY_KEY],
    queryFn: async () =>
      auth.partnerId
        ? new PartnersOutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).getOutstandingDebtForOrganisation({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
          })
        : new OutstandingDebtDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).getOutstandingDebtForOrganisation({
            xXORGID: auth.organisation?.organisationId!,
          }),
    enabled: auth.partnerId
      ? auth.isAuthenticated && !!auth.partnerId
      : auth.isAuthenticated && !!auth.organisation?.organisationId,
    refetchOnWindowFocus: false,
  })

  return {
    debtList,
  }
}

export default useOutstandingDebt
