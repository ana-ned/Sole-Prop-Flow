import { useEffect, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons-pro/core-solid-sharp"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card/Card"
import MainBanner from "../../../../components/UI/MainBanner"
import RadioCard, { RadioCardGroup } from "../../../../components/UI/RadioCard"
import Widget from "../../../../components/UI/Widget"
import {
  OfferResponse,
  OfferResponseOfferStatusEnum,
  RbfVariantNameEnum,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import { upperCaseFirstLetter } from "../../../../utils/string"
import OfferDetailItem from "./OfferDetailItem"
import OfferExpirationNotice from "./OfferExpirationNotice"

export const useVariantQueryState = (
  defaultVariant: RbfVariantNameEnum = RbfVariantNameEnum.High
) =>
  useQueryState(
    "variant",
    parseAsStringLiteral(Object.values(RbfVariantNameEnum))
      .withDefault(defaultVariant)
      .withOptions({
        clearOnDefault: false,
      })
  )

const useOfferSummaryCalculations = (
  offer: OfferResponse,
  variant: RbfVariantNameEnum
) => {
  const { flatBaseFee = 0, advanceAmount: maxAmount = 0 } =
    offer.offerDetails?.rbfOfferDetails || {}
  const { advanceAmount: amount = 0, revenueSharePercentage = 0 } =
    offer.offerDetails?.rbfOfferDetails?.variants?.find(
      (v) => v.name === variant
    ) || {}
  const fee = flatBaseFee * amount
  const total = amount + fee
  return {
    amount,
    fee,
    total,
    revenue: revenueSharePercentage * 100,
    maxAmount,
  }
}

const RevenueBasedFinancingTabContent = ({
  offer,
}: {
  offer: OfferResponse
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const { advanceCurrency: currency = "USD", repaymentFrequency } =
    offer.offerDetails?.commonOfferDetails || {}
  const defaultVariant = offer.offerDetails?.rbfOfferDetails?.variants?.find(
    (v) =>
      v.advanceAmount === offer.offerDetails?.rbfOfferDetails?.advanceAmount
  )?.name
  const [variant, setVariant] = useVariantQueryState(defaultVariant)

  const isDisabled = useMemo(
    () =>
      offer.offerStatus !== OfferResponseOfferStatusEnum.New &&
      offer.offerStatus !== OfferResponseOfferStatusEnum.Selected,
    [offer.offerStatus]
  )

  useEffect(() => {
    if (defaultVariant && isDisabled) {
      void setVariant(defaultVariant)
    }
  }, [defaultVariant, setVariant, isDisabled])

  const { amount, fee, total, revenue, maxAmount } =
    useOfferSummaryCalculations(offer, variant)

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <>
            <Typography type="bodyMedium" color="white">
              {t("rbf.title")}
            </Typography>
            <Typography type="h2" color="white" aria-label={t("amount")}>
              {format(maxAmount, currency, {
                minimumFractionDigits: 0,
              })}
            </Typography>
          </>
        }
      />
      <OfferExpirationNotice offer={offer} />
      <div>
        <Typography tag="h3" type="bodyTitle">
          {t("rbf.variants.select")}
        </Typography>
        <RadioCardGroup className="mt-2">
          {offer.offerDetails?.rbfOfferDetails?.variants?.map((v, index) => (
            <RadioCard
              key={index}
              name="rbf-variant"
              value={v.name ?? ""}
              label={format(v.advanceAmount ?? 0, currency, {
                minimumFractionDigits: 0,
              })}
              checked={variant === v.name}
              disabled={isDisabled}
              onChange={(val) => setVariant(val as typeof variant)}
            >
              <span className="bg-brand-200 inline-flex gap-0.5 rounded-sm px-2 py-0.5">
                <Typography type="footnote" color="brand-700">
                  {t("rbf.summary.details.fee")}:{" "}
                  <strong>
                    {format(
                      (v.advanceAmount ?? 0) *
                        (offer.offerDetails?.rbfOfferDetails?.flatBaseFee ?? 0),
                      currency,
                      {
                        minimumFractionDigits: 0,
                      }
                    )}
                  </strong>
                </Typography>
              </span>
              <Typography
                className="bg-info-200 !text-info-700 flex w-full flex-col rounded-sm px-2 py-0.5 leading-4.5"
                type="footnote"
              >
                <span>{t("rbf.variants.repayments")}:</span>
                <strong>
                  {t("rbf.summary.details.amountValue", {
                    percentage: formatAsPercentage(
                      (v.revenueSharePercentage ?? 0) * 100,
                      undefined,
                      {
                        removeTrailingZeros: true,
                      }
                    ),
                    frequency: repaymentFrequency,
                  })}
                </strong>
              </Typography>
            </RadioCard>
          ))}
        </RadioCardGroup>
      </div>
      <Widget
        title={t("rbf.summary.title")}
        icon={
          <BoxIcon
            severity="accent-11"
            icon={<HugeiconsIcon icon={File01Icon} />}
          />
        }
      >
        <Typography type="body" color="neutral-700" className="mb-4">
          {t("rbf.summary.description")}
        </Typography>
        <Card className="flex flex-col gap-2">
          <OfferDetailItem
            label={t("rbf.summary.details.capital")}
            value={format(amount, currency, { minimumFractionDigits: 0 })}
          />
          <OfferDetailItem
            label={t("rbf.summary.details.fee")}
            value={format(fee, currency, { minimumFractionDigits: 0 })}
          />
          <OfferDetailItem
            label={t("rbf.summary.details.total")}
            value={format(total, currency, { minimumFractionDigits: 0 })}
          />
          <OfferDetailItem
            label={t("rbf.summary.details.frequency")}
            value={upperCaseFirstLetter(
              t("rbf.summary.details.frequencyValue", {
                frequency: repaymentFrequency,
              })
            )}
          />
          <OfferDetailItem
            label={t("rbf.summary.details.amount")}
            value={t("rbf.summary.details.amountValue", {
              percentage: formatAsPercentage(revenue, undefined, {
                removeTrailingZeros: true,
              }),
              frequency: repaymentFrequency,
            })}
          />
        </Card>
      </Widget>
    </div>
  )
}

export default RevenueBasedFinancingTabContent
