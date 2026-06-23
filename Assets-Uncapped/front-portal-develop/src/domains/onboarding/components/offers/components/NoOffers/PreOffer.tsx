import { Fragment, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity03SolidRounded,
  BubbleChatSolidRounded,
  Call02SolidRounded,
  PauseCircleSolidRounded,
  SearchCircleSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import { CreditCardSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { addHours, differenceInHours } from "date-fns"
import { Trans, useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import BoxIcon from "../../../../../../components/Basic/BoxIcon"
import Button from "../../../../../../components/Basic/Button"
import SanitizedHtml from "../../../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../../../components/Basic/Typography"
import DocumentsList from "../../../../../../components/Shared/DocumentsList"
import CardV2 from "../../../../../../components/UI/CardV2"
import ListItem from "../../../../../../components/UI/ListItem"
import MainBanner from "../../../../../../components/UI/MainBanner"
import ProgressBar from "../../../../../../components/UI/ProgressBar"
import { useTracking } from "../../../../../../hooks/useTracking"
import { ConnectionResponse } from "../../../../../../services/api/connections"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../../../../services/api/hubspot"
import { MissingDocumentResponse } from "../../../../../../services/api/organisation-users"
import { format } from "../../../../../../utils/money"
import ConnectionBox from "../../../../../connections/components/ConnectionBox"
import {
  OnboardingFullSidePaths,
  OnboardingMenuPaths,
} from "../../../../constants"
import BookCallBox from "../../../BookCallBox"
import OnboardingLayout from "../../../OnboardingLayout"
import BankVerificationErrors from "../BankVerificationErrors"
import Avatar1 from "./assets/avatar-1.png"
import Avatar2 from "./assets/avatar-2.png"
import Avatar3 from "./assets/avatar-3.png"

const ESTIMATION_HOURS: Record<
  CustomerFacingDealDetailsResponseTierEnum,
  number
> = {
  [CustomerFacingDealDetailsResponseTierEnum.Small]: 24,
  [CustomerFacingDealDetailsResponseTierEnum.Big]: 36,
}
const MINIMUM_ESTIMATION_HOURS = 4

const AvatarGroup = () => {
  return (
    <div className="flex shrink-0 items-center [&>*+*]:-ml-2">
      <img
        src={Avatar1}
        alt=""
        className="size-6 rounded-full border-1 border-white"
      />
      <img
        src={Avatar2}
        alt=""
        className="size-6 rounded-full border-1 border-white"
      />
      <img
        src={Avatar3}
        alt=""
        className="size-6 rounded-full border-1 border-white"
      />
    </div>
  )
}

const PreOffer = ({
  tier,
  amount,
  currency,
  hasConsent,
  startedAt,
  stage,
  isPaused,
  brokenConnections,
  missingDocuments,
  onConsentSubmit,
  onConsentLoading,
  layout = true,
  canBookCall,
}: {
  tier: CustomerFacingDealDetailsResponseTierEnum
  amount: number
  currency: string
  hasConsent: boolean
  startedAt: Date
  stage: 1 | 2 | 3
  isPaused: boolean
  onConsentSubmit: () => void
  brokenConnections: ConnectionResponse[]
  missingDocuments: MissingDocumentResponse[]
  onConsentLoading: boolean
  layout?: boolean
  canBookCall: boolean
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.PreOffer",
  })
  const { trackEvent } = useTracking()
  const location = useLocation()

  const getHoursRemaining = () => {
    const estimation = addHours(startedAt, ESTIMATION_HOURS[tier])
    const hoursLeft =
      differenceInHours(estimation, new Date(), {
        roundingMethod: "ceil",
      }) -
      (stage - 1)

    return Math.max(MINIMUM_ESTIMATION_HOURS, hoursLeft)
  }

  const getStageIcon = () => {
    if (isPaused) {
      return <HugeiconsIcon icon={PauseCircleSolidRounded} />
    }

    if (stage === 1) {
      return <HugeiconsIcon icon={CreditCardSolidStandard} />
    }

    if (stage === 2) {
      return <HugeiconsIcon icon={SearchCircleSolidRounded} />
    }

    return null
  }

  const getStageTitle = () => {
    if (isPaused) {
      return t("stages.ERROR.title")
    }

    switch (stage) {
      case 1: {
        return t("stages.BANK_VERIFICATION.title")
      }
      case 2: {
        return t("stages.DATA_COMPLETENESS.title")
      }
      case 3: {
        return t("stages.UNDERWRITING.title")
      }
      default: {
        return ""
      }
    }
  }

  const getStageSubtitle = () => {
    if (isPaused) {
      return t("stages.ERROR.subtitle")
    }
  }

  useEffect(() => {
    trackEvent({
      category: "onboarding",
      name: "pre-offer",
      action: "viewed",
      customFields: {
        hoursRemaining: getHoursRemaining().toString(),
        stage: stage.toString(),
        isPaused,
      },
    })
  }, [stage, isPaused])

  const Parent = layout ? OnboardingLayout.Parent : Fragment
  const parentProps = layout ? { wide: true } : {}

  const isOverdue = getHoursRemaining() <= MINIMUM_ESTIMATION_HOURS

  return (
    <Parent {...parentProps}>
      <div className="flex flex-col gap-y-4">
        <MainBanner
          title={
            <>
              <Typography color="white" type="smallCopy">
                {t("title")}
              </Typography>
              <p className="font-heading my-1 text-5xl font-bold text-white">
                {format(amount, currency, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <Typography color="white" type="smallCopy">
                <SanitizedHtml as="span" content={t("subtitle")} />
              </Typography>
            </>
          }
        >
          <div className="mb-2">
            <div className="xs:items-center xs:flex-row xs:gap-y-0 flex flex-col gap-x-3 gap-y-2">
              <div className="flex grow gap-x-3">
                {!!getStageIcon() && (
                  <BoxIcon
                    icon={getStageIcon()}
                    severity={isPaused ? "accent-5" : "accent-1"}
                  />
                )}
                {!getStageIcon() && stage === 3 && <AvatarGroup />}
                <Typography type="bodyTitle">{getStageTitle()}</Typography>
              </div>
              <Typography className="self-end">
                {t("eta.title")}:{" "}
                <b>
                  {isPaused
                    ? t("eta.unknown")
                    : isOverdue
                      ? t("eta.awaitingUpdates")
                      : t("eta.hours", { hours: getHoursRemaining() })}
                </b>
              </Typography>
            </div>
            {!!getStageSubtitle() && (
              <Typography type="smallCopy" className="mt-1">
                {getStageSubtitle()}
              </Typography>
            )}
          </div>
          <ProgressBar
            color={isPaused ? "error" : undefined}
            current={stage - 1}
            total={3}
          />
          <div className="mt-4 space-y-3">
            {!isPaused && isOverdue && <Typography>{t("overdue")}</Typography>}
            {canBookCall && !location.pathname.includes("onboarding") && (
              <div className="shadow-light-sm border-card rounded-card-md flex flex-col gap-2 bg-white p-2">
                <ListItem
                  key="refer"
                  to="/book-call"
                  event={{
                    category: "dashboard",
                    name: "pre-offer-book-call",
                    action: "click",
                  }}
                  icon={
                    <BoxIcon
                      severity="accent-2"
                      icon={<HugeiconsIcon icon={Call02SolidRounded} />}
                    />
                  }
                >
                  <span className="font-bold">{t("bookCall")}</span>
                </ListItem>
              </div>
            )}
          </div>
        </MainBanner>

        {hasConsent && !isPaused && (
          <CardV2
            severity="accent-11"
            icon={<HugeiconsIcon icon={BubbleChatSolidRounded} />}
            title={t("notification.title")}
          >
            <Typography>{t("notification.content")}</Typography>
          </CardV2>
        )}

        {canBookCall && location.pathname.includes("onboarding") && (
          <BookCallBox />
        )}

        {!hasConsent && !isPaused && (
          <CardV2
            severity="accent-11"
            icon={<HugeiconsIcon icon={BubbleChatSolidRounded} />}
            title={t("subscribe.title")}
          >
            <div className="flex flex-col gap-y-4">
              <Typography>{t("subscribe.content")}</Typography>
              <div className="shadow-light-sm border-card flex items-center gap-3 bg-white p-4">
                <Typography type="smallCopy" className="grow">
                  <Trans
                    i18nKey="onboarding:offers.PreOffer.subscribe.consent"
                    components={[
                      <a
                        key="link"
                        href="https://www.weareuncapped.com/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        foo
                      </a>,
                    ]}
                  />
                </Typography>
                <Button
                  type="button"
                  variant="primary"
                  className="min-w-[150px]"
                  onClick={onConsentSubmit}
                  loading={onConsentLoading}
                >
                  {t("subscribe.submit")}
                </Button>
              </div>
            </div>
          </CardV2>
        )}

        <BankVerificationErrors />

        {brokenConnections.length > 0 && (
          <CardV2
            severity="accent-5"
            icon={<HugeiconsIcon icon={Activity03SolidRounded} />}
            title={t("connectionErrors.title")}
          >
            <div className="flex flex-col gap-y-4">
              <Typography>{t("connectionErrors.content")}</Typography>
              <div className="flex flex-col gap-y-1">
                {brokenConnections.map((connection) => (
                  <ConnectionBox
                    key={connection.id}
                    connection={connection}
                    dense
                  />
                ))}
              </div>
            </div>
          </CardV2>
        )}

        {missingDocuments.length > 0 && (
          <CardV2
            title={
              <span className="flex items-center gap-x-3">
                <AvatarGroup />
                {t("documents.title")}
              </span>
            }
          >
            <Typography>
              <SanitizedHtml as="span" content={t("documents.content")} />
            </Typography>

            <DocumentsList
              data={missingDocuments}
              category="onboarding"
              path={OnboardingFullSidePaths.Documents}
              locationState={{
                backUrl: location.pathname.includes("onboarding")
                  ? OnboardingMenuPaths.Offers
                  : "/",
              }}
            />
          </CardV2>
        )}
      </div>
    </Parent>
  )
}

export default PreOffer
