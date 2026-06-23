import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  DiscountTag02SolidStandard,
  Calendar02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import { OfferResponse } from "../../../../services/api/agreements/models"
import { format, formatAsPercentage } from "../../../../utils/money"
import { useFixedTermOfferCalculations } from "../../hooks/useFixedTermOfferCalculations"
import { useOfferRepaymentDetails } from "../../hooks/useOfferRepaymentDetails"
import { useRefinanceBalanceCalculations } from "../../hooks/useRefinanceBalanceCalculations"
import { getBusinessLoanOfferParams } from "../../utils/offers"
import DeferredRepaymentSelection from "./DeferredRepaymentSelection"
import OfferDetailItem from "./OfferDetailItem"
import OfferDetailsCardV2 from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"
import RefinanceBalanceModal from "./RefinanceBalanceModal"

const RefinanceFixedTermTabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const offerParams = getBusinessLoanOfferParams(offer)
  const {
    baseFee,
    baseFeeWithDeferredRepayment,
    isDeferredRepaymentVisible,
    deferredRepaymentsParameters,
    deferredRepaymentFees,
    deferredRepaymentDates,
    fixedFeeAmount,
    totalRepayable,
  } = useFixedTermOfferCalculations(offer)

  const currency = offerParams.currency!
  const repaymentDetails = useOfferRepaymentDetails(offer)

  const {
    refinancedAgreementIds,
    balanceToPayOffNet,
    balancesQuery,
    feesData,
    isLoading,
  } = useRefinanceBalanceCalculations(offer)

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
              {format(
                (offerParams.advance || 0) - (balanceToPayOffNet || 0),
                currency,
                {
                  minimumFractionDigits: 0,
                }
              )}
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
            <div className="flex flex-col gap-2">
              <OfferDetailItem
                label={t("OfferRefinance.totalNewLoan")}
                value={format(offerParams.advance, currency, {
                  minimumFractionDigits: 0,
                })}
                description={t("OfferRefinance.totalNewLoanDescription")}
              />

              <OfferDetailItem
                label={t("OfferRefinance.additionalFunds")}
                value={format(
                  (offerParams.advance || 0) - (balanceToPayOffNet || 0),
                  currency,
                  {
                    minimumFractionDigits: 0,
                  }
                )}
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
          <Card>
            <OfferDetailItem
              className="mb-2"
              label={t("term")}
              value={t("month", { count: offerParams.repaymentLength })}
            />

            <OfferDetailItem
              label={t("repaymentFrequency")}
              value={t(`collectionSchedule.${offerParams.repaymentFrequency!}`)}
            />
          </Card>

          {isDeferredRepaymentVisible && (
            <DeferredRepaymentSelection
              params={{
                advance: offerParams.advance,
                deferredRepayment:
                  deferredRepaymentsParameters.deferredRepayment,
                currency,
                offerType: offer.offerType,
                deferredRepaymentFees,
                deferredRepaymentDates,
                baseFee,
              }}
              maxDays={offerParams.maxNumberOfDeferredMonths}
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
            value: format(offerParams.advance, currency, {
              minimumFractionDigits: 0,
            }),
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

export default RefinanceFixedTermTabContent
