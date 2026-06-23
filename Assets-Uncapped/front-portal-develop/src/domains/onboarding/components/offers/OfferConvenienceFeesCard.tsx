import { HugeiconsIcon } from "@hugeicons/react"
import { DiscountTag02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Accordion from "../../../../components/UI/Accordion/Accordion"
import Widget from "../../../../components/UI/Widget"
import { OfferResponse } from "../../../../services/api/agreements"
import { formatAsPercentage } from "../../../../utils/money"
import usePricing from "./hooks/usePricing"

const OfferConvenienceFeesCard = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const pricing = usePricing({ offer })

  const billPaymentFee =
    Number(pricing.data?.billPaymentFee) ||
    offer.offerDetails?.commonOfferDetails?.billOtherFee ||
    0

  const cashFee =
    Number(pricing.data?.cashFee) ||
    offer.offerDetails?.commonOfferDetails?.cashFee ||
    0

  const hasFees =
    billPaymentFee > 0 ||
    (offer.offerDetails?.commonOfferDetails?.cashTransferAllowed && cashFee > 0)

  if (!hasFees) {
    return null
  }

  const feeItems = [
    {
      label: t("billPayFee.title"),
      value: formatAsPercentage((billPaymentFee || 0) * 100, 2, {
        removeTrailingZeros: true,
      }),
      content: t("billPayFee.descriptionLong"),
    },
    ...(offer.offerDetails?.commonOfferDetails?.cashTransferAllowed
      ? [
          {
            label: t("cashFee.title"),
            value: formatAsPercentage(cashFee * 100, 2, {
              removeTrailingZeros: true,
            }),
            content: t("cashFee.descriptionLong"),
            expandable: true,
          },
        ]
      : []),
  ]

  return (
    <Widget
      title={t("convenienceFees")}
      icon={
        <BoxIcon
          severity="accent-4"
          icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
        />
      }
    >
      <Accordion items={feeItems} />
    </Widget>
  )
}

export default OfferConvenienceFeesCard
