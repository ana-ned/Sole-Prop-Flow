import React from "react"
import { cx } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"

const FieldsSummary = ({
  data,
  className = "mb-8",
  wrapped,
}: {
  data: { th: string; td?: React.ReactNode }[]
  className?: string
  wrapped?: boolean
}) => {
  return (
    <div
      className={twMerge(
        cx(className, {
          "rounded-xl bg-white p-4 shadow-[0_1px_4px_0_rgb(0_0_0_/_0.02),0_1px_4px_0_rgb(0_0_0_/_0.05)]":
            wrapped,
        })
      )}
    >
      {data
        .filter((item) => !!item.td)
        .map((item, index) => (
          <div
            className={cx({
              "mb-4": data.filter((el) => !!el.td).length !== index + 1,
            })}
            key={`${item.th}-${index}`}
          >
            <Typography type="smallCopy" className="mb-1">
              {item.th}
            </Typography>
            <Typography type="body">{item.td}</Typography>
          </div>
        ))}
    </div>
  )
}

export default FieldsSummary
