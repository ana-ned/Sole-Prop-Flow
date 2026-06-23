import { OfferResponse } from "../../services/api/agreements"

export const getOfferAmount = (offer: OfferResponse) => {
  return (
    offer.offerDetails?.rbfOfferDetails?.advanceAmount ||
    offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit ||
    offer.offerDetails?.fixedCustomizableOfferDetails?.maxAdvanceAmount ||
    offer.offerDetails?.lineOfCreditDetails?.maxAdvanceAmount ||
    offer.offerDetails?.fixedOfferDetails?.advanceAmount
  )
}
