import { cva, VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const rootVariants = cva(
  "flex h-full items-center justify-center p-0 m-0 text-[0px]",
  {
    variants: {
      overlay: {
        true: "absolute inset-0 z-10 bg-white/75",
        false: "",
      },
    },
    defaultVariants: {
      overlay: false,
    },
  }
)

const spinnerVariants = cva(
  "inline-block rounded-full border-brand-600 border-t-neutral-400 animate-[spin_1s_ease-in-out_infinite]",
  {
    variants: {
      size: {
        xxs: "size-4.5 border-2",
        xs: "size-10 border-4",
        sm: "size-15 border-6",
        md: "size-22.5 border-8",
        lg: "size-30 border-12",
        xl: "size-37.5 border-16",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

export type LoaderSize = NonNullable<
  VariantProps<typeof spinnerVariants>["size"]
>

const Loader = ({
  size = "sm",
  overlay,
  className,
}: {
  size?: LoaderSize
  overlay?: boolean
  className?: string
}) => {
  return (
    <div
      className={twMerge(rootVariants({ overlay: !!overlay }), className)}
      data-testid="loader"
    >
      <div className="w-auto bg-transparent">
        <div className={spinnerVariants({ size })} />
      </div>
    </div>
  )
}

export default Loader
