import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import MainBanner from "../../../../components/UI/MainBanner"
import {
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"
import { getOfferAmount } from "../../../agreements/utils"
import { OnboardingMenuPaths } from "../../../onboarding/constants"

const AmazonConsentBanner = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.amazonConsent",
  })

  const getProductType = (
    offerType: OfferResponseOfferTypeEnum | undefined
  ) => {
    if (
      offerType === OfferResponseOfferTypeEnum.LineOfCredit ||
      offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit
    ) {
      return t("productType.lineOfCredit")
    }
    if (offerType === OfferResponseOfferTypeEnum.Rbf) {
      return t("productType.cashAdvance")
    }
    return t("productType.termLoan")
  }

  const productType = getProductType(offer.offerType)
  const rawAmount = getOfferAmount(offer)
  const currency = offer.offerDetails?.commonOfferDetails?.advanceCurrency
  const amount =
    rawAmount && currency
      ? format(rawAmount, currency, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : ""

  return (
    <MainBanner
      title={
        <div className="flex flex-col items-center gap-1">
          <Typography color="white" type="body">
            {t("subtitle")}
          </Typography>
          {amount && (
            <Typography color="white" type="h1">
              {amount}
            </Typography>
          )}
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Typography type="body" color="neutral-600" className="grow">
          {t("content", { productType })}
        </Typography>
        <Button
          className="!w-full md:!w-auto md:min-w-60 md:shrink-0"
          href={OnboardingMenuPaths.AmazonConsent}
          variant="tertiary"
        >
          {t("button")}
        </Button>
      </div>
    </MainBanner>
  )
}

export default AmazonConsentBanner
