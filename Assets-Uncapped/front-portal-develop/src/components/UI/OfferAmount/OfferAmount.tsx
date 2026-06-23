import { twMerge } from "tailwind-merge"
import { format } from "../../../utils/money"
import Typography from "../../Basic/Typography"

const OfferAmount = ({
  amount,
  currency,
  className,
}: {
  amount: number
  currency: string
  className?: string
}) => {
  return (
    <Typography
      type="h1"
      className={twMerge(
        "relative mx-auto w-fit font-extrabold whitespace-nowrap shadow-[inset_0_-25px_0_var(--color-secondary-300)]",
        "before:absolute before:-top-4.5 before:-left-9.5 before:h-9 before:w-8.25 before:content-(--icon-highlights)",
        "after:absolute after:-top-4.5 after:-right-9.5 after:h-9 after:w-8.25 after:-scale-x-100 after:content-(--icon-highlights)",
        className
      )}
    >
      {format(amount, currency, {
        minimumFractionDigits: 0,
      })}
    </Typography>
  )
}

export default OfferAmount
