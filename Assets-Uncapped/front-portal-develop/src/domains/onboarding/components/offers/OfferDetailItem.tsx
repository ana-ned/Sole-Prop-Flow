import { ReactNode } from "react"
import clsx from "clsx"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography/Typography"

const OfferDetailItem = ({
  label,
  value,
  description,
  condition = true,
  className,
  customContent,
  valueChip,
}: {
  label: string
  value: string
  description?: string
  condition?: boolean
  className?: string
  customContent?: ReactNode
  valueChip?: ReactNode
}) => {
  if (!condition) return null

  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-2">
        <Typography type="bodyMedium" color="neutral-800" id={`label-${label}`}>
          {label}
        </Typography>
        <div className="flex shrink-0 items-center gap-1">
          {valueChip && <div>{valueChip}</div>}
          {value && (
            <Typography
              type="smallTitle"
              color="neutral-800"
              aria-labelledby={`label-${label}`}
            >
              {value}
            </Typography>
          )}
        </div>
      </div>

      {customContent === undefined
        ? description && (
            <SanitizedHtml
              as="p"
              content={description}
              className="text-sm text-neutral-700"
            />
          )
        : customContent}
    </div>
  )
}

export default OfferDetailItem
