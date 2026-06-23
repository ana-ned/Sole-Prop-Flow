import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import * as yup from "yup"
import useAuth from "../../../hooks/useAuth"
import { BANK_ACCOUNTS_QUERY_KEY } from "../../../hooks/useBankAccounts"
import i18n from "../../../inits/i18next"
import countries from "../../../models/countries"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  Account,
  AccountsControllerApi,
} from "../../../services/api/loan-operations"
import { TransferType } from "../../../types/Country.types"
import AbaRoutingNumber from "../../../utils/validator-rules/aba-routing-number"
import BetweenLength from "../../../utils/validator-rules/between-length"
import Exact from "../../../utils/validator-rules/exact"
import Iban from "../../../utils/validator-rules/iban"
import OnlyDigits from "../../../utils/validator-rules/only-digits"
import SwiftBic from "../../../utils/validator-rules/swift-bic"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import ListItemContainer from "../../Collections/ListItemContainer"
import FormControl from "../../Forms/FormControl"
import Input from "../../Forms/Input"
import Select from "../../Forms/Select"
import FormLayout from "../../UI/FormLayout/FormLayout"
import ListItemInput from "../../UI/ListItemInput"
import PageBar from "../../UI/PageBar"

const supportedCountriesOfAccount = countries.filter(
  (country) => country.transferType
)

type AvailableAccountFields = [
  "accountNumber",
  "routingNumber",
  "iban",
  "sortCode",
  "swiftBic",
  "blz",
  "transitNumber",
]

type AccountField = AvailableAccountFields[number]

const getAccountFields = (
  transferType?: TransferType,
  countryOfAccount?: string
): AccountField[] => {
  let fields: AccountField[] = []

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

  if (countryOfAccount === "CAN") {
    fields = ["accountNumber", "transitNumber", "blz"]
  }

  return fields
}

const schema = yup.object().shape({
  transferType: yup.string(),
  availableTransferType: yup.array().of(yup.string()),
  countryOfAccount: yup.string().required(),
  accountNumber: yup
    .string()
    .trim()
    .when(
      ["transferType", "countryOfAccount"],
      ([transferType, countryOfAccount], newSchema) => {
        if (countryOfAccount === "CAN") {
          return newSchema
            .required()
            .test(OnlyDigits())
            .test(BetweenLength(7, 12))
        }

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
          return newSchema
            .required()
            .test(OnlyDigits())
            .test(BetweenLength(6, 8))
        }

        return newSchema
      }
    ),
  sortCode: yup
    .string()
    .trim()
    .when(
      ["transferType", "countryOfAccount"],
      ([transferType, countryOfAccount], newSchema) => {
        if (countryOfAccount === "CAN") {
          return newSchema.required().test(OnlyDigits()).test(Exact(5))
        }

        if (transferType === "SORT_CODE") {
          return newSchema.required().test(OnlyDigits()).test(Exact(6))
        }

        return newSchema
      }
    ),
  blz: yup
    .string()
    .trim()
    .when("countryOfAccount", ([countryOfAccount], newSchema) => {
      if (countryOfAccount === "CAN") {
        return newSchema.required().test(OnlyDigits()).test(Exact(3))
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
    .when(
      ["transferType", "countryOfAccount"],
      ([transferType, countryOfAccount], newSchema) => {
        if (
          (transferType === "SWIFT" && countryOfAccount !== "CAN") ||
          transferType === "IBAN"
        ) {
          return newSchema.required().test(SwiftBic())
        }

        return newSchema
      }
    ),
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
})

const AddBank = ({
  onSuccess,
  onClickBack,
}: {
  onSuccess: () => void
  onClickBack: () => void
}) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { t } = useTranslation("common", {
    keyPrefix: "AddBankAccountForm",
  })
  const { control, handleSubmit, formState, setValue, watch, resetField } =
    useForm({
      resolver: yupResolver(schema),
      mode: "onBlur",
      defaultValues: {
        countryOfAccount: auth.organisation?.countryCode,
      },
    })

  const resetFormInputs = () => {
    ;[
      "iban",
      "accountNumber",
      "swiftBic",
      "sortCode",
      "routingNumber",
      "blz",
    ].forEach((el) => {
      resetField(el as any)
    })
  }

  const countryOfAccount = watch("countryOfAccount")
  const transferType = watch("transferType")
  const availableTransferTypes = watch("availableTransferType")

  const isAccountFieldVisible = (field: AccountField) =>
    getAccountFields(transferType as TransferType, countryOfAccount).includes(
      field
    )

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
  }, [countryOfAccount, setValue])

  const addAccountMutation = useMutation({
    mutationFn: async (account: Account) =>
      new AccountsControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.LoanOperations,
        })
      ).addAccounts({
        xXORGID: String(auth.organisation?.organisationId),
        account,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [BANK_ACCOUNTS_QUERY_KEY],
      })
      toast.success(t("accountAdded"))
      onSuccess()
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit(async (data) => {
          await addAccountMutation.mutateAsync({
            number: data.accountNumber,
            iban: data.iban,
            sortCode: data.sortCode || data.routingNumber,
            swiftBic: data.swiftBic,
            country: data.countryOfAccount,
            blz: data.blz,
          })
        })}
      >
        <FormLayout.Content>
          <PageBar
            title={t("title")}
            onClickBack={onClickBack}
            desktopHeaderType="h4"
          />
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
              onChange={() => {
                resetFormInputs()
              }}
            />
          </FormControl>
          {!!availableTransferTypes && availableTransferTypes.length > 1 && (
            <>
              <Typography type="bodyTitle" color="neutral-600" className="mb-2">
                {t("bankDetails")}
              </Typography>
              <ListItemContainer className="mb-6" size="sm">
                {availableTransferTypes.map((type) => (
                  <ListItemInput
                    className="!min-h-10"
                    key={type}
                    onChange={() => {
                      setValue("transferType", type, {
                        shouldValidate: true,
                      })
                      resetFormInputs()
                    }}
                    // @ts-expect-error dynamic string
                    title={t(`transferTypes.${type}`, {
                      defaultValue: type,
                    })}
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
          {isAccountFieldVisible("accountNumber") && (
            <FormControl>
              <Input
                label={t("accountNumber")}
                name="accountNumber"
                type={
                  ["SORT_CODE", "ABA"].includes(transferType!) ||
                  countryOfAccount === "CAN"
                    ? "number"
                    : "text"
                }
                control={control}
                inputMode={
                  ["SORT_CODE", "ABA"].includes(transferType!) ||
                  countryOfAccount === "CAN"
                    ? "numeric"
                    : undefined
                }
              />
            </FormControl>
          )}
          {isAccountFieldVisible("blz") && (
            <FormControl>
              <Input
                label={t("institiutionNumber")}
                name="blz"
                type="number"
                control={control}
                inputMode="numeric"
              />
            </FormControl>
          )}
          {isAccountFieldVisible("transitNumber") && (
            <FormControl>
              <Input
                label={t("transitNumber")}
                name="sortCode"
                type="number"
                control={control}
                inputMode="numeric"
              />
            </FormControl>
          )}
          {isAccountFieldVisible("swiftBic") && (
            <FormControl>
              <Input label={t("swiftBic")} name="swiftBic" control={control} />
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
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup>
            <Button
              type="submit"
              loading={addAccountMutation.isPending}
              disabled={!formState.isValid}
            >
              {t("submit")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default AddBank
