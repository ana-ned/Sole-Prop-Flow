import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { SigningDocumentsAPIV2ViaHelloSignApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

export const SIGNING_QUERY_KEY = (documentId?: string) => [
  "AGREEMENTS-SIGN-DOCUMENT",
  documentId,
]

const useSigningUrl = ({ documentId }: { documentId?: string }) => {
  const auth = useAuth()

  return useQuery({
    queryKey: SIGNING_QUERY_KEY(documentId),
    queryFn: async () =>
      new SigningDocumentsAPIV2ViaHelloSignApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).createSigningUrl({
        xXORGID: auth.organisation?.organisationId!,
        documentId: documentId!,
      }),
    enabled: !!documentId,
    retry: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Number.POSITIVE_INFINITY,
  })
}

export default useSigningUrl
