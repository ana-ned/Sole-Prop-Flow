import { isPast, isToday, parse } from "date-fns"
import i18n from "../../inits/i18next"

const RULE_NAME = "date-past"

const DatePast = (format = "yyyy-MM-dd") => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) return true

    const date = parse(value, format, new Date())

    return isPast(date) || isToday(date)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default DatePast
