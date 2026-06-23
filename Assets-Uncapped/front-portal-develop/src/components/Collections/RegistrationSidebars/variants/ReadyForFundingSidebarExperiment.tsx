import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02Icon,
  Rocket01Icon,
} from "@hugeicons-pro/core-solid-rounded"
import { Trans, useTranslation } from "react-i18next"
import { format } from "../../../../utils/money"
import Typography from "../../../Basic/Typography"
import Gradient from "../../../UI/Gradient"

const cards = [
  {
    icon: CheckmarkCircle02Icon,
    iconClassName: "text-accent-4-contrast",
    titleKey: "readinessCheck" as const,
    descriptionI18nKey:
      "sidebars.ReadyForFunding.readinessCheckDescription" as const,
  },
  {
    icon: Rocket01Icon,
    iconClassName: "text-accent-2-contrast",
    titleKey: "offers" as const,
    descriptionI18nKey: "sidebars.ReadyForFunding.offersDescription" as const,
  },
]

const ReadyForFundingSidebarExperiment = ({
  amount,
  currency,
}: {
  amount: number
  currency: string
}) => {
  const { t } = useTranslation("common", {
    keyPrefix: "sidebars.ReadyForFunding",
  })

  const formattedAmount = format(amount, currency, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <Gradient className="flex w-full justify-center py-30">
      <div className="relative z-10 flex w-full max-w-[423px] flex-col gap-10">
        <div className="flex flex-col gap-6 text-center">
          <p className="font-heading text-[48px] leading-tight font-extrabold text-white">
            {t("title")}
          </p>
          <p className="mx-auto max-w-[356px] font-light text-white">
            <Trans
              i18nKey="sidebars.ReadyForFunding.subtitle"
              ns="common"
              values={{ amount: formattedAmount }}
              components={{ strong: <span className="font-bold" /> }}
            />
          </p>
        </div>

        <div className="space-y-4">
          {cards.map((card) => (
            <div
              key={card.titleKey}
              className="overflow-hidden rounded-xl border border-white/10 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.15),0px_2px_10px_0px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center gap-3 bg-white/25 px-4 py-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-black/25 outline outline-white/10">
                  <HugeiconsIcon
                    icon={card.icon}
                    className={card.iconClassName}
                    size={16}
                  />
                </div>
                <Typography type="bodyTitle" className="text-white">
                  {t(card.titleKey)}
                </Typography>
              </div>
              <p className="bg-white/10 p-4 text-center text-sm font-light text-white">
                <Trans
                  i18nKey={card.descriptionI18nKey}
                  ns="common"
                  components={{ strong: <strong /> }}
                />
              </p>
            </div>
          ))}
        </div>
      </div>
    </Gradient>
  )
}

export default ReadyForFundingSidebarExperiment
