import { useState } from "react"
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import { filesize } from "filesize"
import { Trans, useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import FileUpload from "../../../../components/Functional/FileUpload"
import Alert from "../../../../components/UI/Alert"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import { DocumentByTypeResponse } from "../../../../services/api/organisation-users"
import { UploadedDocumentResponse } from "../../../../services/api/partners"
import { ReactComponent as AttachmentIcon } from "../../../../svgs/attachment.svg"
import DocumentCustomMessage from "./DocumentCustomMessage"

const UploadDefaultForm = ({
  query,
  fileUpload,
  fileDelete,
  handleFilesUpload,
  onSubmit,
}: {
  query: UseQueryResult<DocumentByTypeResponse, unknown>
  fileUpload: UseMutationResult<
    UploadedDocumentResponse,
    unknown,
    {
      document: Blob
      customSlug?: string
    }
  >
  fileDelete: UseMutationResult<UploadedDocumentResponse, unknown, string>
  handleFilesUpload: (files: File[]) => Promise<void>
  onSubmit: () => void
}) => {
  const { t } = useTranslation("onboarding")
  const [disabledRows, setDisabledRows] = useState<string[]>([])

  const { data, isError, error } = query

  return (
    <>
      <div className="space-y-6">
        {!!data?.requiredDocument?.exampleDocumentUrl && (
          <Typography type="body">
            <Trans ns="onboarding" i18nKey="documents.exampleLink">
              <a
                href={data.requiredDocument.exampleDocumentUrl}
                target="_blank"
                rel="noreferrer"
              >
                linkTitle
              </a>
            </Trans>
          </Typography>
        )}

        <DocumentCustomMessage>
          {data?.requiredDocument?.additionalInfo?.customMessage}
        </DocumentCustomMessage>

        <FileUpload
          extensions={data?.requiredDocument?.allowedFileFormats || []}
          handleUpload={handleFilesUpload}
          loading={fileUpload.isPending}
          title={t("documents.titleSingle", {
            title: data?.requiredDocument?.title?.toLowerCase(),
          })}
          subtitle={data?.requiredDocument?.description}
        />

        {(isError || fileUpload.isError) && (
          <ApiErrorAlert error={(error || fileUpload.error) as Response} />
        )}

        {!!data?.uploadedDocuments?.length && (
          <ListItemContainer>
            {data.uploadedDocuments.map((item) => (
              <ListItemLarge
                key={item.id}
                title={item.fileName}
                subtitle={filesize(item.fileSize!)}
                truncate
                more={{
                  type: "delete",
                  onClick: () => {
                    setDisabledRows([...disabledRows, item.id!])
                    fileDelete.mutate(item.id!, {
                      onSettled() {
                        setDisabledRows(
                          disabledRows.filter(
                            (disabledRow) => disabledRow !== item.id!
                          )
                        )
                      },
                    })
                  },
                }}
                disabled={disabledRows.includes(item.id!)}
                icon={<AttachmentIcon />}
              />
            ))}
          </ListItemContainer>
        )}

        {data?.requiredDocument?.instructions?.map((item) => (
          <Alert key={item}>{item}</Alert>
        ))}
      </div>
      <ButtonGroup withMargin>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={
            (!data || data.uploadedDocuments?.length === 0) &&
            !data?.requiredDocument?.isOptional
          }
        >
          {data &&
          data.uploadedDocuments?.length === 0 &&
          data.requiredDocument?.isOptional
            ? t("documents.skipSingle")
            : t("documents.submitSingle")}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default UploadDefaultForm
