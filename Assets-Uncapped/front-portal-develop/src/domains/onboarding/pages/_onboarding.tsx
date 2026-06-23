import { Navigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import useDeal from "../../../hooks/useDeal"
import ErrorIndex from "../../../pages/error/_error"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOffers from "../hooks/useOffers"
import useOnboarding from "../hooks/useOnboarding"

const OnboardingIndex = () => {
  const { hasCompletedStep, flowQuery } = useApplicationSteps()
  const offers = useOffers()
  const { steps } = useOnboarding()
  const deal = useDeal()

  if (
    flowQuery.isLoading ||
    offers.isLoading ||
    deal.isLoading ||
    deal.isPending
  ) {
    return <PageLoader />
  }

  if (
    offers.signeableOffers.length > 0 &&
    offers.data?.some(
      (item) => !item.offerDetails?.commonOfferDetails?.automatic
    ) &&
    offers.signeableOffers.every(
      (item) => !item.offerDetails?.commonOfferDetails?.signedOffline
    )
  ) {
    return <Navigate to={OnboardingMenuPaths.Offers} />
  }

  if (hasCompletedStep("SUBMIT")) {
    return <Navigate to={OnboardingMenuPaths.Submit} />
  }

  for (const step of steps) {
    if (step.name && !step.completed) {
      return (
        <Navigate
          to={
            step.name === "SUBMIT"
              ? steps.filter((item) => item.name).at(-2)?.href!
              : step.href
          }
        />
      )
    }
  }

  if (steps.length === 0) {
    return <Navigate to="/" replace />
  }

  return <ErrorIndex type="404" />
}

export default OnboardingIndex
