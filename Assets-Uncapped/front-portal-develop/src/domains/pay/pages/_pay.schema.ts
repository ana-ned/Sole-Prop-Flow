import * as yup from "yup"
import { BaseBalanceDTO } from "../../../services/api/agreements"
import {
  BillPaymentFee,
  BillVendorDTO,
} from "../../../services/api/loan-operations"
import AvailableFunds from "../../../utils/validator-rules/available-funds"
import CurrencyCloudMinimumAmount from "../../../utils/validator-rules/currency-cloud-minimum-amount"
import ModulrAllowedReferenceChars from "../../../utils/validator-rules/modulr-allowed-reference-chars"
import UniqueAlphanumericChars from "../../../utils/validator-rules/unique-alphanumeric-chars"

export const ACH_REFERENCE_MAX_LENGTH = 10

export const isACHPayment = (vendor?: BillVendorDTO) =>
  vendor?.currency === "USD" && vendor.accountCountry === "USA"

export const DetailsStepSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("${path} must be a number")
    .required()
    .when(
      ["selectedVendor", "availableBalance", "availableExchangeRates"],
      ([vendor, balance, exchangeRates], fieldSchema) => {
        return fieldSchema
          .test(
            AvailableFunds(
              {
                amount: balance.values?.AVAILABLE_TOTAL!,
                currency: balance.currency!,
              },
              vendor.currency,
              exchangeRates
            )
          )
          .test(CurrencyCloudMinimumAmount(vendor.currency, exchangeRates))
      }
    ),
  reference: yup
    .string()
    .required()
    .trim()
    .when(["selectedVendor"], ([vendor], fieldSchema) => {
      const castedVendor = vendor as BillVendorDTO | undefined

      const isFasterPayment =
        castedVendor?.currency === "GBP" &&
        castedVendor.accountCountry === "GBR"

      if (isFasterPayment) {
        return fieldSchema.min(6).max(18)
      }

      return fieldSchema.min(6).max(100)
    })
    .test(ModulrAllowedReferenceChars())
    .test(UniqueAlphanumericChars(2)),
  sendDate: yup.string().required(),
  swift: yup
    .boolean()
    .when(
      ["selectedVendor", "reference"],
      ([vendor, reference], fieldSchema) => {
        const castedVendor = vendor as BillVendorDTO | undefined

        return isACHPayment(castedVendor) &&
          reference?.length > ACH_REFERENCE_MAX_LENGTH
          ? fieldSchema.oneOf([true], "Must be checked")
          : fieldSchema
      }
    ),
})

type DetailsStepType = yup.InferType<typeof DetailsStepSchema>

export type PayFormSchema = DetailsStepType & {
  search: string
  selectedVendor: BillVendorDTO
  availableVendors: BillVendorDTO[]
  availableFees: BillPaymentFee
  availableExchangeRates: Record<string, number>
  availableBalance: BaseBalanceDTO
  hasSimplifiedPricing?: boolean
}
