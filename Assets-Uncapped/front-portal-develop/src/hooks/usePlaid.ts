import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
} from "react-plaid-link"
import apiConfig, { ApiServicesEnum } from "../services/api/api-config"
import {
  PlaidConnectionApi,
  PlaidLinkErrorPayload,
  PlaidUserEvent,
} from "../services/api/connections"
import QUERY_KEYS from "../utils/query-keys"
import useAuth from "./useAuth"
import useBrowserStorage from "./useBrowserStorage"

export enum PlaidAction {
  CONNECT_WITH_INSTITUTION = "CONNECT_WITH_INSTITUTION",
  RECONNECT = "RECONNECT",
  OAUTH = "OAUTH",
}

const usePlaid = ({
  redirectUrl,
  method,
  onSuccessCallback,
  onExitCallback,
}: {
  redirectUrl: string
  method: PlaidAction
  onSuccessCallback: () => void
  onExitCallback?: (metadata: PlaidLinkOnExitMetadata) => void
}) => {
  const auth = useAuth()
  const [institutionId, setInstitutionId] = useState<string>()
  const [timestamp, setTimestamp] = useState<number>()

  // This connection ID is used only for handling reconnection flow.
  const [connectionId, setConnectionId] = useState<string>()

  // In memory token - used for connect and reconnect
  const [token, setToken] = useState<string | null>(null)

  // Persisted token - used for OAuth
  const [plaidLinkToken, setPlaidLinkToken, removePlaidLinkToken] =
    useBrowserStorage<string>(auth.user?.sub, "plaidLinkToken")

  const fetchToken = useQuery({
    queryKey: [
      QUERY_KEYS.connections.plaidStart,
      redirectUrl,
      institutionId,
      timestamp,
    ],
    queryFn: async () => {
      return new PlaidConnectionApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).getToken({
        xXORGID: auth.organisation?.organisationId!,
        redirectUrl,
        institutionId,
      })
    },
    enabled: !!timestamp,
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    if (fetchToken.data?.linkToken) {
      setToken(fetchToken.data.linkToken)
      setPlaidLinkToken(fetchToken.data.linkToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchToken.data])

  const {
    data: refetchData,
    refetch: refetchReconnectionToken,
    isLoading: isReconnectLoading,
    isError: isReconnectError,
  } = useQuery({
    queryKey: [QUERY_KEYS.connections.plaidReconnect, connectionId],

    queryFn: async () =>
      new PlaidConnectionApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).reconnect({
        xXORGID: auth.organisation?.organisationId!,
        connectionId: connectionId!,
        redirectUrl,
      }),
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    if (refetchData?.linkToken) {
      setToken(refetchData.linkToken)
      setPlaidLinkToken(refetchData.linkToken)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchData])

  const getConnectionId = async (linkSessionId: string) => {
    if (connectionId) {
      return connectionId
    }

    const findOrCreate = await new PlaidConnectionApi(
      apiConfig({
        token: await auth.getToken(),
        service: ApiServicesEnum.Connections,
      })
    ).createPlaidConnection({
      xXORGID: auth.organisation?.organisationId!,
      linkSessionId,
    })

    return findOrCreate.id!
  }

  const addToken = useMutation({
    mutationFn: async ({
      metadata,
      publicToken,
    }: {
      metadata: PlaidLinkOnSuccessMetadata
      publicToken: string
    }) =>
      new PlaidConnectionApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).addToken({
        xXORGID: auth.organisation?.organisationId!,
        connectionId: await getConnectionId(metadata.link_session_id),
        plaidExchangeTokenRequest: {
          metadata: {
            institution: {
              institutionId: metadata.institution?.institution_id,
              name: metadata.institution?.name,
            },
            accounts: metadata.accounts,
            linkSessionId: metadata.link_session_id,
          },
          publicToken,
          oauth: method === PlaidAction.OAUTH,
        },
      }),
    onSuccess: () => {
      onSuccessCallback()
      setConnectionId(undefined)
      setToken(null)
      removePlaidLinkToken()
    },
  })

  const uploadError = useMutation({
    mutationFn: async (plaidLinkErrorPayload: PlaidLinkErrorPayload) =>
      new PlaidConnectionApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).handleError({
        connectionId: await getConnectionId(
          plaidLinkErrorPayload.metadata?.linkSessionId!
        ),
        xXORGID: auth.organisation?.organisationId!,
        plaidLinkErrorPayload,
      }),
  })

  const uploadEvent = useMutation({
    mutationFn: async (plaidUserEvent: PlaidUserEvent) =>
      new PlaidConnectionApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Connections,
        })
      ).handleEvent({
        xXORGID: auth.organisation?.organisationId!,
        connectionId: await getConnectionId(
          plaidUserEvent.metadata?.linkSessionId!
        ),
        plaidUserEvent,
      }),
  })

  const {
    open,
    ready,
    error: plaidLinkError,
  } = usePlaidLink({
    token: method === PlaidAction.OAUTH ? plaidLinkToken! : token,
    receivedRedirectUri:
      method === PlaidAction.OAUTH ? globalThis.location.href : undefined,
    onSuccess: (publicToken, metadata) => {
      addToken.mutate({ publicToken, metadata })
    },
    onExit: async (error, metadata) => {
      setConnectionId(undefined)
      setToken(null)
      if (error) {
        await uploadError.mutateAsync({
          error: {
            errorType: error.error_type,
            errorCode: error.error_code,
            errorMessage: error.error_message,
            displayMessage: error.display_message,
          },
          metadata: {
            institution: {
              institutionId: metadata.institution?.institution_id,
              name: metadata.institution?.name,
            },
            status: metadata.status!,
            linkSessionId: metadata.link_session_id,
            requestId: metadata.request_id,
          },
        })
      }
      onExitCallback?.(metadata)
    },
    onEvent: async (eventName, metadata) => {
      // This duplicates connection creation because Plaid fires off
      // 2 events at exact same time so we can't dedupe them.
      if (eventName === "TRANSITION_VIEW") {
        return
      }

      if (!metadata.link_session_id) {
        return
      }

      await uploadEvent.mutateAsync({
        eventName,
        metadata: {
          errorType: metadata.error_type!,
          errorCode: metadata.error_code!,
          errorMessage: metadata.error_message!,
          exitStatus: metadata.exit_status!,
          institutionId: metadata.institution_id!,
          institutionSearchQuery: metadata.institution_search_query!,
          mfaType: metadata.mfa_type!,
          viewName: metadata.view_name!,
          requestId: metadata.request_id,
          linkSessionId: metadata.link_session_id,
          timestamp: metadata.timestamp,
          selection: metadata.selection!,
        },
      })
    },
  })

  useEffect(() => {
    if (ready && method === PlaidAction.RECONNECT && connectionId) {
      open()
    }
  }, [open, ready, connectionId, method])

  useEffect(() => {
    if (ready && method === PlaidAction.CONNECT_WITH_INSTITUTION) {
      open()
    }
  }, [ready, method, open])

  useEffect(() => {
    if (
      !isReconnectLoading &&
      connectionId &&
      method === PlaidAction.RECONNECT
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetchReconnectionToken()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReconnectLoading, connectionId])

  return {
    open,
    openWithInstitution: (id?: string) => {
      setInstitutionId(id)
      setTimestamp(Date.now())
    },
    ready,
    plaidLinkError,
    isTokenError: fetchToken.isError,
    reconnect: setConnectionId,
    isReconnectError,
  }
}

export default usePlaid
