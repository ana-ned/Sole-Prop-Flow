import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import {
  OfferResponse,
  OfferResponseOfferStatusEnum,
  OfferResponseOfferTypeEnum,
} from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import { getOfferAmount } from "../../../agreements/utils"
import { useRefinanceBalanceCalculations } from "../../../onboarding/hooks/useRefinanceBalanceCalculations"

const DailyPayoutBanner = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.dailyPayout",
  })

  return (
    <MainBanner
      title={
        <>
          <Typography type="smallCopy" color="white">
            {t("title")}
          </Typography>
          <p className="font-heading my-1 text-5xl font-bold text-white">
            {t("heading")}
          </p>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Typography type="body" className="grow">
          {t("content")}
        </Typography>
        <Button
          className="!w-full md:!w-auto md:min-w-60"
          variant="tertiary"
          href="/onboarding/offers"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

const OfferAvailableBanner = ({ offers }: { offers: OfferResponse[] }) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.offerAvailable",
  })

  const hasDailyPayoutOffer = offers.some(
    (offer) => offer.offerType === OfferResponseOfferTypeEnum.DailyPayout
  )

  if (hasDailyPayoutOffer) {
    return <DailyPayoutBanner />
  }

  const highlightedOffer =
    offers.find((offer) =>
      (
        [
          OfferResponseOfferStatusEnum.Selected,
          OfferResponseOfferStatusEnum.PreSigned,
        ] as OfferResponseOfferStatusEnum[]
      ).includes(offer.offerStatus!)
    ) ||
    offers.toSorted(
      (a, b) => (getOfferAmount(b) || 0) - (getOfferAmount(a) || 0)
    )[0]

  const isRefinanceOffer =
    (highlightedOffer.offerDetails?.refinanceDetails?.refinancedAgreementsIds
      ?.length ?? 0) > 0

  const { balanceToPayOffNet, isLoading } = useRefinanceBalanceCalculations(
    highlightedOffer,
    isRefinanceOffer
  )

  const maxAmount = getOfferAmount(highlightedOffer)
  const additionalFunds = maxAmount ? maxAmount - balanceToPayOffNet : 0
  const shouldShowAdditionalFunds =
    isRefinanceOffer &&
    highlightedOffer.offerType !==
      OfferResponseOfferTypeEnum.InterestRateLineOfCredit
  const amount = shouldShowAdditionalFunds ? additionalFunds : maxAmount

  const currency =
    highlightedOffer.offerDetails?.commonOfferDetails?.advanceCurrency

  if (!amount || !currency || (isRefinanceOffer && isLoading)) {
    return null
  }

  return (
    <MainBanner
      title={
        <>
          <Typography type="smallCopy" color="white">
            {t("title")}
          </Typography>
          <p className="font-heading my-1 text-5xl font-bold text-white">
            {format(amount, currency, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Typography type="body" className="grow">
          {t("content")}
        </Typography>
        <Button
          className="!w-full md:!w-auto md:min-w-60"
          variant="tertiary"
          href="/onboarding/offers"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

export default OfferAvailableBanner
