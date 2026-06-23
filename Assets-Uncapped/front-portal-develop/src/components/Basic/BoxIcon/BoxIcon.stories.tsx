import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsUpSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Meta } from "@storybook/react-vite"
import BoxIcon, { BoxIconSeverity, BoxIconSizes } from "./BoxIcon"

const availableColors = Object.values(BoxIconSeverity)

const meta: Meta<typeof BoxIcon> = {
  title: "Basic/BoxIcon",
  component: BoxIcon,
  argTypes: {
    severity: {
      control: { type: "select" },
      options: availableColors,
    },
    size: {
      control: { type: "select" },
      options: BoxIconSizes,
    },
    icon: { control: false },
  },
}
export default meta

export const Colors = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {availableColors.map((color) => (
        <div key={color} className="flex items-center gap-x-2">
          <BoxIcon
            key={color}
            severity={color}
            icon={<HugeiconsIcon icon={AnalyticsUpSolidStandard} />}
          />
          <p>{color}</p>
        </div>
      ))}
    </div>
  )
}

export const Sizes = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {BoxIconSizes.map((size) => (
        <div key={size} className="flex items-center gap-x-4">
          <BoxIcon
            size={size}
            severity="accent-1"
            icon={<HugeiconsIcon icon={AnalyticsUpSolidStandard} />}
          />
          <p>
            Size {size}
            {size === 6 ? " (default)" : ""}
          </p>
        </div>
      ))}
    </div>
  )
}

export const DarkVariant = () => {
  return (
    <div className="bg-brand-800 flex flex-col gap-y-2 p-4">
      {availableColors.map((color) => (
        <div key={color} className="flex items-center gap-x-2">
          <BoxIcon
            variant="dark"
            key={color}
            severity={color}
            icon={<HugeiconsIcon icon={AnalyticsUpSolidStandard} />}
          />
          <p className="text-white">{color}</p>
        </div>
      ))}
    </div>
  )
}
