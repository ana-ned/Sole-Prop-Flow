import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { OfferResponseOfferTypeEnum } from "../../../services/api/agreements"
import { ApplicationControllerApi } from "../../../services/api/amazon-gateway"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import OnboardingGuard from "../components/OnboardingGuard"
import useKycStatus from "../hooks/useKycStatus"
import useOffers from "../hooks/useOffers"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"
import AddBank from "./directDebit/AddBank"
import DrawDepositMethod from "./directDebit/DrawDepositMethod"
import SetupDirectDebit from "./directDebit/SetupDirectDebit"
import UnableToProceed from "./directDebit/UnableToProceed"

const DirectDebit = () => {
  const { isLoading, selectedOffer, isOfferManual } = useOffers()
  const auth = useAuth()
  const deal = useDeal()
  const navigation = useOnboardingNavigation()

  // for customers coming from seller portal, if they have not completed KYC, redirect them back to the previous step
  const kycStatusQuery = useKycStatus({
    enabled:
      auth.isAuthenticated &&
      !!auth.organisation?.organisationId &&
      deal.hasAmazonPartnerOffer,
  })

  // for customers coming from seller portal, if they dont have application confirmed we show the unable to proceed page
  const amazonApplicationStatusQuery = useQuery({
    queryKey: ["amazonApplicationStatus"],
    queryFn: async () =>
      new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.AmazonGateway,
        })
      ).confirmOrganisationApplication({
        xXORGID: auth.organisation?.organisationId!,
      }),
    // this can be only checkd if everyone was positively verified
    enabled:
      deal.hasAmazonPartnerOffer &&
      !!kycStatusQuery.data?.wasAllPersonsVerifiedPositively,
  })

  useEffect(() => {
    if (
      deal.hasAmazonPartnerOffer &&
      kycStatusQuery.data &&
      !kycStatusQuery.data.wasAllPersonsVerifiedPositively
    ) {
      navigation.prev()
    }
  }, [deal.hasAmazonPartnerOffer, kycStatusQuery.data, navigation])

  if (
    isLoading ||
    kycStatusQuery.isLoading ||
    amazonApplicationStatusQuery.isLoading
  ) {
    return <PageLoader />
  }

  if (
    deal.hasAmazonPartnerOffer &&
    amazonApplicationStatusQuery.data?.status === false
  ) {
    return <UnableToProceed />
  }

  const fixedTypeOffers: OfferResponseOfferTypeEnum[] = [
    OfferResponseOfferTypeEnum.Fixed,
    OfferResponseOfferTypeEnum.FixedCustomizable,
    OfferResponseOfferTypeEnum.Rbf,
  ]

  const hasFirstDrawAmount =
    (selectedOffer?.offerType === OfferResponseOfferTypeEnum.LineOfCredit &&
      !!selectedOffer.offerDetails?.lineOfCreditDetails?.firstDrawAmount) ||
    (selectedOffer?.offerType ===
      OfferResponseOfferTypeEnum.InterestRateLineOfCredit &&
      !!selectedOffer.offerDetails?.interestRateLocDetails?.firstDrawAmount)

  const isFixedTypeOffer =
    !!selectedOffer?.offerType &&
    fixedTypeOffers.includes(selectedOffer.offerType)

  const isDailyPayoutOffer =
    selectedOffer?.offerType === OfferResponseOfferTypeEnum.DailyPayout

  const showDrawDepositSteps =
    !!selectedOffer &&
    (isFixedTypeOffer ||
      hasFirstDrawAmount ||
      isDailyPayoutOffer ||
      deal.hasAmazonPartnerOffer)

  const steps = [
    ...(showDrawDepositSteps
      ? [
          <DrawDepositMethod key="draw-deposit-method" offer={selectedOffer} />,
          <AddBank key="add-bank" />,
        ]
      : []),
    ...(isOfferManual ? [] : [<SetupDirectDebit key="setup-direct-debit" />]),
  ]

  return (
    <OnboardingGuard step="DIRECT_DEBIT">
      <MultistepForm>{...steps}</MultistepForm>
    </OnboardingGuard>
  )
}

export default DirectDebit
