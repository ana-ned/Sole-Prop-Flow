import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router"
import * as yup from "yup"
import Button from "../../../../../components/Basic/Button"
import ButtonGroup from "../../../../../components/Basic/ButtonGroup"
import Typography from "../../../../../components/Basic/Typography"
import ListItemContainer from "../../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../../components/Collections/PageLoader"
import { StepProps } from "../../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../../components/UI/FormLayout/FormLayout"
import ControlledListItemInput from "../../../../../components/UI/ListItemInput/ControlledListItemInput"
import PageBar from "../../../../../components/UI/PageBar"
import { useTracking } from "../../../../../hooks/useTracking"
import { UploadDocumentType } from "../../../constants"
import useDocumentUpload from "../../../hooks/useDocumentUpload"
import useOutstandingDebt from "../../../hooks/useOutstandingDebt"
import OnboardingLayout from "../../OnboardingLayout"
import { DocumentsDebtStepProps } from "./documents-debt.model"

const debtTypes = [
  "amortising",
  "bullet",
  "revolving",
  "convertible",
  "revenueBasedFinancing",
  "other",
] as const

const DocumentsDebtNoDebt = ({
  data,
  setStep,
}: StepProps<DocumentsDebtStepProps>) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.outstandingDebt",
  })
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const { fileUploadLock } = useDocumentUpload({
    slug: UploadDocumentType.OutstandingDebt,
    dealId: id,
  })
  const { debtList } = useOutstandingDebt({ id })
  const { control, formState } = useForm({
    resolver: yupResolver(
      yup.object({
        noDebt: yup.object(
          Object.fromEntries(
            debtTypes.map((type) => [type, yup.boolean().required().isTrue()])
          )
        ),
      })
    ),
  })

  const handleSubmit = async () => {
    await fileUploadLock.mutateAsync(undefined)
    await navigate(data!.backUrl)
  }

  if (debtList.isLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingLayout menu={false}>
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("DocumentsDebtNoDebt.title")}
            onClickBack={() => {
              trackEvent({
                category: "onboarding",
                name: "documents-debt-no-debt",
                action: "back",
              })
              setStep?.(1)
            }}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <FormLayout>
          <FormLayout.Content>
            <Typography className="mb-3">
              {t("DocumentsDebtNoDebt.description")}
            </Typography>
            <ListItemContainer className="mt-4">
              {debtTypes.map((type) => (
                <ControlledListItemInput
                  key={`no-debt-${type}`}
                  name={`noDebt.${type}`}
                  control={control}
                  title={t(`DocumentsDebt.repaymentTypeOptions.${type}.noDebt`)}
                  subtitle={t(
                    `DocumentsDebt.repaymentTypeOptions.${type}.description`
                  )}
                  type="normal"
                />
              ))}
            </ListItemContainer>
          </FormLayout.Content>
          <FormLayout.Footer>
            <ButtonGroup>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!formState.isValid}
              >
                {t("DocumentsDebtNoDebt.submit")}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setStep?.(1)
                }}
              >
                {t("DocumentsDebtNoDebt.back")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </FormLayout>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default DocumentsDebtNoDebt
