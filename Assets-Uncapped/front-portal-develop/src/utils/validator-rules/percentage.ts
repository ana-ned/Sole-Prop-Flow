import i18n from "../../inits/i18next"

const RULE_NAME = "percentage"

const Percentage = (min = 1, max = 100) => ({
  name: RULE_NAME,
  params: { min, max },
  test: (value?: string) =>
    Number.isNaN(Number(value))
      ? false
      : Number(value) >= min && Number(value) <= max,
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default Percentage
