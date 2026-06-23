import { camelCase, startCase } from "lodash-es"

export const titleCase = (text?: string) => startCase(camelCase(text || ""))

export const ucwords = (text?: string) => {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export const removeDashes = (text: string | undefined) => {
  if (!text) {
    return ""
  }
  if (text.includes("-")) {
    return text.replaceAll("-", "")
  }
  return text
}

export function toReadableList(list: string[]) {
  const last = list.pop()
  return list.length > 0 ? `${list.join(", ")} & ${last}` : last
}

export const initials = (text: string) => {
  return text
    .match(/(\b\S)?/g)
    ?.join("")
    .toUpperCase()
}

export const getTextSuggestions = (text: string, searchQuery: string) => {
  if (!searchQuery) return text

  const escapedQuery = searchQuery
    .trim()
    .replaceAll(/[-/\\^$*+?.()|[\]{}]/g, String.raw`\$&`)

  return text.replace(
    new RegExp(escapedQuery, "i"),
    (match) => `<mark>${match}</mark>`
  )
}

export const lowerCaseFirstLetter = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export const joinWithConjunction = (list: string[]) => {
  if (list.length === 0) return ""
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} and ${list[1]}`

  const last = list.pop()
  return `${list.join(", ")} and ${last}`
}

export const upperCaseFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
