import { TestContext } from "yup"
import i18n from "../../inits/i18next"
import { format } from "../money"

const RULE_NAME = "between-amount"

const BetweenAmount = (min: number, max: number, currency: string) => ({
  name: RULE_NAME,
  params: { min, max, currency },
  test: (value: any, { createError, path }: TestContext) => {
    if (value === 0) {
      return createError({
        path,
        message: i18n.t(`common:validation.${RULE_NAME}`, {
          min: format(min, currency),
          max: format(max, currency),
        }),
      })
    }

    if (!value) {
      return true
    }

    if (value >= min && value <= max) {
      return true
    }

    return createError({
      path,
      message: i18n.t(`common:validation.${RULE_NAME}`, {
        min: format(min, currency),
        max: format(max, currency),
      }),
    })
  },
})

export default BetweenAmount
