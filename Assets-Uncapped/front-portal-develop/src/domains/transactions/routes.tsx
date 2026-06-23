import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import TransactionsV2 from "./pages/_transactionsV2"

const TransactionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TransactionsV2 />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default TransactionRoutes
