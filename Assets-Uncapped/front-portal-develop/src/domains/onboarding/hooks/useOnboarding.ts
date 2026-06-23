import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { ConnectionResponseStatusEnum } from "../../../services/api/connections"
import {
  ApplicationFlowStepResponseStatusEnum,
  ApplicationFlowStepResponseStepEnum,
} from "../../../services/api/hubspot"
import useConnections from "../../connections/hooks/useConnections"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "./useApplicationSteps"
import useOffers from "./useOffers"

export interface OnboardingStep {
  /**
   * Points to the name of the step in the application steps database.
   */
  name?: ApplicationFlowStepResponseStepEnum
  /**
   * Label displayed in the menu
   */
  caption?: string
  href: string
  active: boolean
  skipped?: boolean
  completed: boolean
  disabled?: boolean
  /**
   * If true, the step will not be displayed in the menu
   */
  hidden?: boolean
  error?: boolean
  count?: number
  custom?: "offer"
  /**
   * Custom icon to render instead of the default step icons
   */
  icon?: React.ReactNode
}

const useOnboarding = () => {
  const { organisationData } = useAuth()
  const location = useLocation()
  const { t } = useTranslation("onboarding")
  const { pathname } = location
  const { hasCompletedStep, hasSkippedStep, missingSteps, flowQuery } =
    useApplicationSteps()
  const deal = useDeal()
  const { isOfferManual, selectedOffer, data: offers } = useOffers()
  const { salesConnections, accountingConnections, bankingConnections } =
    useConnections()

  const STEP_UI_CONFIG: Record<
    string,
    { caption: string; href: string; active: boolean; error?: boolean }
  > = {
    [ApplicationFlowStepResponseStepEnum.Banking]: {
      caption: t("menu.banking"),
      href: OnboardingMenuPaths.Banking,
      active: pathname.includes(OnboardingMenuPaths.Banking),
      error:
        bankingConnections.some(
          (item) => item.status === ConnectionResponseStatusEnum.Error
        ) &&
        (hasCompletedStep(ApplicationFlowStepResponseStepEnum.Banking) ||
          hasSkippedStep(ApplicationFlowStepResponseStepEnum.Banking)),
    },
    [ApplicationFlowStepResponseStepEnum.Sales]: {
      caption: t("menu.sales"),
      href: deal.isAmazonSeller
        ? OnboardingMenuPaths.SalesAmazon
        : OnboardingMenuPaths.Sales,
      active: deal.isAmazonSeller
        ? pathname.includes(OnboardingMenuPaths.Sales) ||
          pathname.includes(OnboardingMenuPaths.SalesAmazon)
        : pathname.includes(OnboardingMenuPaths.Sales),
      error:
        salesConnections.some(
          (item) => item.status === ConnectionResponseStatusEnum.Error
        ) &&
        (hasCompletedStep(ApplicationFlowStepResponseStepEnum.Sales) ||
          hasSkippedStep(ApplicationFlowStepResponseStepEnum.Sales)),
    },
    [ApplicationFlowStepResponseStepEnum.Accounting]: {
      caption: t("menu.accounting"),
      href: OnboardingMenuPaths.Accounting,
      active: pathname.includes(OnboardingMenuPaths.Accounting),
      error:
        accountingConnections.some(
          (item) => item.status === ConnectionResponseStatusEnum.Error
        ) &&
        (hasCompletedStep(ApplicationFlowStepResponseStepEnum.Accounting) ||
          hasSkippedStep(ApplicationFlowStepResponseStepEnum.Accounting)),
    },
    [ApplicationFlowStepResponseStepEnum.ApplicantInformation]: {
      caption: t("menu.softCreditCheck"),
      href: OnboardingMenuPaths.SoftCreditCheck,
      active: pathname.includes(OnboardingMenuPaths.SoftCreditCheck),
    },
    [ApplicationFlowStepResponseStepEnum.BusinessDetails]: {
      caption: t("menu.businessDetails"),
      href: OnboardingMenuPaths.Business,
      active: pathname.includes(OnboardingMenuPaths.Business),
    },
    [ApplicationFlowStepResponseStepEnum.Review]: {
      caption: t("menu.review"),
      href: OnboardingMenuPaths.Review,
      active: pathname.includes(OnboardingMenuPaths.Review),
    },
    [ApplicationFlowStepResponseStepEnum.Offers]: {
      caption: selectedOffer ? t("menu.offersSelected") : t("menu.offers"),
      href: OnboardingMenuPaths.Offers,
      active: pathname.includes(OnboardingMenuPaths.Offers),
    },
    [ApplicationFlowStepResponseStepEnum.Signing]: {
      caption: t("menu.signing"),
      href: OnboardingMenuPaths.Signing,
      active: pathname.includes(OnboardingMenuPaths.Signing),
    },
    [ApplicationFlowStepResponseStepEnum.Owners]: {
      caption: t("menu.verifyOwners"),
      href: OnboardingMenuPaths.Owners,
      active: pathname.includes(OnboardingMenuPaths.Owners),
    },
    [ApplicationFlowStepResponseStepEnum.DirectDebit]: {
      caption:
        organisationData?.countryCode === "USA"
          ? t("menu.achDebit")
          : organisationData?.countryCode === "CAN"
            ? t("menu.padAcc")
            : t("menu.directDebit"),
      href: OnboardingMenuPaths.DirectDebit,
      active: pathname.includes(OnboardingMenuPaths.DirectDebit),
    },
    [ApplicationFlowStepResponseStepEnum.Submit]: {
      href: OnboardingMenuPaths.Submit,
      caption: "",
      active: pathname.includes(OnboardingMenuPaths.Submit),
    },
  }

  const steps: OnboardingStep[] =
    flowQuery.data?.steps
      ?.slice()
      .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .flatMap((fs): OnboardingStep[] => {
        const ui = STEP_UI_CONFIG[fs.step!]

        if (!ui) return []
        if (fs.status === ApplicationFlowStepResponseStatusEnum.Autocompleted) {
          return []
        }
        if (
          fs.step === ApplicationFlowStepResponseStepEnum.DirectDebit &&
          !selectedOffer &&
          isOfferManual
        ) {
          return []
        }

        const step: OnboardingStep = {
          name: fs.step,
          caption: ui.caption,
          href: ui.href,
          active: ui.active,
          completed:
            fs.status === ApplicationFlowStepResponseStatusEnum.Completed,
          skipped: fs.status === ApplicationFlowStepResponseStatusEnum.Skipped,
          disabled: fs.disabled ?? false,
          hidden: fs.hidden ?? false,
          error: ui.error,
          count:
            fs.step === ApplicationFlowStepResponseStepEnum.Offers
              ? selectedOffer
                ? undefined
                : offers?.length || 0
              : undefined,
          custom:
            fs.step === ApplicationFlowStepResponseStepEnum.Offers
              ? "offer"
              : undefined,
        }

        if (
          fs.step === ApplicationFlowStepResponseStepEnum.Submit &&
          missingSteps.length > 0
        ) {
          return [
            {
              href: OnboardingMenuPaths.InformationRequired,
              active: pathname.includes(
                OnboardingMenuPaths.InformationRequired
              ),
              completed: true,
              hidden: true,
            },
            step,
          ]
        }

        return [step]
      }) ?? []

  return {
    steps,
    fullyCompleted:
      organisationData?.activated && organisationData.onboardingFinished,
  }
}

export default useOnboarding
