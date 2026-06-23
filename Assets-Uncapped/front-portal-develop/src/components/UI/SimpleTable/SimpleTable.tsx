import React from "react"
import { cva, VariantProps } from "class-variance-authority"
import clsx from "clsx"
import { ColorTypes } from "../../../types/Color.types"
import { getTextColorClass } from "../../../utils/colors"

const wrapperVariants = cva("", {
  variants: {
    wrapped: {
      true: "mt-2 rounded-xl bg-white p-2 last:mb-6",
    },
    shadow: {
      true: "",
    },
  },
  compoundVariants: [
    {
      wrapped: true,
      shadow: true,
      class: "shadow-light-sm border-card",
    },
  ],
  defaultVariants: {
    wrapped: false,
    shadow: false,
  },
})

type FontWeight = "normal" | "semibold" | "bold"

const VARIANT_DEFAULTS = {
  default: { property: "normal" as FontWeight, value: "bold" as FontWeight },
  simple: { property: "semibold" as FontWeight, value: "bold" as FontWeight },
}

const fontWeightClass: Record<FontWeight, string> = {
  normal: "font-normal",
  semibold: "font-semibold",
  bold: "font-bold",
}

interface SimpleTableData {
  key?: string
  th: React.ReactNode
  td: React.ReactNode
  description?: React.ReactNode
  child?: boolean
  fontWeight?: FontWeight
  propertyFontWeight?: FontWeight
  valueFontWeight?: FontWeight
}

interface SimpleTableProps {
  data: SimpleTableData[]
  color?: ColorTypes
  colorHeading?: ColorTypes
  className?: string
  wrapped?: VariantProps<typeof wrapperVariants>["wrapped"]
  shadow?: VariantProps<typeof wrapperVariants>["shadow"]
  variant?: keyof typeof VARIANT_DEFAULTS
  fontWeight?: FontWeight
  propertyFontWeight?: FontWeight
  valueFontWeight?: FontWeight
}

const SimpleTable = ({
  data,
  color = "primary",
  colorHeading,
  className,
  wrapped,
  shadow,
  variant = "default",
  fontWeight: tableFW,
  propertyFontWeight: tablePropFW,
  valueFontWeight: tableValFW,
}: SimpleTableProps) => {
  const defaults = VARIANT_DEFAULTS[variant]

  const resolveWeight = (
    level: "property" | "value",
    cellFW?: FontWeight,
    rowFW?: FontWeight
  ) => {
    const levelFW = level === "property" ? tablePropFW : tableValFW
    return fontWeightClass[
      cellFW ?? rowFW ?? levelFW ?? tableFW ?? defaults[level]
    ]
  }

  return (
    <div className={clsx(wrapperVariants({ wrapped, shadow }), className)}>
      <table className="-my-2 w-full border-separate border-spacing-y-2 p-0">
        <tbody>
          {data.map(
            (
              {
                key,
                th,
                td,
                description,
                child,
                fontWeight: rowFW,
                propertyFontWeight: rowPropFW,
                valueFontWeight: rowValFW,
              },
              index
            ) => (
              <React.Fragment key={key || `row-${index}`}>
                <tr className={getTextColorClass(color)}>
                  <th
                    className={clsx(
                      "px-1.5 py-1 text-left text-base",
                      child && (wrapped ? "pl-6" : "pl-4.5"),
                      resolveWeight("property", rowPropFW, rowFW),
                      getTextColorClass(colorHeading || color)
                    )}
                  >
                    {th}
                  </th>
                  <td
                    className={clsx(
                      "px-1.5 py-1 text-right text-base",
                      resolveWeight("value", rowValFW, rowFW),
                      getTextColorClass(color)
                    )}
                    aria-labelledby={key || `row-${index}`}
                  >
                    {td}
                  </td>
                </tr>
                {description && (
                  <tr>
                    <td colSpan={2} className="px-1.5 pt-0 pb-1">
                      {description}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SimpleTable
