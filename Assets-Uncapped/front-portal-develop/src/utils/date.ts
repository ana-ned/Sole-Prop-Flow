import {
  format as formatter,
  parse,
  isYesterday,
  isToday,
  isTomorrow,
  setMonth,
  differenceInDays as differenceInDaysFns,
} from "date-fns"

export enum DateFormat {
  LONG = "long",
  MLONG = "mlong",
  MID = "mid",
  SMID = "smid",
  SHORT = "short",
  TIME = "time",
  DATETIME = "dateTime",
  TODAY = "today",
  YESTERDAY = "yesterday",
  TOMORROW = "tomorrow",
  SPLIT = "split",
}

export const getDateFormat = (format: DateFormat) => {
  const { language } = navigator
  const isUs = language.split("-")[1] === "US"

  const usFormat = {
    long: "EEEE, MMMM dd, yyyy",
    mlong: "E, MMM dd, yyyy",
    mid: "MMMM dd, yyyy",
    smid: "MMM dd, yyyy",
    short: "E, MMM dd, yyyy",
    time: "h:mm aaa",
    dateTime: "E, MMM dd, yyyy 'at' h:mm aaa",
    today: "'Today at' h:mm aaa",
    yesterday: "'Yesterday at' h:mm aaa",
    tomorrow: "'Tomorrow at' h:mm aaa",
    split: "MM/dd/yyyy",
  }

  const euFormat = {
    long: "EEEE dd MMMM, yyyy",
    mlong: "E dd MMM, yyy",
    mid: "dd MMMM, yyyy",
    smid: "dd MMM, yyyy",
    short: "E dd MMM, yyyy",
    time: "HH:mm",
    dateTime: "E, MMM dd, yyyy 'at' HH:mm",
    today: "'Today at' HH:mm",
    yesterday: "'Yesterday at' HH:mm",
    tomorrow: "'Tomorrow at' HH:mm",
    split: "dd/MM/yyyy",
  }

  return isUs ? usFormat[format] : euFormat[format]
}

export const formatDate = (
  date: Date,
  config: {
    format?: DateFormat
    customFormat?: string
    relative?: boolean
  } = {}
): string => {
  const { format = DateFormat.LONG, customFormat, relative = false } = config

  if (customFormat) {
    return formatter(date, customFormat)
  }

  if (isToday(date) && relative) {
    return format === DateFormat.SHORT
      ? "Today"
      : formatter(date, getDateFormat(DateFormat.TODAY))
  }

  if (isYesterday(date) && relative) {
    return format === DateFormat.SHORT
      ? "Yesterday"
      : formatter(date, getDateFormat(DateFormat.YESTERDAY))
  }

  if (isTomorrow(date) && relative) {
    return format === DateFormat.SHORT
      ? "Tomorrow"
      : formatter(date, getDateFormat(DateFormat.TOMORROW))
  }

  return formatter(date, getDateFormat(format))
}

export const intToMonth = (int: number): string => {
  const date = setMonth(new Date(), int)
  return formatter(date, "MMMM")
}

export const convertDateBetweenFormats = (
  date: string,
  entryFormat: string,
  outputFormat: string
) => {
  return formatter(parse(date, entryFormat, new Date()), outputFormat)
}

export const differenceInDays = (left: Date, right: Date) => {
  return differenceInDaysFns(left, right)
}
