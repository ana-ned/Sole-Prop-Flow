import { cva } from "class-variance-authority"
import { useTranslation } from "react-i18next"
import { twMerge } from "tailwind-merge"
import SanitizedHtml from "../../../Basic/SanitizedHtml"
import Typography from "../../../Basic/Typography"
import { ReactComponent as Star } from "../assets/star.svg"

const rootVariants = cva([
  "relative z-2 w-full h-28.25 overflow-hidden",
  "mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_13%,rgba(0,0,0,1)_87%,rgba(255,255,255,0)_100%)]",
])

const ReviewCarousel = ({ className }: { className?: string }) => {
  const { t } = useTranslation("registration", { keyPrefix: "GallerySidebar" })

  const printReviews = () => {
    return t("reviews", { returnObjects: true }).map((el: string) => (
      <div key={el} className="h-full">
        <div
          key={el}
          className={twMerge(
            "h-full w-46.25 rounded-xl p-3.75",
            "bg-[linear-gradient(180deg,rgba(250,250,250,1)_0%,rgba(245,245,245,1)_100%)]",
            "[&>p]:font-semibold"
          )}
        >
          <Typography type="footnote">
            <SanitizedHtml as="span" content={el} />
          </Typography>
          <footer className="mt-2.5 flex gap-0.5 [&_svg]:m-0 [&_svg]:size-4.25">
            {Array.from({ length: 5 })
              .fill(0)
              .map((_, index) => (
                <Star key={index} />
              ))}
          </footer>
        </div>
      </div>
    ))
  }

  return (
    <div className={twMerge(rootVariants(), className)}>
      <div className="absolute left-0 flex h-full w-[200%] animate-[review-slide_60s_linear_infinite] items-center gap-4">
        {printReviews()}
        {printReviews()}
      </div>
    </div>
  )
}

export default ReviewCarousel
