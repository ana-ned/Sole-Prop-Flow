import { Navigate } from "react-router"
import MultistepForm from "../../../components/Headless/MultistepForm"
import useAuth from "../../../hooks/useAuth"
import EligibilityCheck from "../components/eligibility-check/EligibilityCheck"
import FindBusiness from "../components/eligibility-check/FindBusiness"

const FundingEligibilityCheck = () => {
  const auth = useAuth()

  if (
    auth.organisation?.organisationId &&
    !auth.organisationData?.notEligibleReason
  ) {
    return <Navigate to="/" />
  }

  return (
    <MultistepForm>
      <EligibilityCheck />
      <FindBusiness />
    </MultistepForm>
  )
}

export default FundingEligibilityCheck
