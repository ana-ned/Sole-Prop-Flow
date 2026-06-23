import { Navigate } from "react-router"
import MultistepForm from "../../../components/Headless/MultistepForm/MultistepForm"
import useAuth from "../../../hooks/useAuth"
import PartnerRegistrationBusinessDetails from "../components/PartnerRegistrationBusinessDetails"
import PartnerRegistrationCredentials from "../components/PartnerRegistrationCredentials"

const ClientForm = () => {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <MultistepForm>
      <PartnerRegistrationCredentials />
      <PartnerRegistrationBusinessDetails />
    </MultistepForm>
  )
}

export default ClientForm
