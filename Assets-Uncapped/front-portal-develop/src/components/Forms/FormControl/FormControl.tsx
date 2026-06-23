import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import { isLocal } from "../../../utils/env"

const marginsMap = {
  s: "mb-2",
  m: "mb-5",
}

const formControlVariants = cva([], {
  variants: {
    size: marginsMap,
  },
  defaultVariants: {
    size: "m",
  },
})
interface FormControlProps extends React.PropsWithChildren<
  VariantProps<typeof formControlVariants>
> {
  className?: string
}

const FormControl = ({ size, children, className }: FormControlProps) => {
  if (size && !marginsMap[size] && isLocal()) {
    throw new Error(`Unhandled size prop used in FormControl: ${size}`)
  }
  return (
    <div className={twMerge(formControlVariants({ size }), className)}>
      {children}
    </div>
  )
}

export default FormControl
