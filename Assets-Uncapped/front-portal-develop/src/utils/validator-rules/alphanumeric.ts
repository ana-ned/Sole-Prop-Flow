import i18n from "../../inits/i18next"

const RULE_NAME = "alphanumeric"
const REGEX = /^[\dA-Za-z]+$/

const Alphanumeric = () => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) {
      return true
    }

    return new RegExp(REGEX).test(value)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default Alphanumeric
