import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import {
  Rocket01SolidStandard,
  ChartUpSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  MoneyBag02SolidRounded,
  PackageDeliveredSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Slider from "react-slick"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../Basic/BoxIcon"
import { BoxIconSeverity } from "../../../Basic/BoxIcon/BoxIcon"
import Typography from "../../../Basic/Typography"
import customerFreeriders from "./assets/customer-freeriders.jpg"
import customerNutripaw from "./assets/customer-nutripaw.jpg"
import customerFreja from "./assets/customer-freja.jpg"
import logoFreeriders from "./assets/logo-freeriders.svg"
import logoNutripaw from "./assets/logo-nutripaw.svg"
import logoFreja from "./assets/logo-freja.svg"
import styles from "./ReapplySidebar.module.scss"

interface SlideTagConfig {
  icon: IconSvgElement
  severity: keyof typeof BoxIconSeverity
}

const SLIDE_KEYS = ["freeriders", "nutripaw", "freja"] as const

type SlideKey = (typeof SLIDE_KEYS)[number]

interface SlideConfig {
  key: SlideKey
  photo: string
  logo: string
  logoAlt: string
  tags: [SlideTagConfig, SlideTagConfig]
  eager?: boolean
}

const SLIDE_CONFIGS: SlideConfig[] = [
  {
    key: "freeriders",
    photo: customerFreeriders,
    logo: logoFreeriders,
    logoAlt: "Freeriders",
    eager: true,
    tags: [
      { icon: MoneyBag02SolidRounded, severity: "accent-brand" },
      { icon: Rocket01SolidStandard, severity: "accent-2" },
    ],
  },
  {
    key: "nutripaw",
    photo: customerNutripaw,
    logo: logoNutripaw,
    logoAlt: "NutriPaw",
    tags: [
      { icon: Rocket01SolidStandard, severity: "accent-brand" },
      { icon: PackageDeliveredSolidRounded, severity: "accent-2" },
    ],
  },
  {
    key: "freja",
    photo: customerFreja,
    logo: logoFreja,
    logoAlt: "Freja",
    tags: [
      { icon: Rocket01SolidStandard, severity: "accent-brand" },
      { icon: ChartUpSolidStandard, severity: "accent-2" },
    ],
  },
]

const TestimonialSlide = ({
  config,
  tagTexts,
  quote,
}: {
  config: SlideConfig
  tagTexts: [string, string]
  quote: string
}) => (
  <div className="relative !h-full w-full overflow-hidden">
    <div className="bg-brand-800 absolute inset-0 z-0 before:absolute before:inset-0 before:bg-[#00416b] before:opacity-50 before:content-['']" />

    <div className="absolute inset-x-0 top-0 z-1 h-full after:absolute after:bottom-0 after:left-0 after:z-1 after:block after:h-[70%] after:w-full after:bg-linear-to-b after:from-[rgb(0_75_77/0)] after:via-[rgb(0_75_77/0.5)] after:to-[rgb(0_75_77/1)] after:content-['']">
      <img
        src={config.photo}
        alt={config.logoAlt}
        className="size-full object-cover object-center"
        loading={config.eager ? "eager" : "lazy"}
      />
    </div>

    {/* !h-auto overrides react-slick's height: 100% inheritance from .slick-slide > div */}
    <div className="absolute inset-x-0 bottom-[100px] z-2 flex !h-auto flex-col gap-4 px-[60px]">
      <img
        src={config.logo}
        alt={config.logoAlt}
        className="h-[70px] w-[200px] overflow-hidden object-contain object-left"
      />

      <div className="flex !h-auto items-center gap-4">
        {config.tags.map((tag, index) => (
          <div
            key={index}
            className="font-primary flex !h-auto items-center gap-2 text-sm leading-normal font-semibold whitespace-nowrap text-white"
          >
            <BoxIcon
              variant="dark"
              severity={tag.severity}
              icon={<HugeiconsIcon icon={tag.icon} />}
              className="border-white/25"
            />
            {tagTexts[index]}
          </div>
        ))}
      </div>

      <Typography
        type="h6"
        className="!h-auto -indent-[0.45em] leading-normal font-normal"
        color="white"
      >
        {quote}
      </Typography>
    </div>
  </div>
)

const ReapplySidebar = () => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked.reapplyForm.testimonials",
  })

  return (
    <div className="bg-brand-800 relative sticky top-0 h-screen w-full overflow-hidden">
      <Slider
        autoplay
        fade
        autoplaySpeed={5000}
        arrows={false}
        className={styles.slider}
        infinite
        dots
      >
        {SLIDE_CONFIGS.map((config) => (
          <TestimonialSlide
            key={config.key}
            config={config}
            tagTexts={
              t(`${config.key}.tags`, {
                returnObjects: true,
              }) as unknown as [string, string]
            }
            quote={t(`${config.key}.quote`)}
          />
        ))}
      </Slider>
    </div>
  )
}

export default ReapplySidebar
