import React from "react"
import * as Sentry from "@sentry/react"
import { createRoot } from "react-dom/client"
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router"
import { UnleashClient } from "unleash-proxy-client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { isE2e, isLocal, isPrototypeMode } from "./utils/env"
import env from "./utils/runtime-env"

if (env("REACT_APP_SENTRY_DSN")) {
  Sentry.init({
    release: env("REACT_APP_VERSION"),
    environment: env("REACT_APP_ENV"),
    dsn: env("REACT_APP_SENTRY_DSN"),
    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration(),
      Sentry.captureConsoleIntegration({
        levels: ["error", "fatal"],
      }),
      Sentry.unleashIntegration({ featureFlagClientClass: UnleashClient }),
    ],
    beforeSend: (event, hint) => {
      if (hint.originalException === "Timeout") {
        return null
      }
      return event
    },
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    enabled: !!env("REACT_APP_SENTRY_DSN") && !isE2e(),
    allowUrls: [/weareuncapped\.com/],
    ignoreErrors: [
      /ChunkLoadError/,
      /i18next::backendConnector: loaded namespace/,
      /i18next: initialized/,
      /i18next: languageChanged/,
      /useTracking:/,
      // Targets Segment:
      /Failed to fetch/,
      "TypeError: Load failed",
      /Failed to create PluginFactory/,
      // Targets Unleash, Segment:
      /NetworkError when attempting to fetch resource/,
      // Targets API non-200 responses:
      /Response returned an error code/,
      /Unable to preload CSS for/,
      /Object Not Found Matching Id:\d+/,
    ],
  })
}

const mockApiRequests = async () => {
  if (isLocal() && import.meta.env.REACT_APP_MSW_ENABLED === "true") {
    const { worker } = await import("./mocks/browser")
    await worker.start({
      // Prototype mode: warn loudly on any request that wasn't explicitly
      // mocked, so a leaked live call would be obvious in the console.
      // Outside prototype mode, keep the original "bypass" behaviour.
      onUnhandledRequest: isPrototypeMode() ? "warn" : "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
  } else {
    await Promise.resolve()
  }
}

globalThis.addEventListener("vite:preloadError", (event) => {
  Sentry.captureException(event, {
    captureContext: { level: "warning", tags: { type: "vite:preloadError" } },
  })
  globalThis.location.reload()
})

mockApiRequests().then(() => {
  createRoot(document.querySelector("#root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
