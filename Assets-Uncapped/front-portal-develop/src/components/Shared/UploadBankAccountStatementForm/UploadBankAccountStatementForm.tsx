import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { filesize } from "filesize"
import { useTranslation } from "react-i18next"
import useAuth from "../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { DocumentControllerApi } from "../../../services/api/organisation-users"
import { ReactComponent as AttachmentIcon } from "../../../svgs/attachment.svg"
import { displayErrorToast } from "../../../utils/error-handling"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import ListItemContainer from "../../Collections/ListItemContainer"
import ApiErrorAlert from "../../Functional/ApiErrorAlert"
import FileUpload from "../../Functional/FileUpload"
import FormLayout from "../../UI/FormLayout/FormLayout"
import ListItemLarge from "../../UI/ListItemLarge"
import PageBar from "../../UI/PageBar"

const UploadBankAccountStatementForm = ({
  onClickBack,
  onSuccess,
  isLoading,
  error,
}: {
  onClickBack: () => void
  onSuccess: () => void
  isLoading?: boolean
  error?: Response
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "UploadBankAccountStatementForm",
  })
  const auth = useAuth()
  const [document, setDocument] = useState<File>()

  const uploadDocumentMutation = useMutation({
    mutationFn: async (uploadedFile: File) =>
      new DocumentControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).uploadBankAccountConfirmationDocument({
        xXORGID: String(auth.organisation?.organisationId),
        document: uploadedFile,
      }),
    onSuccess: () => {
      onSuccess()
    },
    onError: async (err) => {
      await displayErrorToast(err as unknown as Response)
    },
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (document) {
          await uploadDocumentMutation.mutateAsync(document)
        }
      }}
    >
      <FormLayout>
        <FormLayout.Content>
          <PageBar
            title={t("title")}
            onClickBack={onClickBack}
            desktopHeaderType="h4"
          />
          <Typography type="body" className="mb-4">
            {t("copy")}
          </Typography>

          <FileUpload
            title={t("title")}
            extensions={["pdf", "jpg"]}
            handleUpload={(files) => {
              setDocument(files[0])
            }}
            loading={false}
          />

          {document && (
            <ListItemContainer className="my-8">
              <ListItemLarge
                title={document.name}
                subtitle={filesize(document.size)}
                truncate
                disabled={uploadDocumentMutation.isPending}
                more={{
                  type: "delete",
                  onClick: () => {
                    setDocument(undefined)
                  },
                }}
                icon={<AttachmentIcon />}
              />
            </ListItemContainer>
          )}
          <ApiErrorAlert
            className="mt-4"
            error={
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              (uploadDocumentMutation.error as unknown as Response) || error
            }
          />
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup>
            <Button
              type="submit"
              disabled={!document}
              loading={uploadDocumentMutation.isPending || isLoading}
            >
              {t("submit")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </FormLayout>
    </form>
  )
}

export default UploadBankAccountStatementForm
