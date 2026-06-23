import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardCircleIcon,
  Home01Icon,
  Settings02Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-solid-standard"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { BoxIconSeverity } from "../../Basic/BoxIcon/BoxIcon"
import NavItem from "./NavItem"

const meta: Meta<typeof NavItem> = {
  title: "Collections/NavItem",
  component: NavItem,
  argTypes: {
    iconSeverity: {
      control: { type: "select" },
      options: Object.values(BoxIconSeverity),
    },
    icon: { control: false },
    children: { control: "text" },
    chip: { control: "text" },
  },
}
export default meta

type Story = StoryObj<typeof NavItem>

export const Default: Story = {
  args: {
    children: "Dashboard",
    icon: <HugeiconsIcon icon={DashboardCircleIcon} />,
    href: "#",
  },
}

export const WithChip: Story = {
  args: {
    children: "Team Members",
    icon: <HugeiconsIcon icon={UserGroupIcon} />,
    chip: 5,
    href: "#",
  },
}

export const DifferentSeverity: Story = {
  args: {
    children: "Settings",
    icon: <HugeiconsIcon icon={Settings02Icon} />,
    iconSeverity: "accent-3",
    href: "#",
  },
}

export const AllSeverities = () => {
  const severities = Object.values(BoxIconSeverity)

  return (
    <div className="flex flex-col gap-2">
      {severities.map((severity) => (
        <NavItem
          key={severity}
          icon={<HugeiconsIcon icon={Home01Icon} />}
          iconSeverity={severity}
          href="#"
        >
          Severity: {severity}
        </NavItem>
      ))}
    </div>
  )
}

export const AllVariants = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-semibold text-neutral-600">
          Basic Examples
        </h3>
        <div className="flex flex-col gap-2">
          <NavItem icon={<HugeiconsIcon icon={DashboardCircleIcon} />} href="#">
            Dashboard
          </NavItem>
          <NavItem icon={<HugeiconsIcon icon={UserGroupIcon} />} href="#">
            Team Members
          </NavItem>
          <NavItem
            icon={<HugeiconsIcon icon={Settings02Icon} />}
            iconSeverity="accent-3"
            href="#"
          >
            Settings
          </NavItem>
        </div>
      </div>
    </div>
  )
}
