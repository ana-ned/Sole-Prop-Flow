import i18n from "../../inits/i18next"

const RULE_NAME = "modulr-allowed-reference-chars"
const ALLOWED_CHARS = [" ", "-", ".", "&", "/", ","]

const ModulrAllowedReferenceChars = () => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) {
      return true
    }

    const regex = new RegExp(`^[A-Za-z0-9${ALLOWED_CHARS.join("\\")}]*$`, "g")
    return regex.test(value)
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default ModulrAllowedReferenceChars
