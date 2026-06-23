import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import DailyPayouts from "./pages/daily-payouts"
import DailyPayoutsExpired from "./pages/daily-payouts-expired"
import DailyPayoutsLoading from "./pages/daily-payouts-loading"
import DailyPayoutsNoConnection from "./pages/daily-payouts-no-connection"
import HelloWorld from "./pages/hello-world"
import OfferScreen from "./pages/offer-screen"
import MultiOffers from "./pages/multi-offers"
import AcceptTermLoanDailyPayouts from "./pages/accept-term-loan-daily-payouts"
import AcceptCashAdvanceDailyPayouts from "./pages/accept-cash-advance-daily-payouts"
import AcceptTermLoan from "./pages/accept-term-loan"
import AcceptCashAdvance from "./pages/accept-cash-advance"
import Registration from "./pages/registration"
import Application from "./pages/application"
import Underwriting from "./pages/underwriting"
import AscSoleProp from "./pages/asc-sole-prop"

const PrototypesRoutes = () => {
  return (
    <Routes>
      <Route path="hello-world" element={<HelloWorld />} />
      <Route path="registration" element={<Registration />} />
      <Route path="application" element={<Application />} />
      <Route path="underwriting" element={<Underwriting />} />
      <Route path="offer-screen" element={<OfferScreen />} />
      <Route path="multi-offers" element={<MultiOffers />} />
      <Route path="accept-term-loan-daily-payouts" element={<AcceptTermLoanDailyPayouts />} />
      <Route path="accept-cash-advance-daily-payouts" element={<AcceptCashAdvanceDailyPayouts />} />
      <Route path="accept-term-loan" element={<AcceptTermLoan />} />
      <Route path="accept-cash-advance" element={<AcceptCashAdvance />} />
      <Route path="daily-payouts" element={<DailyPayouts />} />
      <Route path="daily-payouts-expired" element={<DailyPayoutsExpired />} />
      <Route path="daily-payouts-no-connection" element={<DailyPayoutsNoConnection />} />
      <Route path="daily-payouts-loading" element={<DailyPayoutsLoading />} />
      <Route path="asc-sole-prop" element={<AscSoleProp />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default PrototypesRoutes
