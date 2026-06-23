import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { add, isWeekend, nextMonday, isFriday, isAfter } from "date-fns"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import Checkbox from "../../../../components/Forms/Checkbox"
import DatePicker from "../../../../components/Forms/DatePicker"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import Alert from "../../../../components/UI/Alert"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import PageBar from "../../../../components/UI/PageBar"
import { useTracking } from "../../../../hooks/useTracking"
import {
  BillVendorDTO,
  BillVendorDTOStatusEnum,
} from "../../../../services/api/loan-operations"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { formatDate } from "../../../../utils/date"
import { currencyToSymbol, format } from "../../../../utils/money"
import { titleCase } from "../../../../utils/string"
import {
  ACH_REFERENCE_MAX_LENGTH,
  DetailsStepSchema,
  PayFormSchema,
  isACHPayment,
} from "../../pages/_pay.schema"

const FORM_DATE_FORMAT = "yyyy-MM-dd"

const disableFridayDueToWeekendInUtc = () => {
  const currentDateTime = new Date()
  const targetTime = new Date()

  targetTime.setUTCHours(22)
  targetTime.setUTCMinutes(0)
  targetTime.setUTCSeconds(0)
  targetTime.setUTCMilliseconds(0)

  return isFriday(currentDateTime) && isAfter(currentDateTime, targetTime)
}

const getDefaultSendDate = (vendor: BillVendorDTO) => {
  if (isWeekend(new Date())) {
    return nextMonday(new Date())
  }

  if (
    vendor.status === BillVendorDTOStatusEnum.Approved &&
    !disableFridayDueToWeekendInUtc()
  ) {
    return new Date()
  }

  const date = add(new Date(), { days: 1 })

  return isWeekend(date) ? nextMonday(new Date()) : date
}

const DetailsStep = ({
  data,
  onSubmit,
  onDelete,
  reset,
}: StepProps<PayFormSchema> & {
  onDelete: () => void
}) => {
  const { t } = useTranslation("pay", { keyPrefix: "index.detailsStep" })
  const { trackEvent } = useTracking()

  const { control, handleSubmit, formState, watch, setValue } = useForm({
    resolver: yupResolver(DetailsStepSchema),
    defaultValues: data,
    mode: "onBlur",
  })

  const amount = watch("amount")
  const reference = watch("reference") || ""

  const isTrusted =
    data?.selectedVendor.status === BillVendorDTOStatusEnum.Approved

  const defaultSendDate = formatDate(
    getDefaultSendDate(data?.selectedVendor!),
    {
      customFormat: FORM_DATE_FORMAT,
    }
  )

  useEffect(() => {
    if (reference.length <= ACH_REFERENCE_MAX_LENGTH) {
      setValue("swift", false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference])

  const isExchangedTransfer =
    data?.availableBalance.currency !== data?.selectedVendor.currency

  const exchangedAmount = isExchangedTransfer
    ? amount /
      (data?.availableExchangeRates[data.selectedVendor.currency!] || 1)
    : 0

  return (
    <FormLayout>
      <PageBar
        title={data?.selectedVendor.name}
        subTitle={
          data?.hasSimplifiedPricing
            ? undefined
            : t("subtitle", {
                category: titleCase(data?.selectedVendor.category || ""),
              })
        }
        onClickBack={reset}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />

      <form
        onSubmit={handleSubmit((formData) => {
          trackEvent({
            category: "pay",
            name: "payment",
            action: "review",
          })
          onSubmit?.(formData)
        })}
      >
        <FormLayout.Content>
          <FormControl>
            <Input
              label={t("amount")}
              name="amount"
              control={control}
              renderType="currency"
              currency={currencyToSymbol(data?.selectedVendor.currency!)}
            />
            {isExchangedTransfer && !!amount && (
              <div className="mt-3 mb-5 flex items-center gap-x-4">
                <div className="w-full">
                  <Typography type="body" color="neutral-600">
                    {t("exchangeAmount")}
                  </Typography>
                </div>
                <div className="w-auto" data-testid="exchange-amount">
                  <Typography type="smallCopy" color="primary">
                    {format(exchangedAmount, data?.availableBalance.currency!)}
                  </Typography>
                </div>
              </div>
            )}
          </FormControl>
          <FormControl>
            <Input
              label={t("reference")}
              name="reference"
              control={control}
              helpText={
                isACHPayment(data?.selectedVendor)
                  ? t("referenceAchHelper")
                  : undefined
              }
              charCount={
                isACHPayment(data?.selectedVendor)
                  ? ACH_REFERENCE_MAX_LENGTH
                  : undefined
              }
              charCountAlertOver={ACH_REFERENCE_MAX_LENGTH}
            />
          </FormControl>
          <FormControl>
            <DatePicker
              label={t("sendDate")}
              name="sendDate"
              control={control}
              pastRestrict
              restrictToday={!isTrusted || disableFridayDueToWeekendInUtc()}
              futureDayLimit={90}
              defaultValue={data?.sendDate || defaultSendDate}
              defaultValueFormat={FORM_DATE_FORMAT}
              excludeWeekends
            />
          </FormControl>
          <Alert>{isTrusted ? t("alertTrusted") : t("alertNew")}</Alert>
          {isACHPayment(data?.selectedVendor) &&
            reference.length > ACH_REFERENCE_MAX_LENGTH && (
              <>
                <Alert
                  type="warning"
                  title={t("alertSwiftTitle")}
                  className="my-4"
                >
                  {t("alertSwiftContent")}
                </Alert>
                <FormControl>
                  <Checkbox label={t("swift")} name="swift" control={control} />
                </FormControl>
              </>
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

export default DetailsStep
