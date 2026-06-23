import { Route, Routes, useLocation } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import DocumentsSingle from "../onboarding/pages/documents-single"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "./constants"
import DrawIndex from "./pages/draw"
import DrawSigning from "./pages/draw-signing"
import LineOfCreditIndex from "./pages/line-of-credit"
import MissingDocuments from "./pages/missing-documents"

const LineOfCreditRoutes = () => {
  const location = useLocation()
  const state = location.state as { backUrl: string } | undefined

  return (
    <Routes>
      <Route path="/missing-documents" element={<MissingDocuments />} />
      <Route
        path="/missing-documents/type/:slug"
        element={
          <DocumentsSingle
            backUrl={state?.backUrl || LINE_OF_CREDIT_DOCUMENTS_PATH}
          />
        }
      />
      <Route path="/:id/*" element={<LineOfCreditIndex />} />
      <Route path="/:id/draw" element={<DrawIndex />} />
      <Route path="/:id/draw/:drawId/sign/*" element={<DrawSigning />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default LineOfCreditRoutes
