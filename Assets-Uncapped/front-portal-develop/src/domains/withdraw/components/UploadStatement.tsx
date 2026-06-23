import { StepProps } from "../../../components/Headless/MultistepForm"
import UploadBankAccountStatementForm from "../../../components/Shared/UploadBankAccountStatementForm"
import VerifyInfo from "../../../components/Shared/UploadBankAccountStatementForm/VerifyInfo"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu/LogoOnlyMenu"

const UploadStatement = ({ onBack, data, onSubmit }: StepProps) => {
  return (
    <Layout menu={<LogoOnlyMenu />} sidebar={<VerifyInfo />}>
      <Layout.Parent>
        <UploadBankAccountStatementForm
          onSuccess={() => {
            onSubmit?.(data)
          }}
          onClickBack={() => {
            onBack!()
          }}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default UploadStatement
