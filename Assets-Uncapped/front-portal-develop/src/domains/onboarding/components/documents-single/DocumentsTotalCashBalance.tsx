import { useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router"
import PageLoader from "../../../../components/Collections/PageLoader"
import useAuth from "../../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  TotalCashBalanceDocumentControllerApi,
  TotalCashBalanceDocumentRequest,
} from "../../../../services/api/organisation-users"
import { TotalCashBalanceDocumentControllerApi as PartnersTotalCashBalanceDocumentControllerApi } from "../../../../services/api/partners"
import useDocumentUpload from "../../hooks/useDocumentUpload"
import DocumentCustomMessage from "./DocumentCustomMessage"
import DocumentsUploadLayout from "./DocumentsUploadLayout"
import TotalCashBalanceForm from "./TotalCashBalanceForm"

const DocumentsTotalCashBalance = ({ backUrl }: { backUrl: string }) => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding")
  const navigate = useNavigate()
  const { slug = "", id } = useParams<{ slug: string; id?: string }>()
  const { query } = useDocumentUpload({ slug, dealId: id })

  const upload = useMutation({
    mutationFn: async (
      totalCashBalanceDocumentRequest: TotalCashBalanceDocumentRequest
    ) =>
      auth.partnerId
        ? new PartnersTotalCashBalanceDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.Partners,
            })
          ).setTotalCashBalance({
            applicationId: id!,
            xXPARTNERID: auth.partnerId,
            totalCashBalanceDocumentRequest,
          })
        : new TotalCashBalanceDocumentControllerApi(
            apiConfig({
              token: await auth.getToken(),
              service: ApiServicesEnum.OrganisationUsers,
            })
          ).setTotalCashBalance({
            xXORGID: String(auth.organisation?.organisationId),
            totalCashBalanceDocumentRequest,
          }),
  })

  const onSubmit = async (formData: TotalCashBalanceDocumentRequest) => {
    await upload.mutateAsync(formData)
    await navigate(backUrl)
  }

  if (query.isLoading || !query.data) {
    return <PageLoader />
  }

  return (
    <DocumentsUploadLayout
      title={t("documents.titleSingle", {
        title: query.data.requiredDocument.title,
      })}
      backUrl={backUrl}
    >
      <div className="space-y-6">
        <DocumentCustomMessage>
          {query.data.requiredDocument.additionalInfo?.customMessage}
        </DocumentCustomMessage>

        <TotalCashBalanceForm onSubmit={onSubmit} />
      </div>
    </DocumentsUploadLayout>
  )
}

export default DocumentsTotalCashBalance
