import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router"
import { useLocalStorage } from "usehooks-ts"
import useAuth from "../../../hooks/useAuth"
import usePlaid, { PlaidAction } from "../../../hooks/usePlaid"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ConnectionControllerApi,
  ConnectionResponse,
  ConnectionResponseStatusEnum,
  GetConnectionsStatusEnum,
  LinkConnectionProcessControllerApi,
} from "../../../services/api/connections"
import { displayErrorToast } from "../../../utils/error-handling"
import { url } from "../../../utils/url"
import { ONBOARDING_BASE_PATH } from "../../onboarding/constants"
import { documentQueryKeys } from "../../onboarding/queries"
import { onboardingConnectionOnSuccessRedirect } from "../../onboarding/utils/redirects"
import platforms, { Platform } from "../models/platforms"
import useNewConnectionModal from "./useNewConnectionModal"
import useRedirectUri from "./useRedirectUri"
import useWindowOpenerAutoclose from "./useWindowOpenerAutoclose"

export const CONNECTIONS_QUERY_KEY = "connections_list"

export const isBankConnection = (connection: ConnectionResponse) =>
  connection.type === "BANK"

const useConnections = () => {
  const { isAuthenticated, getToken, organisation } = useAuth()
  const queryClient = useQueryClient()
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const location = useLocation()
  const [shouldForceRetch, setForceRefetch] = useLocalStorage(
    "refetch-connections",
    false
  )

  useWindowOpenerAutoclose()

  const {
    data: createdConnections,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [CONNECTIONS_QUERY_KEY],
    queryFn: async () =>
      new ConnectionControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).getConnections({
        xXORGID: organisation?.organisationId!,
        // @ts-expect-error api shit 111
        status: [
          GetConnectionsStatusEnum.Connected,
          GetConnectionsStatusEnum.Connecting,
          GetConnectionsStatusEnum.Error,
        ],
        page: 0,
        size: 999,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId!,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (shouldForceRetch) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetch()
      setForceRefetch(false)
    }
  }, [refetch, setForceRefetch, shouldForceRetch])

  const plaid = usePlaid({
    redirectUrl: url("/connections/plaid", true),
    method: PlaidAction.RECONNECT,
    onSuccessCallback: () => refetch(),
    onExitCallback: async () => {
      await navigate(location.pathname)
    },
  })

  const openRedirectUrl = useRedirectUri(
    async () => {
      await refetch()
    },
    async () => {
      await queryClient.cancelQueries({
        queryKey: [CONNECTIONS_QUERY_KEY],
      })
    }
  )

  const createAndRedirectToProvider = useMutation({
    mutationFn: async (params: {
      platform: Platform
      countryCode?: string
      institutionId?: string
    }) => {
      const response = await new LinkConnectionProcessControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).createAndRedirectToAuthorizationProvider({
        xXORGID: organisation?.organisationId!,
        linkRequest: {
          connectionTemplateId: params.platform.connectionTemplateId,
          systemId: params.platform.systemId,
          backUrl: organisation?.activated
            ? url(`connections?linkSystemId=${params.platform.systemId}`)
            : `${onboardingConnectionOnSuccessRedirect[params.platform.category]}?linkSystemId=${params.platform.systemId}`,
          countryCode: params.countryCode,
          institutionId: params.institutionId,
        },
      })

      await openRedirectUrl(response.redirectUrl || "", params.platform)
    },
    onError: async (e: Response) => {
      await displayErrorToast(e)
      await refetch()
    },
  })

  const handleReconnect = useMutation({
    mutationFn: async ({
      connectionId,
      platform,
    }: {
      connectionId: string
      platform: Platform
    }) => {
      if (platform.systemId === "PLAID") {
        plaid.reconnect(connectionId)
        return
      }

      const response = await new ConnectionControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).reconnectV31({
        xXORGID: organisation?.organisationId!,
        connectionId,
        reconnectRequest: {
          backUrl: organisation?.activated
            ? url("connections")
            : onboardingConnectionOnSuccessRedirect[platform.category],
        },
      })

      if (response.redirectUrl) {
        await openRedirectUrl(response.redirectUrl, platform)
        await refetch()
      }
    },
  })

  /**
   * Opens popup with given authorization provider such as amazon/google etc.
   */
  const handleOpenAuthorizationProvider = async (platform: Platform) => {
    // This is only for Xero + Saltedge.
    if (platform.automatic && platform.consentRequired) {
      await navigate(
        location.pathname.includes(ONBOARDING_BASE_PATH)
          ? `${ONBOARDING_BASE_PATH}/consent/${platform.systemId.toLowerCase()}`
          : `/connections/add/consent/${platform.systemId.toLowerCase()}`
      )
      trackEvent({
        category: "connections",
        name: "box",
        action: "click",
        customFields: {
          name: platform.name,
          category: platform.category,
          mode: "consent",
        },
      })
      return
    }

    const unfinishedConnectionByPlatform = createdConnections?.content?.find(
      ({ connectionTemplateId, status }) =>
        connectionTemplateId === platform.connectionTemplateId &&
        status === ConnectionResponseStatusEnum.NotFinished
    )
    if (!platform.reuse && !!unfinishedConnectionByPlatform) {
      handleReconnect.mutate({
        connectionId: unfinishedConnectionByPlatform.id!,
        platform,
      })
      return
    }
    if (!platform.automatic) {
      await navigate(
        location.pathname.includes(ONBOARDING_BASE_PATH)
          ? `${ONBOARDING_BASE_PATH}/manual/${platform.systemId.toLowerCase()}`
          : `/connections/add/manual/${platform.systemId.toLowerCase()}`
      )
      return
    }

    createAndRedirectToProvider.mutate({ platform })
  }

  const handleDeleteConnection = useMutation({
    mutationFn: async (connectionId: string): Promise<void> => {
      await new ConnectionControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).deleteConnection({
        xXORGID: organisation?.organisationId!,
        connectionId,
      })
      await refetch()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
      })
    },
  })

  useNewConnectionModal(createdConnections?.content)

  const connections =
    createdConnections?.content?.filter(
      (item) =>
        item.systemId !== platforms.Invoicing.systemId &&
        item.connectionTemplateId !== platforms.DirectDebit.connectionTemplateId
    ) || []

  const salesConnections =
    createdConnections?.content?.filter(
      ({ type, systemId }) =>
        type === "SALES" ||
        type === "SUBSCRIPTION" ||
        (type === "MARKETING" && systemId === "AMAZON_ADS")
    ) || []

  const accountingConnections =
    createdConnections?.content?.filter(
      ({ type, systemId }) =>
        type === "ACCOUNTING" && systemId !== platforms.Invoicing.systemId
    ) || []

  const bankingConnections =
    createdConnections?.content?.filter((connection) =>
      isBankConnection(connection)
    ) || []

  return {
    handleOpenAuthorizationProvider,
    salesConnections,
    accountingConnections,
    bankingConnections,
    handleDeleteConnection,
    handleReconnect,
    refetchConnections: refetch,
    connections,
    isLoading,
    createAndRedirectToProvider,
  }
}

export default useConnections
