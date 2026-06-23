import React from "react"
import { ChevronRight } from "@material-ui/icons"
import clsx from "clsx"
import { Link } from "react-router"
import { TEventTracker, useTracking } from "../../../hooks/useTracking"
import Typography from "../../Basic/Typography"

const Widget = ({
  icon,
  title,
  children,
  action,
  actionComponent,
  className,
}: {
  icon?: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
  action?: {
    text?: React.ReactNode
    url?: string
    state?: Record<string, string>
    onClick?: () => void
    event?: TEventTracker
  }
  actionComponent?: React.ReactNode
  className?: string
}) => {
  const { trackEvent } = useTracking()

  return (
    <div
      className={clsx(
        "shadow-light-sm bg-surface-elevated-2 rounded-card-md border-card flex flex-col overflow-hidden",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-between gap-x-4 border-b border-(--border-card-color) bg-white",
          {
            "p-3": !!actionComponent,
            "p-4": !actionComponent,
          }
        )}
      >
        <div className="flex grow items-center gap-x-3">
          {icon}
          {typeof title === "string" ? (
            <Typography type="bodyTitle">{title}</Typography>
          ) : (
            title
          )}
        </div>
        {actionComponent && <div>{actionComponent}</div>}
        {!!action && (
          <Typography type="link" color="secondary">
            {action.url && (
              <Link
                to={action.url}
                state={action.state}
                onClick={() => {
                  if (action.event) {
                    trackEvent(action.event)
                  }
                  if (action.onClick) {
                    action.onClick()
                  }
                }}
              >
                {action.text || <ChevronRight />}
              </Link>
            )}
            {!action.url && action.onClick && (
              <button
                type="button"
                onClick={() => {
                  if (action.event) {
                    trackEvent(action.event)
                  }
                  if (action.onClick) {
                    action.onClick()
                  }
                }}
                className={"text-brand-600"}
              >
                {action.text || <ChevronRight />}
              </button>
            )}
          </Typography>
        )}
      </div>
      <div className="relative flex grow flex-col p-4">{children}</div>
    </div>
  )
}

export default Widget
