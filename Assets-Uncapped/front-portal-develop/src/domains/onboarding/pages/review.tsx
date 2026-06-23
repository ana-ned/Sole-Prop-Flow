import { HugeiconsIcon } from "@hugeicons/react"
import { BubbleChatQuestionSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import {
  Notification02SolidStandard,
  AnalyticsUpSolidStandard,
  CreditCardSolidStandard,
  SecurityValidationSolidStandard,
  User03SolidStandard,
  Chart03SolidStandard,
  Alert02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import DocumentsList from "../../../components/Shared/DocumentsList"
import Alert from "../../../components/UI/Alert"
import Card from "../../../components/UI/Card"
import MainBanner from "../../../components/UI/MainBanner"
import Nudge from "../../../components/UI/Nudge/Nudge"
import Widget from "../../../components/UI/Widget"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { useTracking } from "../../../hooks/useTracking"
import { ApplicationFlowStepResponseStepEnum } from "../../../services/api/hubspot"
import { GrantConsentConsentTypeEnum } from "../../../services/api/organisation-users"
import { format } from "../../../utils/money"
import { joinWithConjunction } from "../../../utils/string"
import useConnections from "../../connections/hooks/useConnections"
import { ConnectionsListedByType } from "../components/ConnectionsList"
import BankVerificationErrors from "../components/offers/components/BankVerificationErrors"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import OnboardingMenu from "../components/OnboardingMenu"
import { OnboardingFullSidePaths, OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useCompany from "../hooks/useCompany"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"
import useLowerOffer from "../hooks/useLowerOffer"
import useRequiredDocuments from "../hooks/useRequiredDocuments"
import useVirtualDocuments from "../hooks/useVirtualDocuments"

const ApplicationReview = () => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding")
  const { handleCompleteStep, hasCompletedStep, flowQuery } =
    useApplicationSteps()
  const navigation = useOnboardingNavigation()
  const deal = useDeal()
  const connections = useConnections()
  const { companyDetails } = useCompany()
  const location = useLocation()
  const documents = useRequiredDocuments()
  const virtualDocuments = useVirtualDocuments()
  const { trackEvent } = useTracking()
  const hasLowerOfferSelected = useLowerOffer()

  if (deal.isLoading) {
    return <PageLoader />
  }

  const missingDocuments = [
    ...(documents.data?.requiredDocuments ?? []),
    ...virtualDocuments.missing,
  ]

  const dealAmount = hasLowerOfferSelected
    ? (deal.data?.amount?.amount ?? 0) + 1
    : (deal.data?.amount?.amount ?? 0)

  const formattedAmount = format(dealAmount, deal.data?.amount?.currency!, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const missingSales = connections.salesConnections.length === 0

  const missingBanking =
    !documents.hasUploadedBankingDocument &&
    connections.bankingConnections.length === 0

  const isAccountingRequired =
    (flowQuery.data?.steps?.some(
      (s) => s.step === ApplicationFlowStepResponseStepEnum.Accounting
    ) ??
      false) &&
    !hasLowerOfferSelected

  const missingAccounting =
    isAccountingRequired &&
    !documents.hasUploadedAccountingDocument &&
    connections.accountingConnections.length === 0

  const disabled =
    missingDocuments.some(
      (doc) =>
        !("additionalInfo" in doc && doc.additionalInfo?.resources?.length)
    ) ||
    missingSales ||
    missingBanking ||
    missingAccounting ||
    !hasCompletedStep("BUSINESS_DETAILS")

  const missingConnectionTypes = [
    ...(missingSales ? ["revenue sources"] : []),
    ...(missingBanking ? ["banking connections"] : []),
    ...(missingAccounting ? ["accounting platforms"] : []),
  ]

  return (
    <OnboardingGuard step="APPLICANT_INFORMATION">
      <OnboardingLayout menu={<OnboardingMenu />}>
        <OnboardingLayout.Parent>
          <div className="space-y-6">
            <MainBanner
              title={
                <>
                  <Typography color="white" type="smallCopy">
                    {t("review.title")}
                  </Typography>
                  <p className="font-heading my-1 text-5xl font-bold text-white">
                    {formattedAmount}
                  </p>
                  <Typography color="white" type="smallCopy">
                    <SanitizedHtml as="span" content={t("review.subtitle")} />
                  </Typography>
                </>
              }
            >
              <div className="xs:items-center xs:flex-row xs:gap-y-0 flex flex-col gap-x-3 gap-y-2">
                <div className="flex grow gap-x-3">
                  <BoxIcon
                    icon={<HugeiconsIcon icon={Notification02SolidStandard} />}
                    severity={"accent-8"}
                  />
                  <Typography type="bodyTitle">
                    {t("review.nudge.title")}
                  </Typography>
                </div>
              </div>
              <Typography type="smallCopy" className="mt-1">
                {t("review.nudge.content")}
              </Typography>
            </MainBanner>

            <BankVerificationErrors />

            {missingDocuments.length > 0 && (
              <Widget
                icon={
                  <BoxIcon
                    severity="accent-5"
                    icon={<HugeiconsIcon icon={Alert02SolidStandard} />}
                  />
                }
                title={t("review.missingData.title")}
              >
                <div className="space-y-4">
                  <Typography type="smallCopy">
                    {t("review.missingData.content")}
                  </Typography>

                  <DocumentsList
                    data={missingDocuments}
                    category="onboarding"
                    path={OnboardingFullSidePaths.Documents}
                    locationState={{
                      backUrl: location.pathname.includes("onboarding")
                        ? `${OnboardingMenuPaths.Review}?redirect=1`
                        : "/",
                    }}
                  />
                </div>
              </Widget>
            )}

            <Widget
              icon={
                <BoxIcon
                  severity="accent-6"
                  icon={<HugeiconsIcon icon={AnalyticsUpSolidStandard} />}
                />
              }
              title={t("review.revenueSources.title")}
              actionComponent={
                <Button
                  href={OnboardingMenuPaths.Sales}
                  state={{ nextPath: location.pathname }}
                  variant={
                    connections.salesConnections.length > 0
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => {
                    trackEvent({
                      category: "onboarding",
                      name: "review",
                      action: "add-sales-connection",
                    })
                  }}
                >
                  <span className="sm:hidden">{t("review.add")}</span>
                  <span className="hidden sm:inline">
                    {connections.salesConnections.length > 0
                      ? t("review.revenueSources.button.addAnother")
                      : t("review.revenueSources.button.add")}
                  </span>
                </Button>
              }
            >
              <div className="space-y-4">
                <Typography type="smallCopy">
                  {t("review.revenueSources.content")}
                </Typography>

                <ConnectionsListedByType
                  connections={connections.salesConnections}
                />
              </div>
            </Widget>

            <Widget
              title={t("review.bankConnections.title")}
              icon={
                <BoxIcon
                  severity="accent-1"
                  icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
                />
              }
              actionComponent={
                <Button
                  href={`${OnboardingMenuPaths.Banking}/search`}
                  state={{ nextPath: location.pathname }}
                  variant={
                    connections.bankingConnections.length > 0
                      ? "secondary"
                      : "primary"
                  }
                  onClick={() => {
                    trackEvent({
                      category: "onboarding",
                      name: "review",
                      action: "add-bank-connection",
                    })
                  }}
                >
                  <span className="sm:hidden">{t("review.add")}</span>
                  <span className="hidden sm:inline">
                    {connections.bankingConnections.length > 0
                      ? t("review.bankConnections.button.addAnother")
                      : t("review.bankConnections.button.add")}
                  </span>
                </Button>
              }
            >
              <div className="space-y-4">
                <Typography type="smallCopy">
                  {t("review.bankConnections.content")}
                </Typography>

                <ConnectionsListedByType
                  connections={connections.bankingConnections}
                />
              </div>
            </Widget>

            {isAccountingRequired && (
              <Widget
                title={t("review.accountingPlatforms.title")}
                icon={
                  <BoxIcon
                    severity="accent-3"
                    icon={<HugeiconsIcon icon={Chart03SolidStandard} />}
                  />
                }
                actionComponent={
                  <Button
                    href={OnboardingMenuPaths.Accounting}
                    state={{ nextPath: location.pathname }}
                    variant={
                      connections.accountingConnections.length > 0
                        ? "secondary"
                        : "primary"
                    }
                    onClick={() => {
                      trackEvent({
                        category: "onboarding",
                        name: "review",
                        action: "add-accounting-connection",
                      })
                    }}
                  >
                    <span className="sm:hidden">{t("review.add")}</span>
                    <span className="hidden sm:inline">
                      {connections.accountingConnections.length > 0
                        ? t("review.accountingPlatforms.button.addAnother")
                        : t("review.accountingPlatforms.button.add")}
                    </span>
                  </Button>
                }
              >
                <div className="space-y-4">
                  <Typography type="smallCopy">
                    {t("review.accountingPlatforms.content")}
                  </Typography>

                  <ConnectionsListedByType
                    connections={connections.accountingConnections}
                  />
                </div>
              </Widget>
            )}

            <Widget
              title={t("review.businessDetails.title")}
              icon={
                <BoxIcon
                  severity="accent-2"
                  icon={
                    <HugeiconsIcon icon={SecurityValidationSolidStandard} />
                  }
                />
              }
              actionComponent={
                <Button
                  href={OnboardingMenuPaths.Business}
                  state={{ nextPath: location.pathname }}
                  variant="secondary"
                  onClick={() => {
                    trackEvent({
                      category: "onboarding",
                      name: "review",
                      action: "edit-business-details",
                    })
                  }}
                >
                  {t("review.businessDetails.button")}
                </Button>
              }
            >
              <div className="space-y-4">
                <Typography type="smallCopy">
                  {t("review.businessDetails.content")}
                </Typography>

                <Card>
                  <div className="space-y-1">
                    <Typography type="bodyTitle">
                      {companyDetails.data?.companyName}
                    </Typography>
                    <Typography>
                      {[
                        companyDetails.data?.registeredAddress?.addressLine1,
                        companyDetails.data?.registeredAddress?.addressLine2,
                        companyDetails.data?.registeredAddress?.locality,
                        companyDetails.data?.registeredAddress?.region,
                        companyDetails.data?.registeredAddress?.postalCode,
                        companyDetails.data?.registeredAddress?.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                    <Typography type="bodyTitle">
                      #{companyDetails.data?.companyNumber}
                    </Typography>
                  </div>
                </Card>
              </div>
            </Widget>

            {auth.organisationData?.consents?.some(
              (consent) =>
                consent.type === GrantConsentConsentTypeEnum.SoftCreditCheck &&
                consent.status === "GIVEN"
            ) && (
              <Widget
                icon={
                  <BoxIcon
                    severity="accent-3"
                    icon={<HugeiconsIcon icon={User03SolidStandard} />}
                  />
                }
                title={t("review.applicantInformation.title")}
              >
                <Alert
                  type="success"
                  title={t("review.applicantInformation.alert.title")}
                >
                  {t("review.applicantInformation.alert.content")}
                </Alert>
              </Widget>
            )}

            {missingDocuments.length === 0 &&
              missingConnectionTypes.length > 0 && (
                <Nudge
                  size={6}
                  accent={5}
                  layout="horizontal"
                  icon={BubbleChatQuestionSolidRounded}
                  content={t("review.missingDataAlert", {
                    items: joinWithConjunction(missingConnectionTypes),
                  })}
                />
              )}

            {!hasCompletedStep("REVIEW") && (
              <ButtonGroup withMargin>
                <Button
                  disabled={disabled}
                  type="button"
                  onClick={async () => {
                    await handleCompleteStep("REVIEW")
                    navigation.next()
                  }}
                >
                  Apply for up to {formattedAmount}
                </Button>
              </ButtonGroup>
            )}
          </div>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default ApplicationReview
