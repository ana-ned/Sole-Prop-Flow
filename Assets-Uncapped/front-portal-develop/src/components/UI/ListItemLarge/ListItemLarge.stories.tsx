import { StoryFn, Meta } from "@storybook/react-vite"
import { ReactComponent as SettingsIcon } from "../../../svgs/settings.svg"
import ListItemLarge from "./ListItemLarge"

export default {
  title: "UI/ListItemLarge",
  component: ListItemLarge,
} as Meta<typeof ListItemLarge>

const Template: StoryFn<typeof ListItemLarge> = (args) => {
  return <ListItemLarge {...args} />
}

export const TitleSubtitle = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
  },
}

export const TitleSubtitleLabel = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "label",
      value: "label",
    },
  },
}

export const TitleSubtitleLink = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "link",
    },
  },
}

export const TitleSubtitleValue = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "value",
      value: "value",
    },
  },
}

export const ActiveTitleSubtitleValue = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "value",
      value: "value",
    },
    href: "/",
  },
}

export const TitleSubtitleExternal = {
  render: Template,

  args: {
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "external",
      value: "value",
    },
    href: "https://www.google.com",
  },
}

export const IconTitleSubtitle = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "title",
    subtitle: "subtitle",
  },
}

export const IconTitleSubtitleLabel = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "label",
      value: "label",
    },
  },
}

export const IconTitleSubtitleLink = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "link",
    },
    href: "/test",
  },
}

export const IconTitleSubtitleValue = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "value",
      value: "value",
    },
  },
}

export const IconTitleSubtitleExternal = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "external",
      value: "value",
    },
  },
}

export const Initials = {
  render: Template,

  args: {
    initialIcon: "custom",
    title: "title",
    subtitle: "subtitle",
    more: {
      type: "value",
      value: "value",
    },
  },
}

export const Active = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "Title",
    subtitle: "Subtitle",
    more: {
      type: "link",
    },
    active: true,
  },
}

export const Disabled = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "Title",
    subtitle: "Subtitle",
    more: {
      type: "link",
    },
    disabled: true,
  },
}

export const CustomColor = () => (
  <ListItemLarge
    title="Title"
    subtitle="Subtitle"
    icon={<SettingsIcon />}
    iconBackgroundColor="secondary-300"
    iconColor="neutral-600"
  />
)

export const Truncated = () => (
  <div style={{ maxWidth: "489px" }}>
    <ListItemLarge
      title="Vaidas Amazing Consulting with Super Long name LLC"
      icon={<SettingsIcon />}
      more={{
        type: "value",
        value: "-$99,999.99",
      }}
      truncate
    />
  </div>
)

export const TransparentVariant = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "Transparent item",
    subtitle: "No border or background",
    variant: "transparent",
  },
}

export const TransparentWithValue = {
  render: Template,

  args: {
    icon: <SettingsIcon />,
    title: "Transparent item",
    subtitle: "With a value on the right",
    variant: "transparent",
    more: {
      type: "value",
      value: "$1,234",
    },
  },
}

export const LinkWithCustomRightIcon = () => (
  <div style={{ maxWidth: "489px" }}>
    <ListItemLarge
      title="Vaidas Amazing Consulting with Super Long name LLC"
      icon={<SettingsIcon />}
      more={{
        type: "link",
        element: <SettingsIcon />,
      }}
    />
  </div>
)
