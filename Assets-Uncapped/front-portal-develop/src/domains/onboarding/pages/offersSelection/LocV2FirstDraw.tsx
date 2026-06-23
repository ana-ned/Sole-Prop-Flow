import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { BubbleChatQuestionSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import {
  DiscountTag02SolidStandard,
  MoneyReceive02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import Typography from "../../../../components/Basic/Typography"
import PageLoader from "../../../../components/Collections/PageLoader"
import SliderInput from "../../../../components/Forms/SliderInput"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import AmountBar from "../../../../components/UI/AmountBar"
import Card from "../../../../components/UI/Card"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import Nudge from "../../../../components/UI/Nudge/Nudge"
import PageBar from "../../../../components/UI/PageBar"
import Widget from "../../../../components/UI/Widget"
import useAuth from "../../../../hooks/useAuth"
import { OfferResponse } from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import BetweenAmount from "../../../../utils/validator-rules/between-amount"
import CreditLimitCalculationWidgetContainer from "../../components/offers/components/CreditLimitCalculationWidgetContainer"
import OfferDetailsCardV2 from "../../components/offers/OfferDetailsCardV2"
import OnboardingLayout from "../../components/OnboardingLayout"
import OnboardingMenu from "../../components/OnboardingMenu"
import { useRefinanceBalanceCalculations } from "../../hooks/useRefinanceBalanceCalculations"
import useSelectOffer from "../../hooks/useSelectOffer"

const LocV2FirstDraw = ({
  offer,
  setStep,
}: StepProps & { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.LocFirstDrawV2",
  })
  const auth = useAuth()
  const selectOffer = useSelectOffer()

  const isRefinance =
    (offer.offerDetails?.refinanceDetails?.refinancedAgreementsIds?.length ||
      0) > 0

  const { balanceToPayOffNet, isLoading: isRefinanceLoading } =
    useRefinanceBalanceCalculations(offer, isRefinance)

  const currency = offer.offerDetails?.commonOfferDetails?.advanceCurrency!
  const min = offer.offerDetails?.interestRateLocDetails?.drawMinimumAmount!
  const creditLimit = offer.offerDetails?.interestRateLocDetails?.creditLimit!
  const maximumCreditLimit =
    offer.offerDetails?.interestRateLocDetails?.maximumCreditLimit || 0

  const availableToDraw = isRefinance
    ? Math.max(0, creditLimit - balanceToPayOffNet)
    : creditLimit
  const growToUnlock = Math.max(0, maximumCreditLimit - creditLimit)

  const { control, handleSubmit, watch, formState, reset } = useForm({
    defaultValues: {
      amount: availableToDraw,
    },
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .number()
          .test(BetweenAmount(min, availableToDraw, currency))
          .required(),
      })
    ),
    mode: "onChange",
  })
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-conversion
  const amount = Number(watch("amount"))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Reset form when availableToDraw changes (e.g., after refinance data loads)
  useEffect(() => {
    if (!isRefinanceLoading && availableToDraw > 0) {
      reset({ amount: availableToDraw })
    }
  }, [availableToDraw, isRefinanceLoading, reset])

  const handleFirstDrawSubmit = () => {
    selectOffer.mutate({
      offerId: offer.id!,
      selectOfferRequest: {
        interestRateLineOfCreditParameters: {
          firstDrawAmount: amount,
        },
      },
    })
  }

  const amountBarSegments = [
    ...(isRefinance
      ? [
          {
            amount: balanceToPayOffNet,
            label: t("existingBalance"),
            color: "info-300",
            stripeColor: "info-600",
          },
        ]
      : []),
    {
      amount: availableToDraw,
      label: t("availableToDraw"),
      color: "brand-600",
      emphasis: true,
    },
    {
      amount: growToUnlock,
      label: isRefinance ? t("unlockWithHigherPayouts") : t("growToUnlock"),
      color: "neutral-300",
      stripeColor: "success-600",
    },
  ]

  if (isRefinance && isRefinanceLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingLayout
      menu={
        auth.organisation?.activated ? (
          <LogoOnlyMenu />
        ) : (
          <OnboardingMenu hideNudge />
        )
      }
    >
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("title")}
            desktopHeaderType="h4"
            onClickBack={() => {
              setStep!(1)
            }}
          />
        }
      >
        <form
          onSubmit={handleSubmit(handleFirstDrawSubmit)}
          className="flex flex-col gap-4"
        >
          <Widget
            icon={
              <BoxIcon
                severity="accent-1"
                icon={<HugeiconsIcon icon={MoneyReceive02SolidStandard} />}
              />
            }
            title={t("widgetTitle")}
          >
            <div className="flex flex-col gap-4">
              <Typography>{t("widgetDescription")}</Typography>

              <Card>
                <div className="flex flex-col gap-3">
                  <AmountBar currency={currency} segments={amountBarSegments} />
                  <div>
                    <SliderInput
                      label={t("drawAmount")}
                      name="amount"
                      control={control}
                      min={min}
                      max={availableToDraw}
                      currency={currency}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </Widget>
          <CreditLimitCalculationWidgetContainer offer={offer} />
          <OfferDetailsCardV2
            title={t("repaymentDetails.title")}
            icon={
              <BoxIcon
                severity="accent-1"
                icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
              />
            }
            items={[
              {
                label: t("repaymentDetails.firstDrawAmount"),
                value: format(amount, currency, {
                  minimumFractionDigits: 0,
                }),
              },
              {
                label: t("repaymentDetails.initialRepayment"),
                value: t(
                  `repaymentDetails.frequency.${offer.offerDetails?.commonOfferDetails?.repaymentFrequency!}`
                ),
              },
              {
                label: t("repaymentDetails.firstRepayment", {
                  percentage: formatAsPercentage(
                    offer.offerDetails?.interestRateLocDetails
                      ?.principalRatePerInstallmentInDrawPhase! * 100,
                    2,
                    { removeTrailingZeros: true }
                  ),
                  amount: format(
                    isRefinance ? amount + balanceToPayOffNet : amount,
                    currency,
                    {
                      minimumFractionDigits: 0,
                    }
                  ),
                }),
                value: format(
                  (isRefinance ? amount + balanceToPayOffNet : amount) *
                    offer.offerDetails?.interestRateLocDetails
                      ?.principalRatePerInstallmentInDrawPhase!,
                  currency
                ),
                ...(isRefinance && {
                  content: (
                    <Typography type="smallCopy" color="neutral-700">
                      {t("repaymentDetails.firstRepaymentDescription")}
                    </Typography>
                  ),
                }),
              },
            ]}
          />
          <Nudge
            content={t("repaymentDetails.subsequentRepayments", {
              percentage: formatAsPercentage(
                offer.offerDetails?.interestRateLocDetails
                  ?.principalRatePerInstallmentInDrawPhase! * 100,
                2,
                { removeTrailingZeros: true }
              ),
            })}
            icon={BubbleChatQuestionSolidRounded}
            accent={2}
            layout="horizontal"
            size={6}
          />

          <ButtonGroup withMargin>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                selectOffer.mutate({
                  offerId: offer.id!,
                })
              }}
              loading={selectOffer.isPending}
            >
              {t("actions.requestLater")}
            </Button>
            <Button
              type="submit"
              disabled={!formState.isValid}
              loading={selectOffer.isPending}
            >
              {t("actions.continue")}
            </Button>
          </ButtonGroup>
        </form>
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default LocV2FirstDraw
