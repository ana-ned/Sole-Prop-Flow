import { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Logout05Icon,
  ArrowLeft02Icon,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import Page from "../../../../components/Headless/Page"
import Logo from "../../../../components/UI/Logo"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import { useTracking } from "../../../../hooks/useTracking"

const RegistrationLayout = ({
  children,
  sidebar,
  title,
  onClickBack,
}: {
  children: ReactNode
  sidebar: ReactNode
  title?: string
  onClickBack?: () => void
}) => {
  const auth = useAuth()
  const { trackEvent } = useTracking()
  const { t } = useTranslation("common")

  const handleLogout = async () => {
    trackEvent({
      category: "registration",
      name: "logout",
      action: "clicked",
    })
    await auth.logout()
  }

  return (
    <Page>
      <div className="relative w-full lg:flex">
        <div className="relative flex h-full flex-1 flex-col lg:p-10">
          <div className="shadow-light-sm flex items-center justify-between gap-4 p-3 lg:justify-start lg:p-0 lg:shadow-none">
            <div className="size-11 lg:hidden">
              {onClickBack && (
                <Button variant="secondary" type="button" onClick={onClickBack}>
                  <HugeiconsIcon icon={ArrowLeft02Icon} />
                </Button>
              )}
            </div>

            <Logo link={false} className="h-8 lg:h-10" />

            <div className="size-11 lg:hidden">
              {auth.isAuthenticated && (
                <Button
                  variant="secondary"
                  className="lg:hidden"
                  type="button"
                  ariaLabel={t("actionButtons.logout")}
                  onClick={handleLogout}
                >
                  <HugeiconsIcon icon={Logout05Icon} className="!size-5" />
                </Button>
              )}
            </div>
          </div>
          <div className="p-4 pb-28 lg:flex lg:flex-1 lg:justify-center lg:py-10 xl:px-25">
            <div className="mx-auto h-full max-w-[540px] lg:w-full lg:min-w-[540px]">
              {!!title && (
                <>
                  <div className="hidden lg:block">
                    <PageBar
                      title={title}
                      onClickBack={onClickBack}
                      desktopHeaderType="h4"
                    />
                  </div>
                  <h1 className="font-heading mb-4 text-xl font-bold lg:hidden">
                    {title}
                  </h1>
                </>
              )}
              {children}
            </div>
          </div>
          {auth.isAuthenticated && (
            <ul className="hidden w-[240px] lg:block">
              <li>
                <button
                  type="button"
                  className="hover:bg-surface-elevated-2 flex w-full flex-row items-center gap-x-[10px] gap-y-1 rounded-lg px-3 py-2 whitespace-nowrap transition-all"
                  onClick={handleLogout}
                >
                  <BoxIcon
                    severity="accent-2"
                    icon={<HugeiconsIcon icon={Logout05Icon} />}
                  />
                  {t("actionButtons.logout")}
                </button>
              </li>
            </ul>
          )}
        </div>
        <aside className="hidden lg:flex lg:w-0 lg:max-w-[800px] lg:grow">
          {sidebar}
        </aside>
      </div>
    </Page>
  )
}

export default RegistrationLayout
