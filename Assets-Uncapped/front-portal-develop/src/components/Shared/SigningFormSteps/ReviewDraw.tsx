import React, { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import OnboardingLayout from "../../../domains/onboarding/components/OnboardingLayout"
import { AGREEMENTS_OFFERS_QUERY_KEY } from "../../../domains/onboarding/hooks/useOffers"
import { signingQueryKeys } from "../../../domains/onboarding/queries"
import useDocumentStatuses from "../../../hooks/useDocumentStatuses"
import {
  DocumentDetailsSigningStatusEnum,
  DrawResponse,
} from "../../../services/api/agreements"
import PageLoader from "../../Collections/PageLoader"
import { StepProps } from "../../Headless/MultistepForm"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import DocumentSigningList from "./DocumentSigningList"
import { SigningFormFields } from "./SigningFormSteps.types"

const ReviewDraw = ({
  resource,
  backUrl,
  onSignCallback,
  title,
  content,
}: StepProps<SigningFormFields> & {
  resource: DrawResponse
  backUrl: string
  onSignCallback: () => void
  title: string
  content?: React.ReactNode
}) => {
  const queryClient = useQueryClient()

  const documentStatuses = useDocumentStatuses({
    documentIds: [...resource.documentIds!],
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
      documentStatuses.data &&
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
    (!!documentStatuses.data &&
      documentStatuses.data.length < [...(resource.documentIds || [])].length)
  ) {
    return <PageLoader overlay />
  }

  return (
    <OnboardingLayout.Parent
      pageBar={
        <PageBar
          backUrl={backUrl}
          title={title}
          withChat
          desktopHeaderType="h4"
        />
      }
    >
      <FormLayout>
        <FormLayout.Content>
          {content}
          <DocumentSigningList
            documentStatuses={documentStatuses.data || []}
            isLoc
          />
        </FormLayout.Content>
      </FormLayout>
    </OnboardingLayout.Parent>
  )
}

export default ReviewDraw
