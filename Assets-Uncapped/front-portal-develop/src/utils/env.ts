import env from "./runtime-env"

export const isProduction = (): boolean =>
  env("REACT_APP_ENV") === "production" && import.meta.env.PROD

export const isDev = (): boolean =>
  env("REACT_APP_ENV") === "development" && import.meta.env.PROD

export const isLocal = (): boolean => import.meta.env.DEV

// Prototype mode: fully offline sandbox for /prototypes/*. Skips Auth0,
// Unleash, HubSpot, AppBase tracking — everything that would dial out.
export const isPrototypeMode = (): boolean =>
  import.meta.env.REACT_APP_PROTOTYPE_MODE === "true"

export const isTest = (): boolean => import.meta.env.MODE === "test"

export const isE2e = (): boolean =>
  !!globalThis.Cypress ||
  (import.meta.env.PROD && globalThis.location.hostname === "localhost")

const isPreview = (): boolean => globalThis.location.host.includes(".run.app")

export const isTrackingDisabled = (): boolean =>
  isLocal() || isE2e() || isPreview()

export const getCurrentEnv = () => {
  if (isProduction()) {
    return "production"
  }

  if (isDev()) {
    return "dev"
  }

  if (isLocal()) {
    return "local"
  }

  if (isPreview()) {
    return "preview"
  }

  if (isTest()) {
    return "test"
  }

  if (isE2e()) {
    return "e2e"
  }

  return undefined
}
