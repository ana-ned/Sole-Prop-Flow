import { HugeiconsIcon } from "@hugeicons/react"
import { StarAward02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  ChartUpSolidStandard,
  CreditCardAddSolidStandard,
  Forward02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Typography from "../../../../components/Basic/Typography"
import Widget from "../../../../components/UI/Widget"
import { OfferResponse } from "../../../../services/api/agreements"
import useConnections from "../../../connections/hooks/useConnections"
import platforms from "../../../connections/models/platforms"

const whyWeBetterIconConfig = [
  { icon: CreditCardAddSolidStandard, color: "accent-brand" as const },
  { icon: Forward02SolidStandard, color: "accent-3" as const },
  { icon: ChartUpSolidStandard, color: "accent-11" as const },
]

const DailyPayoutSidebar = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.dailyPayoutSidebar",
  })

  const { salesConnections } = useConnections()

  const storeConnectionIds =
    offer.offerDetails?.dailyPayoutOfferDetails?.storeConnectionIds

  const matchedConnections = salesConnections.filter(
    (connection) => connection.id && storeConnectionIds?.has(connection.id)
  )

  const whyWeBetterItems: string[] = t("whyWeBetter.items", {
    returnObjects: true,
  })

  return (
    <div className="flex w-full flex-col gap-10 text-left">
      <Widget
        title={t("marketplace.title")}
        icon={
          <BoxIcon
            severity="accent-9"
            icon={<HugeiconsIcon icon={StarAward02SolidSharp} />}
          />
        }
      >
        <div className="shadow-light-sm border-card flex flex-col gap-2 rounded-lg bg-white p-2">
          {matchedConnections.map((connection) => {
            const platform = Object.values(platforms).find(
              ({ systemId }) => systemId === connection.systemId
            )
            return (
              <div
                key={connection.id}
                className="flex items-center gap-3 rounded-lg p-2"
              >
                <div className="flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 p-1">
                  {platform && "iconUrl" in platform && platform.iconUrl ? (
                    <img
                      src={platform.iconUrl}
                      alt={platform.name}
                      className="size-6"
                    />
                  ) : null}
                </div>
                <Typography type="body" className="truncate">
                  <span className="font-semibold">
                    {connection.title ?? platform?.name ?? ""}
                  </span>
                  {connection.displayName && (
                    <span className="text-neutral-700">
                      {" "}
                      - {connection.displayName}
                    </span>
                  )}
                </Typography>
              </div>
            )
          })}
        </div>
      </Widget>

      <Widget title={t("whyWeBetter.title")}>
        <div className="flex flex-col gap-6">
          {whyWeBetterItems.map((item, index) => {
            const config = whyWeBetterIconConfig[index]
            return (
              <div key={index} className="flex items-start gap-4">
                <BoxIcon
                  severity={config.color}
                  icon={<HugeiconsIcon icon={config.icon} />}
                />
                <Typography type="body" className="flex-1">
                  {item}
                </Typography>
              </div>
            )
          })}
        </div>
      </Widget>
    </div>
  )
}

export default DailyPayoutSidebar
