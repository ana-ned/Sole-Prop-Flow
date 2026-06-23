import clsx from "clsx"
import { Link } from "react-router"
import BoxIcon, { BoxIconSeverity } from "../../Basic/BoxIcon/BoxIcon"

interface NavItemBaseProps {
  children: React.ReactNode
  icon?: React.ReactNode
  iconSeverity?: keyof typeof BoxIconSeverity
  chip?: string | number
  className?: string
}

type NavItemProps = NavItemBaseProps &
  (
    | { onClick: () => void; href?: never; state?: never }
    | { href: string; state?: object; onClick?: never }
  )

const NavItem = ({
  children,
  icon,
  iconSeverity = "accent-brand",
  chip,
  className,
  onClick,
  href,
  state,
}: NavItemProps) => {
  const baseClassName = clsx(
    "flex h-[38px] cursor-pointer items-center gap-1 rounded-lg border-none bg-transparent px-2 text-base leading-normal text-neutral-800 transition-all duration-150",
    "hover:bg-surface-elevated-2",
    className
  )

  const content = (
    <>
      <BoxIcon icon={icon} severity={iconSeverity} />
      <span className="flex min-h-px min-w-0 flex-1 items-center gap-2 px-2">
        <span className="truncate">{children}</span>
        {chip !== undefined && (
          <span className="border-success-200 bg-success-100 text-success-600 flex h-5 items-center justify-center rounded-full border px-2 text-xs">
            {chip}
          </span>
        )}
      </span>
    </>
  )

  if (href) {
    return (
      <Link to={href} state={state} className={baseClassName}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={baseClassName}>
      {content}
    </button>
  )
}

export default NavItem
