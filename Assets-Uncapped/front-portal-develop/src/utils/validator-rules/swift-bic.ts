import { isValidBIC } from "ibantools"
import i18n from "../../inits/i18next"

const RULE_NAME = "swiftBic"

const SwiftBic = () => ({
  name: RULE_NAME,
  test: (value: any) => isValidBIC(value),
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default SwiftBic
