import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoneySecuritySolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { HelpCircleSolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  CreditCardSolidStandard,
  MoneyExchange03SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import Accordion from "../../../components/UI/Accordion/Accordion"
import Alert from "../../../components/UI/Alert"
import Card from "../../../components/UI/Card"
import CardV2 from "../../../components/UI/CardV2"
import Nudge from "../../../components/UI/Nudge/Nudge"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import usePlaid, { PlaidAction } from "../../../hooks/usePlaid"
import { useTracking } from "../../../hooks/useTracking"
import CountryService from "../../../services/country"
import { isProduction } from "../../../utils/env"
import { url } from "../../../utils/url"
import useConnections from "../../connections/hooks/useConnections"
import { getPotentiallySuccessfulConnections } from "../../connections/utils/connections"
import AnalysingAnimation from "../components/AnalysingAnimation"
import ConnectionArrow from "../components/ConnectionArrow"
import { ConnectionsListedByType } from "../components/ConnectionsList"
import OnboardingGuard from "../components/OnboardingGuard"
import OnboardingLayout from "../components/OnboardingLayout"
import Revenue from "../components/revenue"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useBankVerification from "../hooks/useBankVerification"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"

const BankingIndex = () => {
  const { t } = useTranslation(["onboarding", "connections"])
  const { trackEvent, isInitialized: isTrackingInitialized } = useTracking()
  const deal = useDeal()
  const { refetchConnections, bankingConnections } = useConnections()
  const { handleCompleteStep } = useApplicationSteps()
  const auth = useAuth()
  const [plaidExitStatus, setPlaidExitStatus] = useState<string | null>(null)
  const plaid = usePlaid({
    redirectUrl: url(`${OnboardingMenuPaths.Banking}/plaid-auth`, true),
    method: PlaidAction.CONNECT_WITH_INSTITUTION,
    onSuccessCallback: () => {
      setPlaidExitStatus(null)
      refetchConnections()
    },
    onExitCallback: (metadata) => setPlaidExitStatus(metadata.status),
  })
  const hasSuccessfulConnections =
    getPotentiallySuccessfulConnections(bankingConnections).length > 0
  const navigation = useOnboardingNavigation()

  const countryCode =
    CountryService.getByAlpha3(auth.organisation?.countryCode)?.["alpha-2"] ??
    ""
  const isPlaidSupported = ["CA", "US"].includes(countryCode)
  const bankVerification = useBankVerification()

  const showPayoneerAlternative =
    countryCode === "US" && plaidExitStatus === "institution_not_found"
  const hasTrackedPayoneerImpression = useRef(false)

  useEffect(() => {
    if (
      showPayoneerAlternative &&
      isTrackingInitialized &&
      !hasTrackedPayoneerImpression.current
    ) {
      hasTrackedPayoneerImpression.current = true
      trackEvent({
        category: "onboarding",
        name: "banking-payoneer-alternative",
        action: "displayed",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPayoneerAlternative, isTrackingInitialized])

  return (
    <OnboardingGuard step="BANKING">
      <OnboardingLayout>
        <OnboardingLayout.Parent>
          <PageBar title={t("banking.title")} withChat desktopHeaderType="h4" />
          <div className="space-y-6">
            <Typography>
              <SanitizedHtml as="span" content={t("banking.description")} />
            </Typography>

            <div className="space-y-3">
              {plaid.plaidLinkError && (
                <Alert type="danger">
                  {t("connections:bankErrors.plaidLinkError")}
                </Alert>
              )}

              {plaid.isTokenError && (
                <Alert type="danger">
                  {t("connections:bankErrors.tokenError")}
                </Alert>
              )}

              <Card variant="tertiary">
                <Revenue
                  isAmazonPartnership={deal.isAmazonPartnership}
                  organisationData={auth.organisationData}
                />

                <ConnectionArrow>
                  {t("banking.whereDoSalesPayoutsGo")}
                </ConnectionArrow>

                <CardV2
                  title={t("banking.bankConnections")}
                  icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
                  severity="accent-brand"
                  actions={
                    <Button
                      variant="primary"
                      {...(isPlaidSupported
                        ? {
                            type: "button" as const,
                            onClick: () => {
                              trackEvent({
                                category: "onboarding",
                                name: "banking-connect-plaid",
                                action: "click",
                              })
                              plaid.openWithInstitution()
                            },
                          }
                        : {
                            href: `${OnboardingMenuPaths.Banking}/search`,
                          })}
                    >
                      {hasSuccessfulConnections
                        ? t("banking.addAnotherBank")
                        : t("banking.connectCta")}
                    </Button>
                  }
                >
                  {hasSuccessfulConnections ? (
                    <ConnectionsListedByType connections={bankingConnections} />
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <BoxIcon
                        icon={
                          <HugeiconsIcon icon={MoneySecuritySolidRounded} />
                        }
                        severity="accent-brand"
                        size={10}
                      />
                      <p className="text-text-primary mt-2 mb-1 text-sm font-bold">
                        {t("banking.security.title")}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {t("banking.security.description")}
                      </p>
                    </div>
                  )}
                </CardV2>
              </Card>

              {showPayoneerAlternative && (
                <CardV2
                  title={t("banking.payoneerAlternative.title")}
                  icon={<HugeiconsIcon icon={MoneyExchange03SolidStandard} />}
                  severity="accent-2"
                  actions={
                    <Button
                      variant="primary"
                      href={`/onboarding/consent/yapily?country=GBR&institutionId=${isProduction() ? "payoneer_uk" : "modelo-sandbox"}`}
                      onClick={() =>
                        trackEvent({
                          category: "onboarding",
                          name: "banking-payoneer-alternative",
                          action: "click",
                        })
                      }
                    >
                      {t("banking.payoneerAlternative.cta")}
                    </Button>
                  }
                >
                  <p className="text-text-secondary text-sm">
                    {t("banking.payoneerAlternative.description")}
                  </p>
                </CardV2>
              )}

              {isPlaidSupported && (
                <Button
                  variant="link"
                  href={`${OnboardingMenuPaths.Banking}/search`}
                >
                  {t("banking.connectOther")}
                </Button>
              )}
            </div>

            {hasSuccessfulConnections && bankVerification.inProgress && (
              <Nudge
                title={t("banking.detectingOtherBanks.title")}
                content={t("banking.detectingOtherBanks.content")}
                icon={<AnalysingAnimation />}
                layout="horizontal"
                accent="brand"
              />
            )}

            <CardV2
              title={t("banking.faq.title")}
              icon={<HugeiconsIcon icon={HelpCircleSolidSharp} />}
              severity="accent-3"
            >
              <Accordion
                variant="v2"
                items={t("banking.faq.items", { returnObjects: true }).map(
                  (item, index) => ({
                    label: item.question,
                    content: (
                      <Trans
                        // @ts-expect-error dynamic translation
                        i18nKey={`banking.faq.items.${index}.answer`}
                        ns="onboarding"
                        components={{
                          "bank-search-link": (
                            <Link
                              to={`${OnboardingMenuPaths.Banking}/search`}
                            />
                          ),
                        }}
                      />
                    ),
                    onClick: () =>
                      trackEvent({
                        category: "onboarding",
                        name: "banking-faq",
                        action: "click",
                        customFields: { question: item.question },
                      }),
                  })
                )}
              />
            </CardV2>
          </div>

          <ButtonGroup withMargin>
            <Button
              type="button"
              disabled={!hasSuccessfulConnections}
              onClick={async () => {
                await handleCompleteStep("BANKING")
                navigation.next()
              }}
            >
              {t("banking.submit")}
            </Button>
          </ButtonGroup>
        </OnboardingLayout.Parent>
      </OnboardingLayout>
    </OnboardingGuard>
  )
}

export default BankingIndex
