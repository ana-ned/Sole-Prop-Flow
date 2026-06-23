import { Route, Routes } from "react-router"
import PrivateRoute from "../../components/Functional/PrivateRoute"
import { UserRoles } from "../../hooks/useAuth.types"
import ErrorIndex from "../../pages/error/_error"
import Reapply from "./pages/reapply"
import TopupReengagement from "./pages/topup-reengagement"

const StaticRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute role={UserRoles.CUSTOMER} />}>
        <Route path="/topup-reengagement" element={<TopupReengagement />} />
        <Route path="/reapply" element={<Reapply />} />
      </Route>
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default StaticRoutes
