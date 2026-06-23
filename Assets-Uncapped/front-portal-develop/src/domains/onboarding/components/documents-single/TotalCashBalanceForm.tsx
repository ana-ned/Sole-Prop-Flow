import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import MultipleRadio from "../../../../components/Forms/MultipleRadio"
import Select from "../../../../components/Forms/Select"
import Alert from "../../../../components/UI/Alert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import {
  TotalCashBalanceDocumentRequest,
  TotalCashBalanceDocumentRequestAdditionalCashEnum,
} from "../../../../services/api/organisation-users"
import { getCurrencyList } from "../../../../utils/currency"

const TotalCashBalanceForm = ({
  onSubmit,
}: {
  onSubmit: (data: TotalCashBalanceDocumentRequest) => void
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "documents.totalCashBalance.form",
  })

  const { control, handleSubmit, watch, formState, resetField } =
    useForm<TotalCashBalanceDocumentRequest>({
      // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
      resolver: yupResolver(
        yup.object().shape({
          currency: yup.string().required(),
          totalCashBalance: yup
            .number()
            .typeError("${path} must be a number")
            .required(),
          additionalCash: yup.string().required(),
          totalAmountDueIn: yup.number().when("additionalCash", {
            is: TotalCashBalanceDocumentRequestAdditionalCashEnum.WaitingForPaymentsIn2Weeks,
            then: (s) => s.typeError("${path} must be a number").required(),
          }),
        })
      ),
      mode: "all",
    })

  const additionalCash = watch("additionalCash")
  const currency = watch("currency")

  const currencySymbol = getCurrencyList().find(
    (item) => item.value === currency
  )?.symbol

  useEffect(() => {
    if (
      additionalCash !==
      TotalCashBalanceDocumentRequestAdditionalCashEnum.WaitingForPaymentsIn2Weeks
    ) {
      resetField("totalAmountDueIn")
    }
  }, [additionalCash, resetField])

  return (
    <FormLayout>
      <Typography type="body" className="mb-3">
        {t("cashBalanceInformation")}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout.Content>
          <FormControl>
            <Select
              label={t("currency")}
              name="currency"
              searchable
              options={getCurrencyList().map((item) => ({
                value: item.value,
                label: `${item.symbol} ${item.name}`,
              }))}
              control={control}
            />
          </FormControl>

          <FormControl>
            <Input
              control={control}
              type="number"
              name="totalCashBalance"
              label={t("balance")}
              renderType="currency"
              currency={currencySymbol}
            />
          </FormControl>

          <Alert className="mb-3">{t("alert")}</Alert>

          <FormControl>
            <MultipleRadio
              label={t("cash")}
              name="additionalCash"
              options={[
                {
                  value:
                    TotalCashBalanceDocumentRequestAdditionalCashEnum.WaitingForPaymentsIn2Weeks,
                  label: t(
                    `cashOptions.${TotalCashBalanceDocumentRequestAdditionalCashEnum.WaitingForPaymentsIn2Weeks}`
                  ),
                },
                {
                  value:
                    TotalCashBalanceDocumentRequestAdditionalCashEnum.NotWaitingOnPaymentsIn2Weeks,
                  label: t(
                    `cashOptions.${TotalCashBalanceDocumentRequestAdditionalCashEnum.NotWaitingOnPaymentsIn2Weeks}`
                  ),
                },
              ]}
              control={control}
            />
          </FormControl>

          {additionalCash ===
            TotalCashBalanceDocumentRequestAdditionalCashEnum.WaitingForPaymentsIn2Weeks && (
            <FormControl>
              <Input
                control={control}
                type="number"
                name="totalAmountDueIn"
                label={t("amountDue")}
                renderType="currency"
                currency={currencySymbol}
              />
            </FormControl>
          )}
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup>
            <Button type="submit" disabled={!formState.isValid}>
              {t("submit")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default TotalCashBalanceForm
