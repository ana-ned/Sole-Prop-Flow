import { Route, Routes } from "react-router"
import PrivateRoute from "../../components/Functional/PrivateRoute"
import { UserRoles } from "../../hooks/useAuth.types"
import DashboardIndex from "../dashboard/pages/_dashboard"

const CampaignRoutes = () => (
  <Routes>
    <Route
      element={<PrivateRoute role={UserRoles.CUSTOMER} redirects={false} />}
    >
      <Route path="/:referenceImpressionId" element={<DashboardIndex />} />
    </Route>
  </Routes>
)

export default CampaignRoutes
