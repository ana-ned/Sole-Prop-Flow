import { useNavigate } from "react-router"
import MultistepForm from "../../../../../components/Headless/MultistepForm"
import { OnboardingMenuPaths } from "../../../constants"
import DocumentsDebtForm from "./DocumentsDebtForm"
import DocumentsDebtList from "./DocumentsDebtList"
import DocumentsDebtNoDebt from "./DocumentsDebtNoDebt"

const DocumentsDebt = ({ backUrl }: { backUrl: string }) => {
  const navigate = useNavigate()

  return (
    <MultistepForm
      initialData={{
        backUrl,
      }}
      onFinish={async () => {
        await navigate(OnboardingMenuPaths.Review)
      }}
    >
      <DocumentsDebtList />
      <DocumentsDebtForm />
      <DocumentsDebtNoDebt />
    </MultistepForm>
  )
}

export default DocumentsDebt
