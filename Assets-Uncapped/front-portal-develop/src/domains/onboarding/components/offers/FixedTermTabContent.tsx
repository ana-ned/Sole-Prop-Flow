import { HugeiconsIcon } from "@hugeicons/react"
import {
  Calendar02SolidStandard,
  DiscountTag02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import useDevice from "../../../../hooks/useDevice"
import { OfferResponse } from "../../../../services/api/agreements"
import { ReactComponent as InfoIcon } from "../../../../svgs/info.svg"
import { format, formatAsPercentage } from "../../../../utils/money"
import { OnboardingMenuPaths } from "../../constants"
import { useFixedTermOfferCalculations } from "../../hooks/useFixedTermOfferCalculations"
import { useOfferRepaymentDetails } from "../../hooks/useOfferRepaymentDetails"
import { getBusinessLoanOfferParams } from "../../utils/offers"
import RefinancingSummary from "./components/RefininancingSummary"
import DeferredRepaymentSelection from "./DeferredRepaymentSelection"
import OfferConvenienceFeesCard from "./OfferConvenienceFeesCard"
import OfferDetailItem from "./OfferDetailItem"
import OfferDetailsCardV2 from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"

const FixedTermTabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const { isMobile } = useDevice()

  const offerParams = getBusinessLoanOfferParams(offer)
  const repaymentDetails = useOfferRepaymentDetails(offer)

  const {
    baseFeeWithDeferredRepayment,
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    minTotalRepayable,
    deferredRepaymentAdditionalFee,
  } = useFixedTermOfferCalculations(offer)

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
                    amount: format(offerParams.advance, offerParams.currency!, {
                      minimumFractionDigits: 0,
                    }),
                  })
            }
            className="text-base text-neutral-700"
          />
        </div>
      </div>
      <OfferExpirationNotice offer={offer} />

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
          <Card>
            <div className="flex flex-col gap-4">
              <OfferDetailItem
                label={t("offersEdit.term")}
                value={t("month", { count: offerParams.repaymentLength })}
              />
              <OfferDetailItem
                label={t("repaymentFrequency")}
                value={t(
                  `collectionSchedule.${offerParams.repaymentFrequency!}`
                )}
              />
            </div>
          </Card>
          {isDeferredRepaymentVisible && (
            <DeferredRepaymentSelection
              params={{
                ...deferredRepaymentsParameters,
                deferredRepaymentFees,
                deferredRepaymentDates,
              }}
              maxDays={offerParams.maxNumberOfDeferredMonths}
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
                baseFeeWithDeferredRepayment * offerParams.advance,
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
                          offerParams.advance,
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
export default FixedTermTabContent
