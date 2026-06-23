import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router"
import PageLoader from "../../../../components/Collections/PageLoader"
import useDocumentUpload from "../../hooks/useDocumentUpload"
import useGrossMarginUpload from "../../hooks/useGrossMarginUpload"
import DocumentCustomMessage from "./DocumentCustomMessage"
import DocumentsUploadLayout from "./DocumentsUploadLayout"
import GrossMarginForm from "./GrossMarginForm"

const DocumentsGrossMargin = ({ backUrl }: { backUrl: string }) => {
  const { t } = useTranslation(["onboarding", "common"])
  const navigate = useNavigate()
  const { slug = "", id } = useParams<{ slug: string; id?: string }>()
  const { query } = useDocumentUpload({ slug, dealId: id })

  const grossMarginMutation = useGrossMarginUpload()

  const onSubmit = async (grossMargin?: number) => {
    if (grossMargin) {
      await grossMarginMutation.mutateAsync({ grossMargin, id })
    }
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

        <GrossMarginForm onSubmit={onSubmit} />
      </div>
    </DocumentsUploadLayout>
  )
}

export default DocumentsGrossMargin
