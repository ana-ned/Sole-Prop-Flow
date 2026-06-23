import { ReactNode } from "react"
import { useLocation } from "react-router"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../../components/UI/PageBar"
import useDevice from "../../../../hooks/useDevice"
import OnboardingLayout from "../OnboardingLayout"

const DocumentsUploadLayout = ({
  children,
  title,
  backUrl,
  onClickBack,
  sidebar,
  menu,
  sidebarBackground = true,
}: {
  children: ReactNode
  title: string
  backUrl?: string
  onClickBack?: () => Promise<void>
  sidebar?: ReactNode
  menu?: ReactNode
  sidebarBackground?: boolean
}) => {
  const location = useLocation()
  const { isMobile } = useDevice()

  return (
    <OnboardingLayout
      menu={menu || <LogoOnlyMenu />}
      sidebar={
        !!sidebar &&
        !isMobile && (
          <OnboardingLayout.Child autoHeight withBackground={sidebarBackground}>
            {sidebar}
          </OnboardingLayout.Child>
        )
      }
    >
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={title}
            backUrl={
              onClickBack
                ? undefined
                : new URLSearchParams(location.search).get("back") || backUrl
            }
            onClickBack={onClickBack}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        {children}
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default DocumentsUploadLayout
