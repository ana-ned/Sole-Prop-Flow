import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"

const ListHeader = ({
  title,
  more,
  type = "bodyTitle",
  className = "mb-4",
}: {
  title: string
  type?: "bodyTitle" | "smallTitle"
  more?: {
    to: string
    label?: string
    state?: Record<string, any>
    onClick?: () => void
  }
  className?: string
}) => {
  const { t } = useTranslation()

  return (
    <div className={twMerge(className, "flex items-center justify-between")}>
      <Typography type={type}>{title}</Typography>
      {more && (
        <Link
          to={more.to}
          state={more.state}
          onClick={more.onClick}
          className="text-sm no-underline"
        >
          <Typography type="smallTitle" color="secondary">
            {more.label || t("listHeader.seeAll")}
          </Typography>
        </Link>
      )}
    </div>
  )
}

export default ListHeader
