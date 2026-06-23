import React, { isValidElement } from "react"
import { cva, VariantProps } from "class-variance-authority"
import { Link } from "react-router"
import { twMerge } from "tailwind-merge"

type ButtonVariantsProps = Omit<VariantProps<typeof buttonVariants>, "iconOnly">

interface ButtonCommonProps extends ButtonVariantsProps {
  disabled?: boolean
  children: React.ReactNode
  className?: string
  dataTestId?: string
  ariaLabel?: string
}

interface ButtonHtml extends ButtonCommonProps {
  href?: never
  target?: never
  type: "button" | "submit"
  onClick?: () => void
  state?: never
  download?: boolean
  loading?: boolean
}

interface ButtonLink extends ButtonCommonProps {
  href: string
  target?: string
  type?: never
  onClick?: () => void
  state?: Record<string, unknown>
  download?: boolean
  loading?: never
}

type ButtonProps = ButtonHtml | ButtonLink

export const buttonVariants = cva(
  [
    "items-center justify-center text-center no-underline cursor-pointer select-none",
    "transition-all duration-200 ease-out",
    "disabled:cursor-not-allowed disabled:text-on-disabled disabled:shadow-none",
    "font-semibold text-sm leading-6 rounded-button-md",
    "px-4 gap-2",
    "[&_svg]:shrink-0 [&_svg]:size-5",
  ],
  {
    variants: {
      fullWidth: {
        true: ["flex w-full"],
        false: ["inline-flex w-auto"],
      },
      iconOnly: {
        true: ["!p-0 !gap-0 size-11 [&_svg]:size-6"],
        false: null,
      },
      variant: {
        primary: [
          "text-on-primary bg-button-primary border border-solid border-button-primary-border",
          "hover:bg-button-primary-hover hover:border-button-primary-border-hover",
          "disabled:bg-button-disabled disabled:border-button-disabled-border",
        ],
        secondary: [
          "text-on-secondary bg-button-secondary border border-solid border-button-secondary-border ring-button-secondary-border-hover ring-transparent",
          "hover:border-button-secondary-border-hover hover:ring",
          "disabled:bg-button-disabled disabled:border-button-disabled-border disabled:ring-transparent",
        ],
        tertiary: [
          "text-on-tertiary",
          "bg-[#ffd58e] bg-gradient-to-b from-[#ffcf80] to-[#fcba4b]",
          "shadow-[0_1px_6px_0_rgb(0_0_0/0.02),0_1px_2px_0_rgb(0_0_0/0.08),inset_0_2px_2px_#ffeac7,inset_0_-1px_2px_#f2ae49]",
          "hover:to-[#fcc365]",
          "disabled:bg-button-disabled disabled:from-button-disabled disabled:to-button-disabled disabled:shadow-none",
        ],
        link: [
          "inline-flex !p-0 !min-h-0 text-text-link bg-transparent border-0",
          "hover:underline",
          "disabled:no-underline",
        ],
      },
      error: {
        true: null,
        false: null,
      },
      loading: {
        true: [
          "relative !text-transparent pointer-events-none [&_svg]:invisible",
          "after:absolute after:size-[1em] after:content-['']",
          "after:border-2 after:border-solid after:border-current after:border-t-transparent after:border-r-transparent after:rounded-full",
          "after:top-[calc(50%-0.5em)] after:left-[calc(50%-0.5em)]",
          "after:animate-spin after:[animation-duration:500ms]",
        ],
        false: null,
      },
      size: {
        md: ["min-h-11 py-2"],
        sm: ["min-h-9.5 py-1.5"],
      },
      textWrap: {
        true: ["whitespace-normal"],
        false: ["whitespace-nowrap"],
      },
    },
    compoundVariants: [
      {
        loading: true,
        variant: "primary",
        class: [
          "after:text-on-primary",
          "disabled:bg-button-primary disabled:border-button-primary-border",
        ],
      },
      {
        loading: true,
        variant: "secondary",
        class: [
          "after:text-on-secondary",
          "disabled:bg-button-secondary disabled:border-button-secondary-border",
        ],
      },
      {
        loading: true,
        variant: "tertiary",
        class: [
          "after:text-on-tertiary",
          "disabled:bg-[#ffd58e] disabled:from-[#ffcf80] disabled:to-[#fcba4b]",
          "disabled:shadow-[0_1px_6px_0_rgb(0_0_0/0.02),0_1px_2px_0_rgb(0_0_0/0.08),inset_0_2px_2px_#ffeac7,inset_0_-1px_2px_#f2ae49]",
        ],
      },
      {
        loading: true,
        variant: "link",
        class: ["after:text-text-link"],
      },
      {
        error: true,
        variant: "link",
        class: ["!text-text-error"],
      },
    ],
    defaultVariants: {
      variant: "primary",
      fullWidth: false,
      iconOnly: false,
      loading: false,
      size: "md",
      textWrap: false,
      error: false,
    },
  }
)

const Button = ({
  children,
  variant = "primary",
  href,
  target,
  type,
  onClick,
  disabled = false,
  className,
  loading = false,
  dataTestId,
  fullWidth = false,
  state,
  download,
  ariaLabel,
  size = "md",
  textWrap = false,
  error = false,
}: ButtonProps) => {
  const isIconOnly =
    isValidElement(children) && children.type !== React.Fragment

  const appliedClass = twMerge(
    buttonVariants({
      variant,
      fullWidth,
      size,
      loading,
      textWrap,
      iconOnly: isIconOnly,
      error,
    }),
    className
  )

  if (href) {
    if (href.startsWith("http") || href.startsWith("//")) {
      return (
        <a
          className={appliedClass}
          href={href}
          target={target}
          data-testid={dataTestId}
          download={download}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel}
          onClick={onClick}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        className={appliedClass}
        to={href}
        data-testid={dataTestId}
        state={state}
        onClick={onClick}
        download={download}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      data-testid={dataTestId}
      className={appliedClass}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

export default Button
