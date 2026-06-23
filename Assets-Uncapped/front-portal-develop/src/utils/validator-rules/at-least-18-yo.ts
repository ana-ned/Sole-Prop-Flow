import { parse, differenceInYears } from "date-fns"
import i18n from "../../inits/i18next"
import DateFormat from "./date-format"

const RULE_NAME = "at-least-18-yo"

const AtLeast18Yo = (dateFormat = "yyyy-MM-dd") => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) {
      return false
    }

    const isValidDate = DateFormat(dateFormat).test(value)

    if (!isValidDate) {
      return false
    }

    const dateOfBirth = parse(value, dateFormat, new Date())
    const age = differenceInYears(new Date(), dateOfBirth)
    return age >= 18
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default AtLeast18Yo
