import { useCallback, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyBag02SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { MoneyExchange03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import StepperMenu from "../../../components/UI/StepperMenu"
import useDeal from "../../../hooks/useDeal"
import {
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../services/api/agreements"
import { OnboardingMenuPaths } from "../constants"
import useOffers from "../hooks/useOffers"
import useOnboarding, { OnboardingStep } from "../hooks/useOnboarding"
import { getOfferReadableId } from "../utils/offers"

const OfferIcon = ({ offer }: { offer: OfferResponse }) => {
  if (offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit) {
    return (
      <BoxIcon
        icon={<HugeiconsIcon icon={MoneyExchange03SolidStandard} />}
        severity="accent-1"
        size={6}
      />
    )
  }

  return (
    <BoxIcon
      icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} />}
      severity="accent-2"
      size={6}
    />
  )
}

const OffersMenu = () => {
  const { t } = useTranslation("onboarding")
  const { data: offers, getOfferById } = useOffers()
  const deal = useDeal()
  const { fullyCompleted } = useOnboarding()

  const { offerId } = useParams()
  const currentOffer = offerId ? getOfferById(offerId) : undefined

  const getOfferTitle = useCallback(
    (offer: OfferResponse) => {
      if (
        (offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds || [])
          .length > 0
      ) {
        if (
          offer.offerType ===
          OfferResponseOfferTypeEnum.InterestRateLineOfCredit
        ) {
          return t("offers.refinanceToLineOfCredit", {
            symbol: getOfferReadableId(offer, offers),
          })
        }

        return t("offers.refinancingTopup", {
          symbol: getOfferReadableId(offer, offers),
        })
      }

      if (
        offer.offerType === OfferResponseOfferTypeEnum.InterestRateLineOfCredit
      ) {
        return t("offers.revolvingLineOfCredit", {
          symbol: getOfferReadableId(offer, offers),
        })
      }

      if (offer.offerType === OfferResponseOfferTypeEnum.Rbf) {
        return t("offers.cashAdvance", {
          symbol: getOfferReadableId(offer, offers),
        })
      }

      if (offer.offerType === OfferResponseOfferTypeEnum.DailyPayout) {
        return t("offers.dailyPayouts", {
          symbol: getOfferReadableId(offer, offers),
        })
      }

      if (offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit) {
        return t(
          deal.isAmazonPartnership ? "offers.flexibleCreditLine" : `offers.loc`,
          {
            symbol: getOfferReadableId(offer, offers),
          }
        )
      }

      if (offer.offerDetails?.commonOfferDetails?.isMarcusRefinance) {
        return t("offers.refinancing", {
          symbol: getOfferReadableId(offer, offers),
        })
      }

      return t("offers.businessLoan", {
        symbol: getOfferReadableId(offer, offers),
      })
    },
    [t, offers, deal.isAmazonPartnership]
  )

  const steps: OnboardingStep[] = useMemo(() => {
    const result: OnboardingStep[] = []

    if (!fullyCompleted) {
      result.push({
        caption: t("offers.yourApplication"),
        href: OnboardingMenuPaths.Review,
        active: !currentOffer,
        completed: true,
      })
    }

    if (offers && offers.length > 0) {
      offers.forEach((offer) => {
        result.push({
          caption: getOfferTitle(offer),
          href: `${OnboardingMenuPaths.Offers}/${offer.id}`,
          active: offer.id === currentOffer?.id,
          completed: false,
          icon: <OfferIcon offer={offer} />,
        })
      })
    }

    return result
  }, [fullyCompleted, offers, currentOffer, t, getOfferTitle])

  return (
    <div className="flex flex-col">
      <LogoOnlyMenu withSeparator={false} />
      <StepperMenu steps={steps} />
    </div>
  )
}

export default OffersMenu
