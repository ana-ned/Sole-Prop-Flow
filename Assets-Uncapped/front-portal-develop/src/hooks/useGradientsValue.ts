import { useLayoutEffect, useState } from "react"
import useTheme from "./useTheme"

const useGradientsValue = () => {
  const [currentTheme] = useTheme()
  const [useGradientsValue, setUseGradients] = useState(
    () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--border-use-gradients")
        .trim() === "true"
  )

  useLayoutEffect(() => {
    setUseGradients(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--border-use-gradients")
        .trim() === "true"
    )
  }, [currentTheme])

  return useGradientsValue
}

export default useGradientsValue
