import { trim } from "lodash-es"
import { UserOverview } from "../services/api/organisation-users"

export const url = (path: string, absolute = false): string => {
  if (absolute) {
    return trim(`${globalThis.location.origin}/${trim(path, "/")}`, "/")
  }

  return trim(path, "/")
}

export const personalizeHubspotCalendarLink = (
  link: string,
  userData?: UserOverview
) => {
  if (!link) {
    return ""
  }

  if (!userData) {
    return link
  }

  const params = new URLSearchParams()

  if (userData.firstName) {
    params.set("firstName", userData.firstName)
  }
  if (userData.lastName) {
    params.set("lastName", userData.lastName)
  }
  if (userData.phone) {
    params.set("phone", userData.phone)
  }
  if (userData.email) {
    params.set("email", userData.email)
  }

  params.set("embed", "true")

  return `${link}?${params.toString()}`
}
