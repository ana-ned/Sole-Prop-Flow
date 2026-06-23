import { useEffect } from "react"
import { isAfter, subHours } from "date-fns"
import { personalizeHubspotCalendarLink } from "../utils/url"
import useAuth from "./useAuth"
import { useHubspotCalendarLink } from "./useHubspotCalendarLink"

const useHubspotCalendar = (
  onSuccess?: (e: MessageEvent) => void | Promise<void>,
  customCalendar?: {
    userName?: string
    calendarName?: string
  }
) => {
  const auth = useAuth()
  const calendarLink = useHubspotCalendarLink()
  let customLink = ""

  if (customCalendar?.userName) {
    customLink = `https://meetings.hubspot.com/${customCalendar.userName}`
  }

  if (customCalendar?.calendarName) {
    customLink += `/${customCalendar.calendarName}`
  }

  // Don't use useScript hook for loading the js here
  // it will prevent binding of the iframe on mount
  useEffect(() => {
    // eslint-disable-next-line sonarjs/disabled-resource-integrity
    const script = document.createElement("script")
    script.src =
      "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
    script.async = true
    document.body.append(script)
    if (onSuccess) {
      window.addEventListener("message", onSuccess)
    }
    return () => {
      if (onSuccess) {
        window.removeEventListener("message", onSuccess)
      }
      script.remove()
    }
  }, [onSuccess])

  return {
    calendarLink: personalizeHubspotCalendarLink(
      customLink || calendarLink.link || "",
      auth.userData
    ),
    isLoading: calendarLink.isLoading || auth.isLoading,
    isBooked:
      auth.organisationData?.preferences?.exploreCallBooked &&
      isAfter(
        auth.organisationData.preferences.exploreCallBooked,
        subHours(new Date(), 48)
      ),
  }
}

export default useHubspotCalendar
