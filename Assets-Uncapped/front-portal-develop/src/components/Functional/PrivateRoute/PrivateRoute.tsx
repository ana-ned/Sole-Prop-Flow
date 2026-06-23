import { withAuthenticationRequired } from "@auth0/auth0-react"
import { useLocation, Navigate, Outlet } from "react-router"
import {
  ONBOARDING_BASE_PATH,
  OnboardingPaths,
} from "../../../domains/onboarding/constants"
import EligibilityCheckStatusPaths from "../../../domains/registration/EligibilityCheckStatusPaths"
import useAuth from "../../../hooks/useAuth"
import { UserRoles } from "../../../hooks/useAuth.types"
import useDeal from "../../../hooks/useDeal"
import usePartnerToken from "../../../hooks/usePartnerToken"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import PageLoader from "../../Collections/PageLoader"

const PrivateRoute = ({
  role,
  redirects = true,
}: {
  role?: UserRoles
  redirects?: boolean
}) => {
  const {
    isAuthenticated,
    user,
    organisation,
    isLoading,
    isSocialAccount,
    ...auth
  } = useAuth()
  const location = useLocation()
  const deal = useDeal()
  const partnerToken = usePartnerToken()

  const isUnregisteredSocialAccount =
    isSocialAccount &&
    isAuthenticated &&
    user &&
    !auth.hasRole(UserRoles.REGISTERED)

  if (isLoading || !isAuthenticated || deal.isLoading) {
    return <PageLoader overlay />
  }

  if (isUnregisteredSocialAccount) {
    return <Navigate to="auth/oauth" />
  }

  if (role && !auth.hasRole(role)) {
    return <Navigate replace to="404" />
  }

  if (auth.hasRole(UserRoles.CUSTOMER) && redirects) {
    if (partnerToken.token) {
      return <Navigate to="/auth/partner" />
    }

    if (
      auth.organisationData?.notEligibleReason &&
      !location.pathname.includes("funding/status") &&
      !location.pathname.includes("funding/eligibility-check")
    ) {
      return (
        <Navigate
          to={`/funding/status/${EligibilityCheckStatusPaths.NotEligible}`}
        />
      )
    }

    if (
      location.pathname.includes(ONBOARDING_BASE_PATH) &&
      !location.pathname.includes(
        ONBOARDING_BASE_PATH + OnboardingPaths.Rejected
      ) &&
      deal.shouldRedirectToRejection
    ) {
      return <Navigate to={ONBOARDING_BASE_PATH + OnboardingPaths.Rejected} />
    }

    if (
      !location.pathname.includes(ONBOARDING_BASE_PATH) &&
      !location.pathname.includes("funding/") &&
      !location.pathname.includes("registration/") &&
      !location.pathname.includes("/s/") &&
      !organisation?.activated &&
      auth.hasOrganisationInToken
    ) {
      return <Navigate to={ONBOARDING_BASE_PATH} />
    }

    if (
      !auth.hasOrganisationInToken &&
      !location.pathname.includes("funding/") &&
      !location.pathname.includes("registration/")
    ) {
      return <Navigate to="/funding/eligibility-check" />
    }

    if (
      [
        OrganisationOverviewOrganisationSourceEnum.Marcus,
        OrganisationOverviewOrganisationSourceEnum.Sellersfi,
      ].includes(auth.organisationData?.organisationSource as any) &&
      !auth.organisationData?.preferences?.seenMarcusWelcomeModal &&
      !location.pathname.includes("connections")
    ) {
      return <Navigate to="/connections" />
    }
  }

  return <Outlet />
}

export default globalThis.Cypress &&
!globalThis.localStorage.getItem("auth0RequireAuth")
  ? PrivateRoute
  : withAuthenticationRequired(PrivateRoute, {
      onRedirecting: () => <PageLoader />,
    })
