import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import PayIndex from "./pages/_pay"
import NewVendor from "./pages/new"

const PayRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PayIndex />} />
      <Route path="/new" element={<NewVendor />} />
      <Route path="/:vendorId" element={<PayIndex />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default PayRoutes
