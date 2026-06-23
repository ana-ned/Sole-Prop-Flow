import React from "react"
import { useTranslation } from "react-i18next"
import { twMerge } from "tailwind-merge"
import Button from "../Button"

const ButtonGroup = ({
  children,
  onClickBack,
  backUrl,
  withMargin,
}: {
  children?: React.ReactNode
  onClickBack?: () => void
  backUrl?: string
  withMargin?: boolean
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "ButtonGroup",
  })

  return (
    <div
      className={twMerge(
        "flex flex-col gap-4 *:w-full sm:flex-row sm:items-center *:sm:w-auto",
        backUrl || onClickBack ? "sm:justify-between" : "sm:justify-end",
        withMargin && "mt-8"
      )}
    >
      {backUrl && (
        <Button variant="secondary" href={backUrl}>
          {t("goBack")}
        </Button>
      )}
      {onClickBack && (
        <Button type="button" variant="secondary" onClick={onClickBack}>
          {t("goBack")}
        </Button>
      )}
      <div className="flex flex-col gap-4 *:w-full sm:flex-row sm:items-center *:sm:w-auto">
        {children}
      </div>
    </div>
  )
}

export default ButtonGroup
