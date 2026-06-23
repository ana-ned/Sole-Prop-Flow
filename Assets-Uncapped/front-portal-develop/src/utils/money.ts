import {
  TransactionDetailsStatusEnum,
  TransactionStatusEnum,
} from "../services/api/agreements"

export const format = (
  value: number,
  currency: string,
  options: Intl.NumberFormatOptions = {}
) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    ...options,
  })

  return formatter.format(value)
}

type AllStatuses = TransactionStatusEnum | TransactionDetailsStatusEnum

const isIncomingTransfer = (status: AllStatuses) => {
  const incomingStatuses: AllStatuses[] = [
    TransactionStatusEnum.Received,
    TransactionStatusEnum.Reversal,
    TransactionStatusEnum.Refund,
  ]

  return incomingStatuses.includes(status)
}

export const formatByStatus = (
  status: AllStatuses,
  value: number,
  currency: string,
  isCash: boolean
) => {
  return `${isIncomingTransfer(status) || isCash ? "+" : "-"}${format(value, currency)}`
}

export const isReversed = (status: AllStatuses) => {
  return [
    TransactionStatusEnum.Canceled as string,
    TransactionStatusEnum.Failed as string,
  ].includes(status)
}

export const formatAsPercentage = (
  value: number,
  decimalPoints = 2,
  options?: {
    removeTrailingZeros?: boolean
    signDisplay?: boolean
  }
) => {
  let formattedValue = value.toFixed(decimalPoints)
  if (options?.removeTrailingZeros) {
    formattedValue = `${+formattedValue}`
  }
  if (options?.signDisplay && value > 0) {
    formattedValue = `+${formattedValue}`
  }
  return `${formattedValue}%`
}

export const separate = (value: number, currency: string) => {
  const formatted = format(value, currency)

  return {
    whole: formatted.slice(0, -3),
    fraction: formatted.slice(-3),
  }
}

export const roundCurrency = (value: number) => Math.round(value * 100) / 100

export const currencyToSymbol = (currency: string) => {
  const symbols = {
    USD: "$", // US Dollar
    EUR: "€", // Euro
    CRC: "₡", // Costa Rican Colón
    GBP: "£", // British Pound Sterling
    ILS: "₪", // Israeli New Sheqel
    INR: "₹", // Indian Rupee
    JPY: "¥", // Japanese Yen
    KRW: "₩", // South Korean Won
    NGN: "₦", // Nigerian Naira
    PHP: "₱", // Philippine Peso
    PYG: "₲", // Paraguayan Guarani
    THB: "฿", // Thai Baht
    UAH: "₴", // Ukrainian Hryvnia
    VND: "₫", // Vietnamese Dong
  }

  return symbols[currency as keyof typeof symbols] || currency
}
