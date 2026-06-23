import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"
import useAuth from "../../../hooks/useAuth"
import useBrowserStorage from "../../../hooks/useBrowserStorage"
import { useModal } from "../../../hooks/useModal"
import { useTracking } from "../../../hooks/useTracking"
import {
  ConnectionResponse,
  ConnectionResponseStatusEnum,
} from "../../../services/api/connections"
import { ONBOARDING_BASE_PATH } from "../../onboarding/constants"
import { onboardingConnectionOnSuccessRedirect } from "../../onboarding/utils/redirects"
import ConnectionDuplicate from "../components/Modals/ConnectionDuplicate"
import platforms from "../models/platforms"

const useNewConnectionModal = (latestConnections?: ConnectionResponse[]) => {
  const auth = useAuth()
  const { isModalOpen, setModal, openModal } = useModal()
  const { trackEvent } = useTracking()
  const location = useLocation()
  const navigate = useNavigate()
  const [cachedConnections, setConnectionsCache] = useBrowserStorage<
    ConnectionResponse[]
  >(auth.organisation?.organisationId, "connections_v3")

  useEffect(() => {
    if (latestConnections) {
      setConnectionsCache(latestConnections)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestConnections])

  useEffect(() => {
    const didConnectionsCountChanged =
      latestConnections &&
      !!cachedConnections &&
      cachedConnections.length < latestConnections.length

    if (!isModalOpen && didConnectionsCountChanged) {
      const recentConnection = latestConnections.toSorted((a, b) =>
        a.createdAt && b.createdAt
          ? b.createdAt.getTime() - a.createdAt.getTime()
          : 0
      )[0]
      const recentPlatform = Object.values(platforms).find(
        ({ systemId }) => systemId === recentConnection.systemId
      )

      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        recentConnection &&
        recentConnection.systemId !== platforms.Invoicing.systemId &&
        recentConnection.connectionTemplateId !==
          platforms.DirectDebit.connectionTemplateId
      ) {
        if (
          recentConnection.status === ConnectionResponseStatusEnum.Connected ||
          recentConnection.status === ConnectionResponseStatusEnum.Connecting
        ) {
          const isOnboarding = location.pathname.includes(ONBOARDING_BASE_PATH)
          trackEvent({
            category: "connections",
            name: "connection",
            action:
              recentConnection.status === ConnectionResponseStatusEnum.Connected
                ? "connected"
                : "connecting",
            customFields: {
              category: recentPlatform?.category!,
              platform: recentPlatform?.systemId!,
            },
          })
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          navigate(
            isOnboarding && recentPlatform?.category
              ? onboardingConnectionOnSuccessRedirect[recentPlatform.category]
              : "/connections"
          )
        } else if (
          recentConnection.status === ConnectionResponseStatusEnum.Duplicated
        ) {
          setModal(<ConnectionDuplicate platform={recentPlatform!} />)
          openModal()

          trackEvent({
            category: "connections",
            name: "connection",
            action: "duplicated",
            customFields: {
              category: recentPlatform?.category!,
              platform: recentPlatform?.systemId!,
            },
          })
        } else {
          trackEvent({
            category: "connections",
            name: "connection",
            action: "error",
            customFields: {
              category: recentPlatform?.category!,
              platform: recentPlatform?.systemId!,
            },
          })
        }

        setConnectionsCache(latestConnections)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestConnections])
}

export default useNewConnectionModal
