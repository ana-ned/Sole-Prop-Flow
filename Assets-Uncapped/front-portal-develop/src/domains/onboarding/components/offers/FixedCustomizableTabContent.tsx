import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  DiscountTag02SolidStandard,
  Calendar02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import { useDebounce } from "react-use"
import * as yup from "yup"
import { useShallow } from "zustand/shallow"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import SliderInput from "../../../../components/Forms/SliderInput"
import Card from "../../../../components/UI/Card/Card"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import useDevice from "../../../../hooks/useDevice"
import useStore from "../../../../hooks/useStore"
import { OfferResponse } from "../../../../services/api/agreements"
import { ReactComponent as InfoIcon } from "../../../../svgs/info.svg"
import { format, formatAsPercentage } from "../../../../utils/money"
import BetweenAmount from "../../../../utils/validator-rules/between-amount"
import { OnboardingMenuPaths } from "../../constants"
import useDeferredRepaymentsLength from "../../hooks/useDeferredRepaymentsLength"
import { useFixedCustomizableOfferCalculations } from "../../hooks/useFixedCustomizableOfferCalculations"
import { useOfferRepaymentDetails } from "../../hooks/useOfferRepaymentDetails"
import { getBusinessLoanOfferParams } from "../../utils/offers"
import RefinancingSummary from "./components/RefininancingSummary"
import DeferredRepaymentSelection from "./DeferredRepaymentSelection"
import usePricing from "./hooks/usePricing"
import OfferConvenienceFeesCard from "./OfferConvenienceFeesCard"
import OfferDetailItem from "./OfferDetailItem"
import OfferDetailsCardV2 from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"

const FixedCustomizableTabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const { isMobile } = useDevice()
  const { setOfferCustomizations, offerCustomizations } = useStore(
    useShallow((state) => ({
      setOfferCustomizations: state.setOfferCustomizations,
      offerCustomizations: state.offerCustomizations,
    }))
  )

  // Get initial offer params for form setup
  const offerParams = getBusinessLoanOfferParams(offer, offerCustomizations)
  const pricing = usePricing({ offer })
  const repaymentDetails = useOfferRepaymentDetails(offer)

  const { control, watch, reset } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .string()
          .required()
          .test(
            BetweenAmount(
              offerParams.minAdvance,
              offerParams.maxAdvance,
              offerParams.currency!
            )
          ),
        term: yup.number().required(),
      })
    ),
    mode: "onBlur",
  })

  const amountValue = watch("amount")
  const termValue = watch("term")
  const baseFee = Number(pricing.data?.baseFee) || offerParams.baseFee || 0

  // Use the custom hook with current form values
  const {
    baseFeeWithDeferredRepayment,
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    minTotalRepayable,
    deferredRepaymentAdditionalFee,
  } = useFixedCustomizableOfferCalculations(offer, {
    amount: Number(amountValue) || offerParams.advance,
    baseFee,
  })

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

  useEffect(() => {
    reset({
      amount: String(offerParams.advance || 1),
      term: offerParams.repaymentLength > 0 ? offerParams.repaymentLength : 1,
    })
  }, [offerParams.advance, offerParams.repaymentLength, reset])

  useDebounce(
    () => {
      setOfferCustomizations(offer, {
        customizableOfferParameters: {
          advanceAmount: Number(amountValue),
          fixedRepaymentLength: termValue,
          fixedRepaymentBaseFee: baseFee,
        },
      })
    },
    200,
    [amountValue, termValue]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card-md shadow-light-sm border-card flex flex-col overflow-hidden">
        <MainBanner
          className="rounded-b-none"
          title={
            <>
              <Typography type="bodyMedium" color="white">
                {t("title_one")}
              </Typography>
              <Typography type="h2" color="white" aria-label={t("amount")}>
                {format(offerParams.advance, offerParams.currency!, {
                  minimumFractionDigits: 0,
                })}
              </Typography>
            </>
          }
        />
        <div className="bg-surface-elevated-2 flex flex-col gap-2 p-4">
          <SanitizedHtml
            as="p"
            content={
              offer.offerDetails?.commonOfferDetails?.automatic
                ? t("automatic")
                : t("termLoanDescription", {
                    amount: format(
                      offerParams.maxAdvance,
                      offerParams.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    ),
                  })
            }
            className="text-base text-neutral-700"
          />
        </div>
      </div>
      <OfferExpirationNotice offer={offer} />
      {offerParams.minAdvance !== offerParams.maxAdvance && (
        <Widget
          title={t("OfferRefinance.capital") || t("offersEdit.capital")}
          icon={
            <BoxIcon
              severity="accent-3"
              icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
            />
          }
        >
          <Card>
            <SliderInput
              label={t("amount")}
              currency={offerParams.currency}
              name="amount"
              control={control}
              min={offerParams.minAdvance}
              max={offerParams.maxAdvance}
            />
          </Card>
        </Widget>
      )}
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
                advance: Number(amountValue) || offerParams.advance,
                deferredRepayment:
                  deferredRepaymentsParameters.deferredRepayment,
                currency: offerParams.currency!,
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
      {offer.offerDetails?.commonOfferDetails?.isMarcusRefinance ? (
        <RefinancingSummary
          offer={offer}
          offerParams={offerParams}
          baseFeeWithDeferredRepayment={baseFeeWithDeferredRepayment}
          isDeferredRepaymentVisible={isDeferredRepaymentVisible}
        />
      ) : (
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
              label: `${t("fixedFee")} (${formatAsPercentage(
                baseFeeWithDeferredRepayment * 100,
                2,
                {
                  removeTrailingZeros: true,
                }
              )})`,
              value: format(
                baseFeeWithDeferredRepayment *
                  (Number(amountValue) || offerParams.advance),
                offerParams.currency!,
                {
                  minimumFractionDigits: 0,
                }
              ),
            },
            {
              label: t("totalRepayable"),
              value:
                minTotalRepayable && offerParams.currency
                  ? format(
                      minTotalRepayable +
                        (isDeferredRepaymentVisible
                          ? deferredRepaymentAdditionalFee
                          : 0) *
                          (Number(amountValue) || offerParams.advance),
                      offerParams.currency,
                      {
                        minimumFractionDigits: 0,
                      }
                    )
                  : "--",
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
              value: format(
                repaymentDetails.repaymentAmount,
                offerParams.currency!,
                {
                  minimumFractionDigits: 0,
                }
              ),
            },
          ]}
        />
      )}
      <OfferConvenienceFeesCard offer={offer} />
      {isMobile && (
        <Link
          to={`${OnboardingMenuPaths.Offers}/${offer.id}/collections`}
          className="text-brand-600 my-6 flex items-center justify-end font-bold no-underline"
        >
          {t("moreAboutPlan")} <InfoIcon className="ml-2" />
        </Link>
      )}
    </div>
  )
}

export default FixedCustomizableTabContent
