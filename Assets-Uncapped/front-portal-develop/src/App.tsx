import "./inits/i18next"
import React, { useEffect } from "react"
import * as Sentry from "@sentry/react"
import {
  Route,
  BrowserRouter,
  Routes,
  Navigate,
  useLocation,
} from "react-router"
import PageLoader from "./components/Collections/PageLoader"
import GodMode from "./components/Functional/GodMode"
import Guard from "./components/Functional/Guard"
import PrivateRoute from "./components/Functional/PrivateRoute"
import ToastConfiguredProvider from "./components/UI/Toast"
import DashboardBookCall from "./domains/dashboard/pages/book-call"
import { KYC_BASE_PATH } from "./domains/kyc/paths"
import { ONBOARDING_BASE_PATH } from "./domains/onboarding/constants"
import { UserRoles } from "./hooks/useAuth.types"
import AppProviders from "./inits/app-providers"
import ErrorIndex from "./pages/error/_error"
import AmazonLogin from "./pages/oauth/amazon"
import AmazonCallback from "./pages/oauth/amazon-callback"
import { isDev, isLocal } from "./utils/env"
import useHubSpotScript from "./hooks/useHubSpotScript"

const Chat = React.lazy(() => import("./pages/chat/chat"))
const OAuthIndex = React.lazy(() => import("./pages/oauth/_oauth"))
const InviteMembers = React.lazy(
  () => import("./domains/invitations/pages/invite-members")
)
const InviteMembersList = React.lazy(
  () => import("./domains/invitations/pages/invitations-list")
)
const Invitations = React.lazy(
  () => import("./domains/invitations/pages/_invitations")
)
const ConnectionsRoutes = React.lazy(
  () => import("./domains/connections/routes")
)
const LineOfCreditRoutes = React.lazy(
  () => import("./domains/line-of-credit/routes")
)
const DashboardIndex = React.lazy(
  () => import("./domains/dashboard/pages/_dashboard")
)
const AgreementsRoutes = React.lazy(() => import("./domains/agreements/routes"))
const OnboardingRoutes = React.lazy(() => import("./domains/onboarding/routes"))
const PartnerRegistrationRoutes = React.lazy(
  () => import("./domains/partner-registration/routes")
)
const PartnerApplicationRoutes = React.lazy(
  () => import("./domains/partner-application/routes")
)
const PartnerReferrals = React.lazy(
  () => import("./domains/partner-dashboard/pages/partner-referrals")
)
const PartnerDashboard = React.lazy(
  () => import("./domains/partner-dashboard/pages/_partner-dashboard")
)
const PayRoutes = React.lazy(() => import("./domains/pay/routes"))
const RegistrationRoutes = React.lazy(
  () => import("./domains/registration/routes")
)
const FundingRoutes = React.lazy(
  () => import("./domains/registration/routes-funding")
)
const TransactionRoutes = React.lazy(
  () => import("./domains/transactions/routes")
)
const KycRoutes = React.lazy(() => import("./domains/kyc/routes"))
const StaticRoutes = React.lazy(() => import("./domains/static/routes"))

const WithdrawRoutes = React.lazy(() => import("./domains/withdraw/routes"))

const ProfileRoutes = React.lazy(() => import("./pages/profile/routes"))

const CampaignRoutes = React.lazy(() => import("./domains/campaign/routes"))

const AuthRoutes = React.lazy(() => import("./domains/auth/routes"))

const PrototypesRoutes = React.lazy(() => import("./domains/prototypes/routes"))

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes)

const FallbackErrorPage = ({
  error,
}: {
  error: unknown
  componentStack: string
  eventId: string
}) => <ErrorIndex type="500" error={error} />

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const App = () => {
  useHubSpotScript()

  return (
    <React.Suspense fallback={<PageLoader overlay />}>
      <BrowserRouter>
        <Sentry.ErrorBoundary fallback={FallbackErrorPage}>
          <AppProviders>
            <ToastConfiguredProvider />
            <GodMode />
            <ScrollToTop />
            <SentryRoutes>
              {/* Guest Routes */}
              <Route path="/auth/oauth" element={<OAuthIndex />} />
              <Route path="/auth/amazon" element={<AmazonLogin />} />
              <Route
                path="/auth/amazon/callback"
                element={<AmazonCallback />}
              />
              <Route path="/auth/*" element={<AuthRoutes />} />
              <Route path="/registration/*" element={<RegistrationRoutes />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/invitation/:code" element={<Invitations />} />
              <Route
                path="/partner-invitation/:code"
                element={<Invitations />}
              />
              <Route path="/invite-members" element={<InviteMembers />} />
              <Route
                path="/invite-members/list"
                element={<InviteMembersList />}
              />
              <Route path={`/${KYC_BASE_PATH}/*`} element={<KycRoutes />} />
              <Route
                path="/partner/registration/*"
                element={<PartnerRegistrationRoutes />}
              />

              {(isLocal() || isDev()) && (
                <Route path="/prototypes/*" element={<PrototypesRoutes />} />
              )}
              <Route path="/campaign/*" element={<CampaignRoutes />} />
              <Route path="/s/*" element={<StaticRoutes />} />

              {/* Common Routes */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/"
                  element={
                    <>
                      <Guard role={UserRoles.CUSTOMER}>
                        <DashboardIndex />
                      </Guard>
                      <Guard role={UserRoles.PARTNER}>
                        <PartnerDashboard />
                      </Guard>
                    </>
                  }
                />
                <Route path="/profile/*" element={<ProfileRoutes />} />
              </Route>

              {/* Customer Routes */}
              <Route element={<PrivateRoute role={UserRoles.CUSTOMER} />}>
                <Route path="/funding/*" element={<FundingRoutes />} />
                <Route
                  path={`${ONBOARDING_BASE_PATH}/*`}
                  element={<OnboardingRoutes />}
                />
                <Route path="/loans/*" element={<AgreementsRoutes />} />
                <Route
                  path="/line-of-credit/*"
                  element={<LineOfCreditRoutes />}
                />
                <Route path="/connections/*" element={<ConnectionsRoutes />} />
                <Route path="/pay/*" element={<PayRoutes />} />
                <Route path="/transactions/*" element={<TransactionRoutes />} />
                <Route path="/withdraw/*" element={<WithdrawRoutes />} />
                <Route path="/book-call" element={<DashboardBookCall />} />
              </Route>

              {/* Partner Routes */}
              <Route element={<PrivateRoute role={UserRoles.PARTNER} />}>
                <Route
                  path="/partner/application/*"
                  element={<PartnerApplicationRoutes />}
                />
                <Route path="/referrals" element={<PartnerReferrals />} />
              </Route>

              {/* Redirects */}
              <Route
                path="/dashboard/stories/additional-funding"
                element={<Navigate to="/" replace />}
              />

              {/* Error Routes */}
              <Route path="/error/auth" element={<ErrorIndex type="auth" />} />
              <Route path="*" element={<ErrorIndex type="404" />} />
            </SentryRoutes>
          </AppProviders>
        </Sentry.ErrorBoundary>
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
