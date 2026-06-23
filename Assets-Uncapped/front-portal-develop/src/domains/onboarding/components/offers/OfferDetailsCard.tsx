import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import Typography from "../../../../components/Basic/Typography"
import { TypographyTypes } from "../../../../components/Basic/Typography/Typography"
import Card from "../../../../components/UI/Card"
import Loader from "../../../../components/UI/Loader"
import { ReactComponent as ChevronRightIcon } from "../../../../svgs/chevron-right.svg"

interface OfferDetailItem {
  label: ReactNode
  labelType?: TypographyTypes
  labelClassName?: string
  value: string | number
  valueType?: TypographyTypes
  content?: ReactNode
  link?: string
  customLabelName?: string
}

interface OfferDetailsCardProps {
  title?: string
  items: OfferDetailItem[]
  className?: string
  loading?: boolean
}

const OfferDetailsCard = ({
  title,
  items,
  className,
  loading,
}: OfferDetailsCardProps) => {
  const { t } = useTranslation("onboarding")

  return (
    <div className={className}>
      {title && (
        <div className="mb-2 flex items-center justify-between">
          <Typography type="bodyTitle" color="neutral-700">
            {title}
          </Typography>
        </div>
      )}
      <Card>
        {loading && <Loader size="xs" overlay />}
        {items.map(
          (
            {
              label,
              labelClassName,
              labelType,
              value,
              valueType = "smallTitle",
              content,
              link,
              customLabelName,
            },
            index
          ) => (
            <div className="not-last:mb-4" key={customLabelName || index}>
              <div className="flex items-center justify-between">
                <Typography
                  color={labelType ? undefined : "neutral-700"}
                  id={
                    customLabelName ||
                    (typeof label === "string" ? label : index.toString())
                  }
                  type={labelType}
                  className={labelClassName}
                >
                  {label}
                </Typography>
                <div className="[&_a]:text-brand-600 flex items-center gap-1">
                  <Typography
                    type={valueType}
                    aria-labelledby={customLabelName || label}
                  >
                    {value}
                  </Typography>
                  {link && (
                    <Link to={link} aria-label={t("offers.more")}>
                      <ChevronRightIcon />
                    </Link>
                  )}
                </div>
              </div>
              {content && <div className="mt-4">{content}</div>}
            </div>
          )
        )}
      </Card>
    </div>
  )
}

export default OfferDetailsCard
