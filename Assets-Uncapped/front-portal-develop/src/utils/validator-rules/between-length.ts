import i18n from "../../inits/i18next"

const RULE_NAME = "between-length"

const BetweenLength = (min: number, max: number) => ({
  name: RULE_NAME,
  params: { min, max },
  test: (value: any) =>
    String(value).length >= min && String(value).length <= max,
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default BetweenLength
