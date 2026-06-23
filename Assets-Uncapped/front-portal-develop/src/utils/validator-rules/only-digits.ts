import i18n from "../../inits/i18next"

const RULE_NAME = "only-digits"

const OnlyDigits = () => ({
  name: RULE_NAME,
  test: (value: string | undefined) => {
    const pattern = /^\d+$/
    return value ? new RegExp(pattern).test(value) : false
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default OnlyDigits
