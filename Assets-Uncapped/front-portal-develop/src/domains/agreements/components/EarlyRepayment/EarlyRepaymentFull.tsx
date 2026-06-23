import { yupResolver } from "@hookform/resolvers/yup"
import { useQuery } from "@tanstack/react-query"
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
import ApiErrorAlert from "../../../../components/Functional/ApiErrorAlert"
import Alert from "../../../../components/UI/Alert"
import Card from "../../../../components/UI/Card"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import SimpleTable from "../../../../components/UI/SimpleTable"
import useAuth from "../../../../hooks/useAuth"
import useBalances from "../../../../hooks/useBalances"
import { EarlyRepaymentsControllerApi } from "../../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import { format } from "../../../../utils/money"
import useEarlyRepaymentsMutation from "../../hooks/useEarlyRepaymentsMutation"
import EarlyRepaymentSuccessModal from "../EarlyRepaymentSuccessModal/EarlyRepaymentSuccessModal"

const EarlyRepaymentFull = ({ backUrl }: { backUrl: string }) => {
  const auth = useAuth()
  const { t } = useTranslation("agreements", { keyPrefix: "EarlyRepayment" })
  const params = useParams<{ agreementId: string }>()
  const balanceQuery = useBalances()
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        agreement: yup.boolean().when([], {
          is: true,
          then: (s) => s.oneOf([true], ""),
        }),
      })
    ),
    mode: "onBlur",
  })

  const repaymentQuery = useQuery({
    queryKey: ["EARLY-REPAYMENT", params.agreementId],
    queryFn: async () =>
      new EarlyRepaymentsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).checkEarlyRepaymentTerms({
        xXORGID: auth.organisation?.organisationId!,
        agreementId: params.agreementId!,
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!params.agreementId,
  })

  const requestRepaymentMutation = useEarlyRepaymentsMutation()

  if (repaymentQuery.isLoading || balanceQuery.isLoading) {
    return <PageLoader />
  }

  const balance = balanceQuery.data?.balances?.find(
    (item) => item.agreementId === params.agreementId
  )

  return (
    <>
      <PageBar title={t("title")} backUrl={backUrl} desktopHeaderType="h4" />
      <FormLayout>
        <form
          onSubmit={handleSubmit(async () => {
            await requestRepaymentMutation.mutateAsync({
              agreementId: params.agreementId!,
            })
          })}
        >
          <FormLayout.Content className="flex flex-col gap-y-4">
            <Typography>{t("copy")}</Typography>
            <ApiErrorAlert
              error={requestRepaymentMutation.error as unknown as Response}
            />
            <Card>
              <Typography color="neutral-700">
                {t("amountToBeCollected")}
              </Typography>
              <Typography className="mt-2 mb-4" type="h4" color="neutral-800">
                {format(
                  repaymentQuery.data?.amountToRepay!,
                  balance?.currency!,
                  {
                    minimumFractionDigits: 0,
                  }
                )}
              </Typography>
              <SimpleTable
                colorHeading="neutral-700"
                className="[&_tr_th]:p-0! [&_tr:not(:first-child)_th]:pt-2!"
                data={[
                  {
                    th: t("remainingBalance"),
                    td: format(
                      balance?.values?.CURRENT_TO_REPAY!,
                      balance?.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    ),
                  },
                  {
                    th: t("rebate"),
                    td: format(
                      repaymentQuery.data?.discount!,
                      balance?.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    ),
                  },
                ]}
              />
            </Card>
            <Alert type="info">{t("alert")}</Alert>
          </FormLayout.Content>
          <FormLayout.Footer>
            <FormControl>
              <Checkbox
                control={control}
                name="agreement"
                label={t("agreement")}
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

export default EarlyRepaymentFull
