import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import DocumentsSingle from "../onboarding/pages/documents-single"
import PartnerApplicationCreate from "./pages/partner-application-create"
import PartnerApplicationDetails from "./pages/partner-application-details"
import PartnerApplicationDocuments from "./pages/partner-application-documents"
import PartnerBusinessDetails from "./pages/partner-business-details"

const PartnerApplicationRoutes = () => {
  return (
    <Routes>
      <Route path="/create" element={<PartnerApplicationCreate />} />
      <Route path="/create/:id" element={<PartnerApplicationCreate />} />
      <Route path="/details/:id" element={<PartnerApplicationDetails />} />
      <Route
        path="/business-details/:id"
        element={<PartnerBusinessDetails />}
      />
      <Route path="documents/:id" element={<PartnerApplicationDocuments />} />
      <Route
        path="documents/:id/type/:slug"
        element={<DocumentsSingle backUrl="/partner/application/documents/" />}
      />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default PartnerApplicationRoutes
