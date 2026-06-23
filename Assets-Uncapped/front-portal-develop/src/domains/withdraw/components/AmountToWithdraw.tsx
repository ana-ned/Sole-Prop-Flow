import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import PageLoader from "../../../components/Collections/PageLoader"
import SliderInput from "../../../components/Forms/SliderInput"
import { StepProps } from "../../../components/Headless/MultistepForm"
import BankAccountSelection from "../../../components/Shared/BankAccountSelection"
import VerifyInfo from "../../../components/Shared/UploadBankAccountStatementForm/VerifyInfo"
import Alert from "../../../components/UI/Alert"
import Card from "../../../components/UI/Card"
import FormLayout from "../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import SimpleTable from "../../../components/UI/SimpleTable"
import useAuth from "../../../hooks/useAuth"
import useBalances from "../../../hooks/useBalances"
import useBankAccounts from "../../../hooks/useBankAccounts"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  CashTransferRequestDTOTypeEnum,
  DisbursementsControllerApi,
} from "../../../services/api/loan-operations"
import { displayErrorToast } from "../../../utils/error-handling"
import { format } from "../../../utils/money"
import BetweenAmount from "../../../utils/validator-rules/between-amount"
import WithdrawSuccessModal from "./WithdrawSuccessModal"

const AmountToWithdraw = ({ onSubmit }: StepProps) => {
  const { t } = useTranslation("withdraw", { keyPrefix: "AmountToWithdraw" })
  const auth = useAuth()
  const navigate = useNavigate()

  const balancesQuery = useBalances()
  const bankAccountsQuery = useBankAccounts()

  const { control, handleSubmit, setValue, watch, formState, trigger } =
    useForm({
      resolver: yupResolver(
        yup.object().shape({
          amount: yup
            .string()
            .required()
            .test(
              BetweenAmount(
                0.01,
                balancesQuery.data?.aggregatedBalance!.values!
                  .AVAILABLE_TOTAL || 0,
                balancesQuery.data?.aggregatedBalance!.currency!
              )
            ),
          bankAccountId: yup.string().required(),
        })
      ),
      mode: "onBlur",
    })

  const disbursementMutation = useMutation({
    mutationFn: async (cashRequest: { amount: number; toAccountId: string }) =>
      new DisbursementsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).createDisbursement({
        xXORGID: auth.organisation?.organisationId!,
        cashTransferRequestDTO: {
          organisationId: auth.organisation?.organisationId!,
          type: CashTransferRequestDTOTypeEnum.Automatic,
          currencyCode: balancesQuery.data?.aggregatedBalance!.currency!,
          ...cashRequest,
        },
      }),
    onError: async (error: Response) => {
      await displayErrorToast(error)
    },
  })

  useEffect(() => {
    if (balancesQuery.data?.aggregatedBalance!.values!.AVAILABLE_TOTAL) {
      setValue(
        "amount",
        String(balancesQuery.data.aggregatedBalance.values.AVAILABLE_TOTAL)
      )
    }
  }, [balancesQuery.data?.aggregatedBalance, setValue])

  if (balancesQuery.isLoading || bankAccountsQuery.isLoading) {
    return <PageLoader />
  }

  const bankAccountId = watch("bankAccountId")

  return (
    <Layout menu={<LogoOnlyMenu />} sidebar={<VerifyInfo />}>
      <Layout.Parent>
        <FormLayout>
          <form
            onSubmit={handleSubmit(async (formData) => {
              if (
                bankAccountsQuery.data?.find(
                  (el) => el.id === formData.bankAccountId
                )?.verified
              ) {
                await disbursementMutation.mutateAsync({
                  amount: Number(formData.amount),
                  toAccountId: formData.bankAccountId,
                })
              } else {
                onSubmit?.(formData)
              }
            })}
          >
            <FormLayout.Content>
              <PageBar title={t("title")} backUrl="/" desktopHeaderType="h4" />

              <Card className="mb-4">
                <SliderInput
                  label={t("amountToWithdraw")}
                  currency={balancesQuery.data!.aggregatedBalance!.currency}
                  name="amount"
                  control={control}
                  min={0}
                  max={
                    balancesQuery.data!.aggregatedBalance!.values!
                      .AVAILABLE_TOTAL
                  }
                  roundedStep={false}
                />
                <SimpleTable
                  className="mt-4"
                  color="neutral-600"
                  data={[
                    {
                      th: t("availableToWithdraw"),
                      td: format(
                        balancesQuery.data!.aggregatedBalance!.values!
                          .AVAILABLE_TOTAL,
                        balancesQuery.data!.aggregatedBalance!.currency!
                      ),
                    },
                  ]}
                />
              </Card>
              <BankAccountSelection
                disabled={disbursementMutation.isPending}
                onChange={(account) => {
                  if (bankAccountId !== account.id) {
                    setValue("bankAccountId", account.id!)
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    trigger()
                  }
                }}
                isChecked={(id) => bankAccountId === id}
              />
              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  onClick={async () => {
                    await navigate("/withdraw/add-bank")
                  }}
                >
                  {t("addNewBank")}
                </Button>
              </div>
            </FormLayout.Content>
            <FormLayout.Footer>
              <Alert>{t("alert")}</Alert>
              <ButtonGroup>
                <Button
                  type="submit"
                  disabled={!formState.isValid}
                  loading={disbursementMutation.isPending}
                >
                  {t("continue")}
                </Button>
              </ButtonGroup>
            </FormLayout.Footer>
          </form>
        </FormLayout>
      </Layout.Parent>
      <WithdrawSuccessModal isOpen={disbursementMutation.isSuccess} />
    </Layout>
  )
}

export default AmountToWithdraw
