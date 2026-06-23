import { useTranslation } from "react-i18next"
import Slider from "react-slick"
import Typography from "../../../Basic/Typography"
import Layout from "../../../UI/Layout"
import { ReactComponent as CopyCord } from "../assets/carousel-copy-cord.svg"
import { ReactComponent as CopyGndhouse } from "../assets/carousel-copy-gndhouse.svg"
import { ReactComponent as CopyHg } from "../assets/carousel-copy-hg.svg"
import { ReactComponent as CopyNutripaw } from "../assets/carousel-copy-nutripaw.svg"
import carouselBg1 from "../assets/carousel-bg-1.webp"
import carouselBg2 from "../assets/carousel-bg-2.webp"
import carouselBg3 from "../assets/carousel-bg-3.webp"
import carouselBg4 from "../assets/carousel-bg-4.webp"
import ReviewCarousel from "../components/ReviewCarousel"

const slides = [
  { bg: carouselBg1, Copy: CopyHg },
  { bg: carouselBg2, Copy: CopyGndhouse },
  { bg: carouselBg3, Copy: CopyNutripaw },
  { bg: carouselBg4, Copy: CopyCord },
]

const slideClasses = [
  "relative block h-full w-full bg-cover bg-center",
  // svg
  "[&_svg]:absolute [&_svg]:right-9 [&_svg]:bottom-[97px] [&_svg]:z-10 [&_svg]:[transform:translateZ(0)]",
  // ::before — bottom gradient
  "before:absolute before:bottom-0 before:left-0 before:z-1",
  "before:block before:h-[56vh] before:w-full before:content-['']",
  "before:[background:var(--gradient-gallery-overlay)]",
  // ::after — top gradient (rotated)
  "after:absolute after:top-0 after:left-0 after:z-1",
  "after:block after:h-[56vh] after:w-full after:content-['']",
  "after:[background:var(--gradient-gallery-overlay)] after:rotate-180",
].join(" ")

const GallerySidebar = () => {
  const { t } = useTranslation("registration", { keyPrefix: "GallerySidebar" })
  return (
    <Layout.Sidebar
      className="relative z-1 bg-neutral-800"
      content={
        <>
          <Slider
            autoplay
            fade
            autoplaySpeed={4000}
            arrows={false}
            className="slick-gallery-dots relative z-0 h-full w-full overflow-hidden"
            infinite
            dots
          >
            {slides.map(({ bg, Copy }) => (
              <div key={bg}>
                <div
                  className={slideClasses}
                  style={{ backgroundImage: `url(${bg})` }}
                >
                  <Copy />
                </div>
              </div>
            ))}
          </Slider>
          <ReviewCarousel className="!absolute !top-15" />
          <footer className="absolute bottom-5 left-1/2 z-4 -translate-x-1/2 whitespace-nowrap">
            <Typography type="bodyTitle" color="white">
              {t("chosenByFounders")}
            </Typography>
          </footer>
        </>
      }
    />
  )
}

export default GallerySidebar
