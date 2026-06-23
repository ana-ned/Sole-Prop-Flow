import { isValid, isAfter, parse } from "date-fns"
import i18n from "../../inits/i18next"

const RULE_NAME = "date-format"
const DATE_1800_01_01 = new Date(1800, 1, 1)

const DateFormat = (format = "yyyy-MM-dd") => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) return true

    try {
      const date = parse(value, format, new Date())
      return isValid(date) && isAfter(date, DATE_1800_01_01)
    } catch {
      return false
    }
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default DateFormat
