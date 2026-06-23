import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyReceive02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import { OfferResponse } from "../../../../services/api/agreements"
import { formatAsPercentage, format } from "../../../../utils/money"
import useDeferredRepayments from "../../hooks/useDeferredRepayments"
import { getLineOfCreditOfferParams } from "../../utils/offers"
import useRepaymentPreview from "../offers/hooks/useRepaymentPreview"
import OfferDetailsCardV2 from "../offers/OfferDetailsCardV2"

const FirstDrawSummary = ({ offer }: { offer: OfferResponse }) => {
  const offerParams = getLineOfCreditOfferParams(offer)
  const { t } = useTranslation("onboarding")

  const repaymentSummary = useRepaymentPreview({
    offerId: offer.id!,
    advance: offerParams.firstDrawAmount,
    repaymentLength: offerParams.firstDrawRepaymentDuration,
  })

  const deferredRepayments = useDeferredRepayments({
    deferredRepaymentPeriod:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.deferredRepaymentPeriod || 0,
    baseFee: offerParams.baseFee,
    customisationFee:
      offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.deferredRepaymentAdditionalFee,
    id: offer.id!,
    repaymentLength: offerParams.firstDrawRepaymentDuration || 0,
    advance: offerParams.firstDrawAmount!,
  })

  const hasDeferredRepayments =
    !!offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.deferredRepaymentPeriod

  const drawFee = offerParams.firstDrawAmount! * offerParams.firstDrawFee!
  const deferredRepaymentFee =
    offerParams.firstDrawAmount! *
    (offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.deferredRepaymentAdditionalFee || 0)

  const repaymentNumber = hasDeferredRepayments
    ? deferredRepayments.data?.repaymentsNumber
    : repaymentSummary.data?.repaymentsNumber

  const firstRepaymentAmount = hasDeferredRepayments
    ? deferredRepayments.data?.firstRepaymentAmount
    : repaymentSummary.data?.firstRepaymentAmount

  const totalDrawFeePercentage =
    (offerParams.firstDrawFee! +
      (offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
        ?.deferredRepaymentAdditionalFee || 0)) *
    100

  return (
    <OfferDetailsCardV2
      title={t("signing.summary.FirstDrawSummary.firstDraw")}
      icon={
        <BoxIcon
          severity="accent-6"
          icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
        />
      }
      items={[
        {
          label: t("signing.summary.FirstDrawSummary.drawAmount"),
          value: format(offerParams.firstDrawAmount!, offerParams.currency!, {
            minimumFractionDigits: 0,
          }),
        },
        {
          label: t("signing.summary.FirstDrawSummary.totalDrawFee", {
            fee: formatAsPercentage(totalDrawFeePercentage, 2, {
              removeTrailingZeros: true,
            }),
          }),
          value: format(drawFee + deferredRepaymentFee, offerParams.currency!, {
            minimumFractionDigits: 0,
          }),
        },
        {
          label: t("signing.summary.FirstDrawSummary.totalRepayable"),
          value: format(
            offerParams.firstDrawAmount! + drawFee + deferredRepaymentFee,
            offerParams.currency!,
            {
              minimumFractionDigits: 0,
            }
          ),
        },
        {
          label: t(
            // @ts-expect-error dynamic translations
            `signing.summary.FirstDrawSummary.repaymentsFrequency.${offerParams.repaymentFrequency}`,
            {
              count: repaymentNumber || 0,
            }
          ),
          value: format(firstRepaymentAmount || 0, offerParams.currency!, {
            minimumFractionDigits: 0,
          }),
        },
      ]}
    />
  )
}

export default FirstDrawSummary
