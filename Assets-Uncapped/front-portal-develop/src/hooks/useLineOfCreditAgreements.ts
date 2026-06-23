import { useQuery } from "@tanstack/react-query"
import {
  LineOfCreditApi,
  LineOfCreditResponseStatusEnum,
} from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

export const AGREEMENTS_LOC_QUERY_KEY = ["AGREEMENTS-LOC"]
const CURRENT_AGREEMENT_LOC_QUERY_KEY = ["CURRENT-AGREEMENT-LOC"]

const useLineOfCreditAgreements = () => {
  const auth = useAuth()

  const locAgreements = useQuery({
    queryKey: AGREEMENTS_LOC_QUERY_KEY,
    queryFn: async () =>
      new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getListForOrganisation({
        xXORGID: auth.organisation?.organisationId!,
        includeDraftDraws: true,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const currentLocAgreement = useQuery({
    queryKey: CURRENT_AGREEMENT_LOC_QUERY_KEY,
    queryFn: async () =>
      new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getCurrentForOrganisation({
        xXORGID: auth.organisation?.organisationId!,
        includeDraftDraws: true,
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      (locAgreements.data?.content || []).some(
        (el) => el.status !== LineOfCreditResponseStatusEnum.Closed
      ),
  })

  return {
    locAgreements,
    currentLocAgreement,
  }
}

export default useLineOfCreditAgreements
