import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  AgreementControllerApi,
  DetailedAgreementDTO,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const getAgreementQueryKey = (agreementId: string) => ["AGREEMENT", agreementId]

type QueryConfig = Omit<
  UseQueryOptions<DetailedAgreementDTO>,
  "queryKey" | "queryFn" | "initialData"
>

const useAgreement = (agreementId: string, config?: QueryConfig) => {
  const auth = useAuth()
  const queryClient = useQueryClient()

  return useQuery({
    ...config,
    queryKey: getAgreementQueryKey(agreementId!),
    queryFn: async () =>
      new AgreementControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).get({
        id: agreementId!,
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled:
      (config?.enabled ?? true) &&
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!agreementId,
    initialData: () => {
      const allAgreements = queryClient.getQueryData<DetailedAgreementDTO[]>([
        "AGREEMENTS_INDEX",
        undefined,
      ])
      return allAgreements?.find((a) => a.id === agreementId)
    },
  })
}

export default useAgreement
