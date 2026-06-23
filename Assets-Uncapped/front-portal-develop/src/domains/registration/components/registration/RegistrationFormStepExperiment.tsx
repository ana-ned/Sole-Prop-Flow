import ReadyForFundingSidebarExperiment from "../../../../components/Collections/RegistrationSidebars/variants/ReadyForFundingSidebarExperiment"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import RegistrationLayout from "../RegistrationLayout/RegistrationLayout"
import RegistrationPageContent from "./RegistrationPageContent"

interface RegistrationFormExperimentData {
  prospectId?: string
  preliminaryOffer?: number
  preliminaryOfferCurrency?: string
  averageRevenue?: {
    currency?: string
  }
}

const RegistrationFormStepExperiment = ({
  data,
  setStep,
}: StepProps<RegistrationFormExperimentData>) => {
  return (
    <RegistrationLayout
      sidebar={
        <ReadyForFundingSidebarExperiment
          amount={data?.preliminaryOffer ?? 0}
          currency={
            data?.preliminaryOfferCurrency ??
            data?.averageRevenue?.currency ??
            "USD"
          }
        />
      }
      onClickBack={() => {
        setStep!(2)
      }}
    >
      <RegistrationPageContent prospectId={data?.prospectId} />
    </RegistrationLayout>
  )
}

export default RegistrationFormStepExperiment
