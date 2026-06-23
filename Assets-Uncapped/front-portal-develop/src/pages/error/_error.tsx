import * as Sentry from "@sentry/react"
import { cva } from "class-variance-authority"
import { useTranslation } from "react-i18next"
import { useMount } from "react-use"
import SiteOverlay from "../../components/Basic/SiteOverlay"
import Typography from "../../components/Basic/Typography"
import useDevice from "../../hooks/useDevice"
import { ReactComponent as UncappedLogo } from "../../svgs/logoUncapped.svg"
import { reportErrorLog } from "../../utils/error-handling"
import errorImage from "./jump.webp"

const imageWrapperVariants = cva([], {
  variants: {
    mobile: {
      true: ["w-full text-center"],
      false: ["w-1/2"],
    },
  },
})

const buttonClasses =
  "p-0 m-0 text-brand-600 underline bg-transparent border-none border-0"

interface ErrorIndexProps {
  type: "auth" | "404" | "500"
  error?: unknown
}

const ErrorIndex = ({ type, error }: ErrorIndexProps) => {
  const { t } = useTranslation("error")
  const { isMobile } = useDevice()

  useMount(() => {
    const location = globalThis.location
    const extra = {
      href: location.href,
      pathname: location.pathname,
      referrer: document.referrer || undefined,
    }

    if (type === "500" && error) {
      Sentry.withScope((scope) => {
        scope.setTag("error_page", "500")
        scope.setContext("route", extra)
        Sentry.captureException(error)
      })
      return
    }

    if (type === "500") {
      reportErrorLog("ErrorPage - 500", "error", extra, {
        error_page: type,
      })
    }
  })

  return (
    <SiteOverlay isOpen>
      <div className="m-0 flex h-full items-center justify-center p-0">
        {!isMobile && (
          <div className={imageWrapperVariants({ mobile: isMobile })}>
            <img src={errorImage} alt="ski-jumper" className="max-w-full" />
          </div>
        )}

        <div className={imageWrapperVariants({ mobile: isMobile })}>
          <UncappedLogo className="mx-auto max-w-1/2 lg:mx-0" />
          <Typography type="h4" className="mt-6">
            {t(`${type}.title`)}
          </Typography>
          <Typography className="mt-6">{t(`${type}.content`)}</Typography>
          <Typography className="mt-6">
            <button
              onClick={() => {
                globalThis.location.href = "/"
              }}
              type="button"
              className={buttonClasses}
            >
              {t(`links.goBack`)}
            </button>
            &nbsp;{t(`links.separator`)}&nbsp;
            <a className={buttonClasses} href="//weareuncapped.com">
              {t(`links.goHome`)}
            </a>
          </Typography>
        </div>
      </div>
    </SiteOverlay>
  )
}

export default ErrorIndex
