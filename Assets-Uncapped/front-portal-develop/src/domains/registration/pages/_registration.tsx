import { useMemo } from "react"
import { useFlag, useFlagsStatus } from "@unleash/proxy-client-react"
import { Navigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import GallerySidebar from "../../../components/Collections/RegistrationSidebars/variants/GallerySidebar"
import useAuth from "../../../hooks/useAuth"
import usePartnerToken from "../../../hooks/usePartnerToken"
import { useTrackExperimentViewed } from "../../../hooks/useTrackExperiment"
import RegistrationExperiment from "../components/registration/RegistrationExperiment"
import RegistrationPageContent from "../components/registration/RegistrationPageContent"
import RegistrationLayout from "../components/RegistrationLayout"

const RegistrationIndex = () => {
  const auth = useAuth()
  const isExperimentEnabled = useFlag("ROME-1458-Login-Shuffle-Experiment")
  const flagStatus = useFlagsStatus()
  const { parsedToken } = usePartnerToken()

  const showExperiment = useMemo(
    () => isExperimentEnabled && !parsedToken,
    [isExperimentEnabled, parsedToken]
  )

  useTrackExperimentViewed({
    name: "ROME-1458-Login-Shuffle-Experiment",
    variant: showExperiment ? "v2" : "v1",
    enabled: !auth.isLoading && !auth.isAuthenticated,
  })

  if (auth.isLoading || !flagStatus.flagsReady) {
    return <PageLoader />
  }

  if (auth.isAuthenticated) {
    if (!auth.hasOrganisationInToken) {
      return <Navigate to="/funding/eligibility-check" />
    }
    return <Navigate to={auth.organisation?.activated ? "/" : "/onboarding"} />
  }

  if (showExperiment) {
    return <RegistrationExperiment />
  }

  return (
    <RegistrationLayout sidebar={<GallerySidebar />}>
      <RegistrationPageContent />
    </RegistrationLayout>
  )
}

export default RegistrationIndex
