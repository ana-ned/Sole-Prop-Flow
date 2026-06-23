import i18n from "../../inits/i18next"

const RULE_NAME = "exact"

const Exact = (length: number) => ({
  name: RULE_NAME,
  params: { length },
  test: (value: any) => String(value).length === length,
  message: i18n.t(`common:validation.${RULE_NAME}`),
})

export default Exact
