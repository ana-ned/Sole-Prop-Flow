import useDeal from "../../../hooks/useDeal"
import { DealAttributeObjectAttributeEnum } from "../../../services/api/hubspot"

const useLowerOffer = (): boolean => {
  const deal = useDeal()

  return Boolean(
    deal.data?.attributes?.some(
      ({ attribute, value }) =>
        attribute === DealAttributeObjectAttributeEnum.LowerAmountOffer &&
        value === true
    )
  )
}

export default useLowerOffer
