import { ArrowBack, ArrowForward, Settings } from "@material-ui/icons"
import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import Button from "./Button"

const BUTTON_VARIANTS = ["primary", "secondary", "tertiary", "link"] as const

export default {
  title: "Basic/Button",
  component: Button,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    type: "button",
    onClick: fn(),
    children: "Button Text",
  },
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Sandbox: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} {...args}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const FullWidth: Story = {
  render: (args) => (
    <>
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} fullWidth {...args}>
          {variant}
        </Button>
      ))}
    </>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} disabled {...args}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["primary", "secondary", "tertiary"] as const).map((variant) => (
        <Button key={variant} variant={variant} loading type="button">
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const IconOnly: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} {...args} ariaLabel="Settings">
          <Settings />
        </Button>
      ))}
    </div>
  ),
}

export const IconOnlyDisabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          disabled
          {...args}
          ariaLabel="Settings"
        >
          <Settings />
        </Button>
      ))}
    </div>
  ),
}

export const IconOnlyLoading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["primary", "secondary", "tertiary"] as const).map((variant) => (
        <Button
          key={variant}
          variant={variant}
          loading
          type="button"
          ariaLabel="Loading"
        >
          <Settings />
        </Button>
      ))}
    </div>
  ),
}

export const IconLeft: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} {...args}>
          <ArrowBack /> Go Back
        </Button>
      ))}
    </div>
  ),
}

export const IconRight: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant} {...args}>
          Continue <ArrowForward />
        </Button>
      ))}
    </div>
  ),
}

export const LinkVariant: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-4">
      <Button variant="link" {...args}>
        Default
      </Button>
      <Button variant="link" error {...args}>
        Error
      </Button>
      <Button variant="link" disabled {...args}>
        Disabled
      </Button>
    </div>
  ),
}

export const AsAnchor: Story = {
  name: "As Anchor (href)",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button href="/internal-page">Internal (React Router)</Button>
      <Button href="https://example.com" target="_blank">
        External Link
      </Button>
      <Button variant="secondary" href="/dashboard">
        Secondary Link
      </Button>
      <Button variant="link" href="/settings">
        Link Variant
      </Button>
    </div>
  ),
}

export const TextWrap: Story = {
  render: (args) => (
    <div className="max-w-48">
      <Button textWrap fullWidth {...args}>
        This is a very long button text that should wrap to multiple lines
      </Button>
    </div>
  ),
}

export const AllStates: Story = {
  name: "All States Overview",
  render: () => (
    <div className="space-y-6">
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant} className="space-y-2">
          <div className="text-sm font-semibold text-neutral-600 capitalize">
            {variant}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant={variant} type="button">
              Default
            </Button>
            <Button variant={variant} type="button" disabled>
              Disabled
            </Button>
            {variant !== "link" && (
              <Button variant={variant} type="button" loading>
                Loading
              </Button>
            )}
            {variant === "link" && (
              <Button variant={variant} type="button" error>
                Error
              </Button>
            )}
            <Button variant={variant} type="button" ariaLabel="Icon">
              <Settings />
            </Button>
            <Button variant={variant} type="button">
              <ArrowBack /> With Icon
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
}
