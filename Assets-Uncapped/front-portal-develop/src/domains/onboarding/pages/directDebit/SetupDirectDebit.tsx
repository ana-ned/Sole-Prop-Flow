import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ParseKeys } from "i18next"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { useAsync } from "react-use"
import Button from "../../../../components/Basic/Button"
import ButtonGroup from "../../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../components/Collections/PageLoader"
import Alert from "../../../../components/UI/Alert"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import Modal from "../../../../components/UI/Modal"
import PageBar from "../../../../components/UI/PageBar"
import useAgreements from "../../../../hooks/useAgreements"
import useAuth from "../../../../hooks/useAuth"
import useBankAccounts from "../../../../hooks/useBankAccounts"
import useBrowserStorage from "../../../../hooks/useBrowserStorage"
import useDeal from "../../../../hooks/useDeal"
import { AccountVerificationApi } from "../../../../services/api/amazon-gateway"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  GoCardlessMandateControllerApi,
  GoCardlessMandateResponse,
  GoCardlessMandateResponseGcInstanceEnum,
  GoCardlessMandateResponseStatusEnum,
} from "../../../../services/api/collections"
import CountryService from "../../../../services/country"
import { ReactComponent as AddIcon } from "../../../../svgs/add.svg"
import { displayErrorToast } from "../../../../utils/error-handling"
import OnboardingLayout from "../../components/OnboardingLayout"
import useApplicationSteps from "../../hooks/useApplicationSteps"
import useOffers from "../../hooks/useOffers"
import useOnboardingNavigation from "../../hooks/useOnboardingNavigation"

const INVALID_MANDATE_STATUSES = new Set<GoCardlessMandateResponseStatusEnum>([
  GoCardlessMandateResponseStatusEnum.Failed,
  GoCardlessMandateResponseStatusEnum.Cancelled,
  GoCardlessMandateResponseStatusEnum.Expired,
])

const DD_QUERY_KEY = ["DIRECT_DEBIT_MANDATE_LIST"]

const getCopy = (
  countryCode: string
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
): Record<string, ParseKeys<"onboarding", {}, "directDebit">> => {
  if (countryCode === "USA") {
    return {
      title: "usCopy.title",
      subtitle: "usCopy.subtitle",
      buttonCopy: "usCopy.setupACH",
      amazonAlert: "usCopy.amazonAlert",
      amazonModalTitle: "usCopy.amazonModalTitle",
      amazonModalContent: "usCopy.amazonModalContent",
    }
  }

  if (countryCode === "CAN") {
    return {
      title: "canadaCopy.title",
      subtitle: "canadaCopy.subtitle",
      buttonCopy: "canadaCopy.setupPAD",
      amazonAlert: "canadaCopy.amazonAlert",
      amazonModalTitle: "canadaCopy.amazonModalTitle",
      amazonModalContent: "canadaCopy.amazonModalContent",
    }
  }

  return {
    title: "title",
    subtitle: "subtitle",
    buttonCopy: "setupDirectDebit",
  }
}

const SetupDirectDebit = () => {
  const { organisationData } = useAuth()
  const { t } = useTranslation("onboarding", { keyPrefix: "directDebit" })
  const { isAuthenticated, getToken, organisation } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const agreements = useAgreements()
  const offers = useOffers()
  const navigate = useNavigate()
  const { handleCompleteStep } = useApplicationSteps()
  const defaultCountry = CountryService.getByAlpha3(organisation?.countryCode)
  const navigation = useOnboardingNavigation()
  const deal = useDeal()
  const [isRedirecting, setIsRedirecting] = useState(true)
  const bankAccountsQuery = useBankAccounts()
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setGocardlessLink] = useBrowserStorage<string>(
    organisationData?.id,
    "gocardless_link"
  )

  const getGoCardlessLink = useMutation({
    mutationFn: async () =>
      new GoCardlessMandateControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Collections,
        })
      ).getOfflineInitLink1({
        xXORGID: organisation?.organisationId!,
        prefillData: true,
      }),
    onSuccess: ({ setupLink }) => {
      if (setupLink) {
        setGocardlessLink(setupLink)
        globalThis.location.href = setupLink
      }
    },
    onError: async (error: Response) => {
      await displayErrorToast(error)
    },
  })

  const clearMandate = useMutation({
    mutationFn: async (mandateId: string) =>
      new GoCardlessMandateControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Collections,
        })
      ).cancelMandate({
        xXORGID: organisation?.organisationId!,
        mandateId,
      }),
    onError: async (error: Response) => {
      await displayErrorToast(error)
    },
  })

  const mandatesQuery = useQuery({
    queryKey: DD_QUERY_KEY,
    queryFn: async () =>
      new GoCardlessMandateControllerApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Collections,
        })
      ).mandates({
        xXORGID: organisation?.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId,
  })

  const verifiedBankAccount = bankAccountsQuery.data?.find(
    (el) => el.partnerVerified
  )

  const handleContinue = async () => {
    await handleCompleteStep("DIRECT_DEBIT")
    navigation.next()
  }

  useAsync(async () => {
    if (offers.isOfferManual) {
      await handleContinue()
    } else {
      setIsRedirecting(false)
    }
  }, [offers.isOfferManual, offers.data, navigate, handleCompleteStep])

  const filteredMandates = [...(mandatesQuery.data || [])].filter(
    (mandate) =>
      mandate.gcInstance !== GoCardlessMandateResponseGcInstanceEnum.Marcus
  )

  const hasAtLeastOneValidMandate =
    filteredMandates.length > 0 &&
    !filteredMandates.every((mandate: GoCardlessMandateResponse) =>
      INVALID_MANDATE_STATUSES.has(mandate.status!)
    )

  const validMandates = filteredMandates.filter(
    (el) => !INVALID_MANDATE_STATUSES.has(el.status!)
  )

  const accountCheck = useQuery({
    queryKey: ["accountCheck", validMandates],
    queryFn: async () =>
      new AccountVerificationApi(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.AmazonGateway,
        })
      ).doesAccountLockMatch({
        xXORGID: organisation?.organisationId!,
        bankName: validMandates[0].bank!,
        bankAccountNumberTail: validMandates[0].bankAccountNumberTail!,
      }),
    enabled:
      isAuthenticated &&
      !!organisation?.organisationId &&
      validMandates.length > 0 &&
      !!verifiedBankAccount &&
      !!validMandates[0].bankAccountNumberTail &&
      !!validMandates[0].bank,
  })

  useEffect(() => {
    if (
      deal.hasAmazonPartnerOffer &&
      hasAtLeastOneValidMandate &&
      validMandates.length > 0 &&
      !!verifiedBankAccount &&
      !!accountCheck.data &&
      !accountCheck.data.result
    ) {
      setModalVisible(true)
    }
  }, [
    mandatesQuery.data,
    deal.hasAmazonPartnerOffer,
    accountCheck.data,
    hasAtLeastOneValidMandate,
    validMandates.length,
    verifiedBankAccount,
  ])

  if (
    mandatesQuery.isLoading ||
    agreements.isLoading ||
    isRedirecting ||
    bankAccountsQuery.isLoading ||
    accountCheck.isLoading
  ) {
    return <PageLoader />
  }

  const copy = getCopy(organisation?.countryCode || "")

  return (
    <>
      <OnboardingLayout>
        <OnboardingLayout.Parent
          pageBar={
            <PageBar title={t(copy.title)} withChat desktopHeaderType="h4" />
          }
        >
          <main>
            <Typography type="body" className="mt-1 mb-5">
              {t(copy.subtitle)}
            </Typography>
            {deal.hasAmazonPartnerOffer && (
              <Typography type="body" className="mt-1 mb-5">
                <SanitizedHtml as="span" content={t(copy.amazonAlert)} />
              </Typography>
            )}
            {!hasAtLeastOneValidMandate && (
              <ListItemContainer size="sm">
                <ListItemLarge
                  title={t(copy.buttonCopy)}
                  more={{
                    onClick: () => {
                      getGoCardlessLink.mutate()
                    },
                    type: "element",
                    element: <AddIcon />,
                  }}
                />
              </ListItemContainer>
            )}
            {filteredMandates.length > 0 && (
              <>
                {validMandates.map((mandate: GoCardlessMandateResponse) => {
                  return (
                    <ListItemLarge
                      title={mandate.bank || ""}
                      subtitle={mandate.iban || ""}
                      initialIcon={mandate.country || ""}
                      key={mandate.iban}
                      icon={
                        CountryService.getByAlpha2(mandate.country)?.flag ||
                        defaultCountry?.flag ||
                        ""
                      }
                    />
                  )
                })}
              </>
            )}

            <Alert type="warning" className="mt-5">
              {t("stepRequiredToDeposit")}
            </Alert>
          </main>

          <ButtonGroup withMargin>
            <Button
              type="button"
              variant="primary"
              disabled={!hasAtLeastOneValidMandate}
              onClick={handleContinue}
              loading={getGoCardlessLink.isPending}
            >
              {t("continue")}
            </Button>
          </ButtonGroup>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
      <Modal isOpen={modalVisible}>
        <FeatureContent
          size="small"
          className="m-0 [&_div]:max-w-full [&_div]:!border-0 [&_div]:!border-none [&_div]:!shadow-none [&_footer]:!mt-4"
          content={
            <>
              <Typography type="bodyTitle">
                {t(copy.amazonModalTitle)}
              </Typography>
              <Alert type="danger" showIcon={false}>
                <SanitizedHtml as="span" content={t(copy.amazonModalContent)} />
              </Alert>
            </>
          }
          footerContent={
            <>
              <Button
                type="button"
                onClick={async () => {
                  await clearMandate.mutateAsync(validMandates[0].id!)
                  await queryClient.invalidateQueries({
                    queryKey: DD_QUERY_KEY,
                  })
                  setModalVisible(false)
                }}
                variant="secondary"
              >
                {t("amazonModal.cancel")}
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  await clearMandate.mutateAsync(validMandates[0].id!)
                  getGoCardlessLink.mutate()
                  setModalVisible(false)
                }}
              >
                {t("amazonModal.tryAgain")}
              </Button>
            </>
          }
        />
      </Modal>
    </>
  )
}

export default SetupDirectDebit
