import { useNavigate } from "react-router"
import ConnectionConsentView from "../components/ConnectionConsentView"

const ConnectionConsent = () => {
  const navigate = useNavigate()

  return (
    <ConnectionConsentView
      onBack={() => {
        globalThis.history.back()
      }}
      afterSubmit={async () => {
        await navigate("/connections")
      }}
    />
  )
}

export default ConnectionConsent
