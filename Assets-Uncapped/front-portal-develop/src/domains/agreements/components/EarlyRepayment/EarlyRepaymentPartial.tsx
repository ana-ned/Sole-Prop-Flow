import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import Checkbox from "../../../../components/Forms/Checkbox"
import FormControl from "../../../../components/Forms/FormControl"
import SliderInput from "../../../../components/Forms/SliderInput"
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import Card from "../../../../components/UI/Card"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import SimpleTable from "../../../../components/UI/SimpleTable"
import useAgreements from "../../../../hooks/useAgreements"
import { format, roundCurrency } from "../../../../utils/money"
import useEarlyRepaymentsMutation from "../../hooks/useEarlyRepaymentsMutation"
import useLedgerBalance, {
  getLedgerBalanceQueryKey,
} from "../../hooks/useLedgerBalance"
import EarlyRepaymentSuccessModal from "../EarlyRepaymentSuccessModal/EarlyRepaymentSuccessModal"

const EarlyRepaymentPartial = ({ backUrl }: { backUrl: string }) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "EarlyRepaymentPartial",
  })
  const params = useParams<{ agreementId: string }>()
  const agreements = useAgreements()
  const agreement = agreements.data?.find((el) => el.id === params.agreementId!)
  const queryClient = useQueryClient()
  const ledgerBalance = useLedgerBalance({
    agreementId: params.agreementId!,
  })
  const { control, handleSubmit, formState, setValue, watch } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        amount: yup.number().required().min(1),
        agreement: yup.boolean().when([], {
          is: true,
          then: (s) => s.oneOf([true], ""),
        }),
      })
    ),
    mode: "onBlur",
  })

  const maxAmount = roundCurrency(
    (ledgerBalance.data?.currentPrincipal || 0) +
      (ledgerBalance.data?.currentInterest || 0) +
      (ledgerBalance.data?.currentFees || 0)
  )

  useEffect(() => {
    setValue("amount", maxAmount)
  }, [maxAmount, setValue])

  const amount = watch("amount")

  const requestRepaymentMutation = useEarlyRepaymentsMutation()

  if (ledgerBalance.isLoading || agreements.isLoading) {
    return <PageLoader />
  }

  const isMaxAmount = amount === maxAmount

  return (
    <>
      <PageBar title={t("title")} backUrl={backUrl} desktopHeaderType="h4" />
      <FormLayout>
        <form
          onSubmit={handleSubmit(async () => {
            await requestRepaymentMutation.mutateAsync({
              agreementId: params.agreementId!,
              amount: isMaxAmount
                ? roundCurrency(
                    (ledgerBalance.data?.currentPrincipal || 0) +
                      (ledgerBalance.data?.currentInterest || 0)
                  )
                : amount,
            })
            await queryClient.invalidateQueries({
              queryKey: getLedgerBalanceQueryKey(params.agreementId!),
            })
          })}
        >
          <FormLayout.Content className="flex flex-col gap-y-4">
            <Typography>{t("copy")}</Typography>
            <ApiErrorAlert
              error={requestRepaymentMutation.error as unknown as Response}
            />
            <Card>
              <SliderInput
                label={t("amountToRepay")}
                currency={agreement?.currency}
                name="amount"
                control={control}
                min={100}
                max={maxAmount}
                roundedStep={false}
                customStep={0.01}
              />
            </Card>
            <Card>
              <SimpleTable
                colorHeading="neutral-700"
                className="[&_tr_th]:p-0! [&_tr:not(:first-child)_th]:pt-2!"
                data={[
                  {
                    th: t("outstandingPrincipalBalance"),
                    td: format(
                      ledgerBalance.data?.currentPrincipal!,
                      agreement?.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    ),
                  },
                  {
                    th: t("interestBalance"),
                    td: format(
                      ledgerBalance.data?.currentInterest!,
                      agreement?.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    ),
                  },

                  ...(ledgerBalance.data?.currentFees
                    ? [
                        {
                          th: t("fees"),
                          td: format(
                            ledgerBalance.data.currentFees,
                            agreement?.currency!,
                            {
                              minimumFractionDigits: 0,
                            }
                          ),
                        },
                      ]
                    : []),
                  ...(isMaxAmount
                    ? [
                        {
                          th: (
                            <Typography type="bodyTitle">
                              {t("payOffFull")}
                            </Typography>
                          ),
                          td: format(maxAmount, agreement?.currency!, {
                            minimumFractionDigits: 0,
                          }),
                        },
                      ]
                    : []),
                ]}
              />
            </Card>
            {!isMaxAmount && (
              <Card>
                <SimpleTable
                  colorHeading="neutral-700"
                  className="[&_tr_th]:p-0! [&_tr:not(:first-child)_th]:pt-2!"
                  data={[
                    {
                      th: (
                        <Typography type="bodyTitle">
                          {t("repaymentAmount")}
                        </Typography>
                      ),
                      td: format(amount, agreement?.currency!, {
                        minimumFractionDigits: 0,
                      }),
                    },
                    {
                      th: (
                        <Typography className="pl-8">
                          {t("paidToInterest")}
                        </Typography>
                      ),
                      td: format(
                        Math.min(amount, ledgerBalance.data?.currentInterest!),
                        agreement?.currency!,
                        {
                          minimumFractionDigits: 0,
                        }
                      ),
                    },
                    ...(amount > ledgerBalance.data?.currentInterest! &&
                    ledgerBalance.data?.currentFees! > 0
                      ? [
                          {
                            th: (
                              <Typography className="pl-8">
                                {t("fees")}
                              </Typography>
                            ),
                            td: format(
                              amount -
                                (ledgerBalance.data?.currentInterest! || 0) <
                                ledgerBalance.data?.currentFees!
                                ? amount -
                                    (ledgerBalance.data?.currentInterest! || 0)
                                : ledgerBalance.data?.currentFees!,
                              agreement?.currency!,
                              {
                                minimumFractionDigits: 0,
                              }
                            ),
                          },
                        ]
                      : []),
                    ...(amount >
                    (ledgerBalance.data?.currentInterest || 0) +
                      (ledgerBalance.data?.currentFees || 0)
                      ? [
                          {
                            th: (
                              <Typography className="pl-8">
                                {t("paidToPrincipal")}
                              </Typography>
                            ),
                            td: format(
                              amount -
                                (ledgerBalance.data?.currentInterest || 0) -
                                (ledgerBalance.data?.currentFees || 0),
                              agreement?.currency!,
                              {
                                minimumFractionDigits: 0,
                              }
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
              </Card>
            )}
          </FormLayout.Content>
          <FormLayout.Footer>
            <FormControl>
              <Checkbox
                control={control}
                name="agreement"
                label={isMaxAmount ? t("agreementMax") : t("agreement")}
              />
            </FormControl>
            <ButtonGroup>
              <Button
                type="submit"
                loading={requestRepaymentMutation.isPending}
                disabled={!formState.isValid}
              >
                {t("cta")}
              </Button>
            </ButtonGroup>
          </FormLayout.Footer>
        </form>
      </FormLayout>
      <EarlyRepaymentSuccessModal isOpen={requestRepaymentMutation.isSuccess} />
    </>
  )
}

export default EarlyRepaymentPartial
