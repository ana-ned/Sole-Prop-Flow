import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useShallow } from "zustand/shallow"
import PageLoader from "../../../../components/Collections/PageLoader"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import LocDrawForm from "../../../../components/Shared/LocDrawForm"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../../components/UI/PageBar"
import useAuth from "../../../../hooks/useAuth"
import useDevice from "../../../../hooks/useDevice"
import useStore from "../../../../hooks/useStore"
import {
  LineOfCreditApi,
  OfferResponse,
} from "../../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import DrawSchedule from "../../../line-of-credit/pages/draw-schedule"
import useRepaymentPreview from "../../components/offers/hooks/useRepaymentPreview"
import OnboardingLayout from "../../components/OnboardingLayout"
import OnboardingMenu from "../../components/OnboardingMenu"
import SkipStepButton from "../../components/SkipStepButton"
import useDeferredRepayments from "../../hooks/useDeferredRepayments"
import useDeferredRepaymentsLength from "../../hooks/useDeferredRepaymentsLength"
import useSelectOffer from "../../hooks/useSelectOffer"

const LocFirstDraw = ({ offer }: StepProps & { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.LocFirstDraw",
  })
  const auth = useAuth()
  const { isMobile } = useDevice()
  const [currentAmount, setCurrentAmount] = useState<number | undefined>()
  const [currentRepaymentTermsMonths, setCurrentRepaymentTermsMonths] =
    useState<number | undefined>()
  const { offerSelectedDeferredRepayment, offerCustomizations } = useStore(
    useShallow((state) => ({
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
      offerCustomizations: state.offerCustomizations,
    }))
  )

  const selectOffer = useSelectOffer()

  const customizations = offerCustomizations[offer.id!]

  const locMaxDrawAmount = useQuery({
    queryKey: [
      "LOC_MAX_DRAW",
      offer.id,
      offer.offerDetails?.lineOfCreditDetails?.totalAdvanceAmount,
    ],
    queryFn: async () =>
      new LineOfCreditApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getFirstDrawBalance({
        xXORGID: auth.organisation?.organisationId!,
        limit: customizations.lineOfCreditParameters!.totalAdvanceAmount ?? 0,
        limitCurrency:
          offer.offerDetails?.commonOfferDetails?.advanceCurrency ?? "",
      }),
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      !!customizations.lineOfCreditParameters!.totalAdvanceAmount,
  })

  const minDrawAmount = Math.min(
    offer.offerDetails?.lineOfCreditDetails?.totalAdvanceAmount!,
    offer.offerDetails?.lineOfCreditDetails?.drawMinimumAmount!
  )

  const repaymentSummary = useRepaymentPreview({
    offerId: offer.id!,
    advance: currentAmount,
    repaymentLength: currentRepaymentTermsMonths,
  })

  const deferredRepaymentsParams = {
    deferredRepaymentPeriod:
      offerSelectedDeferredRepayment?.deferredRepaymentPeriod || 0,
    baseFee: offer.offerDetails?.lineOfCreditDetails?.drawFee ?? 0,
    customisationFee:
      offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee,
    id: offer.id!,
    repaymentLength: currentRepaymentTermsMonths!,
    advance: currentAmount!,
  }

  const hasDeferredRepayments =
    (offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.maxNumberOfDeferredMonths || 0) > 0

  const deferredRepayments = useDeferredRepayments(
    deferredRepaymentsParams,
    offerSelectedDeferredRepayment?.deferredRepaymentPeriod ?? 0,
    !!currentAmount && !!currentRepaymentTermsMonths && hasDeferredRepayments
  )

  const deferredRepaymentFees = [
    0,
    offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.oneMonthFee,
    offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.twoMonthsFee,
    offer.offerDetails?.commonOfferDetails?.deferredRepaymentsParameters
      ?.threeMonthsFee,
  ]

  const deferredRepaymentDates = [
    useDeferredRepayments(
      deferredRepaymentsParams,
      0,
      hasDeferredRepayments && !!currentAmount && !!currentRepaymentTermsMonths
    ),
    useDeferredRepayments(
      deferredRepaymentsParams,
      1,
      hasDeferredRepayments && !!currentAmount && !!currentRepaymentTermsMonths
    ),
    useDeferredRepayments(
      deferredRepaymentsParams,
      2,
      hasDeferredRepayments && !!currentAmount && !!currentRepaymentTermsMonths
    ),
    useDeferredRepayments(
      deferredRepaymentsParams,
      3,
      hasDeferredRepayments && !!currentAmount && !!currentRepaymentTermsMonths
    ),
  ]

  const deferredRepaymentLength = useDeferredRepaymentsLength(
    {
      advance: deferredRepaymentsParams.advance,
      baseFee: deferredRepaymentsParams.baseFee,
      repaymentLength: deferredRepaymentsParams.repaymentLength,
      repaymentFrequency:
        offer.offerDetails?.commonOfferDetails?.repaymentFrequency!,
      dealId: offer.offerDetails?.commonOfferDetails?.externalId!,
    },
    hasDeferredRepayments && !!currentAmount && !!currentRepaymentTermsMonths
  )

  if (locMaxDrawAmount.isLoading) {
    return <PageLoader />
  }

  const repaymentFrequency =
    offer.offerDetails?.commonOfferDetails?.repaymentFrequency

  if (!repaymentFrequency) {
    return null
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
      sidebar={
        !isMobile && (
          <OnboardingLayout.Child autoHeight withBackground={false}>
            <DrawSchedule
              firstDraw
              values={{
                collectionFrequency: repaymentFrequency,
                numberOfRepayments:
                  repaymentSummary.data?.repaymentsNumber || 0,
                singleRepaymentAmount:
                  repaymentSummary.data?.firstRepaymentAmount || 0,
                totalRepaymentAmount:
                  (repaymentSummary.data?.firstRepaymentAmount || 0) *
                  (repaymentSummary.data?.repaymentsNumber || 0),
                currency:
                  offer.offerDetails?.commonOfferDetails?.advanceCurrency!,
                deferredRepayments: deferredRepayments.data,
                amount: currentAmount || 0,
                hasDeferredRepayments:
                  (offer.offerDetails?.commonOfferDetails
                    ?.deferredRepaymentsParameters?.maxNumberOfDeferredMonths ||
                    0) > 0,
              }}
            />
          </OnboardingLayout.Child>
        )
      }
    >
      <OnboardingLayout.Parent
        pageBar={<PageBar title={t("title")} desktopHeaderType="h4" />}
      >
        <LocDrawForm
          setCurrentAmount={setCurrentAmount}
          setCurrentRepaymentTermsMonths={setCurrentRepaymentTermsMonths}
          pagebarVisible={false}
          onSubmit={async (formData) => {
            await selectOffer.mutateAsync({
              offerId: offer.id!,
              selectOfferRequest: {
                lineOfCreditParameters: {
                  ...customizations.lineOfCreditParameters,
                  firstDrawAmount: Number.parseFloat(formData.amount),
                  firstDrawRepaymentDuration: formData.repaymentTermsMonths,
                  firstDrawFee: formData.repaymentFee,
                },
                deferredRepaymentsParameters: offerSelectedDeferredRepayment,
              },
            })
          }}
          values={{
            minDrawAmount,
            maxDrawAmount: locMaxDrawAmount.data?.available?.amount ?? 0,
            currency:
              offer.offerDetails?.commonOfferDetails?.advanceCurrency ?? "",
            drawRepaymentDurationMinimum:
              offer.offerDetails?.lineOfCreditDetails
                ?.drawRepaymentDurationMinimum ?? 1,
            drawRepaymentDurationMaximum:
              offer.offerDetails?.lineOfCreditDetails?.drawRepaymentDuration ??
              1,
            collectionFrequency: repaymentFrequency,
            drawFee: offer.offerDetails?.lineOfCreditDetails?.drawFee ?? 0,
            repaymentFee: repaymentSummary.data?.baseFee ?? 0,
            repaymentFeeAmount: repaymentSummary.data?.baseFeeAmount ?? 0,
            totalRepaymentAmount:
              (repaymentSummary.data?.baseFeeAmount ?? 0) +
              (currentAmount ?? 0),
            deferredRepaymentPeriod:
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod,
            customisationFee:
              offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee,
            deferredRepayment:
              offer.offerDetails?.commonOfferDetails
                ?.deferredRepaymentsParameters,
            deferredRepaymentFees,
            deferredRepaymentDates,
            deferredRepaymentMaxDays: deferredRepaymentLength.data?.maxPeriod,
            numberOfRepayments:
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod
                ? deferredRepayments.data?.repaymentsNumber
                : repaymentSummary.data?.repaymentsNumber,
            singleRepaymentAmount:
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod
                ? deferredRepayments.data?.firstRepaymentAmount
                : repaymentSummary.data?.firstRepaymentAmount,
          }}
          isLoading={selectOffer.isPending}
          footerAddition={
            <SkipStepButton
              ctaCopy={t("requestLater")}
              onClick={async () => {
                await selectOffer.mutateAsync({
                  offerId: offer.id!,
                  selectOfferRequest: {
                    lineOfCreditParameters:
                      customizations.lineOfCreditParameters,
                  },
                })
              }}
            />
          }
        />
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default LocFirstDraw
