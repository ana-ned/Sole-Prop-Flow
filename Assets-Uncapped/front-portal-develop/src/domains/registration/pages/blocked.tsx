import PartnerBlocked from "../../../components/Content/Onboarding/PartnerBlocked"
import useAuth from "../../../hooks/useAuth"

const RegistrationBlocked = () => {
  const auth = useAuth()

  const redirectTo = () => {
    if (!auth.organisation || auth.organisationData?.notEligibleReason) {
      return "/funding/eligibility-check"
    }

    if (!auth.organisation.activated) {
      return "/onboarding"
    }

    return "/"
  }
  return (
    <PartnerBlocked
      active={auth.organisation?.activated}
      redirectTo={redirectTo()}
    />
  )
}

export default RegistrationBlocked
