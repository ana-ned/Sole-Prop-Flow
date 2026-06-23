import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import WithdrawIndex from "./pages/_withdraw"
import AddBank from "./pages/add-bank"

const WithdrawRoutes = () => {
  return (
    <Routes>
      <Route path="/add-bank" element={<AddBank />} />
      <Route path="/" element={<WithdrawIndex />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default WithdrawRoutes
