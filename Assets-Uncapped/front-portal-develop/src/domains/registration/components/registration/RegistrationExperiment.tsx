import MultistepForm from "../../../../components/Headless/MultistepForm"
import EligibilityCheck from "../eligibility-check/EligibilityCheck"
import FindBusinessProspectExperiment from "../eligibility-check/FindBusinessProspectExperiment"
import RegistrationFormStepExperiment from "./RegistrationFormStepExperiment"

const RegistrationExperiment = () => {
  return (
    <MultistepForm>
      <EligibilityCheck />
      <FindBusinessProspectExperiment />
      <RegistrationFormStepExperiment />
    </MultistepForm>
  )
}

export default RegistrationExperiment
