import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import EligibilityCheckStatusPaths from "./EligibilityCheckStatusPaths"
import FundingEligibilityCheck from "./pages/eligibility-check"
import FundingEligibleBallparkOffer from "./pages/funding-eligibility/FundingEligibleBallparkOffer"
import FundingNotEligible from "./pages/not-eligible"

const FundingRoutes = () => {
  return (
    <Routes>
      <Route path="/eligibility-check" element={<FundingEligibilityCheck />} />
      <Route path="/status">
        <Route
          path={EligibilityCheckStatusPaths.NotEligible}
          element={<FundingNotEligible />}
        />
        <Route
          path={EligibilityCheckStatusPaths.EligibleBallparkOffer}
          element={<FundingEligibleBallparkOffer />}
        />
      </Route>
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default FundingRoutes
