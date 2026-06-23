import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { DocumentControllerApi } from "../../../services/api/organisation-users"
import { documentQueryKeys } from "../../onboarding/queries"

const useMissingDocuments = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const auth = useAuth()
  const query = useQuery({
    queryKey: documentQueryKeys.v2(),
    queryFn: async () =>
      new DocumentControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).getListOfRequiredDocumentsV21({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      auth.isAuthenticated && !!auth.organisation?.organisationId && enabled,
  })

  return {
    ...query,
    hasRemainingToUpload: !!query.data?.missingDocuments?.length,
  }
}

export default useMissingDocuments
