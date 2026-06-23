import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useAsync } from "react-use"
import useDevice from "../../../hooks/useDevice"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import { ResponseError } from "../../../services/api/agreements"
import { isProduction } from "../../../utils/env"
import {
  getErrorMessage,
  parseServerErrors,
  ApiErrorType,
} from "../../../utils/error-handling"
import Alert from "../../UI/Alert"

const ApiErrorAlert = ({
  error,
  className,
  isPlainTextExpected,
  withSupportLink = true,
}: {
  error: Response | ResponseError | Error | null
  className?: string
  isPlainTextExpected?: boolean
  withSupportLink?: boolean
}) => {
  const { t } = useTranslation("common")
  const [parsedError, setParsedError] = useState<undefined | ApiErrorType>()
  const navigate = useNavigate()
  const traceId =
    error && "headers" in error
      ? error?.headers?.get("trace-id")
      : error && "response" in error
        ? error?.response.headers.get("trace-id")
        : null
  const { isMobile } = useDevice()
  const { openChat } = useHubSpotChat()

  useAsync(async () => {
    setParsedError(
      error && ("response" in error || "headers" in error)
        ? await parseServerErrors(error, isPlainTextExpected)
        : error && "message" in error
          ? {
              code: "error",
              message: isProduction()
                ? t("defaultErrorMessage")
                : error.message,
            }
          : undefined
    )
  }, [error, isPlainTextExpected])

  if (!error || !parsedError) {
    return null
  }

  return (
    <Alert type="danger" className={className}>
      <p>
        {getErrorMessage(parsedError)}
        {withSupportLink && traceId && (
          <>
            {" "}
            ({t("apiErrorAlert.errorId")}:{" "}
            <span className="break-all">{traceId}</span>)
          </>
        )}
      </p>
      {parsedError.details && parsedError.details.length > 0 && (
        <ul className="mx-0 mt-8 mb-0 pt-0 pr-0 pb-0 pl-4">
          {parsedError.details.map((err) => (
            <li key={err.code}>{err.message}</li>
          ))}
        </ul>
      )}
      {withSupportLink && (
        <p>
          <button
            className="mx-0 mt-1.5 mb-0 border-0 bg-transparent p-0 font-bold text-current"
            type="button"
            onClick={async () => {
              if (isMobile) {
                await navigate("/chat")
              } else {
                openChat()
              }
            }}
          >
            {t("apiErrorAlert.contactSupport")}
          </button>
        </p>
      )}
    </Alert>
  )
}

export default ApiErrorAlert
