import { Navigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import TypeformSidetab from "../../../components/Functional/TypeformSidetab"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu/LogoOnlyMenu"
import useAuth from "../../../hooks/useAuth"
import useBrowserStorage from "../../../hooks/useBrowserStorage"
import PreOfferContainer from "../components/offers/components/NoOffers/PreOfferContainer"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import { OnboardingMenuPaths } from "../constants"
import useBankVerification from "../hooks/useBankVerification"
import useOffers from "../hooks/useOffers"
import useOnboarding from "../hooks/useOnboarding"

const OffersIndex = () => {
  const auth = useAuth()
  const { fullyCompleted } = useOnboarding()
  const offers = useOffers()
  const bankVerification = useBankVerification()
  const [feedback, setFeedback] = useBrowserStorage<boolean>(
    auth.user?.sub,
    "onboardingTypeformFeedback"
  )

  if (offers.isLoading) {
    return <PageLoader />
  }

  if (offers.data?.length && offers.data.length > 0) {
    return (
      <Navigate
        to={`${OnboardingMenuPaths.Offers}/${offers.selectedOffer?.id ?? offers.data[0].id}`}
        replace
      />
    )
  }

  if (offers.data?.length === 0 && fullyCompleted) {
    return <Navigate to="/" />
  }

  return (
    <OnboardingGuard step="OFFERS">
      <OnboardingLayout menu={fullyCompleted ? <LogoOnlyMenu /> : undefined}>
        <PreOfferContainer />
      </OnboardingLayout>

      {!feedback &&
        offers.data?.length === 0 &&
        !bankVerification.isFailed &&
        !bankVerification.inProgress && (
          <TypeformSidetab
            id="M1qCOzuG"
            onSubmit={() => {
              setFeedback(true)
            }}
            open="load"
            hidden={{
              org: auth.organisation?.organisationId!,
            }}
          />
        )}
    </OnboardingGuard>
  )
}

export default OffersIndex
