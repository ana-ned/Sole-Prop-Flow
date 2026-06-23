import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import Kyc from "./pages/_kyc"

const KycRoutes = () => {
  return (
    <Routes>
      <Route path=":uuid">
        <Route index element={<Kyc />} />
        <Route path="*" element={<ErrorIndex type="404" />} />
      </Route>
    </Routes>
  )
}

export default KycRoutes
