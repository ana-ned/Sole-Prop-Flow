import { twMerge } from "tailwind-merge"

interface SeparatorProps {
  text?: string
  className?: string
  textClassName?: string
}

const Separator = ({ text, className, textClassName }: SeparatorProps) => (
  <div
    className={twMerge("relative h-0.5 bg-neutral-300", className)}
    role="separator"
    aria-orientation="horizontal"
    {...(text ? { "aria-label": text } : {})}
  >
    {!!text && (
      <span
        aria-hidden="true"
        className={twMerge(
          "absolute top-1/2 left-1/2 inline-block -translate-1/2 bg-white px-2 py-0 whitespace-nowrap text-neutral-600",
          textClassName
        )}
      >
        {text}
      </span>
    )}
  </div>
)

export default Separator
