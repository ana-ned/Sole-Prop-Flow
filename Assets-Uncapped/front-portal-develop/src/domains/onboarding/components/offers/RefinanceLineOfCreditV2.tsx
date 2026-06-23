import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  Calculator01SolidStandard,
  DiscountTag02SolidStandard,
  MoneySend02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { Close } from "@material-ui/icons"
import { clsx } from "clsx"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import AmountBar from "../../../../components/UI/AmountBar"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Modal from "../../../../components/UI/Modal"
import Widget from "../../../../components/UI/Widget"
import useDevice from "../../../../hooks/useDevice"
import {
  InterestRateLocDetailsSetupFeeTypeEnum,
  OfferResponse,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import { useRefinanceBalanceCalculations } from "../../hooks/useRefinanceBalanceCalculations"
import LocV2OfferSidebar from "../../pages/offersSelection/LocV2OfferSidebar"
import { getRepaymentFrequencyDays } from "../../utils/offers"
import CreditLimitCalculationWidgetContainer from "./components/CreditLimitCalculationWidgetContainer"
import OfferDetailItem from "./OfferDetailItem"
import OfferExpirationNotice from "./OfferExpirationNotice"
import RefinanceBalanceModal from "./RefinanceBalanceModal"
import SetupFeeDescription from "./SetupFeeDescription"

const RefinanceLineOfCreditV2 = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const { isMobile } = useDevice()
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false)
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false)

  const {
    refinancedAgreementIds,
    balanceToPayOffNet,
    balancesQuery,
    feesData,
    isLoading,
  } = useRefinanceBalanceCalculations(offer)

  const locDetails = offer.offerDetails?.interestRateLocDetails
  const commonDetails = offer.offerDetails?.commonOfferDetails
  const currency = commonDetails?.advanceCurrency!
  const maximumCreditLimit = locDetails?.maximumCreditLimit || 0
  const creditLimit = locDetails?.creditLimit || 0
  const availableToDraw = Math.max(0, creditLimit - balanceToPayOffNet)
  const growToUnlock = Math.max(0, maximumCreditLimit - creditLimit)
  const isSetupFeeConditional =
    locDetails?.setupFeeType ===
    InterestRateLocDetailsSetupFeeTypeEnum.Conditional
  const setupFee = locDetails?.setupFeeMaxCreditLimitPercent || 0
  const interestRate = locDetails?.interestRate || 0
  const drawPhaseDuration = locDetails?.drawPhaseDuration || 0
  const repaymentPhaseDuration = locDetails?.repaymentPhaseDuration || 0
  const repaymentFrequencyDays = getRepaymentFrequencyDays(
    commonDetails?.repaymentFrequency!
  )
  const principalRatePerInstallment =
    locDetails?.principalRatePerInstallmentInDrawPhase || 0
  const repaymentPhaseBillingPeriodsNumber =
    locDetails?.repaymentPhaseBillingPeriodsNumber || 0
  const availableCreditLimitMultiplier =
    locDetails?.availableCreditLimitMultiplier || 0

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <>
            <Typography type="bodyMedium" color="white">
              {t("RefinanceLocV2.accessUpTo")}
            </Typography>
            <Typography type="h2" color="white">
              {format(maximumCreditLimit, currency, {
                minimumFractionDigits: 0,
              })}
            </Typography>
            <Typography color="white">
              {t("RefinanceLocV2.andRefinanceExistingBalance")}
            </Typography>
          </>
        }
      />
      <OfferExpirationNotice offer={offer} />

      <Widget
        title={t("RefinanceLocV2.understandingCreditLimit")}
        icon={
          <BoxIcon
            severity="accent-4"
            icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
          />
        }
      >
        <div className="flex flex-col gap-4">
          <Typography type="body" color="neutral-700">
            <SanitizedHtml
              as="span"
              content={t("RefinanceLocV2.description", {
                amount: format(maximumCreditLimit, currency, {
                  minimumFractionDigits: 0,
                }),
              })}
            />
          </Typography>

          <Card>
            <div className="flex flex-col gap-2">
              <OfferDetailItem
                label={t("RefinanceLocV2.maximumCreditLimit")}
                value={format(maximumCreditLimit, currency, {
                  minimumFractionDigits: 0,
                })}
              />

              <OfferDetailItem
                label={t("RefinanceLocV2.availableCreditLimit")}
                value={t("RefinanceLocV2.availableCreditLimitValue", {
                  multiplier: availableCreditLimitMultiplier,
                })}
                customContent={
                  <div>
                    <Typography type="smallCopy" color="neutral-700">
                      <SanitizedHtml
                        as="span"
                        content={t(
                          "RefinanceLocV2.availableCreditLimitDescription",
                          {
                            amount: format(creditLimit, currency, {
                              minimumFractionDigits: 0,
                            }),
                            months: 6,
                            days: repaymentFrequencyDays,
                          }
                        )}
                      />{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setIsCreditLimitModalOpen(true)
                        }}
                        className="!inline !p-0 !text-sm"
                      >
                        {t("RefinanceLocV2.learnHowWeCalculateLimit")}
                      </Button>
                    </Typography>
                  </div>
                }
              />

              <OfferDetailItem
                label={t("RefinanceLocV2.existingBalance")}
                value={format(balanceToPayOffNet, currency, {
                  minimumFractionDigits: 0,
                })}
                customContent={
                  <div>
                    <Typography type="smallCopy" color="neutral-700">
                      {t("RefinanceLocV2.existingBalanceDescription")}{" "}
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setIsBalanceModalOpen(true)
                        }}
                        className="!inline !p-0 !text-sm"
                      >
                        {t("RefinanceLocV2.learnHowWeCalculateBalance")}
                      </Button>
                    </Typography>
                  </div>
                }
              />
            </div>
          </Card>

          <AmountBar
            currency={currency}
            segments={[
              {
                amount: balanceToPayOffNet,
                label: t("RefinanceLocV2.existingBalanceLabel"),
                color: "info-300",
                stripeColor: "info-600",
              },
              {
                amount: availableToDraw,
                label: t("RefinanceLocV2.availableToDrawLabel"),
                color: "brand-600",
                emphasis: true,
              },
              {
                amount: growToUnlock,
                label: t("RefinanceLocV2.unlockWithHigherPayoutsLabel"),
                color: "neutral-300",
                stripeColor: "success-600",
              },
            ]}
          />
        </div>
      </Widget>

      <Widget
        title={t("RefinanceLocV2.pricingDetails")}
        icon={
          <BoxIcon
            severity="accent-6"
            icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
          />
        }
      >
        <Card>
          <div className="flex flex-col gap-2">
            {setupFee > 0 && (
              <OfferDetailItem
                label={
                  isSetupFeeConditional
                    ? t("RefinanceLocV2.setupFeeConditional")
                    : t("RefinanceLocV2.setupFee")
                }
                value={t("RefinanceLocV2.setupFeeValue", {
                  percentage: formatAsPercentage(setupFee * 100, 2, {
                    removeTrailingZeros: true,
                  }),
                })}
                customContent={<SetupFeeDescription offer={offer} />}
              />
            )}
            <OfferDetailItem
              label={t("RefinanceLocV2.annualInterestRate")}
              value={formatAsPercentage(interestRate * 100, 2, {
                removeTrailingZeros: true,
              })}
            />

            {offer.offerDetails?.commonOfferDetails?.earlyRepaymentAllowed && (
              <OfferDetailItem
                label={t("RefinanceLocV2.noEarlyRepaymentFee")}
                value=""
                valueChip={
                  <Chip color="warning" label={t("RefinanceLocV2.new")} />
                }
              />
            )}
          </div>
        </Card>
      </Widget>

      <Widget
        title={t("RefinanceLocV2.repaymentDetails")}
        icon={
          <BoxIcon
            severity="accent-3"
            icon={<HugeiconsIcon icon={MoneySend02SolidStandard} />}
          />
        }
      >
        <Card>
          <div className="flex flex-col gap-2">
            <OfferDetailItem
              label={t("RefinanceLocV2.drawPeriod")}
              value={t("RefinanceLocV2.drawPeriodValue", {
                months: drawPhaseDuration,
              })}
              customContent={
                <Typography type="smallCopy" color="neutral-700">
                  <SanitizedHtml
                    as="span"
                    content={t("RefinanceLocV2.drawPeriodDescription", {
                      months: drawPhaseDuration,
                      percentage: formatAsPercentage(
                        principalRatePerInstallment * 100,
                        2,
                        { removeTrailingZeros: true }
                      ),
                      days: repaymentFrequencyDays,
                    })}
                  />
                </Typography>
              }
            />

            <OfferDetailItem
              label={t("RefinanceLocV2.repaymentPeriod")}
              value={t("RefinanceLocV2.repaymentPeriodValue", {
                months: repaymentPhaseDuration,
              })}
              customContent={
                <Typography type="smallCopy" color="neutral-700">
                  <SanitizedHtml
                    as="span"
                    content={t("RefinanceLocV2.repaymentPeriodDescription", {
                      instalments: repaymentPhaseBillingPeriodsNumber,
                      days: repaymentFrequencyDays,
                    })}
                  />
                </Typography>
              }
            />
          </div>
        </Card>
      </Widget>

      <Widget
        title={t("RefinanceLocV2.exploreCalculator")}
        icon={
          <BoxIcon
            severity="accent-8"
            icon={<HugeiconsIcon icon={Calculator01SolidStandard} />}
          />
        }
      >
        <Card>
          <div className="flex items-center justify-between gap-4">
            <Typography type="body" color="neutral-700">
              {t("RefinanceLocV2.calculatorDescription")}
            </Typography>
            <Button
              variant="secondary"
              href={`https://portal.weareuncapped.com/tools/loc-calculator?${new URLSearchParams(
                {
                  limit: maximumCreditLimit.toString(),
                  apr: (interestRate * 100).toString(),
                  start: new Date().toISOString().slice(0, 10),
                  drawMonths: drawPhaseDuration.toString(),
                  repayMonths: repaymentPhaseDuration.toString(),
                  drawPct: (principalRatePerInstallment * 100).toString(),
                }
              ).toString()}`}
              target="_blank"
            >
              {t("RefinanceLocV2.viewCalculator")}
            </Button>
          </div>
        </Card>
      </Widget>

      {isMobile && <LocV2OfferSidebar offer={offer} />}

      <Modal
        isOpen={isCreditLimitModalOpen}
        onClose={() => {
          setIsCreditLimitModalOpen(false)
        }}
        className={clsx("md:!w-xl", { "!p-6": isMobile, "!p-0": !isMobile })}
      >
        {isMobile && (
          <Button
            type="button"
            onClick={() => {
              setIsCreditLimitModalOpen(false)
            }}
            variant="secondary"
            className="mb-4 ml-auto"
          >
            <Close />
          </Button>
        )}
        <CreditLimitCalculationWidgetContainer offer={offer} />
      </Modal>

      <RefinanceBalanceModal
        isOpen={isBalanceModalOpen}
        onClose={() => {
          setIsBalanceModalOpen(false)
        }}
        refinancedAgreementIds={refinancedAgreementIds}
        balancesData={balancesQuery.data}
        feesData={feesData}
        balanceToPayOffNet={balanceToPayOffNet}
      />
    </div>
  )
}

export default RefinanceLineOfCreditV2
