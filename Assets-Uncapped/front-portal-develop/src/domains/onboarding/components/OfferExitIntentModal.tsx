/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCallback, useEffect, useState } from "react"
import { Close } from "@material-ui/icons"
import { Widget } from "@typeform/embed-react"
import clsx from "clsx"
import { useParams } from "react-router"
import { useLocalStorage } from "usehooks-ts"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import { useHubspotCalendarLink } from "../../../hooks/useHubspotCalendarLink"
import { useTracking } from "../../../hooks/useTracking"
import useOffers from "../hooks/useOffers"

const TYPEFORM_FORM_ID = "g5xSSqfx"

const OfferExitIntentModal = () => {
  const [visible, setVisible] = useState(false)
  const offers = useOffers()
  const auth = useAuth()
  const { isMobile } = useDevice()
  const { trackEvent } = useTracking()
  const [feedback, setFeedback] = useLocalStorage<Record<string, boolean>>(
    "offersExintModalFeedbackGiven",
    {}
  )
  const { offerId } = useParams()
  const calendarLink = useHubspotCalendarLink()

  useEffect(() => {
    if (visible) {
      trackEvent({
        category: "onboarding",
        name: "offers",
        action: "exit-intent-opened",
      })
    }
  }, [visible])

  const onEndingButtonClick = useCallback(() => {
    setFeedback({ ...feedback, [offerId!]: true })

    trackEvent({
      category: "onboarding",
      name: "offers",
      action: "exit-intent-cta",
    })

    const link =
      calendarLink.link ||
      "https://meetings.hubspot.com/julia-souto-ribeiro/explore-call-us-150k-250k"
    window.open(link, "_blank", "noopener,noreferrer")
  }, [])

  const handleClose = useCallback(() => {
    setVisible(false)
    setFeedback({ ...feedback, [offerId!]: true })
  }, [feedback, offerId])

  const onSubmit = useCallback(() => {
    trackEvent({
      category: "onboarding",
      name: "offers",
      action: "exit-intent-submitted",
    })
  }, [])

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !visible) {
        setVisible(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [visible])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [visible, handleClose])

  if (
    offers.selectedOffer ||
    offers.signeableOffers.length === 0 ||
    feedback[offerId!]
  ) {
    return null
  }

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 transition-all duration-200",
        {
          "pointer-events-auto opacity-100": visible,
          "pointer-events-none opacity-0": !visible,
        }
      )}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && visible) {
          handleClose()
        }
      }}
    >
      <div
        className={clsx(
          "rounded-card-md relative max-h-[80vh] w-[90%] max-w-[400px] overflow-hidden shadow-xl transition-transform duration-200",
          {
            "scale-100": visible,
            "scale-95": !visible,
          },
          {
            "w-full max-w-none rounded-none": isMobile,
          }
        )}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 flex size-8 items-center justify-center text-white opacity-80 transition-all hover:opacity-100"
          aria-label="Close modal"
        >
          <Close fontSize="small" />
        </button>
        <Widget
          id={TYPEFORM_FORM_ID}
          style={{ minHeight: 500, width: "100%" }}
          hidden={{
            org: auth.organisation?.organisationId!,
          }}
          onSubmit={onSubmit}
          onEndingButtonClick={onEndingButtonClick}
        />
      </div>
    </div>
  )
}

export default OfferExitIntentModal
