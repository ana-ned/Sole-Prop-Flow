import { ReactNode } from "react"
import Loader from "../../../../components/UI/Loader"
import Widget from "../../../../components/UI/Widget"
import OfferDetailItem from "./OfferDetailItem"

export interface OfferDetailItemProps {
  label: string
  value?: string | number
  content?: ReactNode
  customLabelName?: string
  valueChip?: ReactNode
}

const OfferDetailsCardV2 = ({
  title,
  items,
  loading,
  icon,
  footer,
}: {
  title?: string
  items: OfferDetailItemProps[]
  loading?: boolean
  icon?: ReactNode
  footer?: ReactNode
}) => {
  return (
    <Widget title={title || ""} icon={icon}>
      <div className="flex flex-col gap-4">
        <div className="shadow-light-sm border-card flex flex-col gap-2 rounded-lg bg-white p-3">
          {loading && <Loader size="xs" overlay />}
          {items.map(({ label, value, content, valueChip }, index) => (
            <OfferDetailItem
              key={index}
              label={label}
              value={value?.toString() || ""}
              customContent={content}
              valueChip={valueChip}
            />
          ))}
        </div>
        {footer && <div>{footer}</div>}
      </div>
    </Widget>
  )
}

export default OfferDetailsCardV2
