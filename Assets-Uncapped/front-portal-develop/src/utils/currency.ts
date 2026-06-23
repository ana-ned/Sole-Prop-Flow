import i18n from "../inits/i18next"
import { CurrencyCode } from "../types/Country.types"

export const DEFAULT_CURRENCY: CurrencyCode = "USD"

export const getCurrencyList = (
  values?: CurrencyCode[]
): {
  value: string
  symbol: string
  name: string
}[] => {
  const supportedCurrencies: {
    value: CurrencyCode
    symbol: string
    name: string
  }[] = [
    { value: "USD", symbol: "$", name: i18n.t("common:currencies.usd") },
    { value: "GBP", symbol: "£", name: i18n.t("common:currencies.gbp") },
    { value: "EUR", symbol: "€", name: i18n.t("common:currencies.eur") },
    { value: "PLN", symbol: "PLN", name: i18n.t("common:currencies.pln") },
    { value: "JPY", symbol: "¥", name: i18n.t("common:currencies.jpy") },
    { value: "CAD", symbol: "C$", name: i18n.t("common:currencies.cad") },
    { value: "AUD", symbol: "A$", name: i18n.t("common:currencies.aud") },
    { value: "CHF", symbol: "CHF", name: i18n.t("common:currencies.chf") },
    { value: "SEK", symbol: "kr", name: i18n.t("common:currencies.sek") },
    { value: "DKK", symbol: "kr", name: i18n.t("common:currencies.dkk") },
    { value: "NOK", symbol: "kr", name: i18n.t("common:currencies.nok") },
    { value: "BHD", symbol: "BHD", name: i18n.t("common:currencies.bhd") },
    { value: "BGN", symbol: "лв", name: i18n.t("common:currencies.bgn") },
    { value: "CZK", symbol: "Kč", name: i18n.t("common:currencies.czk") },
    { value: "HKD", symbol: "$", name: i18n.t("common:currencies.hkd") },
    { value: "HUF", symbol: "Ft", name: i18n.t("common:currencies.huf") },
    { value: "INR", symbol: "INR", name: i18n.t("common:currencies.inr") },
    { value: "IDR", symbol: "Rp", name: i18n.t("common:currencies.idr") },
    { value: "ILS", symbol: "₪", name: i18n.t("common:currencies.ils") },
    { value: "KES", symbol: "KES", name: i18n.t("common:currencies.kes") },
    { value: "KWD", symbol: "KWD", name: i18n.t("common:currencies.kwd") },
    { value: "MYR", symbol: "RM", name: i18n.t("common:currencies.myr") },
    { value: "MXN", symbol: "$", name: i18n.t("common:currencies.mxn") },
    { value: "NZD", symbol: "$", name: i18n.t("common:currencies.nzd") },
    { value: "OMR", symbol: "OMR", name: i18n.t("common:currencies.omr") },
    { value: "PHP", symbol: "₱", name: i18n.t("common:currencies.php") },
    { value: "QAR", symbol: "﷼", name: i18n.t("common:currencies.qar") },
    { value: "RON", symbol: "LEU", name: i18n.t("common:currencies.ron") },
    { value: "SAR", symbol: "﷼", name: i18n.t("common:currencies.sar") },
    { value: "SGD", symbol: "$", name: i18n.t("common:currencies.sgd") },
    { value: "ZAR", symbol: "ZAR", name: i18n.t("common:currencies.zar") },
    { value: "THB", symbol: "฿", name: i18n.t("common:currencies.thb") },
    { value: "TRY", symbol: "₺", name: i18n.t("common:currencies.try") },
    { value: "UGX", symbol: "USh", name: i18n.t("common:currencies.ugx") },
    { value: "AED", symbol: "AED", name: i18n.t("common:currencies.aed") },
  ]

  if (values) {
    return supportedCurrencies.filter((item) => values.includes(item.value))
  }

  return supportedCurrencies
}
