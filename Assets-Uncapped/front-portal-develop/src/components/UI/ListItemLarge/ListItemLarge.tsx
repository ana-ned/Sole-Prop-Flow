import React from "react"
import { ChevronRight } from "@material-ui/icons"
import clsx from "clsx"
import { cva } from "class-variance-authority"
import { NavLink } from "react-router"
import { twMerge } from "tailwind-merge"
import { TEventTracker, useTracking } from "../../../hooks/useTracking"
import { ReactComponent as DeleteOutlineIcon } from "../../../svgs/delete-outline.svg"
import { ReactComponent as DownloadIcon } from "../../../svgs/download.svg"
import { ReactComponent as LockIcon } from "../../../svgs/lock.svg"
import { ReactComponent as OpenNewIcon } from "../../../svgs/open-new.svg"
import { ReactComponent as UploadIcon } from "../../../svgs/upload.svg"
import { ColorTypes } from "../../../types/Color.types"
import {
  getTextColorClass,
  getBackgroundColorClass,
  getBorderColorClass,
} from "../../../utils/colors"
import { reportErrorLog } from "../../../utils/error-handling"
import Typography from "../../Basic/Typography"
import Loader from "../Loader"

export interface ListItemMoreProps {
  type:
    | "link"
    | "label"
    | "value"
    | "external"
    | "button"
    | "button-link"
    | "download"
    | "upload"
    | "element"
    | "delete"
  value?: string
  element?: React.ReactNode
  strikethrough?: boolean
  onClick?: () => void
}

interface ListItemProps {
  icon?: React.ReactNode
  iconBackgroundColor?: ColorTypes
  iconColor?: ColorTypes
  iconBadge?: React.ReactNode
  iconBadgeColor?: ColorTypes
  iconOutlined?: boolean
  iconClassName?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  href?: string
  hrefState?: any
  more?: ListItemMoreProps
  isFullIcon?: boolean
  className?: string
  initialIcon?: string
  disabled?: boolean
  active?: boolean
  truncate?: boolean
  truncateSubtitle?: boolean
  loading?: boolean
  eventTracker?: TEventTracker[] | TEventTracker
  subTitleColor?: ColorTypes
  error?: boolean
  contentClassName?: string
  titleClassName?: string
  variant?: "default" | "transparent"
}

const rootVariants = cva(
  "flex w-full p-4 text-brand-600 no-underline bg-white border border-neutral-300 rounded transition-all duration-300",
  {
    variants: {
      variant: {
        default: "min-h-18",
        transparent: "min-h-0 p-2 bg-transparent border-none",
      },
      interactive: {
        true: "hover:cursor-pointer hover:bg-neutral-100",
        false: "",
      },
      active: {
        true: "bg-brand-600! border-brand-600!",
        false: "",
      },
      activeLink: {
        true: "border-brand-400 shadow-[inset_0_0_0_1px_var(--color-brand-400)]",
        false: "",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
      error: {
        true: "bg-(--color-status-background-error)! border-(--color-status-border-error)!",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: true,
      active: false,
      activeLink: false,
      disabled: false,
      error: false,
    },
  }
)

const moreVariants = cva("self-center capitalize", {
  variants: {
    moreType: {
      default: "",
      label:
        "text-sm font-bold leading-[1.14] text-brand-600 text-right tracking-normal whitespace-nowrap",
      value:
        "shrink-0 min-w-20.25 text-sm text-neutral-800 text-right whitespace-nowrap",
      delete: "text-error-600",
      external: "text-brand-600",
    },
    strikethrough: {
      true: "line-through",
      false: "",
    },
    active: {
      true: "text-white",
      false: "",
    },
  },
  defaultVariants: {
    moreType: "default",
    strikethrough: false,
    active: false,
  },
})

const STYLED_MORE_TYPES = ["label", "value", "delete", "external"] as const
type StyledMoreType = (typeof STYLED_MORE_TYPES)[number]

const getMoreType = (type?: string): StyledMoreType | "default" =>
  STYLED_MORE_TYPES.includes(type as StyledMoreType)
    ? (type as StyledMoreType)
    : "default"

const ListItemLarge = ({
  icon,
  iconColor = "secondary",
  iconBackgroundColor = "white",
  iconBadge,
  iconBadgeColor = "error-600",
  iconOutlined,
  iconClassName,
  title,
  subtitle,
  href,
  hrefState,
  more,
  isFullIcon = false,
  className,
  initialIcon,
  disabled = false,
  active = false,
  truncate = true,
  truncateSubtitle = true,
  loading = false,
  eventTracker,
  subTitleColor,
  error = false,
  contentClassName,
  titleClassName,
  variant = "default",
}: ListItemProps) => {
  const { trackEvent } = useTracking()

  if (iconBadge && !(icon || initialIcon)) {
    reportErrorLog(
      `Missing icon for ListItemLarge - ${[
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        title?.toString(),
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        subtitle?.toString(),
      ]
        .filter(Boolean)
        .join(", ")}`
    )
  }

  const content = (rootActive: boolean) => (
    <>
      {(icon || initialIcon) && (
        <div
          className={twMerge(
            clsx(
              "relative mr-4 flex size-10 shrink-0 items-center justify-center self-center rounded-lg p-2 text-2xl font-bold uppercase [&_img]:h-auto [&_img]:max-w-full",
              iconBackgroundColor &&
                getBackgroundColorClass(iconBackgroundColor),
              iconColor && getTextColorClass(iconColor),
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              !!iconBackgroundColor &&
                iconOutlined &&
                getBorderColorClass(iconBackgroundColor),
              iconOutlined && "rounded-lg! border-2! border-solid! bg-none!",
              isFullIcon && "overflow-hidden p-0 [&_svg]:size-full",
              iconBackgroundColor === "white" &&
                "border border-neutral-300 p-1.5",
              rootActive && "bg-brand-600 text-white",
              variant === "transparent" && "bg-surface-default shadow-light-sm"
            ),
            iconClassName
          )}
        >
          {icon || initialIcon?.slice(0, 1)}
          {iconBadge ? (
            <div
              className={clsx(
                "absolute -right-0.5 -bottom-2 [&_svg]:max-h-5 [&_svg]:max-w-5",
                iconBadgeColor && getTextColorClass(iconBadgeColor)
              )}
            >
              {iconBadge}
            </div>
          ) : null}
        </div>
      )}
      <div
        className={clsx(
          "mr-3 flex grow flex-col justify-center self-center text-left",
          contentClassName
        )}
      >
        <Typography
          type="body"
          className={twMerge(
            clsx(
              "wrap-anywhere text-neutral-800",
              truncate && "line-clamp-2",
              rootActive && "font-bold text-white"
            ),
            titleClassName
          )}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            type="tableValue"
            className={twMerge(
              "text-neutral-600",
              truncateSubtitle && "line-clamp-2",
              subTitleColor && getTextColorClass(subTitleColor),
              rootActive && "text-white"
            )}
          >
            {subtitle}
          </Typography>
        )}
      </div>
      {more && (
        <div
          className={moreVariants({
            moreType: getMoreType(more.type),
            strikethrough: !!more.strikethrough,
            active: rootActive,
          })}
        >
          {more.type === "link" &&
            !disabled &&
            (more.element || <ChevronRight />)}
          {more.type === "link" && disabled && <LockIcon />}
          {more.type === "delete" && <DeleteOutlineIcon />}
          {more.type === "label" && <div>{more.value}</div>}
          {more.type === "value" && <div>{more.value}</div>}
          {more.type === "external" && <OpenNewIcon />}
          {more.type === "button" && !disabled && <ChevronRight />}
          {more.type === "button-link" && !disabled && <ChevronRight />}
          {more.type === "download" && !disabled && !loading && (
            <DownloadIcon />
          )}
          {["download", "upload"].includes(more.type) &&
            !disabled &&
            loading && <Loader size="xxs" />}
          {more.type === "upload" && !disabled && !loading && <UploadIcon />}
          {more.type === "element" && more.element}
        </div>
      )}
    </>
  )

  if (more?.type === "external") {
    return (
      <a
        href={href || "#"}
        className={twMerge(
          rootVariants({
            variant,
            interactive: true,
            disabled,
            active,
            error,
          }),
          className
        )}
        target="_blank"
        rel="noreferrer"
      >
        {content(active)}
      </a>
    )
  }

  if (
    more &&
    ["button", "download", "upload", "element", "delete"].includes(more.type)
  ) {
    return (
      <button
        onClick={
          !disabled && !loading && more.onClick
            ? () => {
                if (eventTracker) trackEvent(eventTracker)
                more.onClick?.()
              }
            : undefined
        }
        type="button"
        className={twMerge(
          rootVariants({
            variant,
            interactive: true,
            disabled,
            active,
            error,
          }),
          className
        )}
      >
        {content(active)}
      </button>
    )
  }

  if (!href) {
    return (
      <div
        className={twMerge(
          rootVariants({
            variant,
            interactive: false,
          }),
          className
        )}
      >
        {content(false)}
      </div>
    )
  }

  return (
    <NavLink
      onClick={() => {
        if (eventTracker && !disabled) trackEvent(eventTracker)
      }}
      end
      className={({ isActive }) =>
        twMerge(
          rootVariants({
            variant,
            interactive: true,
            disabled,
            active,
            activeLink: isActive,
            error,
          }),
          className
        )
      }
      to={href}
      state={hrefState}
    >
      {content(active)}
    </NavLink>
  )
}

export default ListItemLarge
