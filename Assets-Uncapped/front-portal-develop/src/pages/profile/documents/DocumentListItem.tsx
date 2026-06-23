import { useTranslation } from "react-i18next"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import {
  CustomerDocument,
  CustomerDocumentDocumentTypeEnum,
} from "../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../utils/date"
import useMarcusDocuments from "../hooks/useMarcusDocuments"

const DocumentListItem = ({ document }: { document: CustomerDocument }) => {
  const { t } = useTranslation("profile", { keyPrefix: "DocumentListItem" })
  const { downloadDocumentMutation } = useMarcusDocuments()

  const isStatement =
    document.documentType === CustomerDocumentDocumentTypeEnum.Statement

  return (
    <ListItemLarge
      more={{
        type: "download",
        onClick: async () => {
          await downloadDocumentMutation.mutateAsync({
            id: document.documentId!,
            documentSource: document.documentSource!,
          })
        },
      }}
      loading={downloadDocumentMutation.isPending}
      key={document.documentId}
      title={
        isStatement
          ? !!document.statementStartDate && !!document.statementEndDay
            ? `${t("statement")} ${formatDate(document.statementStartDate, {
                format: DateFormat.SPLIT,
              })} - ${formatDate(document.statementEndDay, {
                format: DateFormat.SPLIT,
              })}`
            : `${t("generatedOn")} ${formatDate(document.documentDate!, {
                format: DateFormat.SPLIT,
              })}`
          : document.documentName
      }
      subtitle={isStatement ? undefined : document.documentName}
    />
  )
}

export default DocumentListItem
