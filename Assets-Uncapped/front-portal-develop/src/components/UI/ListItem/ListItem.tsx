import { HTMLAttributeAnchorTarget } from "react"
import { ChevronRight } from "@material-ui/icons"
import clsx from "clsx"
import { Link, useLocation } from "react-router"
import { TEventTracker, useTracking } from "../../../hooks/useTracking"
import Typography from "../../Basic/Typography"

const ListItem = ({
  icon,
  to,
  children,
  event,
  target,
  shadow,
}: {
  icon?: React.ReactNode
  to: string
  children: React.ReactNode
  event?: TEventTracker
  target?: HTMLAttributeAnchorTarget
  shadow?: boolean
}) => {
  const location = useLocation()
  const { trackEvent } = useTracking()

  return (
    <Link
      to={to}
      target={target}
      state={{
        backUrl: location.pathname,
      }}
      onClick={() => {
        if (event) {
          trackEvent(event)
        }
      }}
      className={clsx(
        "rounded-card-sm flex items-center gap-x-2 bg-white p-2 transition-all hover:bg-neutral-100",
        { "shadow-light-sm": shadow }
      )}
    >
      <div className="flex grow gap-x-3">
        {icon}
        <Typography color="neutral-900" className="!font-medium">
          {children}
        </Typography>
      </div>
      <ChevronRight className="text-brand-600 size-6 shrink-0" />
    </Link>
  )
}

export default ListItem
