import { TestContext } from "yup"
import i18n from "../../inits/i18next"
import { reportErrorLog } from "../error-handling"
import { format } from "../money"

const RULE_NAME = "currency-cloud-minimum-amount"
const REQUIRED_CURRENCY = "GBP"
const MINIMUM_AMOUNT = 2

const CurrencyCloudMinimumAmount = (
  targetCurrency: string,
  exchangeRates?: Record<string, number>
) => ({
  name: RULE_NAME,
  test: (value: number, { createError, path }: TestContext) => {
    if (Number.isNaN(value)) {
      return true
    }

    if (REQUIRED_CURRENCY === targetCurrency) {
      if (value < MINIMUM_AMOUNT) {
        return createError({
          path,
          message: i18n.t(`common:validation.${RULE_NAME}`, {
            min: format(MINIMUM_AMOUNT, targetCurrency),
          }),
        })
      }
      return true
    }

    if (!exchangeRates) {
      reportErrorLog(
        `Exchange rates are not available for ${RULE_NAME} validation`
      )
      return true
    }

    if (!exchangeRates[REQUIRED_CURRENCY]) {
      exchangeRates[REQUIRED_CURRENCY] = 1
    }

    if (!exchangeRates[targetCurrency]) {
      exchangeRates[targetCurrency] = 1
    }

    const convertedAmount = value / exchangeRates[targetCurrency]

    if (convertedAmount * exchangeRates[REQUIRED_CURRENCY] < MINIMUM_AMOUNT) {
      const expected = Math.ceil(
        (exchangeRates[targetCurrency] / exchangeRates[REQUIRED_CURRENCY]) * 2
      )

      return createError({
        path,
        message: i18n.t(`common:validation.${RULE_NAME}`, {
          min: format(expected, targetCurrency),
        }),
      })
    }

    return true
  },
})

export default CurrencyCloudMinimumAmount
