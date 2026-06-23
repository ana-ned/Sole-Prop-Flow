import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { groupBy } from "lodash-es"
import useAuth from "../../../hooks/useAuth"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { DocumentControllerApi } from "../../../services/api/organisation-users"
import { UploadDocumentType } from "../constants"
import { documentQueryKeys } from "../queries"

const ACCOUNTING_DOCUMENT_TYPES = new Set([
  UploadDocumentType.ProfitLossReport,
  UploadDocumentType.BalanceSheet,
])

const useAccountingDocuments = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { trackEvent } = useTracking()

  const documents = useQuery({
    queryKey: documentQueryKeys.required(),
    queryFn: async () =>
      new DocumentControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).getListOfRequiredDocuments1({
        xXORGID: String(auth.organisation?.organisationId),
      }),
    enabled: auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const lock = useMutation({
    mutationFn: async ({
      documentTypes,
    }: {
      documentTypes: UploadDocumentType[]
    }) =>
      Promise.all(
        documentTypes.map(async (documentType) =>
          new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).lockDocumentType1({
            xXORGID: String(auth.organisation?.organisationId),
            documentType,
          })
        )
      ),
    onSuccess: async (_, { documentTypes }) => {
      documentTypes.forEach((documentType) => {
        trackEvent({
          category: "onboarding",
          name: "documents",
          action: "lock",
          customFields: {
            documentType,
          },
        })
      })
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
        type: "all",
      })
      await queryClient.invalidateQueries({ queryKey: documentQueryKeys.v2() })
    },
  })

  const accountingDocumentsRequests = [
    documents.data?.requiredDocuments?.find(
      (item) => item.documentType === UploadDocumentType.ProfitLossReport
    )!,
    documents.data?.requiredDocuments?.find(
      (item) => item.documentType === UploadDocumentType.BalanceSheet
    )!,
  ].filter(Boolean)

  const accountingUploads = groupBy(
    documents.data?.uploadedDocuments?.filter(
      (item) =>
        ACCOUNTING_DOCUMENT_TYPES.has(
          item.documentType as UploadDocumentType
        ) &&
        accountingDocumentsRequests.some(
          (request) => request.documentRequestId === item.requiredDocumentId
        )
    ),
    "documentType"
  )

  const canSubmit =
    Object.keys(accountingUploads).length === accountingDocumentsRequests.length

  const confirmUpload = async () => {
    if (canSubmit) {
      await lock.mutateAsync({
        documentTypes: Object.keys(accountingUploads).map(
          (item) => item as UploadDocumentType
        ),
      })
    }
  }

  return {
    accountingDocumentsRequests,
    canSubmit,
    isUploading: lock.isPending,
    isLoading: documents.isLoading,
    confirmUpload,
  }
}

export default useAccountingDocuments
