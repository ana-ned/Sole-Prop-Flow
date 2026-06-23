import React, { ReactNode, useEffect, useState } from "react"
import clsx from "clsx"
import { Link, useLocation } from "react-router"
import { ONBOARDING_BASE_PATH } from "../../../domains/onboarding/constants"
import useDevice from "../../../hooks/useDevice"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"
import Typography from "../../Basic/Typography"
import ActionButtons from "../../Collections/ActionButtons/ActionButtons"
import Page from "../../Headless/Page"
import PageBar from "../PageBar"

const CHILD_COLUMN_ID = "layout-child"

const Layout = ({
  children,
  menu,
  mode,
  sidebar,
}: {
  children: React.ReactNode
  menu: React.ReactNode
  mode?: "onboarding" | "full"
  sidebar?: React.ReactNode
}) => {
  const { isMobile } = useDevice()
  const location = useLocation()

  const isOnboarding =
    location.pathname.includes(ONBOARDING_BASE_PATH) &&
    !location.pathname.includes(ONBOARDING_BASE_PATH + "/manual")

  const sidebarContainer = (() => {
    if (!isOnboarding && sidebar) {
      return (
        <div className="w-full px-4 pb-32 empty:hidden lg:max-w-[400px] lg:min-w-[302px] lg:shrink-0 lg:px-0 lg:pb-0 lg:empty:block">
          {sidebar}
        </div>
      )
    }

    if (!mode) {
      return (
        <div className="px-4 pb-32 empty:hidden lg:shrink-0 lg:px-0 lg:pb-0 lg:empty:block xl:w-[170px]">
          {sidebar}
        </div>
      )
    }

    if (mode === "onboarding") {
      return (
        <div className="3xl:max-w-[500px] px-4 pb-32 empty:hidden lg:max-w-[400px] lg:min-w-[302px] lg:shrink-0 lg:px-0 lg:pb-0 lg:empty:block">
          {!isMobile && <ActionButtons />}
          {sidebar}
        </div>
      )
    }

    return null
  })()

  return (
    <Page>
      <div
        className={clsx("flex w-full flex-col lg:flex-row lg:p-10", {
          "gap-x-20": mode !== "onboarding",
          "gap-x-12": mode === "onboarding",
        })}
      >
        <div className="w-full shrink-0 pb-[2px] lg:sticky lg:top-10 lg:h-[calc(100vh-80px)] lg:w-[270px] lg:overflow-y-auto">
          {menu}
        </div>
        <div
          className={clsx(
            "flex w-full flex-wrap justify-between gap-x-10 lg:flex-nowrap"
          )}
        >
          {children}
          {sidebarContainer}
        </div>
      </div>
    </Page>
  )
}

const FullWidth = ({ children }: { children: ReactNode }) => {
  return <div className="w-full p-4 pb-23 lg:p-0 lg:pr-15">{children}</div>
}

const Parent = ({
  pageBar,
  children,
  className,
}: {
  /**
   * @deprecated This is legacy leftover migrated from OnboardingChild.Parent. Pass <PageBar /> directly inside children.
   */
  pageBar?: ReactNode
  children: ReactNode
  className?: string
}) => {
  const { isMobile, isDesktop } = useDevice()
  const [hasChild, setHasChild] = useState(false)
  const location = useLocation()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setHasChild(!!document.querySelector(`#${CHILD_COLUMN_ID}`))
  })

  const isCurrentlyParentOnMobile = isMobile && !hasChild
  const isOnboarding =
    location.pathname.includes(ONBOARDING_BASE_PATH) &&
    !location.pathname.includes(ONBOARDING_BASE_PATH + "/manual")

  if (isCurrentlyParentOnMobile || isDesktop) {
    return (
      <div
        className={clsx(
          "mx-auto w-full grow p-4 pb-23 lg:min-w-125 lg:p-0",
          isOnboarding ? "max-w-200" : "max-w-225",
          className
        )}
      >
        {pageBar}
        {children}
      </div>
    )
  }

  return null
}

const Child = ({
  children,
  className,
  redirectOnClose,
  desktopTitle,
  withChat,
  autoHeight,
  onClickBack,
  withBackground = true,
}: {
  children: ReactNode
  className?: string
  redirectOnClose?: string
  desktopTitle?: string
  withChat?: boolean
  autoHeight?: boolean
  onClickBack?: () => void
  withBackground?: boolean
}) => {
  const { isDesktop, isMobile } = useDevice()

  return (
    <div
      id={CHILD_COLUMN_ID}
      className={clsx(
        className,
        "w-full min-[1200px]:pb-[45px] lg:sticky lg:top-0 lg:min-w-[400px] lg:pt-6"
      )}
    >
      <div
        className={clsx(
          className,
          "flex w-full flex-col py-6 lg:relative lg:block lg:w-auto lg:px-6",
          {
            "lg:h-auto lg:max-h-full": autoHeight,
            "lg:bg-surface-elevated-2 lg:shadow-light-sm lg:border-card lg:rounded-2xl lg:p-6":
              withBackground,
          }
        )}
      >
        {isMobile &&
          (redirectOnClose || desktopTitle || withChat || onClickBack) && (
            <PageBar
              backUrl={redirectOnClose}
              withChat={withChat}
              title={desktopTitle}
              onClickBack={onClickBack}
            />
          )}
        {isDesktop && (
          <div className="mb-4 flex h-[44px] empty:hidden">
            {!!redirectOnClose && (
              <Link
                to={redirectOnClose}
                className="inline-flex size-[44px] items-center justify-center border-0 bg-transparent p-[10px] text-neutral-800 [&_svg]:size-6"
              >
                <CloseIcon />
              </Link>
            )}
            {desktopTitle && (
              <Typography
                type="h6"
                className="flex w-full flex-1 items-center justify-center"
              >
                {desktopTitle}
              </Typography>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/**
 * @deprecated This wrapper is no longer needed. Migrate away from it.
 */
const Sidebar = ({
  className,
  content,
}: {
  className?: string
  content?: ReactNode
}) => {
  return <div className={clsx("w-full", className)}>{content}</div>
}

Layout.FullWidth = FullWidth
Layout.Parent = Parent
Layout.Child = Child
Layout.Sidebar = Sidebar

export default Layout
