import { ErrorBoundary } from "@sentry/react"
import { useLocation } from "react-router"
import { useShallow } from "zustand/shallow"
import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
import useStore from "../../../hooks/useStore"
import AccountManagerWillContactModal from "../components/AccountManagerWillContactModal"
import MoreOptions from "../components/MoreOptions"
import Notifications from "../components/Notifications"
import PromotedBanner from "../components/PromotedBanner"
import SmsConsentModal from "../components/SmsConsentModal"
import Balances from "../components/Widgets/Balances/Balances"
import BusinessInsights from "../components/Widgets/BusinessInsights"
import LineOfCredit from "../components/Widgets/LineOfCredit/LineOfCredit"
import useMissingDocuments from "../hooks/useMissingDocuments"
import useSignableOfferRedirect from "../hooks/useSignableOfferRedirect"

const DashboardIndex = () => {
  useSignableOfferRedirect()

  const location = useLocation()
  const documents = useMissingDocuments()
  const { documentsReferer, setDocumentsReferer } = useStore(
    useShallow((state) => ({
      documentsReferer: state.documentsReferer,
      setDocumentsReferer: state.setDocumentsReferer,
    }))
  )

  return (
    <Layout menu={<PortalMenu menuOnMobile={location.pathname === "/"} />}>
      <AccountManagerWillContactModal
        isOpen={
          documentsReferer?.origin === "TOPUP_REQUEST" &&
          !documents.hasRemainingToUpload
        }
        onClose={() => {
          setDocumentsReferer(undefined)
        }}
      />
      <SmsConsentModal />

      <Layout.Parent>
        <div className="flex flex-col gap-y-6 lg:gap-y-8">
          <ErrorBoundary>
            <PromotedBanner />
          </ErrorBoundary>
          <ErrorBoundary>
            <Notifications />
          </ErrorBoundary>
          <LineOfCredit />
          <ErrorBoundary>
            <Balances />
          </ErrorBoundary>
          <ErrorBoundary>
            <BusinessInsights />
          </ErrorBoundary>
          <ErrorBoundary>
            <MoreOptions />
          </ErrorBoundary>
        </div>
      </Layout.Parent>
    </Layout>
  )
}

export default DashboardIndex
