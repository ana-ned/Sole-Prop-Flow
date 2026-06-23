import React, { useEffect, useRef } from "react"
import { clsx } from "clsx"
import useGradientsValue from "../../../hooks/useGradientsValue"

export const Noise = React.memo(function Noise() {
  const shadowHostRef = useRef<HTMLDivElement>(null)
  const hasRendered = useRef(false)

  useEffect(() => {
    const shadowHost = shadowHostRef.current
    if (!shadowHost) return

    let shadowRoot = shadowHost.shadowRoot
    if (!shadowRoot) {
      // Create shadow DOM if it doesn't exist
      shadowRoot = shadowHost.attachShadow({ mode: "open" })
    }

    if (hasRendered.current) return

    // Clear existing content
    while (shadowRoot.firstChild) {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      shadowRoot.removeChild(shadowRoot.firstChild)
    }

    // Create canvas in shadow DOM
    const canvas = document.createElement("canvas")
    canvas.style.cssText =
      "position: absolute; top: 0; left: 0; width: 100%; height: 100%; image-rendering: crisp-edges;"
    shadowRoot.append(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = shadowHost.getBoundingClientRect()
    if (width <= 0 || height <= 0) return

    const dpr = (window.devicePixelRatio || 1) * 2 // Double the resolution for extra sharpness
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Disable smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false

    // Black overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
    ctx.fillRect(0, 0, width, height)

    // Add noise on top
    const imageData = ctx.getImageData(0, 0, width * dpr, height * dpr)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      // eslint-disable-next-line sonarjs/pseudo-random
      const noise = Math.random() < 0.5 ? -60 : 60 // Sharp discrete noise values
      data[i] = Math.max(0, Math.min(255, data[i] + noise))
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise))
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise))
    }

    ctx.putImageData(imageData, 0, 0)
    hasRendered.current = true
  }, [])

  return (
    <div ref={shadowHostRef} className="absolute top-0 left-0 z-10 size-full" />
  )
})

const Gradients = React.memo(function Gradients() {
  return (
    <>
      {/* Noise - rendered in shadow DOM */}
      <Noise />

      {/* Left */}
      <div className="absolute top-1/2 left-[-170px] h-[600px] w-[500px] -translate-y-1/2 rotate-[-15deg] bg-[#0EE5E1E5] blur-[100px]" />

      {/* Center */}
      <div className="absolute top-1/2 left-1/2 z-10 h-125 w-63 -translate-x-1/2 -translate-y-1/2 bg-[#045562] blur-[100px]" />

      {/* Right */}
      <div className="absolute top-1/2 right-[-170px] h-[600px] w-[500px] -translate-y-1/2 rotate-[15deg] bg-[#2BB8FFCC] blur-[100px]" />
    </>
  )
})

const MainBanner = ({
  title,
  children,
  theme = "default",
  className,
}: {
  title: React.ReactNode
  children?: React.ReactNode
  theme?: "default" | "dark"
  className?: string
}) => {
  const useGradients = useGradientsValue()

  return (
    <div>
      <div
        className={clsx(
          "shadow-light-sm rounded-card-lg border-card relative overflow-hidden",
          className,
          {
            "bg-[#045562]": theme === "dark" && useGradients,
            "bg-amount-background text-on-primary":
              theme === "dark" && !useGradients,
          }
        )}
      >
        {useGradients && theme === "dark" && <Gradients />}

        <div
          className={clsx("overflow-hidden p-4 text-center", {
            relative: theme === "default",
            "bg-[#045562]": theme === "default" && useGradients,
            "bg-amount-background text-on-primary":
              theme === "default" && !useGradients,
          })}
        >
          {useGradients && theme === "default" && <Gradients />}
          <div className="relative z-10">{title}</div>
        </div>
        {theme === "default" && !!children && (
          <div className="bg-surface-elevated-2 z-20 p-5">{children}</div>
        )}
        {theme === "dark" && !!children && (
          <div className="relative z-20 bg-black/15 p-5">{children}</div>
        )}
      </div>
    </div>
  )
}

export default MainBanner
