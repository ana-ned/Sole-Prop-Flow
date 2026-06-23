import { Route, Routes } from "react-router"
import ErrorIndex from "../../pages/error/_error"
import ConnectionsAdd from "./pages/connections-add"
import ConnectionsAddConsent from "./pages/connections-add-consent"
import ConnectionsIndex from "./pages/connections-index"
import ManualConnectionAmazon from "./pages/connections-manual/connections-manual-amazon"
import ManualConnectionBraintree from "./pages/connections-manual/connections-manual-braintree"
import ManualConnectionCheckout from "./pages/connections-manual/connections-manual-checkout"
import ManualConnectionKlarna from "./pages/connections-manual/connections-manual-klarna"
import ManualConnectionShopify from "./pages/connections-manual/connections-manual-shopify"
import ManualConnectionWalmart from "./pages/connections-manual/connections-manual-walmart"
import ConnectionsPlaid from "./pages/connections-plaid"

export const ManualConnectionsRoutes = () => (
  <Routes>
    <Route path="braintree" element={<ManualConnectionBraintree />} />
    <Route path="checkout" element={<ManualConnectionCheckout />} />
    <Route path="amazon_v2" element={<ManualConnectionAmazon />} />
    <Route path="shopify_v2" element={<ManualConnectionShopify />} />
    <Route path="klarna" element={<ManualConnectionKlarna />} />
    <Route path="walmart" element={<ManualConnectionWalmart />} />
  </Routes>
)

const ConnectionsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ConnectionsIndex />} />
      <Route path="/add/manual/*" element={<ManualConnectionsRoutes />} />
      <Route
        path="/add/consent/:systemId"
        element={<ConnectionsAddConsent />}
      />
      <Route path="/add/:type" element={<ConnectionsAdd />} />
      <Route path="/plaid" element={<ConnectionsPlaid />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default ConnectionsRoutes
