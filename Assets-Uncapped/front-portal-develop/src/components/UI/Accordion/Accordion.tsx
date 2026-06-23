import React, { useId } from "react"
import { KeyboardArrowDown } from "@material-ui/icons"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"
import { TypographyTypes } from "../../Basic/Typography/Typography"
import Card from "../Card/Card"

type AccordionVariant = "v1" | "v2"

interface AccordionItemProps {
  content?: React.ReactNode
  className?: string
  label: string
  labelClassName?: string
  value?: string | number
  alwaysOpen?: boolean
  valueType?: TypographyTypes
  chip?: React.ReactNode
  variant?: AccordionVariant
  onClick?: () => void
}

const AccordionItem = ({
  content,
  className,
  label,
  value,
  labelClassName,
  alwaysOpen = false,
  valueType = "smallCopy",
  chip,
  variant = "v1",
  onClick,
}: AccordionItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const id = useId()

  const getRotation = () => {
    if (variant === "v1") return isOpen ? 0 : -90
    return isOpen ? 180 : 0
  }

  const icon = content && !alwaysOpen && (
    <span
      className="text-brand-600 inline-flex transition-transform duration-200"
      style={{ transform: `rotate(${getRotation()}deg)` }}
    >
      <KeyboardArrowDown />
    </span>
  )

  return (
    <div className={twMerge("px-1", className)}>
      <button
        type="button"
        onClick={() => {
          if (!isOpen) onClick?.()
          setIsOpen(!isOpen)
        }}
        className={twMerge(
          "flex w-full items-center gap-2 border-none bg-transparent p-0",
          (!content || alwaysOpen) && "cursor-default"
        )}
      >
        {variant === "v1" && icon}
        <p
          id={id}
          className={twMerge(
            "text-text-primary grow text-left font-semibold",
            labelClassName
          )}
        >
          {label}
        </p>
        <div className="[&_a]:text-brand-600 flex items-center gap-1">
          {chip && <div className="mr-1">{chip}</div>}
          <Typography type={valueType} aria-labelledby={id}>
            {value}
          </Typography>
        </div>
        {variant === "v2" && icon}
      </button>
      {content && (
        <div
          className={twMerge(
            "text-text-secondary [&_a]:text-text-link max-h-0 overflow-hidden px-2 text-sm transition-all duration-200 [&_a]:font-bold [&_a]:no-underline [&_a]:hover:underline",
            isOpen || alwaysOpen ? "max-h-[500px] pt-1" : "pt-0"
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  title?: string
  items: AccordionItemProps[]
  className?: string
  variant?: AccordionVariant
}

const Accordion = ({ title, items, className, variant }: AccordionProps) => {
  return (
    <div className={className}>
      {title && (
        <div className="mb-2">
          <Typography type="bodyTitle" color="neutral-800">
            {title}
          </Typography>
        </div>
      )}
      <Card className="space-y-2" spacing="small">
        {items.map(
          ({
            label,
            labelClassName,
            value,
            content,
            alwaysOpen,
            valueType,
            chip,
            onClick,
          }) => (
            <AccordionItem
              key={label}
              label={label}
              labelClassName={labelClassName}
              value={value}
              content={content}
              alwaysOpen={alwaysOpen}
              valueType={valueType}
              chip={chip}
              variant={variant}
              onClick={onClick}
            />
          )
        )}
      </Card>
    </div>
  )
}

export default Accordion
