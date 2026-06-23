import { StepProps } from "../../../../components/Headless/MultistepForm"
import AddBankAccountForm from "../../../../components/Shared/AddBankAccountForm"
import Layout from "../../../../components/UI/Layout"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import useAuth from "../../../../hooks/useAuth"
import OnboardingLayout from "../../components/OnboardingLayout"

const AddBank = ({ setStep }: StepProps) => {
  const auth = useAuth()

  const onClick = () => {
    setStep?.(1)
  }

  return (
    <OnboardingLayout
      menu={auth.organisation?.activated ? <LogoOnlyMenu /> : undefined}
    >
      <Layout.Parent>
        <AddBankAccountForm onSuccess={onClick} onClickBack={onClick} />
      </Layout.Parent>
    </OnboardingLayout>
  )
}

export default AddBank
