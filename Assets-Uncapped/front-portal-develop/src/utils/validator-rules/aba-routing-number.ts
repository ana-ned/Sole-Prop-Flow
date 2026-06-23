import i18n from "../../inits/i18next"

const RULE_NAME = "aba-routing-number"

const AbaRoutingNumber = () => ({
  name: RULE_NAME, // example: 071000343
  test: (value?: string) => {
    if (!value) {
      return true
    }

    let n = 0

    for (let i = 0; i < value.length; i += 3) {
      n +=
        Number.parseInt(value.charAt(i), 10) * 3 +
        Number.parseInt(value.charAt(i + 1), 10) * 7 +
        Number.parseInt(value.charAt(i + 2), 10)
    }

    return n !== 0 && n % 10 === 0
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default AbaRoutingNumber
