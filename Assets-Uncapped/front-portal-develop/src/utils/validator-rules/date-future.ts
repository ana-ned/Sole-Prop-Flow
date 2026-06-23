import { isFuture, isToday, parse } from "date-fns"
import i18n from "../../inits/i18next"

const RULE_NAME = "date-future"

const DateFuture = (format = "yyyy-MM-dd") => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) return true

    const date = parse(value, format, new Date())

    return isFuture(date) && !isToday(date)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default DateFuture
