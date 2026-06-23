import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  DiscountTag02SolidStandard,
  Calendar02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDebounce } from "react-use"
import { useShallow } from "zustand/shallow"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import SliderInput from "../../../../components/Forms/SliderInput"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import useStore from "../../../../hooks/useStore"
import { OfferResponse } from "../../../../services/api/agreements/models"
import { format, formatAsPercentage } from "../../../../utils/money"
import useDeferredRepaymentsLength from "../../hooks/useDeferredRepaymentsLength"
import { useFixedCustomizableOfferCalculations } from "../../hooks/useFixedCustomizableOfferCalculations"
import { useOfferRepaymentDetails } from "../../hooks/useOfferRepaymentDetails"
import { useRefinanceBalanceCalculations } from "../../hooks/useRefinanceBalanceCalculations"
import { getBusinessLoanOfferParams } from "../../utils/offers"
import DeferredRepaymentSelection from "./DeferredRepaymentSelection"
import usePricing from "./hooks/usePricing"
import OfferDetailItem from "./OfferDetailItem"
import OfferDetailsCardV2 from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"
import RefinanceBalanceModal from "./RefinanceBalanceModal"

const RefinanceFixedCustomizableTabContent = ({
  offer,
}: {
  offer: OfferResponse
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { setOfferCustomizations, offerCustomizations } = useStore(
    useShallow((state) => ({
      setOfferCustomizations: state.setOfferCustomizations,
      offerCustomizations: state.offerCustomizations,
    }))
  )

  const offerParams = getBusinessLoanOfferParams(offer, offerCustomizations)
  const repaymentDetails = useOfferRepaymentDetails(offer)
  const pricing = usePricing({ offer })

  const { control, watch, reset } = useForm({
    mode: "onBlur",
  })

  const additionalFundsValue = watch("additionalFunds")
  const termValue = watch("term")
  const baseFee = Number(pricing.data?.baseFee) || offerParams.baseFee || 0
  const additionalFundsAmount = Number(additionalFundsValue)

  const {
    refinancedAgreementIds,
    balanceToPayOffNet,
    balancesQuery,
    feesData,
    isLoading,
  } = useRefinanceBalanceCalculations(offer)

  const amount = additionalFundsAmount + balanceToPayOffNet

  const {
    baseFeeWithDeferredRepayment,
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    fixedFeeAmount,
    totalRepayable,
  } = useFixedCustomizableOfferCalculations(offer, {
    amount,
    baseFee,
  })

  const currency = offerParams.currency!

  useEffect(() => {
    reset({
      additionalFunds: String((offerParams.advance || 1) - balanceToPayOffNet),
      term: offerParams.repaymentLength > 0 ? offerParams.repaymentLength : 1,
    })
  }, [
    offerParams.advance,
    offerParams.repaymentLength,
    balanceToPayOffNet,
    reset,
  ])

  useDebounce(
    () => {
      setOfferCustomizations(offer, {
        customizableOfferParameters: {
          advanceAmount: amount,
          fixedRepaymentLength: termValue,
          fixedRepaymentBaseFee: baseFee,
        },
      })
    },
    200,
    [amount, termValue, baseFee]
  )

  const deferredRepaymentLength = useDeferredRepaymentsLength(
    {
      advance: offerParams.advance,
      baseFee,
      repaymentLength: termValue,
      repaymentFrequency: offerParams.repaymentFrequency!,
      dealId: offerParams.dealId!,
      offerScore: offer.offerDetails?.commonOfferDetails?.offerScore,
    },
    isDeferredRepaymentVisible
  )

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <>
            <Typography type="bodyMedium" color="white">
              {t("OfferRefinance.topUpAdditional")}
            </Typography>
            <Typography type="h2" color="white">
              {format(additionalFundsAmount, currency, {
                minimumFractionDigits: 0,
              })}
            </Typography>
            <Typography color="white">
              {t("OfferRefinance.andRefinanceExistingBalance")}
            </Typography>
          </>
        }
      />
      <OfferExpirationNotice offer={offer} />

      <Widget
        title={t("OfferRefinance.refinanceAndTopUp")}
        icon={
          <BoxIcon
            severity="accent-3"
            icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <Card>
            <SliderInput
              name="additionalFunds"
              control={control}
              label={t("OfferRefinance.additionalFunds")}
              min={
                (offer.offerDetails?.fixedCustomizableOfferDetails
                  ?.minAdvanceAmount || 0) - balanceToPayOffNet
              }
              max={
                (offer.offerDetails?.fixedCustomizableOfferDetails
                  ?.maxAdvanceAmount || 0) - balanceToPayOffNet
              }
              currency={currency}
            />
          </Card>

          <Card>
            <div className="flex flex-col gap-2">
              <OfferDetailItem
                label={t("OfferRefinance.totalNewLoan")}
                value={format(amount, currency, {
                  minimumFractionDigits: 0,
                })}
                description={t("OfferRefinance.totalNewLoanDescription")}
              />

              <OfferDetailItem
                label={t("OfferRefinance.additionalFunds")}
                value={format(additionalFundsAmount, currency, {
                  minimumFractionDigits: 0,
                })}
                description={t("OfferRefinance.additionalFundsDescription")}
                className="pl-8"
              />

              <OfferDetailItem
                label={t("OfferRefinance.balanceToPayOff")}
                value={format(balanceToPayOffNet, currency, {
                  minimumFractionDigits: 0,
                })}
                className="pl-8"
                customContent={
                  <div>
                    <Typography type="smallCopy" color="neutral-700">
                      {t("OfferRefinance.balanceToPayOffDescription")}
                    </Typography>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => {
                        setIsModalOpen(true)
                      }}
                      className="!p-0 !text-sm"
                    >
                      {t("OfferRefinance.learnHowWeCalculate")}
                    </Button>
                  </div>
                }
              />
            </div>
          </Card>
        </div>
      </Widget>

      <Widget
        title={t("OfferRefinance.repayments")}
        icon={
          <BoxIcon
            severity="accent-6"
            icon={<HugeiconsIcon icon={Calendar02SolidStandard} />}
          />
        }
      >
        <div className="flex flex-col gap-4">
          {isDeferredRepaymentVisible && (
            <Typography type="smallCopy" color="neutral-700">
              <SanitizedHtml
                as="span"
                content={t("OfferRefinance.repaymentOptionsDescription")}
              />
            </Typography>
          )}
          <Card>
            <div className="mb-4">
              <OfferDetailItem
                label={t("offersEdit.term")}
                value={t("month", { count: termValue })}
                className="mb-4"
              />
              <SliderInput
                name="term"
                control={control}
                min={offerParams.minRepaymentLength}
                max={offerParams.maxRepaymentLength}
                customStep={1}
              />
            </div>

            <OfferDetailItem
              label={t("repaymentFrequency")}
              value={t(`collectionSchedule.${offerParams.repaymentFrequency!}`)}
            />
          </Card>

          {isDeferredRepaymentVisible && (
            <DeferredRepaymentSelection
              params={{
                advance: amount,
                deferredRepayment:
                  deferredRepaymentsParameters.deferredRepayment,
                currency,
                offerType: offer.offerType,
                deferredRepaymentFees,
                deferredRepaymentDates,
                baseFee,
              }}
              maxDays={
                termValue === offerParams.maxRepaymentLength
                  ? offerParams.maxNumberOfDeferredMonths
                  : deferredRepaymentLength.data?.maxPeriod &&
                      deferredRepaymentLength.data.maxPeriod > -1
                    ? deferredRepaymentLength.data.maxPeriod
                    : 0
              }
              loading={deferredRepaymentLength.isLoading}
              variant="compact"
            />
          )}
        </div>
      </Widget>

      <OfferDetailsCardV2
        title={t("OfferRefinance.offerSummary")}
        icon={
          <BoxIcon
            severity="accent-4"
            icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
          />
        }
        items={[
          {
            label: t("OfferRefinance.totalNewLoan"),
            value: format(amount, currency, { minimumFractionDigits: 0 }),
          },
          {
            label: `${t("fixedFee")} (${formatAsPercentage(
              baseFeeWithDeferredRepayment * 100,
              2,
              {
                removeTrailingZeros: true,
              }
            )})`,
            value: format(fixedFeeAmount, currency, {
              minimumFractionDigits: 0,
            }),
          },
          {
            label: t("totalRepayable"),
            value: format(totalRepayable, currency, {
              minimumFractionDigits: 0,
            }),
          },
          ...(offer.offerDetails?.commonOfferDetails?.earlyRepaymentAllowed
            ? [
                {
                  label: t("OfferRefinance.noEarlyRepaymentFee"),
                  valueChip: (
                    <Chip color="warning" label={t("OfferRefinance.new")} />
                  ),
                },
              ]
            : []),
          {
            label: t(
              `collectionsDetails.repaymentSchedule.${offerParams.repaymentFrequency!}`,
              {
                count: repaymentDetails.repaymentsNumber,
              }
            ),
            value: format(repaymentDetails.repaymentAmount, currency, {
              minimumFractionDigits: 0,
            }),
          },
        ]}
      />

      <RefinanceBalanceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        refinancedAgreementIds={refinancedAgreementIds}
        balancesData={balancesQuery.data}
        feesData={feesData}
        balanceToPayOffNet={balanceToPayOffNet}
      />
    </div>
  )
}

export default RefinanceFixedCustomizableTabContent
