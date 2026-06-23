import React, { useState } from "react"
import { ChevronRight } from "@material-ui/icons"
import { useTranslation } from "react-i18next"
import PageLoader from "../../components/Collections/PageLoader"
import Card from "../../components/UI/Card"
import Layout from "../../components/UI/Layout"
import PageBar from "../../components/UI/PageBar"
import PortalMenu from "../../components/UI/PortalMenu"
import useAuth from "../../hooks/useAuth"
import { UserRoles } from "../../hooks/useAuth.types"
import { useTracking } from "../../hooks/useTracking"
import { OrganisationOverviewOrganisationSourceEnum } from "../../services/api/organisation-users"
import { ReactComponent as DvrIcon } from "../../svgs/dvr.svg"
import { ReactComponent as EditIcon } from "../../svgs/edit.svg"
import { ReactComponent as FaqIcon } from "../../svgs/fact-check.svg"
import { ReactComponent as FolderIcon } from "../../svgs/folder-open.svg"
import { ReactComponent as GavelIcon } from "../../svgs/gavel.svg"
import { ReactComponent as GroupIcon } from "../../svgs/group.svg"
import { ReactComponent as LogoutIcon } from "../../svgs/logout.svg"
import { ReactComponent as PasswordIcon } from "../../svgs/password.svg"
import ProfileItem from "./_profile/ProfileItem"
import ResetPasswordModal from "./_profile/ResetPasswordModal"
import useMarcusDocuments from "./hooks/useMarcusDocuments"

const ProfileIndex = () => {
  const { organisation, user, logout, ...auth } = useAuth()
  const { t } = useTranslation("profile")
  const { trackEvent } = useTracking()
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
  const marcusDocuments = useMarcusDocuments()

  const blocks: {
    icon: React.ReactNode
    title: string
    allowed: boolean
    href?: string
    customPointer?: React.ReactNode
    onClick?: () => void
  }[][] = [
    [
      {
        icon: <GroupIcon />,
        title: t("teamMembers"),
        href: "/invite-members/list",
        customPointer: <ChevronRight />,
        allowed: auth.hasRole(UserRoles.CUSTOMER),
      },
    ],
    [
      {
        icon: <FolderIcon />,
        title: t("documents.title"),
        href: "/profile/documents",
        customPointer: <ChevronRight />,
        allowed:
          (marcusDocuments.statements || []).length > 0 ||
          (marcusDocuments.loanDocuments || []).length > 0,
      },
    ],
    [
      {
        icon: <EditIcon />,
        title: t("leaveFeedback"),
        href: `https://weareuncapped.typeform.com/to/szhkvqBW#org=${organisation?.organisationId}`,
        allowed: auth.hasRole(UserRoles.CUSTOMER),
      },
    ],
    [
      {
        icon: <FaqIcon />,
        title: t("faqs"),
        href: `https://www.weareuncapped.com/goldman-sachs-faqs`,
        allowed:
          auth.organisationData?.organisationSource ===
          OrganisationOverviewOrganisationSourceEnum.Marcus,
      },
    ],
    [
      {
        icon: <FaqIcon />,
        title: t("faqs"),
        href: `https://www.weareuncapped.com/sellersfi-faqs`,
        allowed:
          auth.organisationData?.organisationSource ===
          OrganisationOverviewOrganisationSourceEnum.Sellersfi,
      },
    ],
    [
      {
        icon: <DvrIcon />,
        title: t("electonicDisclosureAndConsent"),
        href: "https://weareuncapped.com/electronic-disclosure-and-consent",
        allowed: true,
      },
      {
        icon: <GavelIcon />,
        title: t("privacyStatement"),
        href: "https://www.weareuncapped.com/privacy-policy",
        allowed: true,
      },
    ],
    [
      {
        icon: <PasswordIcon />,
        title: t("resetPassword"),
        customPointer: <ChevronRight />,
        onClick: () => {
          setResetPasswordModalOpen(true)
        },
        allowed: true,
      },
    ],
  ]

  if (marcusDocuments.isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <Layout.Parent>
        <PageBar title={organisation?.organisationName} subTitle={user?.name} />
        <div className="space-y-2">
          {blocks
            .filter((block) => block.some((menuItem) => menuItem.allowed))
            .map((block, index) => {
              const menuItems = block.filter((item) => item.allowed)

              return menuItems.length > 0 ? (
                <Card key={`category-${index}`} className="!px-2 !py-3">
                  {menuItems.map((link) => (
                    <ProfileItem
                      key={link.title}
                      icon={link.icon}
                      title={link.title}
                      href={link.href}
                      onClick={link.onClick}
                      customPointer={link.customPointer}
                    />
                  ))}
                </Card>
              ) : null
            })}
          <Card className="!px-2 !py-3">
            <ProfileItem
              icon={<LogoutIcon />}
              onClick={() => {
                trackEvent({
                  category: "auth",
                  name: "user",
                  action: "logout",
                  customFields: {
                    place: "profile",
                  },
                })
                return logout()
              }}
              title={t("logout")}
            />
          </Card>
        </div>

        <ResetPasswordModal
          isOpen={resetPasswordModalOpen}
          onClose={() => {
            setResetPasswordModalOpen(false)
          }}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default ProfileIndex
