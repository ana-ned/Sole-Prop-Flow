import { Navigate, useLocation, useNavigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import NotEligible from "../../../components/Content/Registration/NotEligible"
import useAuth from "../../../hooks/useAuth"
import ErrorIndex from "../../../pages/error/_error"
import {
  OrganisationOverviewNotEligibleReasonEnum,
  RegisterOrganisationRequestMainEcommercePlatformEnum,
} from "../../../services/api/organisation-users"
import useAttributionReapply from "../../onboarding/hooks/useAttributionReapply"

const FundingNotEligible = () => {
  const navigate = useNavigate()
  const attributionReapply = useAttributionReapply()
  const { state } = useLocation() as {
    state: {
      reason?: OrganisationOverviewNotEligibleReasonEnum
      minimumRequiredRevenue?: number
      minimumRequiredRevenueCurrency?: string
      mainEcommercePlatform?: RegisterOrganisationRequestMainEcommercePlatformEnum
    } | null
  }
  const auth = useAuth()

  const reason = auth.organisationData?.notEligibleReason || state?.reason
  const notEligibleMinimumRevenue =
    auth.organisationData?.notEligibleMinimumRevenue?.amount ||
    state?.minimumRequiredRevenue
  const notEligibleMinimumRevenueCurrency =
    auth.organisationData?.notEligibleMinimumRevenue?.currency ||
    state?.minimumRequiredRevenueCurrency

  if (auth.isLoading) {
    return <PageLoader />
  }

  if (
    auth.hasOrganisationInToken &&
    !auth.organisationData?.notEligibleReason
  ) {
    return <Navigate to="/" />
  }

  if (!reason && !auth.hasOrganisationInToken) {
    return <Navigate to="/funding/eligibility-check" />
  }

  if (!reason) {
    return <ErrorIndex type="500" />
  }

  return (
    <NotEligible
      reason={reason}
      requiredRevenue={notEligibleMinimumRevenue}
      requiredCurrency={notEligibleMinimumRevenueCurrency}
      onReapply={async () => {
        await attributionReapply.mutateAsync()
        await navigate("/funding/eligibility-check")
      }}
      isReapplyPending={attributionReapply.isPending}
    />
  )
}

export default FundingNotEligible
