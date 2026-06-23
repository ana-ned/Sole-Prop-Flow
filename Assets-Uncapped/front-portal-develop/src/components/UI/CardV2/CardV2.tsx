import clsx from "clsx"
import BoxIcon from "../../Basic/BoxIcon"
import { BoxIconSeverity } from "../../Basic/BoxIcon/BoxIcon"

const CardV2 = ({
  className,
  title,
  children,
  icon,
  severity,
  actions,
}: {
  className?: string
  title: React.ReactNode
  children: React.ReactNode
  icon?: React.ReactNode
  severity?: keyof typeof BoxIconSeverity
  actions?: React.ReactNode
}) => {
  return (
    <div
      className={clsx(
        "shadow-light-sm rounded-card-md border-card bg-white",
        className
      )}
    >
      <div className="flex items-center justify-between gap-x-3 border-b border-neutral-200 px-4 py-3">
        <div className="flex gap-x-3">
          {!!icon && !!severity && <BoxIcon icon={icon} severity={severity} />}
          <div
            className={clsx("text-text-primary font-bold", {
              "pl-1": !icon,
            })}
          >
            {title}
          </div>
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="bg-surface-elevated-2 rounded-b-card-md p-4">
        {children}
      </div>
    </div>
  )
}

export default CardV2
