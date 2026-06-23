import { SupportedEnvVars } from "../types/globals"

// These variables will be always resolved in build time, regardless the environment.
const exceptions = new Set(["NODE_ENV", "REACT_APP_VERSION"])

// Resolve environment variable on runtime when on production (from env.js file) or from the regular env files on the local environment.
const env = (property: keyof SupportedEnvVars): string => {
  if (
    import.meta.env.DEV ||
    import.meta.env.MODE === "test" ||
    import.meta.env.REACT_APP_DOCKER === "true" ||
    exceptions.has(property)
  ) {
    return String(import.meta.env[property] || "")
  }

  return globalThis.__RUNTIME_ENV__[property] || ""
}

export default env
