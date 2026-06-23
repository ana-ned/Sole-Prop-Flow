import { HugeiconsIcon } from "@hugeicons/react"
import { Logout05Icon } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import useAuth from "../../../hooks/useAuth"
import { useTracking } from "../../../hooks/useTracking"
import BoxIcon from "../../Basic/BoxIcon"

const LogoutMenuButton = () => {
  const auth = useAuth()
  const { trackEvent } = useTracking()
  const { t } = useTranslation("common")

  if (!auth.isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    trackEvent({
      category: "onboarding",
      name: "logout",
      action: "clicked",
    })
    await auth.logout()
  }

  return (
    <ul className="mt-auto hidden pt-10 lg:block">
      <li>
        <button
          type="button"
          className="hover:bg-surface-elevated-2 flex w-[240px] flex-row items-center gap-x-[10px] gap-y-1 rounded-lg px-3 py-2 whitespace-nowrap transition-all"
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
  )
}

export default LogoutMenuButton
