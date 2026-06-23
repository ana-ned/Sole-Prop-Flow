import i18n from "../../inits/i18next"

const RULE_NAME = "unique-alphanumeric-chars"
const UNCOUNTED_CHARS = [" ", "-", ".", "&", "/"]

const UniqueAlphanumericChars = (count: number) => ({
  name: RULE_NAME,
  params: { count },
  test: (value?: string) => {
    if (!value) {
      return true
    }

    const regex = new RegExp(`[${UNCOUNTED_CHARS.join("")}]`, "gi")

    const unique = value.replaceAll(/\W/g, "").replaceAll(regex, "")

    return new Set(unique).size >= count
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default UniqueAlphanumericChars
