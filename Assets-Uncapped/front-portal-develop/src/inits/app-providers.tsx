import React from "react"
import { Auth0Provider } from "@auth0/auth0-react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { FlagProvider } from "@unleash/proxy-client-react"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { useNavigate } from "react-router"
import AppBase from "../AppBase"
import PageLoader from "../components/Collections/PageLoader"
import useAuth from "../hooks/useAuth"
import useAuthorizedUnleashConfig from "../hooks/useAuthorizedUnleashConfig"
import { ModalProvider } from "../hooks/useModal"
import useTheme from "../hooks/useTheme"
import { TrackingProvider } from "../hooks/useTracking"
import { isPrototypeMode } from "../utils/env"
import { logError } from "../utils/error-handling"
import env from "../utils/runtime-env"

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      logError(error)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      logError(error)
    },
  }),
})

const CoreApplicationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const auth = useAuth()
  const unleashConfig = useAuthorizedUnleashConfig()
  useTheme() // Initialize theme hook

  if (auth.isLoading) {
    return <PageLoader overlay />
  }

  return <FlagProvider config={unleashConfig}>{children}</FlagProvider>
}

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()
  const onRedirectCallback = async (appState: any) => {
    await navigate(appState?.returnTo || globalThis.location.pathname)
  }

  // Prototype sandbox: skip Auth0, Unleash, AppBase, Tracking. None of those
  // can dial out because they're never instantiated. Prototype pages get a
  // minimal provider tree (router-aware URL params, react-query, modals).
  if (isPrototypeMode()) {
    return (
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <ModalProvider>{children}</ModalProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    )
  }

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={env("REACT_APP_AUTH0_DOMAIN")}
          clientId={env("REACT_APP_AUTH0_CLIENT_ID")}
          authorizationParams={{
            redirect_uri: globalThis.location.origin,
            audience: env("REACT_APP_AUTH0_AUDIENCE"),
          }}
          onRedirectCallback={onRedirectCallback}
        >
          <CoreApplicationProvider>
            <TrackingProvider>
              <ModalProvider>
                <AppBase>{children}</AppBase>
              </ModalProvider>
            </TrackingProvider>
          </CoreApplicationProvider>
        </Auth0Provider>
      </QueryClientProvider>
    </NuqsAdapter>
  )
}

export default AppProviders
