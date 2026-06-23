import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoreHorizontalSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import clsx from "clsx"
import { Link } from "react-router"
import BoxIcon from "../../Basic/BoxIcon/BoxIcon"
import { ActionButtonConfig } from "./useActionButtons"

interface MenuProps {
  items: ActionButtonConfig[]
  className?: string
  label?: string
}

const Menu = ({ items, className, label }: MenuProps) => {
  const renderItem = (item: ActionButtonConfig) => {
    const content = (
      <>
        <BoxIcon
          icon={<HugeiconsIcon icon={item.icon} />}
          severity={item.iconSeverity}
        />
        <span className="flex min-h-px min-w-0 flex-1 items-center">
          <span className="truncate">{item.label}</span>
        </span>
      </>
    )

    const itemClassName =
      "hover:bg-surface-elevated-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base leading-normal text-neutral-800 transition-all duration-150"

    if (item.href) {
      return (
        <Link
          to={item.href}
          state={item.state}
          className={itemClassName}
          onClick={item.onClick}
        >
          {content}
        </Link>
      )
    }

    return (
      <button type="button" onClick={item.onClick} className={itemClassName}>
        {content}
      </button>
    )
  }

  return (
    <HeadlessMenu as="div" className={clsx("relative", className)}>
      <MenuButton
        className="hover:border-brand-400 data-open:ring-control-border-active flex size-[38px] cursor-pointer items-center justify-center rounded-lg border border-neutral-300 bg-white text-neutral-800 transition-all focus:outline-none data-open:ring-1"
        aria-label={label}
        data-testid="more-button"
      >
        <HugeiconsIcon icon={MoreHorizontalSolidRounded} className="size-5" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-50 mt-1 min-w-[284px] rounded-xl bg-white py-1 shadow-lg focus:outline-none"
      >
        {items.map((item) => (
          <MenuItem key={item.key}>{renderItem(item)}</MenuItem>
        ))}
      </MenuItems>
    </HeadlessMenu>
  )
}

export default Menu
