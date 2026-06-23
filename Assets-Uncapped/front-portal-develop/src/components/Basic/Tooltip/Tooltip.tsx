import React, { useId } from "react"
import { Tooltip as ReactTooltip, ITooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"

type Props = {
  content: React.ReactNode
  children: React.ReactNode
  disabled?: boolean
} & Pick<ITooltip, "place">

const Tooltip: React.FC<Props> = ({
  content,
  children,
  place,
  disabled = false,
}) => {
  const id = useId()

  if (disabled) {
    return children
  }

  return (
    <>
      <span role="presentation" id={id}>
        {children}
      </span>
      <ReactTooltip
        className="max-w-65 !rounded-lg bg-neutral-800 !px-3 !py-2 text-center !text-xs font-normal"
        anchorId={id}
        place={place}
      >
        {content}
      </ReactTooltip>
    </>
  )
}

export default Tooltip
