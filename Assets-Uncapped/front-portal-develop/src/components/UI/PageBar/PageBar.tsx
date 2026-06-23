import { ReactNode } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { Link } from "react-router"
import { twMerge } from "tailwind-merge"
import useDevice from "../../../hooks/useDevice"
import { ReactComponent as ArrowBackIcon } from "../../../svgs/arrow-back.svg"
import Button from "../../Basic/Button"
import Typography from "../../Basic/Typography"
import Loader from "../Loader"

const rootVariants = cva("relative flex items-center justify-between", {
  variants: {
    mode: {
      desktop: "min-h-11",
      mobile: "",
    },
  },
})

const titleVariants = cva("grow", {
  variants: {
    mode: {
      desktop: "text-left",
      mobile: "text-center",
    },
  },
})

const subtitleVariants = cva("block font-normal text-neutral-600", {
  variants: {
    mode: {
      desktop: "text-base",
      mobile: "text-sm",
    },
  },
})

const actionWrapperVariants = cva("flex self-start", {
  variants: {
    mode: {
      desktop: "min-w-15 *:mr-4",
      mobile: "min-w-13 *:mr-2",
    },
    position: {
      first: "",
      last: "",
    },
  },
  compoundVariants: [
    { mode: "desktop", position: "first", class: "min-w-0" },
    { mode: "desktop", position: "last", class: "min-w-0" },
    { mode: "desktop", position: "first", class: "*:mr-4" },
    { mode: "desktop", position: "last", class: "*:ml-4 *:mr-0" },
    { mode: "mobile", position: "first", class: "*:mr-2" },
    { mode: "mobile", position: "last", class: "*:ml-2 *:mr-0" },
  ],
})

type Mode = NonNullable<VariantProps<typeof rootVariants>["mode"]>

interface PageBarProps {
  backUrl?: string
  backUrlState?: Record<string, any>
  title?: string
  subTitle?: string
  onClickBack?: () => void
  ignoreDesktop?: boolean
  actionButton?:
    | {
        onClick: () => void
        children: ReactNode
      }
    | ReactNode
  actionLink?: {
    to: string
    children: ReactNode
  }
  withChat?: boolean
  desktopHeaderType?: "h5" | "h4"
  loading?: boolean
}

const PageBar = ({
  backUrl,
  backUrlState = {},
  title,
  subTitle,
  onClickBack,
  ignoreDesktop = false,
  actionButton,
  actionLink,
  withChat = false,
  desktopHeaderType = "h5",
  loading = false,
}: PageBarProps) => {
  const { isDesktop } = useDevice()

  const hideSideElements =
    !backUrl && !onClickBack && !actionButton && !withChat

  const mode: Mode = isDesktop && !ignoreDesktop ? "desktop" : "mobile"

  if (onClickBack && backUrl)
    throw new Error("Pagebar has defined both onClickBack and backUrl")

  return (
    <div className="mb-4 lg:mb-8">
      <div className={rootVariants({ mode })}>
        <div
          className={twMerge(
            actionWrapperVariants({ mode, position: "first" }),
            hideSideElements && "hidden"
          )}
        >
          {backUrl && (
            <Button
              href={backUrl}
              state={backUrlState}
              variant="secondary"
              dataTestId="back-button"
            >
              <ArrowBackIcon />
            </Button>
          )}
          {onClickBack && !backUrl && (
            <Button
              type="button"
              onClick={onClickBack}
              variant="secondary"
              dataTestId="back-button"
            >
              <ArrowBackIcon />
            </Button>
          )}
        </div>
        {loading && <Loader size="xs" className="!mr-3" />}
        {title && (
          <Typography
            className={titleVariants({ mode })}
            type={mode === "desktop" ? desktopHeaderType : "bodyTitle"}
          >
            {title}{" "}
            {subTitle && (
              <span className={subtitleVariants({ mode })}>{subTitle}</span>
            )}
          </Typography>
        )}
        <div
          className={twMerge(
            actionWrapperVariants({ mode, position: "last" }),
            hideSideElements && "hidden"
          )}
        >
          {actionButton &&
            (typeof actionButton === "object" && "onClick" in actionButton ? (
              <Button
                type="button"
                variant="secondary"
                onClick={actionButton.onClick}
                dataTestId="pagebar-action-button"
              >
                {actionButton.children}
              </Button>
            ) : (
              actionButton
            ))}
          {actionLink && (
            <div>
              <Link
                to={actionLink.to}
                className="text-brand-600 font-bold no-underline"
              >
                {actionLink.children}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageBar
