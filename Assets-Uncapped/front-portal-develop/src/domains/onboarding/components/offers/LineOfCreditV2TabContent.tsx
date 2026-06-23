import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  Calculator01SolidStandard,
  DiscountTag02SolidStandard,
  MoneySend02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { Close } from "@material-ui/icons"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import AmountBar from "../../../../components/UI/AmountBar"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"
import {
  InterestRateLocDetailsSetupFeeTypeEnum,
  OfferResponse,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import LocV2OfferSidebar from "../../pages/offersSelection/LocV2OfferSidebar"
import { getRepaymentFrequencyDays } from "../../utils/offers"
import CreditLimitCalculationWidgetContainer from "./components/CreditLimitCalculationWidgetContainer"
import OfferDetailsCardV2, { OfferDetailItemProps } from "./OfferDetailsCardV2"
import OfferExpirationNotice from "./OfferExpirationNotice"
import SetupFeeDescription from "./SetupFeeDescription"

const LineOfCreditV2TabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.lineOfCredit",
  })
  const { isMobile } = useDevice()
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false)

  const understadingCreditLimitItems: OfferDetailItemProps[] = [
    {
      label: t("V2details.maximumCreditLimitDetails.title"),
      value: format(
        offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit!,
        offer.offerDetails?.commonOfferDetails?.advanceCurrency!,
        {
          minimumFractionDigits: 0,
        }
      ),
    },
    {
      label: t("V2details.availableCreditLimitDetails.title"),
      value: t("V2details.availableCreditLimitDetails.value", {
        multiplier:
          offer.offerDetails?.interestRateLocDetails
            ?.availableCreditLimitMultiplier,
      }),
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("V2details.availableCreditLimitDetails.description", {
              amount: format(
                offer.offerDetails?.interestRateLocDetails?.creditLimit!,
                offer.offerDetails?.commonOfferDetails?.advanceCurrency!,
                {
                  minimumFractionDigits: 0,
                }
              ),
            })}
            as="span"
          />{" "}
          {
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsCreditLimitModalOpen(true)
              }}
            >
              {t("V2details.availableCreditLimitDetails.cta")}
            </Button>
          }
        </Typography>
      ),
    },
  ]

  const isSetupFeeConditional =
    offer.offerDetails?.interestRateLocDetails?.setupFeeType ===
    InterestRateLocDetailsSetupFeeTypeEnum.Conditional

  const pricingDetailsItems: OfferDetailItemProps[] = [
    ...(offer.offerDetails?.interestRateLocDetails
      ?.setupFeeMaxCreditLimitPercent &&
    offer.offerDetails.interestRateLocDetails.setupFeeMaxCreditLimitPercent > 0
      ? [
          {
            label: isSetupFeeConditional
              ? t("V2details.setupFee.titleConditional")
              : t("V2details.setupFee.title"),
            value: t("V2details.setupFee.value", {
              percentage: formatAsPercentage(
                offer.offerDetails.interestRateLocDetails
                  .setupFeeMaxCreditLimitPercent * 100,
                2,
                {
                  removeTrailingZeros: true,
                }
              ),
            }),
            content: <SetupFeeDescription offer={offer} />,
          },
        ]
      : []),
    {
      label: t("V2details.interestRateDetails.title"),
      value: formatAsPercentage(
        offer.offerDetails?.interestRateLocDetails?.interestRate! * 100,
        2,
        {
          removeTrailingZeros: true,
        }
      ),
    },
    ...(offer.offerDetails?.commonOfferDetails?.earlyRepaymentAllowed
      ? [
          {
            label: t("V2details.earlyRepaymentFee.title"),
            valueChip: (
              <Chip
                color="warning"
                label={t("V2details.earlyRepaymentFee.new")}
              />
            ),
          },
        ]
      : []),
  ]

  const repaymentDetailsItems = [
    {
      label: t("V2details.drawPeriodDetails.title"),
      value: t("V2details.drawPeriodDetails.value", {
        months: offer.offerDetails?.interestRateLocDetails?.drawPhaseDuration,
      }),
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("V2details.drawPeriodDetails.description", {
              amount: formatAsPercentage(
                offer.offerDetails!.interestRateLocDetails!
                  .principalRatePerInstallmentInDrawPhase! * 100,
                2,
                {
                  removeTrailingZeros: true,
                }
              ),
              days: getRepaymentFrequencyDays(
                offer.offerDetails?.commonOfferDetails?.repaymentFrequency!
              ),
            })}
            as="span"
          />
        </Typography>
      ),
    },
    {
      label: t("V2details.repaymentPeriodDetails.title"),
      value: t("V2details.repaymentPeriodDetails.value", {
        months:
          offer.offerDetails?.interestRateLocDetails?.repaymentPhaseDuration,
      }),
      content: (
        <Typography type="smallCopy" color="neutral-700">
          <SanitizedHtml
            content={t("V2details.repaymentPeriodDetails.description", {
              frequency: getRepaymentFrequencyDays(
                offer.offerDetails?.commonOfferDetails?.repaymentFrequency!
              ),
              instalments:
                offer.offerDetails?.interestRateLocDetails
                  ?.repaymentPhaseBillingPeriodsNumber,
            })}
            as="span"
          />
        </Typography>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <>
            <Typography type="bodyMedium" color="white">
              {t("yourOffer")}
            </Typography>
            <Typography type="h2" color="white">
              {format(
                offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit!,
                offer.offerDetails?.commonOfferDetails?.advanceCurrency!,
                {
                  minimumFractionDigits: 0,
                }
              )}
            </Typography>
          </>
        }
      >
        <SanitizedHtml
          content={t("V2nudge.content", {
            amount: format(
              offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit!,
              offer.offerDetails?.commonOfferDetails?.advanceCurrency!,
              {
                minimumFractionDigits: 0,
              }
            ),
          })}
          as="span"
        />
      </MainBanner>
      <OfferExpirationNotice offer={offer} />
      <OfferDetailsCardV2
        items={understadingCreditLimitItems}
        title={t("V2details.understandingCreditLimit")}
        icon={
          <BoxIcon
            severity="accent-4"
            icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
          />
        }
        footer={
          <AmountBar
            currency={offer.offerDetails?.commonOfferDetails?.advanceCurrency!}
            segments={[
              {
                amount:
                  offer.offerDetails?.interestRateLocDetails?.creditLimit!,
                label: t("availableToDrawLabel"),
                color: "brand-600",
                emphasis: true,
              },
              {
                amount: Math.max(
                  0,
                  (offer.offerDetails?.interestRateLocDetails
                    ?.maximumCreditLimit || 0) -
                    (offer.offerDetails?.interestRateLocDetails?.creditLimit ||
                      0)
                ),
                label: t("growToUnlockLabel"),
                color: "brand-300",
                stripeColor: "brand-600",
              },
            ]}
          />
        }
      />
      <OfferDetailsCardV2
        items={pricingDetailsItems}
        title={t("V2details.pricingDetails")}
        icon={
          <BoxIcon
            severity="accent-6"
            icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
          />
        }
      />
      <OfferDetailsCardV2
        items={repaymentDetailsItems}
        title={t("V2details.repaymentDetails")}
        icon={
          <BoxIcon
            severity="accent-3"
            icon={<HugeiconsIcon icon={MoneySend02SolidStandard} />}
          />
        }
      />

      {offer.offerDetails?.interestRateLocDetails && (
        <div className="shadow-light-sm border-card rounded-card-md flex items-center justify-between gap-x-4 bg-white p-4">
          <div className="flex gap-x-4">
            <BoxIcon
              severity="accent-4"
              icon={<HugeiconsIcon icon={Calculator01SolidStandard} />}
            />
            <Typography type="bodyTitle">{t("lineOfCreditV2Tool")}</Typography>
          </div>
          <Button
            variant="secondary"
            size="sm"
            href={`https://portal.weareuncapped.com/tools/loc-calculator?${new URLSearchParams(
              {
                limit:
                  offer.offerDetails.interestRateLocDetails.maximumCreditLimit?.toString() ??
                  "",
                apr: (
                  (offer.offerDetails.interestRateLocDetails.interestRate ??
                    0) * 100
                ).toString(),
                start: new Intl.DateTimeFormat("en-CA").format(new Date()),
                drawMonths:
                  offer.offerDetails.interestRateLocDetails.drawPhaseDuration?.toString() ??
                  "",
                repayMonths:
                  offer.offerDetails.interestRateLocDetails.repaymentPhaseDuration?.toString() ??
                  "",
                drawPct: (
                  (offer.offerDetails.interestRateLocDetails
                    .principalRatePerInstallmentInDrawPhase ?? 0) * 100
                ).toString(),
              }
            ).toString()}`}
            target="_blank"
          >
            {t("viewCta")}
          </Button>
        </div>
      )}
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
    </div>
  )
}

export default LineOfCreditV2TabContent
