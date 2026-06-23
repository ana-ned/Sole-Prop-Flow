import { TGoogleAddress } from "../../../components/Forms/GoogleAutocompleteInput"
import { BaseBalanceDTO } from "../../../services/api/agreements"
import {
  BillPaymentFee,
  BillVendorDTO,
} from "../../../services/api/loan-operations"
import { CurrencyCode, TransferType } from "../../../types/Country.types"

export interface NewVendorFormSchema {
  name: string
  email: string
  selectedConvenienceFee: keyof BillPaymentFee
  address?: TGoogleAddress
  countryOfAccount: string
  currency: TSupportedCurrency
  iban?: string
  accountNumber?: string
  swiftBic?: string
  sortCode?: string
  routingNumber?: string
  branchCode?: string
  bankCode?: string
  ifscCode?: string
  bsbCode?: string
  transferType: TransferType
  availableTransferType: TransferType[]
  availableVendors: BillVendorDTO[]
  availableFees: BillPaymentFee
  availableExchangeRates: Record<string, number>
  availableBalance: BaseBalanceDTO
  hasSimplifiedPricing?: boolean
}

export type TSupportedCurrency = (typeof supportedCurrencies)[number]

export const supportedCurrencies: CurrencyCode[] = [
  "GBP",
  "EUR",
  "USD",
  "PLN",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "SEK",
  "DKK",
  "NOK",
  "BHD",
  "BGN",
  "CZK",
  "HKD",
  "HUF",
  "INR",
  "IDR",
  "ILS",
  "KES",
  "KWD",
  "MYR",
  "MXN",
  "NZD",
  "OMR",
  "PHP",
  "QAR",
  "RON",
  "SAR",
  "SGD",
  "ZAR",
  "THB",
  "TRY",
  "UGX",
  "AED",
]
