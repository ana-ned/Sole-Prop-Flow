import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import PageLoader from "../../../components/Collections/PageLoader"
import Card from "../../../components/UI/Card"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import Modal from "../../../components/UI/Modal"
import OfferAmount from "../../../components/UI/OfferAmount/OfferAmount"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDeal, { getDealQueryKey } from "../../../hooks/useDeal"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  CustomerFacingDealDetailsResponseMainPlatformEnum,
  DealControllerApi,
} from "../../../services/api/hubspot"
import { ReactComponent as AdminPanelSettings } from "../../../svgs/admin-panel-settings.svg"
import useConnections from "../../connections/hooks/useConnections"
import { featuredAccountingPlatforms } from "../../connections/models/platforms"
import { getPotentiallySuccessfulConnections } from "../../connections/utils/connections"
import { ReactComponent as OtherIcon } from "../assets/accounting-other.svg"
import ConnectionsLayout from "../components/ConnectionsLayout"
import OnboardingGuard from "../components/OnboardingGuard"
import SkipStepButton from "../components/SkipStepButton"
import { ACCOUNTING_LOWER_OFFER_BREAKPOINT } from "../constants"
import useAccountingDocuments from "../hooks/useAccountingDocuments"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboardingNavigation from "../hooks/useOnboardingNavigation"
import useLowerOffer from "../hooks/useLowerOffer"
import { documentQueryKeys } from "../queries"

const AccountingConnectionsIndex = () => {
  const auth = useAuth()
  const { t } = useTranslation("onboarding")
  const { handleCompleteStep, hasCompletedStep, skipStep } =
    useApplicationSteps()
  const { accountingConnections, handleOpenAuthorizationProvider } =
    useConnections()
  const navigation = useOnboardingNavigation()
  const [askForChoice, setAskForChoice] = useState(true)
  const deal = useDeal()
  const { trackEvent } = useTracking()
  const queryClient = useQueryClient()
  const [modal, setModal] = useState<"CONFIRM_LOWER_OFFER">()
  const { accountingDocumentsRequests } = useAccountingDocuments()
  const location = useLocation()
  const hasLowerOfferSelected = useLowerOffer()

  const canSelectLowerOffer =
    askForChoice &&
    getPotentiallySuccessfulConnections(accountingConnections).length === 0 &&
    !hasLowerOfferSelected &&
    deal.data?.mainPlatform ===
      CustomerFacingDealDetailsResponseMainPlatformEnum.Amazon &&
    deal.data.amount?.amount! > ACCOUNTING_LOWER_OFFER_BREAKPOINT

  const takeLowerOffer = useMutation({
    mutationFn: async () => {
      await new DealControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).decisionMade({
        xXORGID: auth.organisation?.organisationId!,
        dealId: deal.data?.id!,
        dealDecision: {
          decision: "LOWER_OFFER",
        },
      })

      await handleCompleteStep("ACCOUNTING")

      await queryClient.invalidateQueries({
        queryKey: getDealQueryKey(),
        type: "all",
      })

      await queryClient.invalidateQueries({
        queryKey: documentQueryKeys.required(),
        type: "all",
      })
    },
  })

  if (deal.isLoading) {
    return <PageLoader />
  }

  return (
    <OnboardingGuard step={"ACCOUNTING"}>
      <ConnectionsLayout
        pageBar={
          <PageBar
            title={
              hasLowerOfferSelected || canSelectLowerOffer
                ? t("accountingConnections.titleEarly")
                : t("accountingConnections.title")
            }
            onClickBack={() => {
              if (canSelectLowerOffer || askForChoice) {
                navigation.prev()
              } else {
                setAskForChoice(true)
              }
            }}
            withChat
            desktopHeaderType="h4"
          />
        }
        footer={
          canSelectLowerOffer ? null : (
            <ButtonGroup withMargin>
              {!hasLowerOfferSelected && (
                <SkipStepButton
                  ctaCopy={t("accountingConnections.skip")}
                  onClick={async () => {
                    await skipStep("ACCOUNTING")
                    navigation.next()
                  }}
                />
              )}
              <Button
                type="button"
                variant="primary"
                onClick={async () => {
                  await handleCompleteStep("ACCOUNTING")
                  navigation.next()
                }}
                disabled={
                  !hasLowerOfferSelected &&
                  getPotentiallySuccessfulConnections(accountingConnections)
                    .length === 0 &&
                  accountingDocumentsRequests.length > 0 &&
                  !hasCompletedStep("ACCOUNTING")
                }
              >
                {t("actions.continue")}
              </Button>
            </ButtonGroup>
          )
        }
      >
        {canSelectLowerOffer ? (
          <div className="flex flex-col gap-y-6">
            <Card spacing="big">
              <Typography type="h6" className="text-center">
                {t("accountingConnections.card.titleMax")}
              </Typography>
              <OfferAmount
                amount={deal.data?.amount?.amount!}
                currency={deal.data?.amount?.currency!}
                className="mt-4 mb-4"
              />
              <Typography>
                <SanitizedHtml
                  as="span"
                  content={t("accountingConnections.card.descriptionMax")}
                />
              </Typography>
              <Button
                fullWidth
                className="mt-6"
                type="button"
                onClick={() => {
                  trackEvent({
                    category: "onboarding",
                    name: "accounting",
                    action: "take-bigger-offer",
                  })
                  setAskForChoice(false)
                }}
              >
                {t("accountingConnections.actions.continue")}
              </Button>
            </Card>

            <Card spacing="big">
              <Typography type="h6" className="text-center">
                {t("accountingConnections.card.titleMin")}
              </Typography>
              <OfferAmount
                amount={ACCOUNTING_LOWER_OFFER_BREAKPOINT}
                currency={deal.data?.amount?.currency!}
                className="mt-4 mb-4"
              />
              <Typography type="bodyTitle" className="mb-4 text-center">
                {t("accountingConnections.card.subtitle")}
              </Typography>
              <Typography>
                <SanitizedHtml
                  as="span"
                  content={t("accountingConnections.card.descriptionMin")}
                />
              </Typography>
              <Button
                fullWidth
                className="mt-6"
                type="button"
                onClick={() => {
                  trackEvent({
                    category: "onboarding",
                    name: "accounting",
                    action: "consider-lower-offer",
                  })
                  setModal("CONFIRM_LOWER_OFFER")
                }}
              >
                {t("accountingConnections.actions.skip")}
              </Button>
            </Card>
          </div>
        ) : // eslint-disable-next-line sonarjs/no-nested-conditional
        hasLowerOfferSelected ? (
          <Card spacing="big">
            <Typography type="h6" className="text-center">
              {t("accountingConnections.lowerOfferSelected.title")}
            </Typography>
            <OfferAmount
              amount={(deal.data?.amount?.amount ?? 0) + 1}
              currency={deal.data?.amount?.currency!}
              className="mt-4 mb-4"
            />
            <Typography>
              <SanitizedHtml
                as="span"
                content={t(
                  "accountingConnections.lowerOfferSelected.description"
                )}
              />
            </Typography>
          </Card>
        ) : (
          <>
            <Typography>{t("accountingConnections.description")}</Typography>
            <ListItemContainer className="my-6">
              {featuredAccountingPlatforms.map((platform) => (
                <ListItemLarge
                  icon={
                    "iconUrl" in platform &&
                    typeof platform.iconUrl === "string" &&
                    platform.iconUrl ? (
                      <img src={platform.iconUrl} alt={platform.name} />
                    ) : undefined
                  }
                  key={platform.name}
                  title={platform.name}
                  more={{
                    type: "button",
                    onClick: async () => {
                      trackEvent({
                        category: "onboarding",
                        name: "accounting",
                        action: "clicked",
                        customFields: {
                          name: platform.name,
                          category: platform.category,
                        },
                      })

                      await handleOpenAuthorizationProvider(platform)
                    },
                  }}
                />
              ))}
              <ListItemLarge
                icon={<OtherIcon />}
                iconClassName="!p-1"
                title={t("accountingConnections.other")}
                href="/onboarding/accounting/all"
                eventTracker={{
                  category: "onboarding",
                  name: "accounting",
                  action: "clicked-other",
                }}
                more={{ type: "button-link" }}
              />
            </ListItemContainer>

            <Typography type="bodyTitle">
              {t("accountingConnections.invite.title")}
            </Typography>
            <Typography>{t("accountingConnections.invite.content")}</Typography>
            <ListItemContainer className="mt-4">
              <ListItemLarge
                icon={<AdminPanelSettings />}
                title={t("accountingConnections.invite.button")}
                href="/invite-members"
                hrefState={{
                  from: location.pathname,
                }}
                eventTracker={{
                  category: "onboarding",
                  name: "accounting",
                  action: "invite-list-item-clicked",
                }}
                more={{ type: "button-link" }}
              />
            </ListItemContainer>
          </>
        )}
      </ConnectionsLayout>

      <Modal
        size="sm"
        isOpen={modal === "CONFIRM_LOWER_OFFER"}
        onClose={() => {
          setModal(undefined)
        }}
      >
        <Typography type="h5" className="mb-4 text-center">
          {t("accountingConnections.lowerOfferConfirmation.title")}
        </Typography>
        <Typography className="mb-5 text-center">
          {t("accountingConnections.lowerOfferConfirmation.content")}
        </Typography>
        <Button
          fullWidth
          type="button"
          variant="secondary"
          onClick={() => {
            setModal(undefined)
          }}
          className="mb-4"
        >
          {t("accountingConnections.lowerOfferConfirmation.cancel")}
        </Button>
        <Button
          fullWidth
          type="button"
          variant="primary"
          loading={takeLowerOffer.isPending}
          onClick={async () => {
            await takeLowerOffer.mutateAsync()
            trackEvent({
              category: "onboarding",
              name: "accounting",
              action: "take-lower-offer",
            })
            navigation.next()
          }}
        >
          {t("accountingConnections.lowerOfferConfirmation.submit")}
        </Button>
      </Modal>
    </OnboardingGuard>
  )
}

export default AccountingConnectionsIndex
