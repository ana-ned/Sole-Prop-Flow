import { useNavigate } from "react-router"
import AddBankAccountForm from "../../../components/Shared/AddBankAccountForm"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu/LogoOnlyMenu"

const AddBank = () => {
  const navigate = useNavigate()
  const onClick = async () => {
    await navigate("/withdraw")
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
