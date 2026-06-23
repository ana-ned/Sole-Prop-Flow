import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useSessionStorage } from "usehooks-ts"
import { OnboardingMenuPaths } from "../../onboarding/constants"
import useOffers from "../../onboarding/hooks/useOffers"

const STORAGE_KEY = "signable_offer_redirect_shown"

const useSignableOfferRedirect = (): void => {
  const [hasChecked, setHasChecked] = useSessionStorage<boolean>(
    STORAGE_KEY,
    false
  )
  const offers = useOffers()
  const navigate = useNavigate()

  useEffect(() => {
    if (hasChecked) return
    if (!offers.isSuccess && !offers.isError) return

    setHasChecked(true)

    if (offers.signeableOffers.length > 0) {
      navigate(OnboardingMenuPaths.Offers, { replace: true })
    }
  }, [
    hasChecked,
    offers.isSuccess,
    offers.isError,
    offers.signeableOffers.length,
    navigate,
    setHasChecked,
  ])
}

export default useSignableOfferRedirect
