// Acceptance-flow shell.
//
// Given an array of OfferModule, builds the multi-step page:
//   1. One config step per offer (in order) — renders module.ConfigContent + module.RightPanel
//   2. Sign agreements step — N agreement rows (one per offer) with progressive unlocking
//   3. Sign agreements done — verify-owners CTA
//
// The shell renders:
//   - Sidebar nav (desktop) and mobile top bar
//   - Top-right CTAs (Book a call + Invite team)
//   - Continue / Back buttons (inline on desktop, sticky on mobile)
//   - "What happens next?" + "To sign" cards on the sign step
//   - Agreement summary card in the right panel during the sign step
//
// Each offer module owns its config-screen state internally — the shell
// doesn't thread state across modules.

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle02SolidStandard,
  ArrowRight01SolidStandard,
  ArrowLeft01SolidStandard,
  Call02SolidStandard,
  UserMultiple02SolidStandard,
  Logout03SolidStandard,
  PencilEdit02SolidStandard,
  SquareLock02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import {
  MoneyBag02SolidRounded,
  FlashSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Logo from "../../../components/UI/Logo"
import { SectionCardHeader } from "./_shared/primitives"
import { AgreementListItem } from "./_shared/agreement-list-item"
import { AgreementSummaryCard } from "./_shared/agreement-summary"
import { DpAddOnBanner } from "./_shared/dp-addon-banner"
import type { OfferModule } from "./_types"

// Map a single-offer scenario to the +DP variant route, used by the
// "Add Daily Payouts" banner on the right panel.
const DP_UPGRADE_ROUTE: Record<string, string> = {
  "term-loan": "/prototypes/accept-term-loan-daily-payouts",
  "cash-advance": "/prototypes/accept-cash-advance-daily-payouts",
}

// ---------------------------------------------------------------------------
// Step model
// ---------------------------------------------------------------------------

type NavStepState = "complete" | "active" | "todo"

// We use a flat string id for the active step. The shell knows the order from
// the offers array + the fixed [sign, verify, withdraw] suffix steps.
type StepId =
  | { kind: "config"; offerIndex: number }
  | { kind: "sign-agreements" }
  | { kind: "sign-agreements-done" } // entered after all agreements signed

// ---------------------------------------------------------------------------
// Sidebar nav item (clickable when not active)
// ---------------------------------------------------------------------------

const SidebarNavItem = ({
  label,
  state,
  badge,
  onClick,
}: {
  label: string
  state: NavStepState
  badge?: string
  onClick?: () => void
}) => {
  const isActive = state === "active"
  const isComplete = state === "complete"
  const isClickable = Boolean(onClick) && !isActive

  const sharedClasses = [
    "flex h-[38px] w-full items-center gap-1 rounded-lg px-2 text-left transition-all duration-150",
    isActive ? "shadow-light-sm" : "",
    isClickable ? "cursor-pointer hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none" : "",
  ].join(" ")

  const Wrapper: any = isClickable ? "button" : "div"

  return (
    <Wrapper
      type={isClickable ? "button" : undefined}
      onClick={isClickable ? onClick : undefined}
      className={sharedClasses}
      aria-current={isActive ? "step" : undefined}
      style={isActive ? { backgroundColor: "#fbfaf9" } : undefined}
    >
      {isComplete ? (
        <HugeiconsIcon icon={CheckmarkCircle02SolidStandard} className="size-6 shrink-0" style={{ color: "#128081" }} />
      ) : isActive ? (
        <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd"
              d="M9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0ZM9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2Z"
              fill="#FFC266" />
            <path d="M8.99902 3.66699C11.9444 3.66715 14.3319 6.05466 14.332 9C14.3318 11.8532 12.0911 14.1842 9.27344 14.3271L8.99902 14.334V3.66699Z" fill="#FFC266" />
          </svg>
        </span>
      ) : (
        <span className="flex size-6 shrink-0 items-center justify-center" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="#c1cacd" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        </span>
      )}
      <Typography
        type="body"
        color="neutral-800"
        className={[badge ? "px-2" : "flex-1 px-2", isActive ? "font-semibold" : ""].join(" ")}
      >
        {label}
      </Typography>
      {badge && (
        <span
          className="inline-flex h-5 items-center justify-center rounded-full border px-2"
          style={{ backgroundColor: "#f1f9f9", borderColor: "#c1e5e6" }}
        >
          <span className="font-primary text-[12px] font-semibold leading-none" style={{ color: "#128081" }}>
            {badge}
          </span>
        </span>
      )}
      {badge && <span className="flex-1" aria-hidden />}
    </Wrapper>
  )
}

// ---------------------------------------------------------------------------
// Mobile top bar
// ---------------------------------------------------------------------------

const MobileTopBar = ({
  activeOfferIndex,
  isSignStep,
  offers,
}: {
  activeOfferIndex: number | null
  isSignStep: boolean
  offers: OfferModule[]
}) => {
  const activeLabel = isSignStep
    ? "Sign agreements"
    : activeOfferIndex !== null
    ? offers[activeOfferIndex].navLabel
    : ""

  return (
    <header
      className="sticky top-0 z-30 flex flex-col gap-y-3 border-b border-neutral-200 bg-white px-4 pb-3 pt-3 xl:hidden"
      aria-label="Application progress"
    >
      <div className="relative flex h-9 items-center justify-center">
        <Logo link={false} className="h-6 w-auto" />
        <button
          type="button"
          className="absolute right-0 flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
          aria-label="More options"
        >
          <span aria-hidden className="flex items-center gap-x-[3px]">
            <span className="size-1 rounded-full bg-neutral-700" />
            <span className="size-1 rounded-full bg-neutral-700" />
            <span className="size-1 rounded-full bg-neutral-700" />
          </span>
        </button>
      </div>

      <nav className="flex items-center gap-x-2 overflow-x-auto" aria-label="Application steps">
        <button
          type="button"
          onClick={() => (window.location.href = "/prototypes/multi-offers")}
          className="flex h-9 shrink-0 items-center gap-x-2 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
          aria-label="Back to Your Offers"
        >
          <HugeiconsIcon icon={CheckmarkCircle02SolidStandard} className="size-5 shrink-0" style={{ color: "#128081" }} />
          <span className="font-primary text-[14px] font-medium text-neutral-800">Your Offers</span>
        </button>
        <div
          className="flex h-9 shrink-0 items-center gap-x-2 rounded-lg px-2 shadow-light-sm"
          aria-current="step"
          style={{ backgroundColor: "#fbfaf9" }}
        >
          <BoxIcon
            icon={
              <HugeiconsIcon
                icon={
                  isSignStep
                    ? PencilEdit02SolidStandard
                    : offers[activeOfferIndex ?? 0]?.id === "daily-payouts"
                    ? FlashSolidRounded
                    : MoneyBag02SolidRounded
                }
                size={14}
              />
            }
            severity="accent-2"
            size={6}
          />
          <span className="font-primary text-[14px] font-semibold text-neutral-800">{activeLabel}</span>
        </div>
      </nav>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Sign-agreements main column (built from offer list + signedCount)
// ---------------------------------------------------------------------------

const SignAgreementsContent = ({
  offers,
  signedCount,
  onSign,
  onContinue,
}: {
  offers: OfferModule[]
  signedCount: number
  onSign: () => void
  onContinue: () => void
}) => {
  const isDone = signedCount === offers.length

  // "What happens next?" bullets — generated based on count + progress
  const bullets: string[] = []
  bullets.push(
    offers.length === 1
      ? "Review the agreement carefully before signing."
      : "Review each agreement carefully before signing."
  )
  if (offers.length > 1) {
    bullets.push(
      `Sign the ${offers[0].agreementName} first — your ${offers[1].agreementName} becomes available once it's signed.`
    )
  }
  bullets.push(
    offers.length === 1
      ? "Once signed, you'll move on to verifying your identity."
      : `Once ${offers.length === 2 ? "both" : "all"} are signed, you'll move on to verifying your identity.`
  )

  return (
    <div className="flex flex-col gap-y-4">
      <Typography type="h3" color="neutral-800">
        {isDone ? "Agreements signed" : "Review and sign agreement"}
      </Typography>

      {/* Done banner */}
      {isDone && (
        <div
          className="flex items-center gap-2 rounded-xl border px-3 py-2"
          style={{ backgroundColor: "#eaf6f6", borderColor: "#c1e5e6" }}
        >
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-md border"
            style={{ backgroundColor: "#eaf6f6", borderColor: "#c1e5e6" }}
          >
            <HugeiconsIcon icon={CheckmarkCircle02SolidStandard} size={14} style={{ color: "#128081" }} />
          </span>
          <p className="text-[14px] leading-[1.5]" style={{ color: "#374d53" }}>
            {offers.length === 1 ? "Agreement signed." : `${offers.length === 2 ? "Both" : "All"} agreements signed.`}{" "}
            You&rsquo;re ready to verify your identity.
          </p>
        </div>
      )}

      {/* What happens next */}
      {!isDone && (
        <div className="overflow-hidden rounded-xl shadow-light-sm">
          <SectionCardHeader
            icon={<HugeiconsIcon icon={CheckmarkCircle02SolidStandard} size={14} style={{ color: "#128081" }} />}
            title="What happens next?"
            accentBg="#eaf6f6"
            accentBorder="#c1e5e6"
          />
          <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
            <div className="flex flex-col gap-3">
              {bullets.map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#eaf6f6" }}
                    aria-hidden
                  >
                    <HugeiconsIcon icon={CheckmarkCircle02SolidStandard} size={12} style={{ color: "#128081" }} />
                  </span>
                  <Typography type="body" color="neutral-700">{text}</Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* To sign — one row per offer */}
      <div className="overflow-hidden rounded-xl shadow-light-sm">
        <SectionCardHeader
          icon={<HugeiconsIcon icon={PencilEdit02SolidStandard} size={14} style={{ color: "#7286f6" }} />}
          title={isDone ? "Signed agreements" : "To sign"}
          accentBg="#f0f2fe"
          accentBorder="#d5dbfb"
        />
        <div className="px-4 py-4" style={{ backgroundColor: "#fbfaf9" }}>
          <div className="flex flex-col gap-2 overflow-hidden rounded-lg bg-white p-1 shadow-light-sm">
            {offers.map((offer, i) => {
              const isSigned = i < signedCount
              const isPending = i === signedCount
              const isLocked = i > signedCount
              return (
                <AgreementListItem
                  key={offer.id}
                  title={offer.agreementName}
                  chipLabel={
                    isSigned
                      ? "Signed"
                      : isPending
                      ? "Pending signature"
                      : `Available after ${offers[i - 1].agreementName} is signed`
                  }
                  chipTone={isSigned ? "success" : "default"}
                  disabled={isLocked}
                  action={
                    isSigned ? (
                      <HugeiconsIcon icon={CheckmarkCircle02SolidStandard} size={20} style={{ color: "#128081" }} />
                    ) : isPending ? (
                      <Button type="button" variant="primary" size="sm" onClick={onSign}>
                        Sign
                      </Button>
                    ) : (
                      <HugeiconsIcon icon={SquareLock02SolidStandard} size={20} style={{ color: "#879092" }} />
                    )
                  }
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Continue CTA when all signed (right-aligned on desktop) */}
      {isDone && (
        <div className="hidden justify-end pt-4 xl:flex">
          <Button type="button" variant="primary" onClick={onContinue}>
            Continue
            <HugeiconsIcon icon={ArrowRight01SolidStandard} className="ml-1 size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Acceptance-flow shell
// ---------------------------------------------------------------------------

type AcceptanceFlowProps = {
  offers: OfferModule[]
}

const AcceptanceFlow = ({ offers }: AcceptanceFlowProps) => {
  const [step, setStep] = useState<StepId>({ kind: "config", offerIndex: 0 })
  const [signedCount, setSignedCount] = useState(0)

  const isConfigStep = step.kind === "config"
  const isSignStep = step.kind === "sign-agreements"
  const activeOfferIndex = isConfigStep ? step.offerIndex : null

  // ── Nav states for sidebar ────────────────────────────────────────────────
  const offerNavStates: NavStepState[] = offers.map((_, i) => {
    if (isConfigStep) return i === step.offerIndex ? "active" : i < step.offerIndex ? "complete" : "todo"
    if (isSignStep) return "complete"
    return "complete"
  })
  const signNavState: NavStepState = isSignStep ? "active" : "todo"

  // ── Navigation handlers ──────────────────────────────────────────────────
  const handleContinue = () => {
    if (isConfigStep) {
      if (step.offerIndex < offers.length - 1) {
        setStep({ kind: "config", offerIndex: step.offerIndex + 1 })
      } else {
        setStep({ kind: "sign-agreements" })
      }
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBack = () => {
    if (isConfigStep && step.offerIndex > 0) {
      setStep({ kind: "config", offerIndex: step.offerIndex - 1 })
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSign = () => {
    setSignedCount((n) => Math.min(n + 1, offers.length))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleVerify = () => {
    // No-op placeholder — verify-owners screen not built yet
  }

  const navigateToOfferConfig = (index: number) => {
    setStep({ kind: "config", offerIndex: index })
    setSignedCount(0)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const showBackToOffers = isConfigStep && step.offerIndex === 0
  const showBackButton = isConfigStep && step.offerIndex > 0
  const showContinueButton = isConfigStep

  // CTA label confirms the current offer on every config step — e.g.
  // "Confirm Term Loan" on the TL step, "Confirm Daily Payout" on the DP
  // step. Pressing it advances to the next config step or to sign agreements.
  const continueLabel = isConfigStep
    ? `Confirm ${offers[step.offerIndex].navLabel}`
    : "Continue"

  // ── Right panel content ──────────────────────────────────────────────────
  // Agreement summary is shown across config AND sign steps. On a single-offer
  // config flow we also show the "Add Daily Payouts" upsell banner.
  const hasDailyPayouts = offers.some((o) => o.id === "daily-payouts")
  const activeOfferId = isConfigStep ? offers[step.offerIndex].id : null
  const dpUpgradeRoute = activeOfferId ? DP_UPGRADE_ROUTE[activeOfferId] : undefined
  const showDpBanner = isConfigStep && !hasDailyPayouts && Boolean(dpUpgradeRoute)

  const ConfigRightPanel = isConfigStep ? offers[step.offerIndex].RightPanel : undefined

  // Re-key the summary card whenever the active step changes so the per-block
  // expand state resets to the new default ("active offer expanded, rest
  // collapsed" on config steps; "everything collapsed" on the sign step).
  const summaryKey = isConfigStep ? `config:${activeOfferId}` : "sign"

  const rightPanelContent = (
    <>
      {ConfigRightPanel && <ConfigRightPanel />}
      <AgreementSummaryCard
        key={summaryKey}
        offers={offers}
        activeOfferId={activeOfferId}
        footer={
          showDpBanner ? (
            <DpAddOnBanner onAdd={() => { window.location.href = dpUpgradeRoute! }} />
          ) : null
        }
      />
    </>
  )

  // ── Main column content ──────────────────────────────────────────────────
  let mainContent: React.ReactNode
  if (isConfigStep) {
    const Config = offers[step.offerIndex].ConfigContent
    mainContent = <Config />
  } else if (isSignStep) {
    mainContent = (
      <SignAgreementsContent
        offers={offers}
        signedCount={signedCount}
        onSign={handleSign}
        onContinue={handleVerify}
      />
    )
  }

  const mainAriaLabel = isSignStep
    ? "Sign agreements"
    : isConfigStep
    ? `${offers[step.offerIndex].navLabel} configuration`
    : "Acceptance flow"

  const rightPanelTopActions = (
    <div className="flex flex-wrap justify-end gap-x-1">
      <button
        type="button"
        className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
      >
        <BoxIcon icon={<HugeiconsIcon icon={Call02SolidStandard} size={16} />} severity="accent-brand" size={6} />
        <Typography type="body" color="neutral-800" className="px-2">Book a call</Typography>
      </button>
      <button
        type="button"
        className="flex h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none"
      >
        <BoxIcon icon={<HugeiconsIcon icon={UserMultiple02SolidStandard} size={16} />} severity="accent-9" size={6} />
        <Typography type="body" color="neutral-800" className="px-2">Invite team</Typography>
      </button>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-surface-canvas">
      <MobileTopBar
        activeOfferIndex={activeOfferIndex}
        isSignStep={isSignStep}
        offers={offers}
      />

      <div className="flex items-start px-4 pb-8 pt-4 xl:px-10 xl:pb-10 xl:pt-10">
        {/* Sidebar — desktop only */}
        <aside className="hidden w-[318px] shrink-0 flex-col justify-between self-stretch pr-12 xl:flex">
          <div className="flex flex-col gap-y-8">
            <div className="px-2 pt-2">
              <Logo link={false} className="h-10 w-auto" />
            </div>
            <nav className="flex flex-col gap-y-1" aria-label="Application steps">
              <SidebarNavItem label="Your application" state="complete" />
              <SidebarNavItem
                label="Your Offers"
                state="complete"
                badge="3"
                onClick={() => (window.location.href = "/prototypes/multi-offers")}
              />
              {offers.map((offer, i) => (
                <SidebarNavItem
                  key={offer.id}
                  label={offer.navLabel}
                  state={offerNavStates[i]}
                  onClick={offerNavStates[i] === "complete" ? () => navigateToOfferConfig(i) : undefined}
                />
              ))}
              <SidebarNavItem label="Sign agreements" state={signNavState} />
              <SidebarNavItem label="Verify owners" state="todo" />
              <SidebarNavItem label="Withdraw & ACH Debit" state="todo" />
            </nav>
          </div>
        </aside>

        {/* Log out — fixed to viewport bottom-left so it stays at the same
            position across every page regardless of content height (desktop only). */}
        <button
          type="button"
          className="fixed bottom-10 left-10 z-20 hidden h-[38px] items-center gap-x-1 rounded-lg px-2 transition-colors hover:bg-neutral-100 focus-visible:shadow-focus focus:outline-none xl:flex"
        >
          <BoxIcon icon={<HugeiconsIcon icon={Logout03SolidStandard} size={16} />} severity="accent-2" size={6} />
          <Typography type="body" color="neutral-800" className="px-2">Log out</Typography>
        </button>

        {/* Main 2-column area */}
        <div className="flex flex-1 flex-col gap-y-4 xl:flex-row xl:gap-x-6 xl:gap-y-0">
          {/* Col 2: main content */}
          <main
            key={`${step.kind}-${activeOfferIndex ?? ""}-${signedCount}`}
            className="flex flex-1 flex-col gap-y-0 pb-24 xl:pb-0 animate-[fadeSlideIn_0.2s_ease-out]"
            aria-label={mainAriaLabel}
            style={{ animationFillMode: "both" }}
          >
            {mainContent}

            {/* CTA row — desktop inline (config steps only) */}
            {(showContinueButton || showBackButton || showBackToOffers) && (
              <div className="hidden items-center justify-between gap-x-4 pt-4 xl:flex">
                {showBackButton ? (
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    <HugeiconsIcon icon={ArrowLeft01SolidStandard} className="mr-1 size-4" />
                    Back
                  </Button>
                ) : showBackToOffers ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => (window.location.href = "/prototypes/multi-offers")}
                  >
                    <HugeiconsIcon icon={ArrowLeft01SolidStandard} className="mr-1 size-4" />
                    Back to Offers
                  </Button>
                ) : (
                  <span />
                )}
                {showContinueButton && (
                  <Button type="button" variant="primary" onClick={handleContinue}>
                    {continueLabel}
                    <HugeiconsIcon icon={ArrowRight01SolidStandard} className="ml-1 size-4" />
                  </Button>
                )}
              </div>
            )}
          </main>

          {/* Col 3: right panel — desktop only */}
          <aside className="hidden w-[400px] shrink-0 flex-col gap-y-6 xl:flex" aria-label="Offer context">
            {rightPanelTopActions}
            {rightPanelContent}
          </aside>
        </div>
      </div>

      {/* Sticky bottom CTA — mobile/tablet only */}
      {(showContinueButton || showBackButton || showBackToOffers) && (
        <div
          className="fixed bottom-0 left-0 right-0 z-30 flex w-full items-center justify-between gap-x-4 px-4 pb-4 pt-8 xl:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(247, 244, 242, 0) 0%, rgba(255, 255, 255, 0.92) 45%, rgba(255, 255, 255, 1) 100%)",
          }}
        >
          {showBackButton ? (
            <Button type="button" variant="secondary" onClick={handleBack}>
              <HugeiconsIcon icon={ArrowLeft01SolidStandard} className="mr-1 size-4" />
              Back
            </Button>
          ) : showBackToOffers ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => (window.location.href = "/prototypes/multi-offers")}
            >
              <HugeiconsIcon icon={ArrowLeft01SolidStandard} className="mr-1 size-4" />
              Back to Offers
            </Button>
          ) : (
            <span />
          )}
          {showContinueButton && (
            <Button type="button" variant="primary" onClick={handleContinue}>
              <span className="xl:hidden">{continueLabel}</span>
              <HugeiconsIcon icon={ArrowRight01SolidStandard} className="ml-1 size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default AcceptanceFlow
