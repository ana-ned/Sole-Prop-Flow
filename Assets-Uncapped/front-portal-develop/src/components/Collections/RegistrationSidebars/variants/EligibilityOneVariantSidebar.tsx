import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react"
import {
  MoneyBag02SolidRounded,
  SecurityValidationIcon,
} from "@hugeicons-pro/core-solid-rounded"
import { Location06SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import { Chart01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Check } from "@material-ui/icons"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Gradient from "../../../UI/Gradient"
import { ReactComponent as Mask } from "../assets/mask.svg"
import { ReactComponent as OfferCard } from "../assets/offer-card.svg"
import { ReactComponent as UncappedLogoCard } from "../assets/uncapped-logo-card.svg"

const IconCard = ({
  icon,
  accent,
  checked,
}: {
  icon: IconSvgElement
  accent: string
  checked?: boolean
}) => (
  <div className="relative flex size-18 items-center justify-center rounded-xl border border-[rgba(141,141,141,0.20)] bg-[linear-gradient(225deg,rgba(255,255,255,0.20)_0%,rgba(0,0,0,0.20)_100%)] [box-shadow:0_0.758px_3.034px_var(--shadow-large-short-spread,0)_rgba(0,0,0,0.21),0_0_15.169px_var(--shadow-large-long-spread,0)_rgba(0,0,0,0.15),0_11.376px_15.169px_var(--shadow-large-long-spread,0)_rgba(0,0,0,0.15)] backdrop-blur-sm backdrop-filter">
    <div
      className={clsx(
        "flex size-10 items-center justify-center rounded-lg border",
        accent
      )}
    >
      <HugeiconsIcon icon={icon} size={24} />
    </div>
    {checked && (
      <div className="bg-brand-600 absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full filter-[drop-shadow(var(--shadow-large-long-x,0)_var(--shadow-large-long-y,2px)_var(--shadow-large-long-blur,9px)_var(--shadow-dark-lg-short-Color,rgba(0,0,0,0.15)))_drop-shadow(var(--shadow-large-short-x,0)_var(--shadow-large-short-y,1px)_var(--shadow-large-short-blur,2px)_var(--shadow-dark-lg-short-Color,rgba(0,0,0,0.15)))]">
        <Check className="size-3! text-white" />
      </div>
    )}
  </div>
)

const Heading = ({
  children,
  className,
}: {
  children: string
  className?: string
}) => (
  <h4
    className={clsx(
      "font-heading text-center text-[32px] font-semibold text-white",
      className
    )}
  >
    {children}
  </h4>
)

const EligibilityOneVariantSidebar = () => {
  const { t } = useTranslation("common", {
    keyPrefix: "sidebars.EligibilityOneVariant",
  })

  return (
    <Gradient className="flex w-full justify-center py-30">
      <div className="flex flex-col gap-14">
        <div className="relative z-10">
          <Heading className="mb-8">{t("discoverTitle")}</Heading>
          <div className="flex items-center justify-center gap-6">
            {[
              {
                icon: Location06SolidSharp,
                accent:
                  "border-accent-1-border text-accent-1-contrast bg-accent-1-subtle",
              },
              {
                icon: SecurityValidationIcon,
                accent:
                  "border-accent-2-border text-accent-2-contrast bg-accent-2-subtle",
              },
              {
                icon: MoneyBag02SolidRounded,
                accent:
                  "border-accent-3-border text-accent-3-contrast bg-accent-3-subtle",
              },
            ].map((item, index) => (
              <IconCard
                key={index}
                icon={item.icon}
                accent={item.accent}
                checked
              />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <Heading className="mb-3">{t("connectTitle")}</Heading>
          <div className="flex items-center justify-center gap-0.5">
            <IconCard
              icon={Chart01SolidStandard}
              accent="border-accent-6-border text-accent-6-contrast bg-accent-6-subtle"
            />

            <Mask />

            <UncappedLogoCard className="mt-2 -mr-4 -ml-4" />
          </div>
        </div>

        <div className="relative z-10">
          <Heading className="mb-3">{t("offersTitle")}</Heading>
          <div className="flex items-center justify-center">
            <OfferCard />
          </div>
        </div>
      </div>
    </Gradient>
  )
}

export default EligibilityOneVariantSidebar
