import { Navigate, Route, Routes, useLocation } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import { ManualConnectionsRoutes } from "../connections/routes"
import {
  OnboardingMenuPaths,
  OnboardingPaths,
  OnboardingSidePaths,
} from "./constants"
import OnboardingIndex from "./pages/_onboarding"
import AccountingConnections from "./pages/accounting-connections"
import AccountingConnectionsAll from "./pages/accounting-connections-all"
import AccountingConnectionsDocuments from "./pages/accounting-connections-documents"
import Banking from "./pages/banking"
import BankingPlaidAuth from "./pages/banking-plaid-auth"
import BankingSearch from "./pages/banking-search"
import BookCall from "./pages/book-call"
import BusinessDetails from "./pages/business-details"
import Connections from "./pages/connections"
import ConnectionConsent from "./pages/consent"
import DirectDebit from "./pages/direct-debit"
import DocumentsSingle from "./pages/documents-single"
import InformationRequired from "./pages/information-required"
import Offers from "./pages/offers"
import OffersSelection from "./pages/offersSelection/offersSelection"
import Rejected from "./pages/rejected"
import ApplicationReview from "./pages/review"
import SalesConnections from "./pages/sales-connections"
import SalesConnectionsAll from "./pages/sales-connections-all"
import SalesConnectionsAmazon from "./pages/sales-connections-amazon"
import AmazonConsent from "./pages/amazon-consent"
import ReviewBankDetails from "./pages/review-bank-details"
import Signing from "./pages/signing"
import Submit from "./pages/submit"
import VerifyOwners from "./pages/verify-owners"

const OnboardingRoutes = () => {
  const location = useLocation()
  const state = location.state as { backUrl: string } | undefined

  return (
    <Routes>
      <Route path="/" element={<OnboardingIndex />} />
      <Route path="/manual/*" element={<ManualConnectionsRoutes />} />
      <Route path="/consent/:systemId" element={<ConnectionConsent />} />
      <Route path={OnboardingPaths.Sales} element={<SalesConnections />} />
      <Route
        path={`${OnboardingPaths.Sales}/all`}
        element={<SalesConnectionsAll />}
      />
      <Route
        path={`${OnboardingPaths.Sales}/amazon`}
        element={<SalesConnectionsAmazon />}
      />
      <Route
        path={OnboardingPaths.Accounting}
        element={<AccountingConnections />}
      />
      <Route
        path={`${OnboardingPaths.Accounting}/all`}
        element={<AccountingConnectionsAll />}
      />
      <Route
        path={`${OnboardingPaths.Accounting}/documents`}
        element={<AccountingConnectionsDocuments />}
      />
      <Route path="/connections" element={<Connections />} />
      <Route path={OnboardingPaths.Banking} element={<Banking />} />
      <Route
        path={`${OnboardingPaths.Banking}/plaid-auth`}
        element={<BankingPlaidAuth />}
      />
      <Route
        path={`${OnboardingPaths.Banking}/search`}
        element={<BankingSearch />}
      />
      <Route path={OnboardingPaths.Business} element={<BusinessDetails />} />
      <Route
        path={OnboardingSidePaths.Documents}
        element={<Navigate to={OnboardingMenuPaths.Review} replace />}
      />
      <Route
        path={`${OnboardingSidePaths.Documents}/type/:slug`}
        element={
          <DocumentsSingle
            backUrl={state?.backUrl || OnboardingMenuPaths.Review}
          />
        }
      />
      <Route path={OnboardingPaths.Review} element={<ApplicationReview />} />
      <Route path={OnboardingPaths.Offers} element={<Offers />} />
      <Route
        path={`${OnboardingPaths.Offers}/:offerId/*`}
        element={<OffersSelection />}
      />
      <Route path={`${OnboardingPaths.Signing}/*`} element={<Signing />} />
      <Route path={`${OnboardingPaths.Owners}/*`} element={<VerifyOwners />} />
      <Route
        path={`${OnboardingPaths.DirectDebit}/*`}
        element={<DirectDebit />}
      />
      <Route path={OnboardingPaths.BookCall} element={<BookCall />} />
      <Route
        path={OnboardingPaths.InformationRequired}
        element={<InformationRequired />}
      />
      <Route path={OnboardingPaths.AmazonConsent} element={<AmazonConsent />} />
      <Route
        path={OnboardingPaths.ReviewBankDetails}
        element={<ReviewBankDetails />}
      />
      <Route path={OnboardingPaths.Submit} element={<Submit />} />
      <Route path={OnboardingPaths.Rejected} element={<Rejected />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default OnboardingRoutes
