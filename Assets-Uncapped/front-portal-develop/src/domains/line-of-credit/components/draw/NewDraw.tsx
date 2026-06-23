import { useState } from "react"
import { Route, Routes, useNavigate } from "react-router"
import { useShallow } from "zustand/shallow"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import LocDrawForm from "../../../../components/Shared/LocDrawForm"
import Layout from "../../../../components/UI/Layout"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import useDevice from "../../../../hooks/useDevice"
import useStore from "../../../../hooks/useStore"
import { DrawRepaymentPreviewCustomisationTypeEnum } from "../../../../services/api/agreements"
import useDeferredRepaymentsLength from "../../../onboarding/hooks/useDeferredRepaymentsLength"
import useDrawRepaymentSummary from "../../hooks/useDrawRepaymentSummary"
import DrawSchedule from "../../pages/draw-schedule"

const NewDraw = ({ onSubmit, data }: StepProps) => {
  const navigate = useNavigate()
  const { isMobile } = useDevice()
  const [currentAmount, setCurrentAmount] = useState<number | undefined>()
  const [currentRepaymentTermsMonths, setCurrentRepaymentTermsMonths] =
    useState<number | undefined>()
  const { offerSelectedDeferredRepayment } = useStore(
    useShallow((state) => ({
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
    }))
  )

  const minDrawAmount =
    data.lineOfCredit?.drawParameters?.minimumDrawAmount?.amount! >
    data.lineOfCredit?.balance?.available?.amount!
      ? data.lineOfCredit?.balance?.available?.amount!
      : data.lineOfCredit?.drawParameters?.minimumDrawAmount?.amount! || 0

  const repaymentSummaryParams = {
    lineOfCredit: data.lineOfCredit,
    drawAmount: currentAmount ?? 0,
    repaymentTermsMonths: currentRepaymentTermsMonths ?? 0,
  }

  const repaymentsSummary = useDrawRepaymentSummary(repaymentSummaryParams)

  const deferredRepaymentFees = [
    0,
    data?.lineOfCredit!.deferredRepayments?.oneMonthFee,
    data?.lineOfCredit!.deferredRepayments?.twoMonthsFee,
    data?.lineOfCredit!.deferredRepayments?.threeMonthsFee,
  ]

  const deferredRepaymentDatesParams = {
    ...repaymentSummaryParams,
    customisationPeriod: 0,
    customisationType:
      DrawRepaymentPreviewCustomisationTypeEnum.DeferredRepayments,
  }

  const deferredRepaymentsEnabled =
    data?.lineOfCredit?.deferredRepayments?.maxNumberOfDeferredMonths > 0 &&
    !!currentRepaymentTermsMonths &&
    !!currentAmount

  const deferredRepaymentDates = [
    useDrawRepaymentSummary(
      {
        ...deferredRepaymentDatesParams,
      },
      deferredRepaymentsEnabled
    ),
    useDrawRepaymentSummary(
      {
        ...deferredRepaymentDatesParams,
        customisationPeriod: 1,
      },
      deferredRepaymentsEnabled
    ),
    useDrawRepaymentSummary(
      {
        ...deferredRepaymentDatesParams,
        customisationPeriod: 2,
      },
      deferredRepaymentsEnabled
    ),
    useDrawRepaymentSummary(
      {
        ...deferredRepaymentDatesParams,
        customisationPeriod: 3,
      },
      deferredRepaymentsEnabled
    ),
  ]

  const deferredRepaymentLength = useDeferredRepaymentsLength(
    {
      advance: currentAmount!,
      baseFee: data.lineOfCredit.fees?.drawPercentFee ?? 0,
      repaymentFrequency: data.lineOfCredit.collectionFrequency,
      repaymentLength: currentRepaymentTermsMonths!,
      dealId: data.lineOfCredit.dealId,
    },
    deferredRepaymentsEnabled
  )

  return (
    <Layout
      menu={<LogoOnlyMenu />}
      sidebar={
        <Routes>
          {!isMobile && (
            <Route
              path="/"
              element={
                <Layout.Child withBackground={false}>
                  <DrawSchedule
                    values={{
                      collectionFrequency:
                        data.lineOfCredit?.collectionFrequency,
                      numberOfRepayments:
                        repaymentsSummary.data?.numberOfRepayments || 0,
                      totalRepaymentAmount:
                        repaymentsSummary.data?.totalRepayment?.amount || 0,
                      singleRepaymentAmount:
                        repaymentsSummary.data?.singleRepayment?.amount || 0,
                      currency:
                        repaymentsSummary.data?.singleRepayment?.currency ||
                        "USD",
                      amount: currentAmount || 0,
                      deferredRepayments:
                        deferredRepaymentDates[
                          offerSelectedDeferredRepayment?.deferredRepaymentPeriod ||
                            0
                        ].data,
                      hasDeferredRepayments:
                        data?.lineOfCredit?.deferredRepayments
                          ?.maxNumberOfDeferredMonths > 0,
                    }}
                  />
                </Layout.Child>
              }
            />
          )}
        </Routes>
      }
    >
      <Layout.Parent>
        <LocDrawForm
          onSubmit={onSubmit!}
          onClickBack={async () => {
            await navigate(data.backUrl)
          }}
          setCurrentAmount={setCurrentAmount}
          setCurrentRepaymentTermsMonths={setCurrentRepaymentTermsMonths}
          values={{
            minDrawAmount,
            maxDrawAmount: data.lineOfCredit!.balance?.available?.amount || 0,
            currency: data.lineOfCredit?.limit?.currency!,
            drawRepaymentDurationMinimum:
              data.lineOfCredit!.drawParameters?.drawRepaymentDurationMinimum,
            drawRepaymentDurationMaximum:
              data.lineOfCredit!.drawParameters?.drawRepaymentDurationMaximum ??
              1,
            amount: data.amount,
            collectionFrequency: data.lineOfCredit!.collectionFrequency ?? "",
            drawFee: data.lineOfCredit!.fees?.drawPercentFee ?? 0,
            repaymentFee: repaymentsSummary.data?.drawPercentFee ?? 0,
            repaymentFeeAmount: repaymentsSummary.data?.drawFee?.amount ?? 0,
            totalRepaymentAmount:
              repaymentsSummary.data?.totalRepayment?.amount ?? 0,
            deferredRepaymentPeriod:
              offerSelectedDeferredRepayment?.deferredRepaymentPeriod!,
            deferredRepayment: data?.lineOfCredit!.deferredRepayments,
            customisationFee:
              offerSelectedDeferredRepayment?.deferredRepaymentAdditionalFee,
            deferredRepaymentFees,
            deferredRepaymentDates,
            deferredRepaymentMaxDays: deferredRepaymentLength.data?.maxPeriod,
          }}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default NewDraw
