import { useQuery } from "@tanstack/react-query"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { DocumentControllerApi } from "../../../services/api/organisation-users"
import { DocumentControllerApi as DocumentControllerApiPartners } from "../../../services/api/partners"
import { titleCase } from "../../../utils/string"
import { UploadDocumentType } from "../constants"
import { documentQueryKeys } from "../queries"

const useRequiredDocuments = ({
  id,
}: {
  id?: string
} = {}) => {
  const auth = useAuth()

  const query = useQuery({
    queryKey: documentQueryKeys.required(),
    queryFn: async () =>
      auth.partnerId
        ? new DocumentControllerApiPartners(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).getListOfRequiredDocuments({
            xXPARTNERID: auth.partnerId,
            applicationId: id!,
          })
        : new DocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).getListOfRequiredDocuments1({
            xXORGID: String(auth.organisation?.organisationId),
          }),
    // FIXME: API should be covering this, but apparently for some
    // organisations it returns UPPER_CASE_ENUM_NAME, so we need to
    // convert it to title case
    select: (data) => ({
      ...data,
      requiredDocuments: data.requiredDocuments?.map((document) => ({
        ...document,
        title: document.title?.includes("_")
          ? titleCase(document.title)
          : document.title,
      })),
    }),
    enabled: auth.partnerId
      ? auth.isAuthenticated && !!auth.partnerId && !!id
      : auth.isAuthenticated && !!auth.organisation?.organisationId,
  })

  const uploadedDocuments =
    query.data && "uploadedDocuments" in query.data
      ? query.data.uploadedDocuments!
      : []

  return {
    ...query,
    hasRemainingToUpload: !!query.data?.requiredDocuments?.length,
    hasUploadedBankingDocument: uploadedDocuments.some(
      (document) =>
        document.documentType === UploadDocumentType.TotalCashBalance ||
        document.documentType === UploadDocumentType.BankStatement
    ),
    hasUploadedAccountingDocument: uploadedDocuments.some(
      (document) =>
        document.documentType === UploadDocumentType.ProfitLossReport ||
        document.documentType === UploadDocumentType.BalanceSheet
    ),
  }
}

export default useRequiredDocuments
