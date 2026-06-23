import { cva } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const labelVariants = cva(
  ["block mb-0.5 text-sm font-semibold text-text-primary"],
  {
    variants: {
      disabled: {
        true: "text-neutral-500",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
)

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean
}

const Label = ({ children, className, disabled, ...props }: LabelProps) => {
  if (!children) return null

  return (
    <label
      className={twMerge(labelVariants({ disabled }), className)}
      {...props}
    >
      {children}
    </label>
  )
}

interface MessageProps {
  error?: React.ReactNode
  helpText?: React.ReactNode
  isTouched?: boolean
}

const Message = ({ error, helpText, isTouched = true }: MessageProps) => {
  if (error) {
    const className = isTouched
      ? "text-error-600 mt-1 text-xs"
      : "mt-1 text-xs text-neutral-800"
    return <p className={className}>{error}</p>
  }

  if (helpText) {
    return <p className="mt-1 text-xs text-neutral-600">{helpText}</p>
  }

  return null
}

const FormHelpers = {
  Label,
  Message,
}

export default FormHelpers
