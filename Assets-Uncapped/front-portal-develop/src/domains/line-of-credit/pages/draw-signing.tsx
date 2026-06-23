import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Route, Routes, useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import AuthorityStep from "../../../components/Shared/SigningFormSteps/AuthorityStep"
import DetailsStep from "../../../components/Shared/SigningFormSteps/DetailsStep"
import ReviewDraw from "../../../components/Shared/SigningFormSteps/ReviewDraw"
import ReviewOfferNoAuthority from "../../../components/Shared/SigningFormSteps/ReviewOfferNoAuthority"
import ReviewStep from "../../../components/Shared/SigningFormSteps/ReviewStep"
import Layout from "../../../components/UI/Layout"
import useDevice from "../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import ErrorIndex from "../../../pages/error/_error"
import {
  DrawRepaymentPreviewCustomisationTypeEnum,
  DrawResponseStatusEnum,
  DrawSigningDetailsSigningTypeEnum,
  RepaymentCustomisationParametersResponseTypeEnum,
} from "../../../services/api/agreements"
import NextSteps from "../../onboarding/components/signing/NextSteps"
import DrawEmailSentModal from "../components/DrawEmailSentModal"
import DrawSignedModal from "../components/DrawSignedModal"
import DrawStepHeader from "../components/DrawStepHeader"
import DrawSummary from "../components/DrawSummary"
import useDraw from "../hooks/useDraw"
import useDrawRepaymentSummary from "../hooks/useDrawRepaymentSummary"

const DrawSigning = () => {
  const { id, drawId } = useParams()
  const { t } = useTranslation("line-of-credit", { keyPrefix: "draw-signing" })
  const { isMobile } = useDevice()

  const [step, setStep] = useState(1)
  const [modal, setModal] = useState<"SIGNED" | "EMAIL_SENT">()

  const { locAgreements } = useLineOfCreditAgreements()
  const lineOfCredit = locAgreements.data?.content?.find(
    (item) => item.id === id
  )

  const draw = useDraw({
    lineOfCredit,
    drawId: drawId!,
  })

  const deferredRepaymentSummary = useDrawRepaymentSummary(
    {
      lineOfCredit,
      drawAmount: draw.data?.size?.amount ?? 0,
      repaymentTermsMonths: draw.data?.repaymentTermsMonths ?? 0,
      customisationPeriod:
        draw.data?.repaymentCustomisationParametersResponse?.period,
      customisationType:
        DrawRepaymentPreviewCustomisationTypeEnum.DeferredRepayments,
    },
    !!draw.data?.repaymentCustomisationParametersResponse?.type &&
      draw.data.repaymentCustomisationParametersResponse.type ===
        RepaymentCustomisationParametersResponseTypeEnum.DeferredRepayments
  )

  useEffect(() => {
    if (
      draw.data?.status === DrawResponseStatusEnum.WaitingForSignature &&
      draw.data.drawSigningDetails?.signingType ===
        DrawSigningDetailsSigningTypeEnum.Email
    ) {
      setModal("EMAIL_SENT")
    }
  }, [draw.data])

  if (
    locAgreements.isLoading ||
    draw.isLoading ||
    deferredRepaymentSummary.isLoading
  ) {
    return <PageLoader />
  }

  if (
    !lineOfCredit ||
    !draw.data ||
    !(
      [
        DrawResponseStatusEnum.Draft,
        DrawResponseStatusEnum.WaitingForSignature,
      ] as DrawResponseStatusEnum[]
    ).includes(draw.data.status!)
  ) {
    return <ErrorIndex type="404" />
  }

  return (
    <Layout
      menu={false}
      sidebar={
        <>
          {!isMobile && [1, 3, 4].includes(step) && (
            <Layout.Child desktopTitle={t("childTitle")} autoHeight>
              <div className="mt-8">
                <DrawSummary
                  draw={draw.data}
                  lineOfCredit={lineOfCredit}
                  deferredRepayments={deferredRepaymentSummary.data}
                />
                <NextSteps />
              </div>
            </Layout.Child>
          )}
          <Routes>
            <Route
              path="/more"
              element={
                <Layout.Child
                  desktopTitle={t("childTitle")}
                  redirectOnClose={`/line-of-credit/${lineOfCredit.id}/draw/${draw.data.id}/sign`}
                >
                  <NextSteps />
                </Layout.Child>
              }
            />
          </Routes>
        </>
      }
    >
      <MultistepForm
        onStepChange={(current) => {
          setStep(current)
        }}
      >
        <AuthorityStep
          resource={draw.data}
          title={t("authorityStep.title")}
          content={
            <DrawStepHeader
              draw={draw.data}
              lineOfCredit={lineOfCredit}
              deferredRepayments={deferredRepaymentSummary.data}
            />
          }
        />
        <DetailsStep />
        <ReviewStep
          title={t("authorityStep.title")}
          content={
            <DrawStepHeader
              draw={draw.data}
              lineOfCredit={lineOfCredit}
              deferredRepayments={deferredRepaymentSummary.data}
            />
          }
        />
        <ReviewDraw
          resource={draw.data}
          title={t("authorityStep.title")}
          backUrl={`/line-of-credit/${draw.data.lineOfCreditId}`}
          content={
            <DrawStepHeader
              draw={draw.data}
              lineOfCredit={lineOfCredit}
              deferredRepayments={deferredRepaymentSummary.data}
            />
          }
          onSignCallback={() => {
            setModal("SIGNED")
          }}
        />
        <ReviewOfferNoAuthority
          resource={draw.data}
          title={t("authorityStep.title")}
          content={
            <>
              <DrawStepHeader
                draw={draw.data}
                lineOfCredit={lineOfCredit}
                deferredRepayments={deferredRepaymentSummary.data}
              />
              {!isMobile && (
                <DrawSummary
                  draw={draw.data}
                  lineOfCredit={lineOfCredit}
                  deferredRepayments={deferredRepaymentSummary.data}
                />
              )}
            </>
          }
          onEmailSentCallback={() => {
            setModal("EMAIL_SENT")
          }}
        />
      </MultistepForm>

      <DrawSignedModal draw={draw.data} isOpen={modal === "SIGNED"} />

      <DrawEmailSentModal draw={draw.data} isOpen={modal === "EMAIL_SENT"} />
    </Layout>
  )
}

export default DrawSigning
