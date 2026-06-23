import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity03SolidRounded,
  MoneyBag02SolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import Chip from "../../../components/UI/Chip"
import Notice from "../../../components/UI/Notice"

// ---------------------------------------------------------------------------
// Mock data — no real API calls anywhere in this file
// ---------------------------------------------------------------------------

const OFFERS = [
  {
    id: "standard",
    label: "Standard",
    amount: "$150,000",
    fee: "$15,000",
    feePercent: "10%",
    totalRepay: "$165,000",
    rate: "10% of daily revenue",
    term: "Up to 12 months",
    badge: "Most popular",
  },
  {
    id: "flex",
    label: "Flex",
    amount: "$100,000",
    fee: "$8,000",
    feePercent: "8%",
    totalRepay: "$108,000",
    rate: "8% of daily revenue",
    term: "Up to 6 months",
    badge: null,
  },
]

const BENEFITS = [
  "Funds deposited within 24 hours of signing",
  "Repayments flex up and down with your daily revenue",
  "No personal guarantee required",
  "Pay off early at no extra cost",
]

const TERMS = (offer: (typeof OFFERS)[0]) => [
  { label: "Fixed fee", value: `${offer.fee} (${offer.feePercent})` },
  { label: "Total to repay", value: offer.totalRepay },
  { label: "Repayment", value: offer.rate },
  { label: "Term", value: offer.term },
]

// ---------------------------------------------------------------------------
// Offer screen prototype
// ---------------------------------------------------------------------------

const OfferScreen = () => {
  const [selectedId, setSelectedId] = useState("standard")
  const offer = OFFERS.find((o) => o.id === selectedId) ?? OFFERS[0]

  return (
    // Safe standalone wrapper — no auth, no API hooks
    <div className="min-h-screen w-full bg-surface-canvas">
      <div className="mx-auto max-w-xl px-6 py-10">
        <div className="flex flex-col gap-y-6">

          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-y-3">
            <div>
              <Chip label="Offer ready" color="success" />
            </div>
            <Typography type="h2">Your funding offer</Typography>
            <Typography type="body" color="neutral-700">
              Based on your revenue data, we&apos;re pleased to offer you working
              capital. Choose the option that suits your business best.
            </Typography>
          </div>

          {/* ── Offer selector pills ─────────────────────────────────────── */}
          <div className="flex gap-x-3">
            {OFFERS.map((o) => {
              const isActive = o.id === selectedId
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedId(o.id)}
                  className={[
                    "relative flex-1 rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer",
                    isActive
                      ? "border-brand-600 bg-white shadow-light-md"
                      : "border-neutral-200 bg-neutral-50 hover:border-neutral-300",
                  ].join(" ")}
                >
                  {o.badge && (
                    <span className="absolute -top-3 left-3 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                      {o.badge}
                    </span>
                  )}
                  <p
                    className={[
                      "text-xs font-semibold uppercase tracking-wide",
                      isActive ? "text-brand-600" : "text-neutral-500",
                    ].join(" ")}
                  >
                    {o.label}
                  </p>
                  <p
                    className={[
                      "mt-1 font-heading text-2xl font-semibold leading-none",
                      isActive ? "text-neutral-800" : "text-neutral-500",
                    ].join(" ")}
                  >
                    {o.amount}
                  </p>
                </button>
              )
            })}
          </div>

          {/* ── Offer card ───────────────────────────────────────────────── */}
          <div className="overflow-hidden rounded-2xl shadow-light-md">

            {/* Teal gradient header */}
            <div className="flex flex-col items-center gap-y-2 bg-gradient-to-br from-[#005570] to-[#1ebdc0] px-8 py-10 text-center">
              <HugeiconsIcon
                icon={MoneyBag02SolidRounded}
                className="mb-1 text-white/60"
                size={28}
              />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
                Approved funding amount
              </p>
              <p className="font-heading text-5xl font-extrabold leading-none text-white">
                {offer.amount}
              </p>
              <p className="text-sm text-white/70">
                Revenue-based repayment &middot; No personal guarantee
              </p>
            </div>

            {/* White body */}
            <div className="flex flex-col gap-y-5 bg-white px-6 py-6">

              {/* Key terms grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-canvas p-4">
                {TERMS(offer).map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-y-0.5">
                    <Typography type="footnote" color="neutral-500">
                      {label}
                    </Typography>
                    <Typography type="smallTitle" color="neutral-800">
                      {value}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-y-2">
                <Button type="button" variant="tertiary" fullWidth>
                  Accept this offer
                </Button>
                <Button type="button" variant="secondary" fullWidth>
                  Talk to our team first
                </Button>
              </div>

            </div>
          </div>

          {/* ── Expiry notice ────────────────────────────────────────────── */}
          <Notice
            variant="warning"
            icon={<HugeiconsIcon icon={Activity03SolidRounded} />}
          >
            This offer is valid until{" "}
            <strong className="font-semibold text-neutral-800">
              Friday 9 May 2026
            </strong>
            . After this date we will need to reassess your eligibility.
          </Notice>

          {/* ── Benefit list ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-y-3">
            <Typography type="smallTitle" color="neutral-700">
              What&apos;s included
            </Typography>
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-start gap-x-3">
                <div className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-200">
                  <div className="size-2 rounded-full bg-brand-600" />
                </div>
                <Typography type="smallCopy" color="neutral-700">
                  {benefit}
                </Typography>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default OfferScreen
