import i18n from "../../inits/i18next"
import { reportErrorLog } from "../error-handling"

const RULE_NAME = "available-funds"

interface MoneyResource {
  amount: number
  currency: string
}

const AvailableFunds = (
  current: MoneyResource,
  targetCurrency: string,
  exchangeRates?: Record<string, number>
) => ({
  name: RULE_NAME,
  test: (value: number) => {
    if (!value) {
      return true
    }

    if (current.currency === targetCurrency) {
      return value <= current.amount
    }

    if (!exchangeRates) {
      reportErrorLog(
        `Exchange rates are not available for ${RULE_NAME} validation`
      )
      return true
    }

    if (!exchangeRates[targetCurrency]) {
      reportErrorLog(
        `Exchange rates for ${targetCurrency} are not available for ${RULE_NAME} validation`
      )
      return true
    }

    const convertedAmount = value / exchangeRates[targetCurrency]

    return convertedAmount <= current.amount
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default AvailableFunds
