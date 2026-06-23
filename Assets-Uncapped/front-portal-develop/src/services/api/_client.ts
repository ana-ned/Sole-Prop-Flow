/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { CustomError } from "ts-custom-error"
import env from "../../utils/runtime-env"

class ApiError extends CustomError {
  constructor(
    public code: string,
    public message: string,
    public details?: { code: string; message: string; fieldName?: string }[]
  ) {
    super(message)
  }
}

const client = async (
  endpoint: string,
  customConfig: {
    token?: string
    organisation?: string
    body?: any
    method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH"
    headers?: any
  } = {}
) => {
  const { token, organisation, ...overrideConfig } = customConfig
  const config = {
    method: "GET",
    ...overrideConfig,
    body: overrideConfig.body ? JSON.stringify(overrideConfig.body) : undefined,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...overrideConfig.headers,
    },
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (organisation) {
    config.headers["xx-org-id"] = organisation
  }

  const response = await fetch(
    `${env("REACT_APP_API_URL")}/${endpoint}`,
    config
  )

  if (response.ok && config.headers.Accept === "text/html") {
    return response.text()
  }

  if (
    response.ok &&
    (config.headers.Accept === "application/octet-stream" ||
      config.headers.Accept === "application/pdf")
  ) {
    return response.blob()
  }

  if (response.ok) {
    try {
      return await response.json()
    } catch {
      return {}
    }
  }

  try {
    const error = await response.json()
    throw new ApiError(error.code, error.message, error.details)
  } catch (error) {
    throw new ApiError(
      // @ts-expect-error: broken internal typings
      (error as Error | ApiError)?.code || "DEFAULT_FALLBACK",
      (error as Error | ApiError)?.message || "",
      // @ts-expect-error: broken internal typings
      (error as Error | ApiError)?.details || []
    )
  }
}

export default client
