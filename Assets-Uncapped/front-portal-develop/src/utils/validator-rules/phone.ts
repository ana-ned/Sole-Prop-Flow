import { isValidPhoneNumber } from "libphonenumber-js/max"
import i18n from "../../inits/i18next"

const RULE_NAME = "phone-format"

const PhoneFormat = () => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) {
      return true
    }

    return isValidPhoneNumber(value)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default PhoneFormat
