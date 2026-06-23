import { useQuery } from "@tanstack/react-query"
import { SigningDocumentsAPIV2ViaHelloSignApi } from "../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import useAuth from "./useAuth"

export const DOCUMENT_STATUS_QUERY_KEY = ["Document-signing-status"]

const createDocumentStatusQueryKey = (documentIds?: string[]) => {
  return [...DOCUMENT_STATUS_QUERY_KEY, ...(documentIds || [])]
}

const useDocumentStatuses = ({ documentIds }: { documentIds?: string[] }) => {
  const auth = useAuth()

  return useQuery({
    queryKey: createDocumentStatusQueryKey(documentIds),
    queryFn: async () =>
      new SigningDocumentsAPIV2ViaHelloSignApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getStatuses({
        xXORGID: auth.organisation?.organisationId!,
        // @ts-expect-error api expects set
        requestBody: documentIds,
      }),
    refetchInterval: (query) => {
      return (query.state.data || []).length < (documentIds || []).length
        ? 500
        : undefined
    },
    enabled: !!documentIds,
  })
}

export default useDocumentStatuses
