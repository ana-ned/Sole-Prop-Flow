import { isValidIBAN } from "ibantools"
import i18n from "../../inits/i18next"

const RULE_NAME = "iban"

const Iban = () => ({
  name: RULE_NAME,
  test: (value: string) => isValidIBAN(value.replaceAll(" ", "")),
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default Iban
