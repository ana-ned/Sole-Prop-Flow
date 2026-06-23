import { HugeiconsIcon } from "@hugeicons/react"
import {
  HelpCircleSolidSharp,
  StarAward02SolidSharp,
} from "@hugeicons-pro/core-solid-sharp"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import useDevice from "../../../../hooks/useDevice"
import { OfferResponse } from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import DailyPayoutSidebar from "../../pages/offersSelection/DailyPayoutSidebar"
import DailyPayoutAnimation from "./DailyPayoutAnimation"
import OfferDetailsCardV2 from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"

const buildDailyPayoutCalculatorUrl = (
  details: NonNullable<
    NonNullable<OfferResponse["offerDetails"]>["dailyPayoutOfferDetails"]
  >
): string => {
  const advanceLimit = details.advanceLimit ?? 0
  const dailyFeeRate = details.dailyFeeRate ?? 0
  const principalBalanceRate = details.principalBalanceRate ?? 0
  const payoutDateObj = new Date()
  payoutDateObj.setDate(payoutDateObj.getDate() + 7)
  const payoutDate = new Intl.DateTimeFormat("en-CA").format(payoutDateObj)
  return `https://portal.weareuncapped.com/tools/daily-payout-calculator/index.html?${new URLSearchParams(
    {
      stdbal: (Math.round(((advanceLimit / 3) * 0.6) / 1000) * 1000).toString(),
      defbal: (Math.round(((advanceLimit / 3) * 0.4) / 1000) * 1000).toString(),
      payout: payoutDate,
      revenue: (Math.round(advanceLimit / 3 / 30 / 100) * 100).toString(),
      fee: (dailyFeeRate * 100).toString(),
      rate: (principalBalanceRate * 100).toString(),
    }
  ).toString()}`
}

const DailyPayoutTabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.dailyPayout",
  })
  const { isMobile } = useDevice()

  const currency = offer.offerDetails?.commonOfferDetails?.advanceCurrency!

  const advanceRatePercentage =
    offer.offerDetails?.dailyPayoutOfferDetails?.principalBalanceRate! * 100

  const advanceRateFormatted = formatAsPercentage(advanceRatePercentage, 4, {
    removeTrailingZeros: true,
  })

  const dailyFeeFormatted = formatAsPercentage(
    offer.offerDetails?.dailyPayoutOfferDetails?.dailyFeeRate! * 100,
    6,
    { removeTrailingZeros: true }
  )

  const rate = advanceRateFormatted

  const limit = format(
    offer.offerDetails?.dailyPayoutOfferDetails?.advanceLimit!,
    currency,
    { minimumFractionDigits: 0 }
  )

  const detailsItems = [
    {
      label: t("details.advanceRate.title"),
      value: advanceRateFormatted,
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("details.advanceRate.description", { rate, limit })}
            as="span"
          />
        </Typography>
      ),
    },
    {
      label: t("details.dailyFee.title"),
      value: dailyFeeFormatted,
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("details.dailyFee.description")}
            as="span"
          />
        </Typography>
      ),
    },
    {
      label: t("details.repayments.title"),
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("details.repayments.description", { rate })}
            as="span"
          />
        </Typography>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <Typography type="h2" color="white">
            {t("banner.title")}
          </Typography>
        }
      >
        <SanitizedHtml content={t("banner.subtitle", { rate })} as="span" />
      </MainBanner>

      <OfferExpirationNotice offer={offer} />

      <OfferDetailsCardV2
        items={detailsItems}
        title={t("details.title")}
        icon={
          <BoxIcon
            severity="accent-9"
            icon={<HugeiconsIcon icon={StarAward02SolidSharp} />}
          />
        }
      />

      <Widget
        title={t("example.title")}
        icon={
          <BoxIcon
            severity="accent-8"
            icon={<HugeiconsIcon icon={HelpCircleSolidSharp} />}
          />
        }
      >
        <DailyPayoutAnimation rate={advanceRatePercentage} />
        {offer.offerDetails?.dailyPayoutOfferDetails && (
          <Card spacing="small" className="mt-4">
            <div className="flex items-center justify-between gap-3 py-1 pr-2 pl-1.5">
              <Typography type="bodyTitle">{t("calculatorLink")}</Typography>
              <Button
                variant="secondary"
                size="sm"
                href={buildDailyPayoutCalculatorUrl(
                  offer.offerDetails.dailyPayoutOfferDetails
                )}
                target="_blank"
              >
                {t("viewCta")}
              </Button>
            </div>
          </Card>
        )}
      </Widget>

      {isMobile && <DailyPayoutSidebar offer={offer} />}
    </div>
  )
}

export default DailyPayoutTabContent
