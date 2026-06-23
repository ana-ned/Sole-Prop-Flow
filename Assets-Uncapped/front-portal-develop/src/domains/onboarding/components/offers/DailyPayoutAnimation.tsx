import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import { formatAsPercentage } from "../../../../utils/money"

const DAYS = 15
const MAX_H = 163

const COLORS = {
  payout: "var(--color-secondary-400)",
  advance: "var(--color-brand-400)",
  deferred: "var(--color-brand-600)",
  remainder: "#7cc07c",
}

const ADVANCE_STRIPE_STYLE = {
  backgroundColor: "var(--color-brand-200)",
  backgroundImage:
    "repeating-linear-gradient(-45deg, var(--color-brand-300), transparent 1px, transparent 4px, var(--color-brand-300) 4px, var(--color-brand-300) 5px)",
}

const PAYOUT_STRIPE_STYLE = {
  backgroundColor: "var(--color-secondary-200)",
  backgroundImage:
    "repeating-linear-gradient(-45deg, var(--color-secondary-300), transparent 1px, transparent 4px, var(--color-secondary-300) 4px, var(--color-secondary-300) 5px)",
}

interface BarState {
  advance: number
  deferred: number
  payout: number
  remainder: number
}

interface Day14Style {
  height: number
  solid: boolean
}

function ease(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const emptyBars = (): BarState[] =>
  Array.from({ length: DAYS }, () => ({
    advance: 0,
    deferred: 0,
    payout: 0,
    remainder: 0,
  }))

/**
 * Splits a total bar height into advance/deferred portions based on the rate
 * (percentage unlocked daily). Advance takes `rate%` of the total, deferred
 * the remainder.
 */
const splitByRate = (total: number, rate: number) => ({
  advance: (total * rate) / 100,
  deferred: (total * (100 - rate)) / 100,
})

interface DailyPayoutAnimationProps {
  /** Advance rate as a percentage (e.g. 80 for 80%). */
  rate: number
}

const DailyPayoutAnimation = ({ rate }: DailyPayoutAnimationProps) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.dailyPayout.animation",
  })

  const rateLabel = formatAsPercentage(rate, 4, { removeTrailingZeros: true })

  const stepMessages = useMemo(
    () => [
      t("step1"),
      t("step2", { rate: rateLabel }),
      t("step3", { rate: rateLabel }),
      t("step4"),
      t("step5"),
    ],
    [t, rateLabel]
  )

  const legendItems = useMemo(
    () => [
      {
        style: { backgroundColor: COLORS.payout },
        label: t("legendMarketplacePayout"),
      },
      {
        style: ADVANCE_STRIPE_STYLE,
        label: t("legendDailyPayout"),
      },
      {
        style: { backgroundColor: COLORS.deferred },
        label: t("legendDeferredBalancePayout"),
      },
    ],
    [t]
  )

  const [bars, setBars] = useState<BarState[]>(emptyBars)
  const [stepMsgIndex, setStepMsgIndex] = useState(0)
  const [msgOpacity, setMsgOpacity] = useState(1)
  const [activationLineOpacity, setActivationLineOpacity] = useState(0)
  const [day14Style, setDay14Style] = useState<Day14Style>({
    height: 0,
    solid: false,
  })

  const cancelledRef = useRef(false)
  const barsRef = useRef<BarState[]>(emptyBars())

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (cancelledRef.current) {
            reject(new Error("cancelled"))
          } else {
            resolve()
          }
        }, ms)
      }),
    []
  )

  const tween = useCallback(
    (duration: number, stepFn: (t: number) => void) =>
      new Promise<void>((resolve, reject) => {
        const start = performance.now()
        function frame(now: number) {
          if (cancelledRef.current) {
            reject(new Error("cancelled"))
            return
          }
          const t = Math.min(1, (now - start) / duration)
          stepFn(t)
          if (t < 1) {
            requestAnimationFrame(frame)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(frame)
      }),
    []
  )

  const flushBars = useCallback(() => {
    setBars([...barsRef.current])
  }, [])

  const clearAll = useCallback(() => {
    barsRef.current = emptyBars()
    setBars([...barsRef.current])
    setActivationLineOpacity(0)
    setDay14Style({ height: 0, solid: false })
  }, [])

  const setMsg = useCallback(
    async (index: number) => {
      setMsgOpacity(0)
      await wait(250)
      setStepMsgIndex(index)
      setMsgOpacity(1)
    },
    [wait]
  )

  const animate = useCallback(async () => {
    try {
      clearAll()
      setDay14Style({ height: 100, solid: false })
      setStepMsgIndex(0)
      setMsgOpacity(1)
      await wait(3800)

      await setMsg(1)
      await wait(400)

      await tween(400, (t) => {
        setActivationLineOpacity(t)
      })
      await wait(800)

      const { advance: day5Advance, deferred: day5Deferred } = splitByRate(
        60,
        rate
      )
      await tween(1800, (t) => {
        const e = ease(t)
        barsRef.current[5] = {
          ...barsRef.current[5],
          advance: day5Advance * e,
          deferred: day5Deferred * e,
        }
        flushBars()
      })
      await wait(3500)

      await setMsg(2)
      await wait(600)

      const dailyTotal = 10
      const { advance: dailyAdvance, deferred: dailyDeferred } = splitByRate(
        dailyTotal,
        rate
      )

      const outlineStart = 100 - dailyTotal

      for (let dayIdx = 6; dayIdx <= 13; dayIdx++) {
        const isDay14Bar = dayIdx === 13
        await tween(350, (t) => {
          const e = ease(t)
          barsRef.current[dayIdx] = {
            ...barsRef.current[dayIdx],
            advance: dailyAdvance * e,
            deferred: dailyDeferred * e,
          }
          flushBars()
          if (isDay14Bar) {
            setDay14Style({
              height: 100 - (100 - outlineStart) * e,
              solid: false,
            })
          }
        })
        if (!isDay14Bar) await wait(200)
      }
      await wait(3200)

      await setMsg(3)
      await wait(600)

      const yellowPct = 100 - rate

      await tween(800, (t) => {
        const e = ease(t)
        setDay14Style({
          height: outlineStart - (outlineStart - yellowPct) * e,
          solid: true,
        })
      })
      await wait(3000)

      await setMsg(4)
      await wait(600)

      await tween(350, (t) => {
        const e = ease(t)
        barsRef.current[14] = {
          ...barsRef.current[14],
          advance: dailyAdvance * e,
          deferred: dailyDeferred * e,
        }
        flushBars()
      })
      await wait(200)
      await wait(3500)

      if (!cancelledRef.current) {
        animate()
      }
    } catch {
      // cancelled on unmount
    }
  }, [clearAll, wait, tween, setMsg, flushBars, rate])

  useEffect(() => {
    cancelledRef.current = false
    animate()
    return () => {
      cancelledRef.current = true
    }
  }, [animate])

  return (
    <div className="shadow-light-sm border-card relative h-115 w-full overflow-hidden rounded-xl bg-white">
      <div className="absolute inset-0 flex flex-col justify-center px-7">
        <div
          className="text-text-primary -mt-1.25 mb-5 min-h-13 text-base leading-normal font-normal transition-opacity duration-200"
          style={{ opacity: msgOpacity }}
        >
          <SanitizedHtml as="span" content={stepMessages[stepMsgIndex]} />
        </div>
        <div className="relative flex h-73.75 items-end">
          {bars.map((bar, i) => {
            const advH = (bar.advance / 100) * MAX_H
            const defH = (bar.deferred / 100) * MAX_H
            const payH = i !== 13 ? (bar.payout / 100) * MAX_H : 0
            const remH = (bar.remainder / 100) * MAX_H
            return (
              <div
                key={i}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >
                <div className="relative w-[55%] overflow-hidden rounded-t-[3px]">
                  <div
                    style={{
                      height: remH,
                      backgroundColor: COLORS.remainder,
                    }}
                    className="w-full"
                  />
                  {i === 13 ? (
                    <div
                      style={{
                        height: (day14Style.height / 100) * MAX_H,
                        ...(day14Style.solid
                          ? { backgroundColor: COLORS.payout }
                          : PAYOUT_STRIPE_STYLE),
                      }}
                      className="w-full"
                    />
                  ) : (
                    <div
                      style={{
                        height: payH,
                        backgroundColor: COLORS.payout,
                      }}
                      className="w-full"
                    />
                  )}
                  <div
                    style={{
                      height: defH,
                      backgroundColor: COLORS.deferred,
                    }}
                    className="w-full"
                  />
                  <div
                    style={{
                      height: advH,
                      ...ADVANCE_STRIPE_STYLE,
                    }}
                    className="w-full"
                  />
                </div>
                <div className="text-text-secondary w-full border-t border-neutral-400 pt-2 text-center text-sm leading-snug font-normal">
                  {i < 14 ? t("dayLabel") : ""}
                  <br />
                  {i < 14 ? i + 1 : "..."}
                </div>
              </div>
            )
          })}
          <div
            className="absolute top-0 bottom-0 left-[calc(33.33%-1px)] z-2"
            style={{ opacity: activationLineOpacity }}
          >
            <p className="text-text-secondary absolute top-2.5 w-30 -translate-x-1/2 text-center text-sm leading-normal font-normal">
              {t("activationLabel")}
            </p>
            <div className="absolute top-13.5 bottom-11.75 left-0 border-l border-neutral-400" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className="text-text-primary flex items-center gap-2 text-sm font-semibold"
            >
              <div
                className="size-3.5 shrink-0 rounded-sm"
                style={item.style}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyPayoutAnimation
