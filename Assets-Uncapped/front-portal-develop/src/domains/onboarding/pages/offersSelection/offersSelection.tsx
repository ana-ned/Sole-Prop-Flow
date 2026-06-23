import { Navigate, useParams } from "react-router"
import PageLoader from "../../../../components/Collections/PageLoader"
import MultistepForm from "../../../../components/Headless/MultistepForm"
import { OfferResponseOfferTypeEnum } from "../../../../services/api/agreements"
import OnboardingGuard from "../../components/OnboardingGuard"
import { OnboardingMenuPaths } from "../../constants"
import useOffers from "../../hooks/useOffers"
import LocFirstDraw from "./LocFirstDraw"
import LocV2FirstDraw from "./LocV2FirstDraw"
import OffersSingle from "./offers-single"

const OffersSelection = () => {
  const { offerId } = useParams()
  const { getOfferById, isLoading } = useOffers()
  const offer = offerId ? getOfferById(offerId) : undefined

  if (isLoading) {
    return <PageLoader />
  }

  if (!offer) {
    return <Navigate to={OnboardingMenuPaths.Offers} />
  }

  const formSteps = [
    <OffersSingle offer={offer} key="offers-single" />,
    ...(offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit
      ? [<LocFirstDraw offer={offer} key="loc-first-draw" />]
      : []),
    ...(offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit
      ? [<LocV2FirstDraw offer={offer} key="loc-v2-first-draw" />]
      : []),
  ]

  return (
    <OnboardingGuard step="OFFERS">
      <MultistepForm>{formSteps}</MultistepForm>
    </OnboardingGuard>
  )
}

export default OffersSelection
