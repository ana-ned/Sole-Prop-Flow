import { useEffect } from "react"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import DrawDepositMethodForm from "../../../../components/Shared/DrawDepositMethodForm"
import LogoOnlyMenu from "../../../../components/UI/LogoOnlyMenu"
import useAuth from "../../../../hooks/useAuth"
import useBrowserStorage from "../../../../hooks/useBrowserStorage"
import useDeal from "../../../../hooks/useDeal"
import {
  OfferResponse,
  OfferResponseOfferTypeEnum,
} from "../../../../services/api/agreements"
import OnboardingLayout from "../../components/OnboardingLayout"
import useApplicationSteps from "../../hooks/useApplicationSteps"
import useOffers from "../../hooks/useOffers"
import useOnboarding from "../../hooks/useOnboarding"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"
import useSetCashTransferAccount from "../../hooks/useSetCashTransferAccount"
import {
  getBusinessLoanOfferParams,
  getLineOfCreditOfferParams,
  getOfferAdvanceAmount,
} from "../../utils/offers"

const DrawDepositMethod = ({
  setCustomSubmit,
  setStep,
  offer,
}: StepProps & { offer: OfferResponse }) => {
  const { organisationData } = useAuth()
  const setTransferAccountMutation = useSetCashTransferAccount()
  const deal = useDeal()
  const navigation = useOnboardingNavigation()
  const { isOfferManual } = useOffers()
  const { handleCompleteStep } = useApplicationSteps()
  const { fullyCompleted } = useOnboarding()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gocardlessLink, _, removeGocardlessLink] = useBrowserStorage<string>(
    organisationData?.id,
    "gocardless_link"
  )

  const isLoc = offer.offerType === OfferResponseOfferTypeEnum.LineOfCredit

  const offerParams = isLoc
    ? getLineOfCreditOfferParams(offer)
    : getBusinessLoanOfferParams(offer)

  useEffect(() => {
    // if the client setup gocardless account, he is redirected back to that step
    if (
      (!deal.hasAmazonPartnerOffer ||
        offer.offerType ===
          OfferResponseOfferTypeEnum.InterestRateLineOfCredit) &&
      gocardlessLink
    ) {
      removeGocardlessLink()
      setStep!(3)
    }
  }, [
    gocardlessLink,
    removeGocardlessLink,
    setStep,
    deal.hasAmazonPartnerOffer,
    offer.offerType,
  ])

  return (
    <OnboardingLayout menu={fullyCompleted ? <LogoOnlyMenu /> : undefined}>
      <OnboardingLayout.Parent>
        <DrawDepositMethodForm
          isLoc={isLoc}
          onSubmit={async (formData) => {
            await setTransferAccountMutation.mutateAsync({
              offerId: offer.id!,
              cashTransferAccountId: formData.accountId,
            })
            if (isOfferManual) {
              await handleCompleteStep("DIRECT_DEBIT")
              navigation.next()
            } else {
              setStep!(3)
            }
          }}
          onBack={() => {
            navigation.prev()
          }}
          currency={offerParams.currency!}
          amount={
            getOfferAdvanceAmount(offer) ?? (isLoc ? 0 : offerParams.advance)
          }
          onAddBankAccount={(formValues) => {
            setCustomSubmit?.(formValues, 2)
          }}
          error={setTransferAccountMutation.error as unknown as Response}
          isLoading={setTransferAccountMutation.isPending}
          offer={offer}
        />
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default DrawDepositMethod
