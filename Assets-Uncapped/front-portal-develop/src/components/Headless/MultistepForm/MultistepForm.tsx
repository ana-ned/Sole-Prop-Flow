import React, { useEffect, useState } from "react"

export interface StepProps<T = any> {
  data?: T
  onSubmit?: (data: Partial<T>) => void
  setCustomSubmit?: (data: Partial<T>, nextStep: number) => void
  onBack?: () => void
  currentStep?: number
  setStep?: (step: number) => void
  skipStep?: () => void
  reset?: () => void
}

const MultistepForm = ({
  children,
  initialData = {},
  initialStep = 1,
  onFinish = () => null,
  onStepFinish = () => null,
  onStepChange = () => null,
}: {
  children: React.ReactElement[]
  initialStep?: number
  initialData?: any
  onFinish?: (data: any) => void
  onStepFinish?: (step: number, nextStep: number) => void
  onStepChange?: (current: number) => void
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep)
  const [data, setData] = useState<any>(initialData)

  useEffect(() => {
    onStepChange(currentStep)
  }, [currentStep, onStepChange])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep])

  const onSubmit = (newData: any, nextStep?: number) => {
    setData((currentData: any) => ({ ...currentData, ...newData }))

    if (nextStep && nextStep <= children.length) {
      onStepFinish(currentStep, nextStep)
      setCurrentStep(nextStep)
    } else if (currentStep + 1 <= children.length) {
      onStepFinish(currentStep, currentStep + 1)
      setCurrentStep(currentStep + 1)
    } else {
      onFinish({ ...data, ...newData })
    }
  }

  const onBack = () => {
    setCurrentStep(currentStep > 1 ? currentStep - 1 : 1)
  }

  const setStep = (newStep: number) => {
    setCurrentStep(newStep)
  }

  const skipStep = () => {
    if (currentStep + 1 <= children.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onFinish(data)
    }
  }

  const reset = () => {
    setStep(1)
    setData({ ...initialData })
  }

  const props: StepProps = {
    data,
    onBack,
    onSubmit,
    setCustomSubmit: (newData, newStep) => {
      onSubmit(newData, newStep)
    },
    currentStep,
    setStep,
    skipStep,
    reset,
  }

  if (!children[currentStep - 1]) {
    return null
  }

  return React.cloneElement(children[currentStep - 1], props)
}

export default MultistepForm
