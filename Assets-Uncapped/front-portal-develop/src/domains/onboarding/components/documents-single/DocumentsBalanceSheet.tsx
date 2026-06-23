import { useState } from "react"
import { filesize } from "filesize"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../components/Collections/PageLoader"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import FileUpload from "../../../../components/Functional/FileUpload"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import { ReactComponent as AttachmentIcon } from "../../../../svgs/attachment.svg"
import useDocumentUpload from "../../hooks/useDocumentUpload"
import DocumentCustomMessage from "./DocumentCustomMessage"
import DocumentsUploadLayout from "./DocumentsUploadLayout"

const DocumentsBalanceSheet = ({
  backUrl,
  layoutless,
}: {
  backUrl?: string
  layoutless?: boolean
}) => {
  const { t } = useTranslation("onboarding")
  const navigate = useNavigate()
  const { id } = useParams<{ slug: string; id?: string }>()
  const [disabledRows, setDisabledRows] = useState<string[]>([])
  const { query, fileUpload, fileDelete, fileUploadLock, handleFilesUpload } =
    useDocumentUpload({ slug: "BALANCE_SHEET", dealId: id })
  const { data, isError, error, isLoading } = query

  const { handleSubmit } = useForm()

  if (isLoading || !data) {
    return <PageLoader />
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const Content = () => {
    return (
      <div className="space-y-6">
        <ol className="ol-secondary">
          {!!data.requiredDocument.exampleDocumentUrl && (
            <li>
              <Typography>
                <a
                  href={data.requiredDocument.exampleDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download our example template
                </a>
              </Typography>
            </li>
          )}
          <li>
            Check that your Balance Sheet matches the same format including{" "}
            <b>separate columns for each month</b>
          </li>
          <li>
            Include data for each month <b>up to the latest reporting period</b>
          </li>
          <li>
            If your company is part of a group,{" "}
            <b>consolidate balance sheets at group level</b>
          </li>
          <li>
            Upload your consolidated Balance Sheet in either{" "}
            <b>csv, xlsx, or xls format</b>
          </li>
        </ol>

        <DocumentCustomMessage>
          {data.requiredDocument.additionalInfo?.customMessage}
        </DocumentCustomMessage>

        <div className="flex flex-col gap-y-4">
          <FileUpload
            extensions={data.requiredDocument.allowedFileFormats || []}
            handleUpload={handleFilesUpload}
            loading={fileUpload.isPending}
            title={t("documents.titleSingle", {
              title: data.requiredDocument.title?.toLowerCase(),
            })}
            subtitle={data.requiredDocument.description}
          />

          {(isError || fileUpload.isError) && (
            <ApiErrorAlert
              error={(error || fileUpload.error) as unknown as Response}
            />
          )}

          {!!data.uploadedDocuments?.length && (
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
        </div>
      </div>
    )
  }

  if (layoutless) {
    return <Content />
  }

  return (
    <DocumentsUploadLayout
      title={t("documents.titleSingle", {
        title: data.requiredDocument.title,
      })}
      backUrl={backUrl}
    >
      <FormLayout>
        <form
          onSubmit={handleSubmit(async () => {
            await fileUploadLock.mutateAsync({})
            if (backUrl) {
              await navigate(backUrl)
            }
          })}
        >
          <FormLayout.Content>
            <Content />
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button
                type="submit"
                loading={fileUploadLock.isPending}
                disabled={data.uploadedDocuments?.length === 0}
              >
                {t("documents.submitSingle")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
    </DocumentsUploadLayout>
  )
}

export default DocumentsBalanceSheet
