import i18n from "../../inits/i18next"

const RULE_NAME = "url"

const Url = () => ({
  name: RULE_NAME,
  test: (value?: string) => {
    if (!value) {
      return true
    }

    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[\dA-Za-z]+([.-][\dA-Za-z]+)*\.[A-Za-z]{2,16}(:\d{1,5})?(\/.*)?$/.test(
      value.trim()
    )
  },
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default Url
