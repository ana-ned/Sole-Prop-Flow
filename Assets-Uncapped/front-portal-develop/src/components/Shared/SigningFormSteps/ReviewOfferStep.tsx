import React, { useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  InformationCircleSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import Summary from "../../../domains/onboarding/components/signing/Summary"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "../../../domains/onboarding/hooks/useOffers"
import { signingQueryKeys } from "../../../domains/onboarding/queries"
import useDevice from "../../../hooks/useDevice"
import useDocumentStatuses from "../../../hooks/useDocumentStatuses"
import {
  CommonOfferDetailsLoanProductTypeEnum,
  DocumentDetailsSigningStatusEnum,
  OfferResponse,
} from "../../../services/api/agreements"
import ButtonGroup from "../../Basic/ButtonGroup"
import Typography from "../../Basic/Typography"
import PageLoader from "../../Collections/PageLoader"
import { StepProps } from "../../Headless/MultistepForm"
import CardV2 from "../../UI/CardV2/CardV2"
import FormLayout from "../../UI/FormLayout/FormLayout"
import Nudge from "../../UI/Nudge/Nudge"
import PageBar from "../../UI/PageBar"
import DocumentSigningList from "./DocumentSigningList"
import { SigningFormFields } from "./SigningFormSteps.types"

const ReviewOfferStep = ({
  resource,
  disclaimer,
  onSignCallback,
  content,
}: StepProps<SigningFormFields> & {
  resource: OfferResponse
  disclaimer?: string
  onSignCallback: () => void
  content?: React.ReactNode
}) => {
  const queryClient = useQueryClient()
  const { isMobile } = useDevice()
  const { t } = useTranslation("common", {
    keyPrefix: "SigningFormSteps.authorityStep.ReviewOfferStep",
  })
  const documentStatuses = useDocumentStatuses({
    documentIds: resource.offerDetails?.signingDetails?.documentIds,
  })

  useEffect(() => {
    const onComplete = async () => {
      await queryClient.invalidateQueries({
        queryKey: [AGREEMENTS_OFFERS_QUERY_KEY],
      })
      await queryClient.invalidateQueries({
        queryKey: signingQueryKeys.status(resource),
      })
      onSignCallback()
    }

    if (
      !!documentStatuses.data &&
      documentStatuses.data.length > 0 &&
      documentStatuses.data.every(
        (status) =>
          status.signingStatus === DocumentDetailsSigningStatusEnum.Completed
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      onComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentStatuses.data])

  if (
    documentStatuses.isLoading ||
    (documentStatuses.data || []).length <
      (resource.offerDetails?.signingDetails?.documentIds || []).length
  ) {
    return <PageLoader overlay />
  }

  return (
    <OnboardingLayout.Parent
      pageBar={<PageBar title={t("title")} withChat desktopHeaderType="h4" />}
    >
      <FormLayout>
        <FormLayout.Content>
          {content}
          {isMobile && <Summary offer={resource} />}
          <div className="flex flex-col gap-y-6">
            <CardV2 title={t("whatHappensNow")}>
              <div className="flex flex-col gap-4">
                {[
                  t("signTheAgreement", {
                    count: (documentStatuses.data || []).length,
                  }),
                  ...t("nextSteps", {
                    returnObjects: true,
                  }),
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <BoxIcon
                      severity="accent-brand"
                      icon={<HugeiconsIcon icon={CheckmarkCircle01Icon} />}
                      size={6}
                    />
                    <Typography color="neutral-800">{item}</Typography>
                  </div>
                ))}
              </div>
            </CardV2>

            <DocumentSigningList
              documentStatuses={documentStatuses.data!}
              isLoc={
                resource.offerDetails?.commonOfferDetails?.loanProductType ===
                CommonOfferDetailsLoanProductTypeEnum.LineOfCreditFrame
              }
            />

            {!!disclaimer && (
              <Nudge
                layout="horizontal"
                accent={8}
                icon={InformationCircleSolidRounded}
                content={disclaimer}
                size={6}
              />
            )}
          </div>
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup />
        </FormLayout.Footer>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default ReviewOfferStep
