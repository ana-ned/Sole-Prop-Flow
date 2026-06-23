import useAuth from "../../../../../../hooks/useAuth"
import useConsents from "../../../../../../hooks/useConsents"
import useDeal from "../../../../../../hooks/useDeal"
import { ConnectionResponseStatusEnum } from "../../../../../../services/api/connections"
import { CustomerFacingDealDetailsResponseStageEnum } from "../../../../../../services/api/hubspot"
import useConnections from "../../../../../connections/hooks/useConnections"
import useApplicationSteps from "../../../../hooks/useApplicationSteps"
import useBankVerification from "../../../../hooks/useBankVerification"
import useLowerOffer from "../../../../hooks/useLowerOffer"
import useRequiredDocuments from "../../../../hooks/useRequiredDocuments"
import useVirtualDocuments from "../../../../hooks/useVirtualDocuments"
import PreOffer from "./PreOffer"

const PreOfferContainer = ({ layout = true }: { layout?: boolean }) => {
  const deal = useDeal()
  const { flowQuery } = useApplicationSteps()
  const bankVerification = useBankVerification()
  const documents = useRequiredDocuments()
  const virtualDocuments = useVirtualDocuments()
  const { connections } = useConnections()
  const auth = useAuth()
  const consents = useConsents()
  const hasLowerOfferSelected = useLowerOffer()

  const getStage = () => {
    if (bankVerification.inProgress || bankVerification.isFailed) {
      return 1
    }

    if (
      deal.data?.stage ===
      CustomerFacingDealDetailsResponseStageEnum.DataCompleteness
    ) {
      return 2
    }

    return 3
  }

  const getStartedDate = () => {
    if (auth.organisationData?.onboardingFinished && deal.data?.createdAt) {
      return deal.data.createdAt
    }

    const reviewStep = flowQuery.data?.steps?.find(
      (item) => item.step === "REVIEW"
    )

    if (reviewStep?.completedAt) {
      return reviewStep.completedAt
    }

    const businessStep = flowQuery.data?.steps?.find(
      (item) => item.step === "BUSINESS_DETAILS"
    )

    if (businessStep?.completedAt) {
      return businessStep.completedAt
    }

    return new Date()
  }

  const brokenConnections = connections.filter(
    (item) => item.status === ConnectionResponseStatusEnum.Error
  )

  const missingDocuments = [
    ...(documents.data?.requiredDocuments ?? []),
    ...virtualDocuments.missing,
  ]

  const isPaused =
    bankVerification.isFailed ||
    missingDocuments.length > 0 ||
    brokenConnections.length > 0

  return (
    <PreOffer
      layout={layout}
      tier={deal.data?.tier!}
      amount={
        hasLowerOfferSelected
          ? (deal.data?.amount?.amount ?? 0) + 1
          : (deal.data?.amount?.amount ?? 0)
      }
      currency={deal.data?.amount?.currency ?? "USD"}
      startedAt={getStartedDate()}
      stage={getStage()}
      isPaused={isPaused}
      canBookCall={
        !!deal.data?.amount?.amount &&
        deal.data.amount.amount >= 250_000 &&
        !isPaused
      }
      brokenConnections={brokenConnections}
      missingDocuments={missingDocuments}
      hasConsent={
        auth.userData?.consents?.SMS_NOTIFICATIONS?.status === "GIVEN"
      }
      onConsentSubmit={() => {
        consents.grantSmsConsent.mutate({
          phone: auth.userData?.phone!,
          smsConsentGranted: true,
        })
      }}
      onConsentLoading={consents.grantSmsConsent.isPending}
    />
  )
}

export default PreOfferContainer
