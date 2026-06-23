import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"

const rootVariants = cva("flex min-h-full", {
  variants: {
    centered: {
      true: "lg:items-center",
    },
  },
})

const imgVariants = cva("block w-full mx-auto", {
  variants: {
    fluidIcon: {
      true: "max-w-full",
      false: "max-w-53",
    },
  },
  defaultVariants: {
    fluidIcon: false,
  },
})

const footerVariants = cva("flex flex-col gap-4", {
  variants: {
    size: {
      small: "mt-4 md:mt-9",
      large: "mt-4 md:mt-6",
    },
  },
  defaultVariants: {
    size: "small",
  },
})

type RootVariants = VariantProps<typeof rootVariants>
type ImgVariants = VariantProps<typeof imgVariants>
type FooterVariants = VariantProps<typeof footerVariants>

interface FeatureContentProps {
  title?: string
  img?: string
  content?: React.ReactNode
  footerContent?: React.ReactElement
  className?: string
  contentClassName?: string
  fluidIcon?: NonNullable<ImgVariants["fluidIcon"]>
  size?: NonNullable<FooterVariants["size"]>
  centered?: NonNullable<RootVariants["centered"]>
}

const mobileContentClasses = [
  "max-lg:flex max-lg:flex-1 max-lg:flex-col max-lg:[overflow-wrap:anywhere]",
  "max-lg:mx-auto max-lg:text-center max-lg:text-neutral-600",
  "max-lg:[&>*:not(:last-child)]:mb-4",
]

const contentClasses = [
  "flex flex-1 flex-col [overflow-wrap:anywhere]",
  "mx-auto text-center text-neutral-600",
  "[&>*:not(:last-child)]:mb-4",
]

const FeatureContent = ({
  title,
  img,
  content,
  footerContent,
  className,
  contentClassName,
  fluidIcon,
  size,
  centered = true,
}: FeatureContentProps) => {
  return (
    <div
      className={twMerge(
        rootVariants({ centered: centered || undefined }),
        className
      )}
    >
      <div className="flex flex-1 flex-col">
        <div className={twMerge(mobileContentClasses, contentClassName)}>
          {img && (
            <picture>
              <img
                className={imgVariants({ fluidIcon: fluidIcon || undefined })}
                src={img}
                alt=""
              />
            </picture>
          )}
          {title && (
            <Typography type="h5" className="mt-5 text-center">
              <SanitizedHtml as="span" content={title} />
            </Typography>
          )}
          <div className={twMerge(contentClasses, "mt-4!")}>{content}</div>
        </div>
        {footerContent && (
          <footer className={footerVariants({ size })}>{footerContent}</footer>
        )}
      </div>
    </div>
  )
}

export default FeatureContent
