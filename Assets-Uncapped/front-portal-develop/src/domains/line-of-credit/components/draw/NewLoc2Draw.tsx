import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import * as yup from "yup"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import SliderInput from "../../../../components/Forms/SliderInput"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import AmountBar from "../../../../components/UI/AmountBar"
import Card from "../../../../components/UI/Card"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import Layout from "../../../../components/UI/Layout"
import PageBar from "../../../../components/UI/PageBar"
import PortalMenu from "../../../../components/UI/PortalMenu"
import Widget from "../../../../components/UI/Widget"
import { format } from "../../../../utils/money"
import BetweenAmount from "../../../../utils/validator-rules/between-amount"
import useLedgerBalance from "../../../agreements/hooks/useLedgerBalance"
import CreditLimitCalculationWidgetContainer from "./CreditLimitCalculationWidgetContainer"

const NewLoc2Draw = ({ onSubmit, data }: StepProps) => {
  const { t } = useTranslation("line-of-credit", { keyPrefix: "NewLoc2Draw" })
  const navigate = useNavigate()

  const agreementId = data.lineOfCredit?.agreementId.id
  const ledgerBalanceQuery = useLedgerBalance({
    agreementId: agreementId!,
    enabled: !!agreementId,
  })

  const minDrawAmount =
    data.lineOfCredit?.drawParameters?.minimumDrawAmount?.amount! >
    data.lineOfCredit?.balance?.available?.amount!
      ? data.lineOfCredit?.balance?.available?.amount!
      : data.lineOfCredit?.drawParameters?.minimumDrawAmount?.amount! || 0

  const maxDrawAmount = data.lineOfCredit?.balance?.available?.amount || 0
  const amount = data.amount
  const currency = data.lineOfCredit?.limit?.currency!
  const drawnAmount = ledgerBalanceQuery.data?.currentPrincipal || 0
  const growToUnlock =
    (data.lineOfCredit?.maxCreditLimit ?? 0) -
    (data.lineOfCredit?.currentAvailableCreditLimit ?? 0)

  const { control, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .string()
          .required()
          .test(BetweenAmount(minDrawAmount, maxDrawAmount, currency)),
      })
    ),
    mode: "onBlur",
  })

  useEffect(() => {
    if (maxDrawAmount) {
      setValue("amount", String(maxDrawAmount), { shouldValidate: true })
    }

    if (amount) {
      setValue("amount", String(amount), { shouldValidate: true })
    }
  }, [setValue, maxDrawAmount, amount])

  return (
    <Layout menu={<PortalMenu menuOnMobile={false} />}>
      <Layout.Parent>
        <FormLayout>
          <form
            onSubmit={handleSubmit((formData) => {
              onSubmit!({
                ...formData,
              })
            })}
          >
            <FormLayout.Content className="flex flex-col gap-4">
              <PageBar
                title={t("title")}
                onClickBack={async () => {
                  await navigate(data.backUrl)
                }}
                desktopHeaderType="h4"
              />
              <Widget
                icon={
                  <BoxIcon
                    severity="accent-1"
                    icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
                  />
                }
                title={t("widgetTitle")}
              >
                <div className="flex flex-col gap-4">
                  <Typography>{t("copy")}</Typography>

                  <Card>
                    <div className="flex flex-col gap-3">
                      <AmountBar
                        currency={currency}
                        segments={[
                          {
                            amount: drawnAmount,
                            label: t("drawn"),
                            color: "neutral-800",
                          },
                          {
                            amount: maxDrawAmount,
                            label: t("availableToDraw"),
                            color: "brand-600",
                            emphasis: true,
                          },
                          {
                            amount: growToUnlock,
                            label: t("growToUnlock"),
                            color: "brand-300",
                            stripeColor: "brand-600",
                          },
                        ]}
                      />
                      {minDrawAmount === maxDrawAmount ? (
                        <Typography type="bodyTitle">
                          {t("amount")}: {format(maxDrawAmount, currency)}
                        </Typography>
                      ) : (
                        <div>
                          <SliderInput
                            label={t("amount")}
                            name="amount"
                            control={control}
                            min={minDrawAmount}
                            max={maxDrawAmount}
                            currency={currency}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </Widget>
              <CreditLimitCalculationWidgetContainer
                agreementId={agreementId}
                currency={currency}
                multiplier={data.lineOfCredit?.availableCreditLimitMultiplier}
                maximumCreditLimit={data.lineOfCredit?.maxCreditLimit || 0}
                creditLimit={
                  data.lineOfCredit?.currentAvailableCreditLimit || 0
                }
              />
              <Button type="submit" disabled={!formState.isValid}>
                {t("cta")}
              </Button>
            </FormLayout.Content>
          </form>
        </FormLayout>
      </Layout.Parent>
    </Layout>
  )
}

export default NewLoc2Draw
