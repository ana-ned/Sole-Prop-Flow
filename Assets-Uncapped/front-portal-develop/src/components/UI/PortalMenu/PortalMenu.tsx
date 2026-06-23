import { useLayoutEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity03SolidRounded,
  ClipboardSolidRounded,
  MoneyBag02SolidRounded,
  UserGroupSolidRounded,
  UserShield01SolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import {
  Home08SolidStandard,
  MoneyExchange03SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router"
import useAuth from "../../../hooks/useAuth"
import { UserRoles } from "../../../hooks/useAuth.types"
import useDevice from "../../../hooks/useDevice"
import usePartnerInfo from "../../../hooks/usePartnerInfo"
import { useTracking } from "../../../hooks/useTracking"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import BoxIcon from "../../Basic/BoxIcon"
import LogoOnlyMenu from "../LogoOnlyMenu"

interface MenuItem {
  title: string
  mobileTitle?: string
  icon: React.ReactNode
  href: string
  exact?: boolean
  canSee: boolean
  onClick?: () => void
  className?: string
}

const PortalMenu = ({ menuOnMobile = false }: { menuOnMobile?: boolean }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const activeElementRef = useRef<HTMLAnchorElement>(null)
  const { t } = useTranslation()
  const auth = useAuth()
  const { trackEvent } = useTracking()
  const { isMobile } = useDevice()
  const partnerQuery = usePartnerInfo()

  // Scroll to active element on mount
  useLayoutEffect(() => {
    if (containerRef.current && activeElementRef.current) {
      containerRef.current.scrollTo({
        left: Math.max(0, activeElementRef.current.offsetLeft - 20),
      })
    }
  }, [])

  const menuItems: MenuItem[] = [
    {
      title: t("menu.dashboard"),
      icon: (
        <BoxIcon
          severity="accent-1"
          icon={<HugeiconsIcon icon={Home08SolidStandard} />}
        />
      ),
      href: "/",
      exact: true,
      canSee: true,
    },
    {
      title: t("menu.loans"),
      icon: (
        <BoxIcon
          severity="accent-3"
          icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} />}
        />
      ),
      href: "/loans",
      exact: false,
      canSee: auth.hasRole(UserRoles.CUSTOMER),
    },
    {
      title: t("menu.transactions"),
      icon: (
        <BoxIcon
          severity="accent-6"
          icon={<HugeiconsIcon icon={MoneyExchange03SolidStandard} />}
        />
      ),
      href: "/transactions",
      canSee: auth.hasRole(UserRoles.CUSTOMER),
    },
    {
      title: t("menu.connections"),
      icon: (
        <BoxIcon
          severity="accent-2"
          icon={<HugeiconsIcon icon={Activity03SolidRounded} />}
        />
      ),
      href: "/connections",
      exact: false,
      canSee: auth.hasRole(UserRoles.CUSTOMER),
    },
    {
      title: t("menu.documents"),
      icon: (
        <BoxIcon
          severity="accent-3"
          icon={<HugeiconsIcon icon={ClipboardSolidRounded} />}
        />
      ),
      href: "/profile/documents",
      canSee:
        auth.organisationData?.organisationSource ===
        OrganisationOverviewOrganisationSourceEnum.Marcus,
    },
    {
      title: t("menu.referrals"),
      icon: (
        <BoxIcon
          severity="accent-6"
          icon={<HugeiconsIcon icon={UserGroupSolidRounded} />}
        />
      ),
      href: "/referrals",
      canSee: auth.hasRole(UserRoles.PARTNER),
    },
    {
      title:
        auth.organisation?.organisationName ||
        partnerQuery.data?.partner?.name ||
        t("menu.profile"),
      mobileTitle: t("menu.profile"),
      icon: (
        <BoxIcon
          severity="accent-1"
          icon={<HugeiconsIcon icon={UserShield01SolidRounded} />}
        />
      ),
      href: "/profile",
      exact: true,
      canSee: true,
      className: "lg:mt-auto",
    },
  ]

  return (
    <div
      className={clsx(
        "shadow-light-sm flex h-full flex-col items-center lg:items-start lg:border-0 lg:shadow-none",
        {
          hidden: isMobile && !menuOnMobile,
        }
      )}
    >
      <LogoOnlyMenu withActionButtons={false} withSeparator={false} />

      <ul
        ref={containerRef}
        className="flex w-full grow flex-row justify-around gap-x-2 overflow-x-auto px-3 pb-3 lg:max-w-[240px] lg:flex-col lg:justify-start lg:gap-x-0 lg:gap-y-2 lg:overflow-x-visible lg:px-0 lg:pb-0"
      >
        {menuItems
          .filter((item) => item.canSee)
          .map(
            ({ href, icon, title, mobileTitle, exact, onClick, className }) => (
              <li key={href} className={className}>
                <NavLink
                  ref={(el) => {
                    // Check if this element has the unique active portal menu class
                    if (el?.classList.contains("portal-menu-active")) {
                      ;(
                        activeElementRef as React.MutableRefObject<HTMLAnchorElement | null>
                      ).current = el
                    } else if (activeElementRef.current === el) {
                      ;(
                        activeElementRef as React.MutableRefObject<HTMLAnchorElement | null>
                      ).current = null
                    }
                  }}
                  className={({ isActive }) =>
                    clsx(
                      "hover:bg-surface-elevated-2 hover:border-nav-item-active border-nav-item flex flex-row items-center gap-x-[10px] gap-y-1 rounded-lg px-3 py-2 whitespace-nowrap transition-all",
                      {
                        "bg-surface-elevated-2 shadow-light-sm portal-menu-active border-nav-item-active":
                          isActive,
                      }
                    )
                  }
                  onClick={() => {
                    trackEvent({
                      category: "menu",
                      name: mobileTitle
                        ? mobileTitle.toLowerCase()
                        : title.toLowerCase(),
                      action: "click",
                    })

                    if (onClick) {
                      onClick()
                    }
                  }}
                  to={href}
                  end={exact}
                >
                  {icon}
                  <span className="truncate">
                    {isMobile && !!mobileTitle ? mobileTitle : title}
                  </span>
                </NavLink>
              </li>
            )
          )}
      </ul>
    </div>
  )
}

export default PortalMenu
