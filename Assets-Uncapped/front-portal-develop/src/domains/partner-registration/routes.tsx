import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import PartnerRegistration from "./pages/partner-registration"
import PartnerRegistrationSuccess from "./pages/partner-registration-success"

const PartnerRegistrationRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PartnerRegistration />} />
      <Route path="/success" element={<PartnerRegistrationSuccess />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default PartnerRegistrationRoutes
