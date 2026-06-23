import React from "react"
import { Navigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboarding from "../hooks/useOnboarding"
import { ApplicationFlowStepResponseStepEnum } from "../../../services/api/hubspot"

const ALLOWED_FOR_ACTIVE_USERS = new Set<ApplicationFlowStepResponseStepEnum>([
  ApplicationFlowStepResponseStepEnum.Offers,
  ApplicationFlowStepResponseStepEnum.Signing,
])

const OnboardingGuard = ({
  step,
  children,
}: {
  step: ApplicationFlowStepResponseStepEnum
  children: React.ReactNode
}) => {
  const { flowQuery } = useApplicationSteps()
  const { fullyCompleted } = useOnboarding()
  const auth = useAuth()
  const deal = useDeal()

  if (flowQuery.isLoading || deal.isLoading) {
    return <PageLoader />
  }

  if (fullyCompleted && !ALLOWED_FOR_ACTIVE_USERS.has(step)) {
    return <Navigate to="/" />
  }

  // if Marcus without deal in onboarding, redirect to dashboard
  if (
    [
      OrganisationOverviewOrganisationSourceEnum.Marcus,
      OrganisationOverviewOrganisationSourceEnum.Sellersfi,
    ].includes(auth.organisationData?.organisationSource as any) &&
    !deal.data
  ) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export default OnboardingGuard
