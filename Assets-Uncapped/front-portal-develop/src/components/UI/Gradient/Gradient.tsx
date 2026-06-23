import React from "react"
import { clsx } from "clsx"
import useGradientsValue from "../../../hooks/useGradientsValue"
import { Noise } from "../MainBanner/MainBanner"

const Gradient = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  const useGradients = useGradientsValue()

  return (
    <div
      className={clsx("relative overflow-hidden", className, {
        "bg-brand-600 text-on-primary": !useGradients,
        "bg-brand-800": useGradients,
      })}
    >
      {useGradients && (
        <>
          {/* Overlay */}
          <div className="bg-info-800 absolute top-0 left-0 h-full w-full opacity-50"></div>

          {/* Masked Noise */}
          <div className="absolute inset-0 z-10 mask-[radial-gradient(800px_800px_at_bottom_left,black,transparent),radial-gradient(800px_800px_at_top_right,black,transparent)]">
            <Noise />
          </div>

          {/* Shape 1 - Bottom Left */}
          <div className="bg-accent-1-contrast absolute bottom-[-460px] left-[-350px] h-[922px] w-[700px] rounded-[50%] opacity-40 mix-blend-color-dodge blur-[200px]" />

          {/* Shape 2 - Top Right */}
          <div className="bg-accent-6-contrast absolute top-[-460px] right-[-350px] h-[922px] w-[700px] rounded-[50%] opacity-40 blur-[200px]" />
        </>
      )}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

export default Gradient
