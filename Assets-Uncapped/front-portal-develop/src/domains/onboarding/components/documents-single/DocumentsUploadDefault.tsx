import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router"
import PageLoader from "../../../../components/Collections/PageLoader"
import useDocumentUpload from "../../hooks/useDocumentUpload"
import DocumentsUploadLayout from "./DocumentsUploadLayout"
import UploadDefaultForm from "./UploadDefaultForm"

const DocumentsUploadDefault = ({ backUrl }: { backUrl: string }) => {
  const { t } = useTranslation("onboarding")
  const navigate = useNavigate()
  const { slug = "", id } = useParams<{ slug: string; id?: string }>()
  const { query, fileUpload, fileDelete, fileUploadLock, handleFilesUpload } =
    useDocumentUpload({ slug, dealId: id })
  const { data, isLoading } = query

  if (isLoading || !data) {
    return <PageLoader />
  }

  const onSubmit = async () => {
    await fileUploadLock.mutateAsync(undefined)
    await navigate(backUrl)
  }

  return (
    <DocumentsUploadLayout
      title={t("documents.titleSingle", {
        title: data.requiredDocument.title,
      })}
      backUrl={backUrl}
    >
      <UploadDefaultForm
        query={query}
        fileUpload={fileUpload}
        fileDelete={fileDelete}
        handleFilesUpload={handleFilesUpload}
        onSubmit={onSubmit}
      />
    </DocumentsUploadLayout>
  )
}

export default DocumentsUploadDefault
