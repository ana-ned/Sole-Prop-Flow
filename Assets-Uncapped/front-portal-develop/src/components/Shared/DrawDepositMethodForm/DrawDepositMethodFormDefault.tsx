import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import SkipStepButton from "../../../domains/onboarding/components/SkipStepButton"
import useBankAccounts from "../../../hooks/useBankAccounts"
import { OfferResponse } from "../../../services/api/agreements"
import { ReactComponent as AddIcon } from "../../../svgs/add.svg"
import { ReactComponent as DeleteOutlineIcon } from "../../../svgs/delete-outline.svg"
import { format } from "../../../utils/money"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import ListItemContainer from "../../Collections/ListItemContainer"
import PageLoader from "../../Collections/PageLoader"
import ApiErrorAlert from "../../Functional/ApiErrorAlert"
import Card from "../../UI/Card"
import FormLayout from "../../UI/FormLayout/FormLayout"
import ListItemLarge from "../../UI/ListItemLarge"
import PageBar from "../../UI/PageBar"
import BankAccountSelection from "../BankAccountSelection"

const schema = yup.object().shape({
  accountId: yup.string().required(),
  account: yup.object().optional().shape({
    verified: yup.boolean(),
  }),
})

export type DrawDepositMethodFormSchema = yup.InferType<typeof schema>

const DrawDepositMethodFormDefault = ({
  onSubmit,
  onBack,
  onDelete,
  onAddBankAccount,
  onSkip,
  amount,
  currency,
  error = null,
  isLoc,
  isLoading,
  offer,
}: {
  onSubmit: (formData: DrawDepositMethodFormSchema) => void
  onBack: () => void
  onAddBankAccount: (formValues: DrawDepositMethodFormSchema) => void
  onDelete?: () => void
  amount: number
  currency: string
  error?: Response | null
  onSkip?: () => void
  isLoc: boolean
  isLoading?: boolean
  offer?: OfferResponse
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "DrawDepositMethodForm",
  })

  const bankAccountsQuery = useBankAccounts()
  const { watch, handleSubmit, formState, setValue, trigger } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  const formValues = watch()

  if (bankAccountsQuery.isLoading) {
    return <PageLoader />
  }

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit((formData) => {
          onSubmit(formData)
        })}
      >
        <FormLayout.Content>
          <PageBar
            title={t("withdrawCash")}
            actionButton={
              onDelete
                ? {
                    onClick: onDelete,
                    children: <DeleteOutlineIcon />,
                  }
                : undefined
            }
            desktopHeaderType="h4"
          />
          <Typography type="body" className="mb-4">
            {isLoc ? t("bankTransferCopyLoc") : t("bankTransferCopy")}
          </Typography>
          <Card className="mb-4">
            <Typography color="neutral-600" className="mb-2">
              {isLoc
                ? t("amountToDraw")
                : offer?.offerDetails?.commonOfferDetails?.isMarcusRefinance
                  ? t("additionalCapital")
                  : t("amountToWithdraw")}
            </Typography>
            <Typography type="h4">
              {format(
                offer?.offerDetails?.commonOfferDetails?.isMarcusRefinance
                  ? amount -
                      (offer.offerDetails.commonOfferDetails
                        .amountToRefinanceMarcusLoan || 0)
                  : amount,
                currency,
                {
                  minimumFractionDigits: 0,
                }
              )}
            </Typography>
          </Card>
          <Typography
            type="bodyTitle"
            className="mt-4 mb-2"
            color="neutral-600"
          >
            {t("selectBankAccount")}
          </Typography>
          <BankAccountSelection
            disabled={false}
            onChange={async (account) => {
              setValue("accountId", account.id!)
              setValue("account", account)
              await trigger()
            }}
            isChecked={(accountId) => formValues.accountId === accountId}
          />
          {bankAccountsQuery.data?.length === 0 ? (
            <ListItemContainer size="sm">
              <ListItemLarge
                icon={<AddIcon />}
                more={{
                  onClick: () => {
                    onAddBankAccount(formValues)
                  },
                  type: "button",
                }}
                title={t("addBankAccount")}
              />
            </ListItemContainer>
          ) : (
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  onAddBankAccount(formValues)
                }}
              >
                {t("addNewBank")}
              </Button>
            </div>
          )}

          <ApiErrorAlert className="mt-4" error={error} />
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup onClickBack={onBack}>
            {onSkip && (
              <SkipStepButton onClick={onSkip} ctaCopy={t("withdrawLater")} />
            )}
            <Button
              type="submit"
              disabled={!formState.isValid}
              loading={isLoading}
            >
              {t("cta")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default DrawDepositMethodFormDefault
