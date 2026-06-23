import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import AgreementIndex from "./pages/_agreement"
import AgreementsIndex from "./pages/_agreements"
import EarlyRepayment from "./pages/early-repayment"
import EarlyRepayments from "./pages/early-repayments"

const AgreementsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AgreementsIndex />} />
      <Route path="/past" element={<AgreementsIndex />} />
      <Route path="/early-repayments" element={<EarlyRepayments />} />
      <Route
        path="/early-repayments/:agreementId"
        element={<EarlyRepayment />}
      />
      <Route path="/:agreementId/*" element={<AgreementIndex />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default AgreementsRoutes
