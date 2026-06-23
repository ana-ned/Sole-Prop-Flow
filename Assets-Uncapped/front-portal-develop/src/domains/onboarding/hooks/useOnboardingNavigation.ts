import { useEffect, useState, useMemo } from "react"
import { useNavigate } from "react-router"
import useStore from "../../../hooks/useStore"
import { reportErrorLog } from "../../../utils/error-handling"
import useOnboarding from "./useOnboarding"

const useOnboardingNavigation = () => {
  const navigate = useNavigate()
  const [next, setNext] = useState(false)
  const [prev, setPrev] = useState(false)
  const { steps } = useOnboarding()
  const customNextOnboardingPath = useStore(
    (state) => state.customNextOnboardingPath
  )

  const currentIndex = steps.findIndex((item) => item.active)

  const navigation = {
    current: steps[currentIndex],
    prev: currentIndex > 0 ? steps[currentIndex - 1] : undefined,
    next: currentIndex < steps.length - 1 ? steps[currentIndex + 1] : undefined,
  }

  useEffect(() => {
    if (next) {
      if (customNextOnboardingPath) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(customNextOnboardingPath)
      } else if (navigation.next) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(navigation.next.href)
      } else {
        reportErrorLog(
          "useOnboardingNavigation: No next step available",
          "error"
        )
      }
      setNext(false)
    }
  }, [customNextOnboardingPath, navigate, navigation.next, next])

  useEffect(() => {
    if (prev) {
      if (customNextOnboardingPath) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(customNextOnboardingPath)
      } else if (navigation.prev) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(navigation.prev.href)
      } else {
        reportErrorLog(
          "useOnboardingNavigation: No previous step available",
          "error"
        )
      }
      setPrev(false)
    }
  }, [customNextOnboardingPath, navigate, navigation.prev, prev])

  const lastMissingStep = steps.find((item) => !item.completed)

  return useMemo(
    () => ({
      next: () => {
        setNext(true)
      },
      hasNext: !!navigation.next,
      prev: () => {
        setPrev(true)
      },
      hasPrev: !!navigation.prev,
      lastMissingStep,
    }),
    []
  )
}

export default useOnboardingNavigation
