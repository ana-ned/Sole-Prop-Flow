import { Route, Routes } from "react-router"
import PartnerCallback from "./pages/partner-callback"

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/partner" element={<PartnerCallback />} />
    </Routes>
  )
}

export default AuthRoutes
