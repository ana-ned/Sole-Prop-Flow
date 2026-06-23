import { useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import { SigningDocumentsAPIV2ViaHelloSignApi } from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"

const useMarkAsSigned = () => {
  const auth = useAuth()
  return useMutation({
    mutationFn: async (params: { documentId: string }) =>
      new SigningDocumentsAPIV2ViaHelloSignApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).markDocumentAsSigned({
        xXORGID: auth.organisation?.organisationId!,
        documentId: params.documentId,
      }),
  })
}

export default useMarkAsSigned
