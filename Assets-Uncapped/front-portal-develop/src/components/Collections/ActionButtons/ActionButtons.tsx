import { HugeiconsIcon } from "@hugeicons/react"
import useDevice from "../../../hooks/useDevice"
import Menu from "./Menu"
import NavItem from "./NavItem"
import { ActionButtonConfig, useActionButtons } from "./useActionButtons"

const ActionButtons = ({
  withChat,
  customChatUrl,
}: {
  withChat?: boolean
  customChatUrl?: string
}) => {
  const { isMobile } = useDevice()
  const items = useActionButtons({ withChat, customChatUrl })

  const renderNavItem = (item: ActionButtonConfig) => {
    const navProps = item.href
      ? { href: item.href, state: item.state }
      : { onClick: item.onClick! }

    return (
      <NavItem
        key={item.key}
        {...navProps}
        icon={<HugeiconsIcon icon={item.icon} />}
        iconSeverity={item.iconSeverity}
      >
        {item.label}
      </NavItem>
    )
  }

  if (isMobile) {
    return <Menu items={items} />
  }

  return (
    <div className="flex justify-end gap-1 py-2">
      {items.map((item) => renderNavItem(item))}
    </div>
  )
}

export default ActionButtons
