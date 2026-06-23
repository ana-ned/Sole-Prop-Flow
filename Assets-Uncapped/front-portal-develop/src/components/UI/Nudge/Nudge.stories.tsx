import {
  InformationCircleIcon,
  MoneyBag02SolidStandard,
  CreditCardSolidStandard,
  Home08SolidStandard,
  Rocket01SolidStandard,
  BookmarkCheck02Icon,
} from "@hugeicons-pro/core-solid-standard"
import { Meta, StoryObj } from "@storybook/react-vite"
import { Link } from "react-router"
import Nudge from "./Nudge"

export default {
  title: "UI/Nudge",
  component: Nudge,
  decorators: [
    (Story) => (
      <div className="flex max-w-md flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Important Information",
    content:
      "This is a sample nudge component with some important information for the user.",
    icon: InformationCircleIcon,
    layout: "horizontal",
    accent: 2,
  },
} as Meta<typeof Nudge>

type Story = StoryObj<typeof Nudge>

const NUDGE_LAYOUTS = ["horizontal", "vertical"] as const
const NUDGE_ACCENTS = [1, 2, 8] as const

export const Sandbox: Story = {
  args: {
    title: "Complete your profile",
    content: (
      <span>
        Add your banking information to get{" "}
        <Link to="/dashboard">better offers</Link>
      </span>
    ),
    icon: InformationCircleIcon,
    layout: "horizontal",
    accent: 2,
  },
}

export const Layouts: Story = {
  render: (args) => (
    <>
      {NUDGE_LAYOUTS.map((layout) => (
        <Nudge
          key={layout}
          {...args}
          title={`${layout.charAt(0).toUpperCase()}${layout.slice(1)} Layout`}
          content={`This nudge is displayed in ${layout} layout with the icon and content arranged accordingly.`}
          layout={layout}
        />
      ))}
    </>
  ),
}

export const Accents: Story = {
  render: (args) => (
    <>
      {NUDGE_ACCENTS.map((accent) => (
        <Nudge
          key={accent}
          {...args}
          title={`Accent ${accent}`}
          content={`This nudge uses accent color ${accent} for styling the icon background and text colors.`}
          accent={accent}
          icon={accent === 2 ? Home08SolidStandard : InformationCircleIcon}
        />
      ))}
    </>
  ),
}

export const Icons: Story = {
  render: (args) => (
    <>
      <Nudge
        {...args}
        title="Information"
        content="General information or tips for the user"
        icon={InformationCircleIcon}
        accent={8}
      />
      <Nudge
        {...args}
        title="Important"
        content="Important information that requires attention"
        icon={Home08SolidStandard}
        accent={2}
      />
      <Nudge
        {...args}
        title="Progress"
        content="Helpful tip to improve user experience"
        icon={Rocket01SolidStandard}
        accent={8}
      />
      <Nudge
        {...args}
        title="Completed"
        content="Confirmation of a successful action"
        icon={BookmarkCheck02Icon}
        accent={8}
      />
      <Nudge
        {...args}
        title="Financial"
        content="Information related to money or transactions"
        icon={MoneyBag02SolidStandard}
        accent={2}
      />
      <Nudge
        {...args}
        title="Credit Card"
        content="Information about credit card or payment methods"
        icon={CreditCardSolidStandard}
        accent={8}
      />
    </>
  ),
}

export const ContentVariations: Story = {
  render: (args) => (
    <>
      <Nudge
        {...args}
        title="Short Message"
        content="Brief nudge text"
        layout="horizontal"
      />
      <Nudge
        {...args}
        title="Medium Message"
        content="This is a medium-length nudge message that provides more context and information to the user."
        layout="horizontal"
      />
      <Nudge
        {...args}
        title="Long Message with Link"
        content={
          <span>
            This is a longer nudge message that includes detailed information
            about the feature or action. It may contain{" "}
            <Link to="/help">helpful links</Link> to guide users to additional
            resources or documentation. The message can span multiple lines and
            provide comprehensive guidance.
          </span>
        }
        layout="vertical"
      />
      <Nudge
        {...args}
        title="Rich Content"
        content={
          <div>
            <p>This nudge contains rich content including:</p>
            <ul className="mt-2 list-inside list-disc">
              <li>Multiple paragraphs</li>
              <li>Lists and structured content</li>
              <li>
                <Link to="/dashboard">Interactive elements</Link>
              </li>
            </ul>
          </div>
        }
        layout="vertical"
        accent={8}
      />
    </>
  ),
}

export const RealWorldExamples: Story = {
  render: (args) => (
    <>
      <Nudge
        {...args}
        title="Complete your application"
        content={
          <span>
            Upload your bank statements to get{" "}
            <Link to="/upload">better loan offers</Link>
          </span>
        }
        icon={MoneyBag02SolidStandard}
        layout="horizontal"
        accent={2}
      />
      <Nudge
        {...args}
        title="Account verification required"
        content="Please verify your identity to access all features. This helps keep your account secure."
        icon={Home08SolidStandard}
        layout="vertical"
        accent={2}
      />
      <Nudge
        {...args}
        title="New feature available"
        content={
          <span>
            Try our new dashboard with improved analytics.{" "}
            <Link to="/new-dashboard">Learn more</Link>
          </span>
        }
        icon={Rocket01SolidStandard}
        layout="horizontal"
        accent={8}
      />
      <Nudge
        {...args}
        title="Payment method added"
        content="Your new credit card has been successfully added to your account."
        icon={BookmarkCheck02Icon}
        layout="horizontal"
        accent={8}
      />
    </>
  ),
}
