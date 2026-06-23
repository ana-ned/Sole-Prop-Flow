import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import Select from "../../../../components/Forms/Select"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import ListItemInput from "../../../../components/UI/ListItemInput"
import PageBar from "../../../../components/UI/PageBar"
import { useTracking } from "../../../../hooks/useTracking"
import countries from "../../../../models/countries"
import { ReactComponent as DeleteOutlineIcon } from "../../../../svgs/delete-outline.svg"
import { TransferType } from "../../../../types/Country.types"
import { getCurrencyList } from "../../../../utils/currency"
import AbaRoutingNumber from "../../../../utils/validator-rules/aba-routing-number"
import Alphanumeric from "../../../../utils/validator-rules/alphanumeric"
import BetweenLength from "../../../../utils/validator-rules/between-length"
import Exact from "../../../../utils/validator-rules/exact"
import Iban from "../../../../utils/validator-rules/iban"
import OnlyDigits from "../../../../utils/validator-rules/only-digits"
import SwiftBic from "../../../../utils/validator-rules/swift-bic"
import {
  NewVendorFormSchema,
  supportedCurrencies,
  TSupportedCurrency,
} from "../../pages/new.schema"

const supportedCountriesOfAccount = countries.filter(
  (country) => country.transferType
)

const availableAccountFields = [
  "accountNumber",
  "routingNumber",
  "iban",
  "sortCode",
  "swiftBic",
  "branchCode",
  "bankCode",
  "ifscCode",
  "bsbCode",
] as const

type AccountField = (typeof availableAccountFields)[number]

const getAccountFields = (
  transferType: TransferType,
  countryOfAccount: string,
  currency: TSupportedCurrency
): AccountField[] => {
  let fields: AccountField[] = []

  if (countryOfAccount === "CAN" && currency === "CAD") {
    fields = [...fields, "branchCode"]
  }

  if (countryOfAccount === "IND" && currency === "INR") {
    fields = [...fields, "ifscCode"]
  }

  if (countryOfAccount === "AUS" && currency === "AUD") {
    fields = [...fields, "bsbCode"]
  }

  if (
    (countryOfAccount === "CAN" && currency === "CAD") ||
    (countryOfAccount === "NOR" && currency === "NOK") ||
    (countryOfAccount === "DNK" && currency === "DKK") ||
    (countryOfAccount === "HKG" && currency === "HKD") ||
    (countryOfAccount === "SWE" && currency === "SEK")
  ) {
    fields = [...fields, "bankCode"]
  }

  if (transferType === "ABA") {
    fields = [...fields, "accountNumber", "routingNumber"]
  }

  if (transferType === "IBAN") {
    fields = [...fields, "iban", "swiftBic"]
  }

  if (transferType === "SORT_CODE") {
    fields = [...fields, "accountNumber", "sortCode"]
  }

  if (transferType === "SWIFT") {
    fields = [...fields, "accountNumber", "swiftBic"]
  }

  return fields
}

const schema = yup.object().shape({
  transferType: yup.string(),
  countryOfAccount: yup.string().required(),
  currency: yup.string().required(),
  accountNumber: yup
    .string()
    .trim()
    .when("transferType", ([transferType], newSchema) => {
      if (transferType === "ABA") {
        return newSchema
          .required()
          .test(OnlyDigits())
          .test(BetweenLength(6, 17))
      }

      if (transferType === "SWIFT") {
        return newSchema.required().test(BetweenLength(6, 30))
      }

      if (transferType === "SORT_CODE") {
        return newSchema.required().test(OnlyDigits()).test(BetweenLength(6, 8))
      }

      return newSchema
    }),
  sortCode: yup
    .string()
    .trim()
    .when("transferType", ([transferType], newSchema) => {
      if (transferType === "SORT_CODE") {
        return newSchema.required().test(OnlyDigits()).test(Exact(6))
      }

      return newSchema
    }),
  iban: yup
    .string()
    .trim()
    .when("transferType", ([transferType], newSchema) => {
      if (transferType === "IBAN") {
        return newSchema.required().test(Iban())
      }

      return newSchema
    }),
  swiftBic: yup
    .string()
    .trim()
    .when("transferType", ([transferType], newSchema) => {
      if (transferType === "SWIFT" || transferType === "IBAN") {
        return newSchema.required().test(SwiftBic())
      }

      return newSchema
    }),
  routingNumber: yup
    .string()
    .trim()
    .when("transferType", ([transferType], newSchema) => {
      if (transferType === "ABA") {
        return newSchema
          .required()
          .test(OnlyDigits())
          .test(Exact(9))
          .test(AbaRoutingNumber())
      }

      return newSchema
    }),
  branchCode: yup
    .string()
    .trim()
    .when(
      ["countryOfAccount", "currency"],
      ([countryOfAccount, currency], newSchema) => {
        if (countryOfAccount === "CAN" && currency === "CAD") {
          return newSchema.required().test(OnlyDigits()).test(Exact(5))
        }

        return newSchema
      }
    ),
  bankCode: yup
    .string()
    .trim()
    .when(
      ["countryOfAccount", "currency"],
      ([countryOfAccount, currency], newSchema) => {
        if (countryOfAccount === "CAN" && currency === "CAD") {
          return newSchema.required().test(OnlyDigits()).test(Exact(3))
        }

        if (countryOfAccount === "DNK" && currency === "DKK") {
          return newSchema.required().test(OnlyDigits()).test(Exact(4))
        }

        if (countryOfAccount === "NOR" && currency === "NOK") {
          return newSchema.required().test(OnlyDigits()).test(Exact(4))
        }

        if (countryOfAccount === "HKG" && currency === "HKD") {
          return newSchema.required().test(Alphanumeric()).test(Exact(3))
        }

        if (countryOfAccount === "SWE" && currency === "SEK") {
          return newSchema
            .required()
            .test(OnlyDigits())
            .test(BetweenLength(4, 5))
        }

        return newSchema
      }
    ),
  ifscCode: yup
    .string()
    .trim()
    .when(
      ["countryOfAccount", "currency"],
      ([countryOfAccount, currency], newSchema) => {
        if (countryOfAccount === "IND" && currency === "INR") {
          return newSchema
            .required()
            .matches(/^[A-Za-z]{4}[\dA-Za-z]{7}$/, "Invalid IFSC code")
        }

        return newSchema
      }
    ),
  bsbCode: yup
    .string()
    .trim()
    .when(
      ["countryOfAccount", "currency"],
      ([countryOfAccount, currency], newSchema) => {
        if (countryOfAccount === "AUS" && currency === "AUD") {
          return newSchema.required().test(OnlyDigits()).test(Exact(6))
        }

        return newSchema
      }
    ),
})

const PaymentDetailsStep = ({
  data,
  onSubmit,
  onDelete,
  onBack,
}: StepProps<NewVendorFormSchema> & { onDelete: () => void }) => {
  const { t } = useTranslation("pay", {
    keyPrefix: "newVendor.paymentDetailsStep",
  })
  const { trackEvent } = useTracking()

  const { control, handleSubmit, formState, watch, setValue } =
    useForm<NewVendorFormSchema>({
      // @ts-expect-error: fix yup schema to infer ts types: https://github.com/react-hook-form/resolvers/releases/tag/v3.1.1
      resolver: yupResolver(schema),
      defaultValues: {
        ...data,
        countryOfAccount: data?.countryOfAccount || data?.address?.country,
      },
      mode: "onBlur",
    })

  const countryOfAccount = watch("countryOfAccount")
  const transferType = watch("transferType")
  const availableTransferTypes = watch("availableTransferType")

  const isAccountFieldVisible = (field: AccountField) =>
    getAccountFields(
      transferType,
      countryOfAccount,
      watch("currency")
    ).includes(field)

  useEffect(() => {
    const country = supportedCountriesOfAccount.find(
      (item) => item["alpha-3"] === countryOfAccount
    )

    if (country?.transferType) {
      setValue(
        "availableTransferType",
        Array.isArray(country.transferType)
          ? country.transferType
          : [country.transferType]
      )

      setValue(
        "transferType",
        Array.isArray(country.transferType)
          ? country.transferType[0]
          : country.transferType
      )
    }

    if (country?.currency && supportedCurrencies.includes(country.currency)) {
      setValue("currency", country.currency)
    }
  }, [countryOfAccount, setValue])

  const beforeSubmit = (formData: NewVendorFormSchema) => {
    availableAccountFields.forEach((field) => {
      if (!isAccountFieldVisible(field)) {
        formData[field] = undefined
      }
    })

    trackEvent({
      category: "pay",
      name: "new-payee-payment-details",
      action: "submit",
    })

    onSubmit?.(formData)
  }

  return (
    <FormLayout>
      <PageBar
        title={t("title")}
        onClickBack={onBack}
        actionButton={{
          onClick: onDelete,
          children: <DeleteOutlineIcon />,
        }}
      />

      <form onSubmit={handleSubmit(beforeSubmit)}>
        <FormLayout.Content>
          <FormControl>
            <Select
              label={t("countryOfAccount")}
              name="countryOfAccount"
              searchable
              control={control}
              options={supportedCountriesOfAccount.map((item) => ({
                value: item["alpha-3"],
                label: item.name,
                entity: item,
              }))}
            />
          </FormControl>
          <FormControl>
            <Select
              label={t("currency")}
              name="currency"
              searchable
              options={getCurrencyList(supportedCurrencies).map((currency) => ({
                value: currency.value,
                label: `${currency.symbol} ${currency.name}`,
                entity: currency,
              }))}
              control={control}
            />
          </FormControl>
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
          {!!availableTransferTypes && availableTransferTypes.length > 1 && (
            <>
              <Typography type="bodyTitle" color="neutral-600" className="mb-2">
                {t("bankDetails")}
              </Typography>
              <ListItemContainer className="mb-6">
                {availableTransferTypes.map((type) => (
                  <ListItemInput
                    key={type}
                    onChange={() => {
                      setValue("transferType", type, {
                        shouldValidate: true,
                      })
                    }}
                    title={t(`transferTypes.${type}`, { defaultValue: type })}
                    type="radio"
                    checked={transferType === type}
                    value={type}
                  />
                ))}
              </ListItemContainer>
            </>
          )}
          {isAccountFieldVisible("iban") && (
            <FormControl>
              <Input label={t("iban")} name="iban" control={control} />
            </FormControl>
          )}
          {isAccountFieldVisible("accountNumber") && (
            <FormControl>
              <Input
                label={t("accountNumber")}
                name="accountNumber"
                type={
                  ["SORT_CODE", "ABA"].includes(transferType)
                    ? "number"
                    : "text"
                }
                control={control}
                inputMode={
                  ["SORT_CODE", "ABA"].includes(transferType)
                    ? "numeric"
                    : undefined
                }
              />
            </FormControl>
          )}
          {isAccountFieldVisible("swiftBic") && (
            <FormControl>
              <Input label={t("swiftBic")} name="swiftBic" control={control} />
            </FormControl>
          )}
          {isAccountFieldVisible("sortCode") && (
            <FormControl>
              <Input
                label={t("sortCode")}
                name="sortCode"
                type="number"
                control={control}
                inputMode="numeric"
              />
            </FormControl>
          )}
          {isAccountFieldVisible("routingNumber") && (
            <FormControl>
              <Input
                label={t("routingNumber")}
                name="routingNumber"
                type="number"
                control={control}
                inputMode="numeric"
              />
            </FormControl>
          )}
          {isAccountFieldVisible("branchCode") && (
            <FormControl>
              <Input
                label={t("branchCode")}
                type="number"
                name="branchCode"
                control={control}
                inputMode="numeric"
              />
            </FormControl>
          )}
          {isAccountFieldVisible("bankCode") && (
            <FormControl>
              <Input label={t("bankCode")} name="bankCode" control={control} />
            </FormControl>
          )}
          {isAccountFieldVisible("ifscCode") && (
            <FormControl>
              <Input label={t("ifscCode")} name="ifscCode" control={control} />
            </FormControl>
          )}
          {isAccountFieldVisible("bsbCode") && (
            <FormControl>
              <Input
                label={t("bsbCode")}
                type="number"
                name="bsbCode"
                control={control}
                inputMode="numeric"
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

export default PaymentDetailsStep
