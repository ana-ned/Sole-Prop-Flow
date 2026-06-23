import React from "react"
import { OpenInNew } from "@material-ui/icons"
import { Link } from "react-router"
import Typography from "../../../components/Basic/Typography"

interface ProfileItemProps {
  icon: React.ReactNode
  title: string
  onClick?: () => void
  href?: string
  customPointer?: React.ReactNode
}

const ProfileItem = ({
  icon,
  title,
  href,
  onClick,
  customPointer,
}: ProfileItemProps) => {
  const rootClassNames =
    "inline-flex w-full p-2 no-underline bg-white border-none rounded-(--radius-card-sm) hover:bg-neutral-100 not-last:mb-2"
  const linkIconClassNames = "text-brand-600 [&_svg]:size-6"
  const content = () => (
    <>
      <div className={linkIconClassNames}>{icon}</div>
      <div className="grow self-center px-2 py-0 text-left">
        <Typography className="text-neutral-600" type="body">
          {title}
        </Typography>
      </div>
      <div className={linkIconClassNames}>{customPointer || <OpenInNew />}</div>
    </>
  )

  if (href && !href.startsWith("http")) {
    return (
      <Link to={href} onClick={onClick} className={rootClassNames}>
        {content()}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel="noreferrer"
        className={rootClassNames}
      >
        {content()}
      </a>
    )
  }
  return (
    <button type="button" onClick={onClick} className={rootClassNames}>
      {content()}
    </button>
  )
}

export default ProfileItem
