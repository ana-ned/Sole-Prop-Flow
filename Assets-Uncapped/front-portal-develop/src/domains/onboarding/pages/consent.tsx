import { useNavigate, useParams } from "react-router"
import ErrorIndex from "../../../pages/error/_error"
import ConnectionConsentView from "../../connections/components/ConnectionConsentView"
import platforms from "../../connections/models/platforms"
import { onboardingConnectionOnSuccessRedirect } from "../utils/redirects"

const ConnectionConsent = () => {
  const { systemId } = useParams<{ systemId: string }>()
  const navigate = useNavigate()

  const platform = Object.values(platforms).find(
    (item) => item.systemId.toLowerCase() === systemId?.toLowerCase()
  )

  if (!platform) {
    return <ErrorIndex type="404" />
  }

  return (
    <ConnectionConsentView
      onBack={() => {
        globalThis.history.back()
      }}
      afterSubmit={async () => {
        await navigate(onboardingConnectionOnSuccessRedirect[platform.category])
      }}
    />
  )
}

export default ConnectionConsent
