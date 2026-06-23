import * as Sentry from "@sentry/react"
import { toast } from "react-toastify"
import i18n from "../inits/i18next"
import { ResponseError, ErrorResponse } from "../services/api/agreements"
import env from "./runtime-env"

export interface ApiErrorType {
  code: string
  message?: string
  details?: { code: string; message: string; fieldName?: string }[]
}

export const getErrorMessage = (error: ApiErrorType): string => {
  if (i18n.exists(`common:errorCodes.${error.code}`)) {
    return i18n.t(`common:errorCodes.${error.code}`)
  }

  return error.message || i18n.t("common:defaultErrorMessage")
}

export const reportErrorLog = (
  message: string,
  level: Sentry.SeverityLevel = "error",
  extra: Record<string, unknown> = {},
  tags: Record<string, any> = {}
) => {
  if (env("REACT_APP_SENTRY_DSN")) {
    Sentry.captureMessage(message, {
      level,
      extra,
      tags,
    })
  } else {
    console.error(message, level, extra, tags)
  }
}

export const logError = (error: any, throwInCypress = true) => {
  if (env("REACT_APP_SENTRY_DSN")) {
    Sentry.captureException(error)
  } else {
    if (globalThis.Cypress && throwInCypress) {
      throw error
    }

    console.error(error)
  }
}

const handleExternalUnhandledErrors = (message?: string) => {
  if (message?.startsWith("CLIENT_ERROR:[")) {
    logError("handleExternalUnhandledErrors - This should be dead code")
    const errors = JSON.parse(/CLIENT_ERROR:(\[.*])/.exec(message)?.[1] || "")

    if (errors[0]?.message) {
      return String(errors[0]?.message)
    }
  }

  return message
}

export const parseServerErrors = async (
  error: Response | ResponseError | ErrorResponse | null,
  isPlainTextExpected?: boolean
) => {
  try {
    const isPlainTextResponse =
      error && "headers" in error
        ? error.headers.get("content-type")?.includes("text/plain")
        : error && "response" in error
          ? error.response.headers.get("content-type")?.includes("text/plain")
          : false

    if (error && "headers" in error) {
      reportErrorLog("parseServerErrors - This should be dead code", "debug", {
        error,
      })
    }

    if (error && isPlainTextResponse && isPlainTextExpected) {
      return {
        code: "",
        message:
          "text" in error
            ? await error.text()
            : "response" in error
              ? await error.response.text()
              : "",
        details: [],
      }
    }

    if (error) {
      const err =
        "json" in error
          ? await error.json()
          : "response" in error
            ? await error.response.json()
            : {}
      return {
        code: err.code || err.errorCode,
        message: handleExternalUnhandledErrors(
          err.message || err.businessMessage || err.error
        ),
        details: err.details,
      }
    }
  } catch (error_) {
    reportErrorLog(`Couldn't parse error message:", ${error_}`)
  }

  return {
    code: "DEFAULT_FALLBACK",
    message: "",
    details: [],
  }
}

export const displayErrorToast = async (error: Response | ErrorResponse) => {
  const parsedError = await parseServerErrors(error)
  toast.error(getErrorMessage(parsedError))
}
