import i18n from "../../inits/i18next"

const RULE_NAME = "ssn"

const SocialSecurityNumber = () => ({
  name: RULE_NAME,
  test: (value: any) => {
    const pattern = /^(?!000|666)[0-8]\d{2}-?(?!00)\d{2}-?(?!0000)\d{4}$/
    return new RegExp(pattern).test(value)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default SocialSecurityNumber
