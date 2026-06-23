import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router"
import Button from "../../../../../components/Basic/Button"
import ButtonGroup from "../../../../../components/Basic/ButtonGroup"
import Typography from "../../../../../components/Basic/Typography"
import ListItemContainer from "../../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../../components/Collections/PageLoader"
import { StepProps } from "../../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../../../components/UI/ListItemLarge"
import PageBar from "../../../../../components/UI/PageBar"
import { useTracking } from "../../../../../hooks/useTracking"
import { OutstandingDebtDocumentResponseStatusEnum } from "../../../../../services/api/partners"
import { ReactComponent as AddIcon } from "../../../../../svgs/add.svg"
import { UploadDocumentType } from "../../../constants"
import useDocumentUpload from "../../../hooks/useDocumentUpload"
import useOutstandingDebt from "../../../hooks/useOutstandingDebt"
import OnboardingLayout from "../../OnboardingLayout"
import DocumentCustomMessage from "../DocumentCustomMessage"
import { DocumentsDebtStepProps } from "./documents-debt.model"
import DocumentsDebtListItem from "./DocumentsDebtListItem"

const DocumentsDebtList = ({
  data,
  setStep,
  onSubmit,
}: StepProps<DocumentsDebtStepProps>) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.outstandingDebt.DocumentsDebtList",
  })
  const navigate = useNavigate()
  const { trackEvent } = useTracking()
  const { id } = useParams<{ id?: string }>()
  const { fileUploadLock, query } = useDocumentUpload({
    slug: UploadDocumentType.OutstandingDebt,
    dealId: id,
  })
  const { debtList } = useOutstandingDebt({ id })

  const handleSubmit = async () => {
    await fileUploadLock.mutateAsync(undefined)
    await navigate(data!.backUrl)
  }

  if (debtList.isLoading) {
    return <PageLoader />
  }

  const hasPendingRequests = !!debtList.data?.outstandingDebts?.some(
    (item) =>
      item.status === OutstandingDebtDocumentResponseStatusEnum.Requested
  )
  const hasDebt = (debtList.data?.outstandingDebts?.length || 0) > 0

  return (
    <OnboardingLayout menu={false}>
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("header")}
            backUrl={data?.backUrl}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <FormLayout>
          <FormLayout.Content>
            <Typography className="mb-3">{t("description")}</Typography>
            <DocumentCustomMessage>
              {query.data?.requiredDocument.additionalInfo?.customMessage}
            </DocumentCustomMessage>
            <ListItemContainer className="mt-4">
              {hasDebt ? (
                debtList.data?.outstandingDebts?.map((debt) => {
                  return (
                    <DocumentsDebtListItem
                      key={debt.id}
                      debt={debt}
                      onClick={(selectedDebt) => {
                        onSubmit?.({ uploadedDocumentDebtId: selectedDebt.id })
                      }}
                    />
                  )
                })
              ) : (
                <>
                  <ListItemLarge
                    title={t("add.title")}
                    subtitle={t("add.description")}
                    more={{
                      type: "button",
                      onClick: () => {
                        trackEvent({
                          category: "onboarding",
                          name: "documents-debt-list",
                          action: "form-add",
                        })
                        onSubmit?.({ uploadedDocumentDebtId: undefined })
                      },
                    }}
                  />
                  <ListItemLarge
                    title={t("skip.title")}
                    subtitle={t("skip.description")}
                    more={{
                      type: "button",
                      onClick: () => {
                        trackEvent({
                          category: "onboarding",
                          name: "documents-debt-list",
                          action: "form-skip",
                        })
                        setStep?.(3)
                      },
                    }}
                  />
                </>
              )}
            </ListItemContainer>

            {hasDebt && (
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  onSubmit?.({ uploadedDocumentDebtId: undefined })
                }}
              >
                <AddIcon className="mr-2" />
                {t("addNew")}
              </Button>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              {hasDebt && (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={hasPendingRequests}
                >
                  {t("continue")}
                </Button>
              )}
            </ButtonGroup>
          </FormLayout.Footer>
        </FormLayout>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default DocumentsDebtList
