import { useQuery, useMutation } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import {
  CustomerDocumentDocumentSourceEnum,
  DocumentsFacadeControllerApi,
  CustomerDocumentDocumentTypeEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { displayErrorToast } from "../../../utils/error-handling"

const useMarcusDocuments = () => {
  const auth = useAuth()

  const documentsQuery = useQuery({
    queryKey: ["PROFILE_DOCUMENTS", auth.organisation?.organisationId],
    queryFn: async () =>
      new DocumentsFacadeControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getOrganisationDocuments({
        xXORGID: auth.organisation?.organisationId!,
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const downloadDocumentMutation = useMutation({
    mutationFn: async ({
      id,
      documentSource,
    }: {
      id: string
      documentSource: CustomerDocumentDocumentSourceEnum
    }) =>
      new DocumentsFacadeControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).generateSignedUri({
        xXORGID: auth.organisation?.organisationId!,
        documentSource,
        id,
      }),
    onSuccess: (data) => {
      const link = document.createElement("a")
      link.href = data
      link.download = data.split("/").pop()!
      document.body.append(link)
      link.click()
      link.remove()
    },
    onError: async (err) => {
      await displayErrorToast(err as unknown as Response)
    },
  })

  const statements = documentsQuery.data?.documents
    ?.filter(
      (el) => el.documentType === CustomerDocumentDocumentTypeEnum.Statement
    )
    .toSorted((a, b) => b.documentDate!.getTime() - a.documentDate!.getTime())

  const loanDocuments = documentsQuery.data?.documents
    ?.filter(
      (el) => el.documentType !== CustomerDocumentDocumentTypeEnum.Statement
    )
    .toSorted((a, b) => b.documentDate!.getTime() - a.documentDate!.getTime())

  return {
    ...documentsQuery,
    downloadDocumentMutation,
    statements,
    loanDocuments,
  }
}

export default useMarcusDocuments
