export interface ICountry {
  name: string
  "alpha-2": string
  "alpha-3": string
  "country-code": string
  region: string
  systemId?: "PLAID" | "SALTEDGE"
  transferType?: TransferType | TransferType[]
  currency?: CurrencyCode
  flag: string
  regions?: { name: string; eligible: boolean; fundedBy?: "BESPOKE" }[]
}

export type CurrencyCode =
  | "GBP"
  | "USD"
  | "EUR"
  | "PLN"
  | "AUD"
  | "CAD"
  | "SEK"
  | "DKK"
  | "ZAR"
  | "PHP"
  | "NZD"
  | "MYR"
  | "JPY"
  | "RON"
  | "CHF"
  | "NOK"
  | "SAR"
  | "SGD"
  | "THB"
  | "TRY"
  | "UGX"
  | "AED"
  | "BHD"
  | "BGN"
  | "HKD"
  | "HUF"
  | "INR"
  | "IDR"
  | "ILS"
  | "KES"
  | "KWD"
  | "OMR"
  | "CZK"
  | "MXN"
  | "QAR"

export type TransferType = "IBAN" | "SWIFT" | "ABA" | "SORT_CODE"
