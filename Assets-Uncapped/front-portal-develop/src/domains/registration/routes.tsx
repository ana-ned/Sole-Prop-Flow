import { Route, Routes } from "react-router"
import GuestRoute from "../../components/Functional/GuestRoute"
import PrivateRoute from "../../components/Functional/PrivateRoute"
import { UserRoles } from "../../hooks/useAuth.types"
import ErrorIndex from "../../pages/error/_error"
import RegistrationIndex from "./pages/_registration"
import RegistrationBlocked from "./pages/blocked"

const RegistrationRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/" element={<RegistrationIndex />} />
      </Route>
      <Route element={<PrivateRoute role={UserRoles.CUSTOMER} />}>
        <Route path="/blocked" element={<RegistrationBlocked />} />
      </Route>
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default RegistrationRoutes
