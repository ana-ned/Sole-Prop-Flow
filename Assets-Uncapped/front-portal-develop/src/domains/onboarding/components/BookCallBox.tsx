import { useCallback, useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Call02SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader/PageLoader"
import Alert from "../../../components/UI/Alert"
import CardV2 from "../../../components/UI/CardV2"
import useHubspotCalendar from "../../../hooks/useHubspotCalendarEmbed"
import { useTracking } from "../../../hooks/useTracking"
import useUpdateOrganisationPreferences from "../../../hooks/useUpdateOrganisationPreferences"
import ErrorIndex from "../../../pages/error/_error"

const BookCallBox = ({ pageMode }: { pageMode?: boolean }) => {
  const { t } = useTranslation("common", {
    keyPrefix: "BookCallBox",
  })
  const organisationPreferencesMutation = useUpdateOrganisationPreferences()
  const { trackEvent } = useTracking()
  const [isCallBooked, setIsCallBooked] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const submitMeeting = useCallback(
    async (e: MessageEvent) => {
      if (e.data.meetingBookSucceeded) {
        setIsCallBooked(true)

        trackEvent({
          category: "onboarding",
          name: `book-call-box`,
          action: "meeting-booked",
          customFields: {
            path: location.pathname,
          },
        })

        await organisationPreferencesMutation.mutateAsync({
          exploreCallBooked: new Date(),
        })
      }
    },
    [location.pathname, organisationPreferencesMutation, trackEvent]
  )

  const { calendarLink, isBooked, isLoading } =
    useHubspotCalendar(submitMeeting)

  useEffect(() => {
    setIsCallBooked(isBooked)
  }, [isBooked])

  if (isLoading) {
    if (pageMode) {
      return <PageLoader />
    }
    return null
  }

  if (!calendarLink && !isBooked) {
    if (pageMode) {
      return <ErrorIndex type="404" />
    }

    return null
  }

  return (
    <CardV2
      severity="accent-2"
      icon={<HugeiconsIcon icon={Call02SolidRounded} />}
      title={t("title")}
    >
      <div className="space-y-3">
        <Typography>{t("content")}</Typography>

        {!isCallBooked && (
          <div
            className="meetings-iframe-container mx-auto -mt-2 h-[650px] w-full overflow-hidden md:-mb-6 md:h-[715px]"
            data-src={calendarLink}
          />
        )}

        {isCallBooked && (
          <Alert
            type="success"
            title={t("success.title")}
            layout="horizontal"
            button={
              pageMode &&
              location.pathname.includes("onboarding") && (
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  variant="primary"
                >
                  {t("success.button")}
                </Button>
              )
            }
          >
            <Typography>{t("success.content")}</Typography>
          </Alert>
        )}
      </div>
    </CardV2>
  )
}

export default BookCallBox
