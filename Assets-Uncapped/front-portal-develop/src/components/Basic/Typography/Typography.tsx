import React from "react"
import clsx from "clsx"
import { ColorTypes } from "../../../types/Color.types"
import { getTextColorClass } from "../../../utils/colors"

export const TYPOGRAPHY_TYPES = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "bodyTitle",
  "bodyMedium",
  "tableHeader",
  "tableValue",
  "tableLink",
  "link",
  "body",
  "smallTitle",
  "smallCopy",
  "footnote",
] as const

export type TypographyTypes = (typeof TYPOGRAPHY_TYPES)[number]

const typographyStyles: Record<TypographyTypes, string> = {
  h1: "font-heading text-[56px] font-semibold leading-[1.3]",
  h2: "font-heading text-[48px] font-semibold leading-[1.3]",
  h3: "font-heading text-[40px] font-semibold leading-[1.3]",
  h4: "font-heading text-[32px] font-semibold leading-[1.3]",
  h5: "font-heading text-[24px] font-semibold leading-[1.3]",
  h6: "font-primary text-[20px] font-semibold leading-[1.3]",
  bodyTitle: "font-primary text-[16px] font-bold",
  bodyMedium: "font-primary text-[16px] font-semibold",
  tableHeader: "font-primary text-[14px] font-bold",
  tableValue: "font-primary text-[14px] font-normal",
  tableLink: "font-primary text-[14px] font-bold",
  link: "font-primary text-[16px] font-bold",
  body: "font-primary text-[16px] font-normal [&_a]:font-bold [&_a]:text-brand-600 [&_a]:no-underline",
  smallTitle: "font-primary text-[14px] font-bold",
  smallCopy:
    "font-primary text-[14px] font-normal [&_a]:font-bold [&_a]:text-brand-600 [&_a]:no-underline",
  footnote: "font-primary text-[12px] font-normal",
}

interface ITypography {
  children: React.ReactNode
  type?: TypographyTypes
  color?: ColorTypes
  className?: string
  tag?: React.ElementType
  strikethrough?: boolean
  id?: string
}

const Typography = ({
  children,
  type = "body",
  color = "neutral-800",
  className,
  tag,
  strikethrough = false,
  id,
  ...rest
}: ITypography) => {
  const headerArray: string[] = ["h1", "h2", "h3", "h4", "h5", "h6"]
  const isHeader = headerArray.includes(type)
  const style = clsx(
    typographyStyles[type],
    getTextColorClass(color),
    strikethrough && "line-through",
    className
  )
  // CustomTag is only used when isHeader or tag is provided
  // When isHeader is true, type is one of h1-h6 which are valid HTML elements
  const CustomTag = (tag ?? type) as React.ElementType

  return isHeader || tag ? (
    <CustomTag className={style} id={id} {...rest}>
      {children}
    </CustomTag>
  ) : (
    <p className={style} id={id} {...rest}>
      {children}
    </p>
  )
}

export default Typography
