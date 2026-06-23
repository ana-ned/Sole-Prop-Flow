/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const siteOverlayVariants = cva(
  [
    "bg-surface-canvas",
    "fixed",
    "inset-0",
    "z-(--overlay-z-index)",
    "overflow-y-auto",
  ],
  {
    variants: {
      opacity: {
        true: ["opacity-70"],
        false: null,
      },
    },
  }
)

type SiteOverlayVariantProps = VariantProps<typeof siteOverlayVariants>

interface SiteOverlayProps extends SiteOverlayVariantProps {
  isOpen: boolean
  children?: React.ReactNode
  onClick?: (event: any) => void
  className?: string
}

const SiteOverlay = ({
  isOpen,
  children,
  opacity = false,
  onClick,
  className,
}: SiteOverlayProps) => {
  if (isOpen) {
    return (
      <div
        className={twMerge(siteOverlayVariants({ opacity }), className)}
        onClick={(event) => onClick?.(event)}
        onKeyDown={(event) => onClick?.(event)}
      >
        {children}
      </div>
    )
  }

  return null
}

export default SiteOverlay
