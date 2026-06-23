import { StepProps } from "../../../../components/Headless/MultistepForm"
import UploadBankAccountStatementForm from "../../../../components/Shared/UploadBankAccountStatementForm"
import VerifyInfo from "../../../../components/Shared/UploadBankAccountStatementForm/VerifyInfo"
import Layout from "../../../../components/UI/Layout"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import useRequestDraw from "../../hooks/useRequestDraw"

const UploadBankStatement = ({ data, onBack }: StepProps) => {
  const requestDraw = useRequestDraw({ lineOfCredit: data.lineOfCredit })

  return (
    <Layout menu={<LogoOnlyMenu />} sidebar={<VerifyInfo />}>
      <Layout.Parent>
        <UploadBankAccountStatementForm
          onSuccess={async () => {
            await requestDraw.mutateAsync({
              amount: Number(data.amount),
              repaymentTermsMonths: data.repaymentTermsMonths,
              cashTransferAccountId: data.accountId,
            })
          }}
          onClickBack={() => {
            onBack!()
          }}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default UploadBankStatement
