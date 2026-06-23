import { StepProps } from "../../../../components/Headless/MultistepForm"
import AddBankAccountForm from "../../../../components/Shared/AddBankAccountForm"
import Layout from "../../../../components/UI/Layout"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"

const AddBank = ({ setStep }: StepProps) => {
  const onClick = () => {
    setStep!(2)
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <AddBankAccountForm onSuccess={onClick} onClickBack={onClick} />
      </Layout.Parent>
    </Layout>
  )
}

export default AddBank
