/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vitest/globals" />

export interface SupportedEnvVars {
  readonly NODE_ENV: string
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_AUTH0_DOMAIN: string
  readonly REACT_APP_AUTH0_CLIENT_ID: string
  readonly REACT_APP_AUTH0_AUDIENCE: string
  readonly REACT_APP_ENV: string
  readonly REACT_APP_VERSION: string
  readonly REACT_APP_SENTRY_DSN: string
  readonly REACT_APP_GOOGLE_PLACES_API_KEY: string
  readonly REACT_APP_SEGMENT_API_KEY: string
  readonly REACT_APP_UNLEASH_CLIENT_KEY: string
  readonly REACT_APP_UNLEASH_URL: string
  readonly REACT_APP_PROTOTYPE_MODE: string
}

declare global {
  var __RUNTIME_ENV__: SupportedEnvVars
  var Cypress: any
  var _hsq: any
  var HubSpotConversations: any
  var ga: any
  var clarity:
    | undefined
    | {
        (
          method: "identify",
          customuserid: string,
          customsessionid?: string,
          custompageid?: string
        ): void
        (method: "set", key: string, value: string | string[]): void
      }
}
