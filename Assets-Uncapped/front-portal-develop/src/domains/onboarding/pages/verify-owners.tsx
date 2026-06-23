import { useLocation } from "react-router"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import BeneficialOwnersFlow from "../components/verify-owners/beneficial-owners-flow"

const VerifyOwners = () => {
  const location = useLocation()
  const isFormRoute =
    location.pathname.includes("/add") || location.pathname.includes("/edit")

  return (
    <OnboardingGuard step="OWNERS">
      <OnboardingLayout menu={isFormRoute ? <LogoOnlyMenu /> : undefined}>
        <BeneficialOwnersFlow />
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default VerifyOwners
