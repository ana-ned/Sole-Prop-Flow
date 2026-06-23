import React, { ReactNode, useEffect, useState } from "react"
import clsx from "clsx"
import { useLocation } from "react-router"
import { useShallow } from "zustand/shallow"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import TrustpilotWidget from "../../../components/UI/TrustpilotWidget"
import useDeal from "../../../hooks/useDeal"
import useStore from "../../../hooks/useStore"
import { ApplicationFlowStepResponseStepEnum } from "../../../services/api/hubspot"
import { OnboardingMenuPaths } from "../constants"
import useApplicationSteps from "../hooks/useApplicationSteps"
import useOnboarding from "../hooks/useOnboarding"

const TRUSTPILOT_VISIBLE_STEPS: Set<ApplicationFlowStepResponseStepEnum> =
  new Set([
    ApplicationFlowStepResponseStepEnum.Banking,
    ApplicationFlowStepResponseStepEnum.Sales,
    ApplicationFlowStepResponseStepEnum.Accounting,
    ApplicationFlowStepResponseStepEnum.ApplicantInformation,
    ApplicationFlowStepResponseStepEnum.BusinessDetails,
    ApplicationFlowStepResponseStepEnum.Review,
  ])
import ReadyToSubmit from "./modals/ReadyToSubmit"
import OnboardingMenu from "./OnboardingMenu"

const STEPS_REQUIRED_TO_SUBMIT: ApplicationFlowStepResponseStepEnum[] = [
  ApplicationFlowStepResponseStepEnum.Signing,
  ApplicationFlowStepResponseStepEnum.Owners,
  ApplicationFlowStepResponseStepEnum.DirectDebit,
]

const OnboardingLayout = ({
  children,
  menu = <OnboardingMenu />,
  sidebar,
}: {
  children: ReactNode
  menu?: ReactNode
  sidebar?: ReactNode
}) => {
  const location = useLocation()
  const locationState = location.state as { nextPath?: string } | undefined
  const { hasCompletedStep } = useApplicationSteps()
  const deal = useDeal()
  const onboarding = useOnboarding()
  const {
    customNextOnboardingPath,
    setCustomNextOnboardingPath,
    setLastOnboardingPath,
  } = useStore(
    useShallow((state) => ({
      customNextOnboardingPath: state.customNextOnboardingPath,
      setCustomNextOnboardingPath: state.setCustomNextOnboardingPath,
      setLastOnboardingPath: state.setLastOnboardingPath,
    }))
  )
  const [submitApplicationModalOpen, setSubmitApplicationModalOpen] =
    useState(false)

  const isMenuHidden =
    (hasCompletedStep(ApplicationFlowStepResponseStepEnum.Review) ||
      customNextOnboardingPath === OnboardingMenuPaths.Review) &&
    onboarding.steps.findIndex((step) => step.active) <
      onboarding.steps.findIndex(
        (step) => step.name === ApplicationFlowStepResponseStepEnum.Review
      )

  useEffect(() => {
    if (locationState?.nextPath) {
      setCustomNextOnboardingPath(locationState.nextPath)
    }
  }, [locationState?.nextPath, setCustomNextOnboardingPath])

  useEffect(() => {
    if (isMenuHidden) {
      setCustomNextOnboardingPath(
        locationState?.nextPath === OnboardingMenuPaths.Offers
          ? OnboardingMenuPaths.Offers
          : OnboardingMenuPaths.Review
      )
    }
  }, [
    hasCompletedStep,
    isMenuHidden,
    locationState?.nextPath,
    setCustomNextOnboardingPath,
  ])

  useEffect(() => {
    if (
      customNextOnboardingPath &&
      location.pathname.includes(customNextOnboardingPath)
    ) {
      setCustomNextOnboardingPath()
    }
  }, [location.pathname, customNextOnboardingPath, setCustomNextOnboardingPath])

  useEffect(() => {
    setLastOnboardingPath(location.pathname)
  }, [location.pathname, setLastOnboardingPath])

  useEffect(() => {
    if (
      STEPS_REQUIRED_TO_SUBMIT.every((el) => hasCompletedStep(el)) &&
      !hasCompletedStep(ApplicationFlowStepResponseStepEnum.Submit) &&
      !deal.isLoading &&
      !deal.shouldRedirectToRejection
    ) {
      setSubmitApplicationModalOpen(true)
    }
  }, [hasCompletedStep, deal.isLoading, deal.shouldRedirectToRejection])

  return (
    <Layout
      menu={isMenuHidden ? <LogoOnlyMenu /> : menu}
      sidebar={sidebar}
      mode="onboarding"
    >
      {children}
      <ReadyToSubmit
        isOpen={submitApplicationModalOpen}
        onClose={() => {
          setSubmitApplicationModalOpen(false)
        }}
      />
    </Layout>
  )
}

const OnboardingParent = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Layout.Parent>) => {
  const { steps } = useOnboarding()
  const { hasCompletedStep } = useApplicationSteps()
  const activeStepName = steps.find((step) => step.active)?.name
  const showTrustpilot =
    !!activeStepName &&
    TRUSTPILOT_VISIBLE_STEPS.has(activeStepName) &&
    !hasCompletedStep(ApplicationFlowStepResponseStepEnum.Review)

  return (
    <Layout.Parent {...props} className={clsx("flex flex-col", className)}>
      {children}
      {showTrustpilot && (
        <TrustpilotWidget className="mt-auto flex justify-center pt-8" />
      )}
    </Layout.Parent>
  )
}

OnboardingLayout.Parent = OnboardingParent

OnboardingLayout.Child = Layout.Child

export default OnboardingLayout
