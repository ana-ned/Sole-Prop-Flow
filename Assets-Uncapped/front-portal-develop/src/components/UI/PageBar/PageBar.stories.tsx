import { StoryFn, Meta } from "@storybook/react-vite"
import { ReactComponent as DeleteOutlineIcon } from "../../../svgs/delete-outline.svg"
import PageBar from "./PageBar"

export default {
  title: "UI/PageBar",
  component: PageBar,
} as Meta<typeof PageBar>

const Template: StoryFn<typeof PageBar> = (args) => {
  return <PageBar {...args} />
}

export const Link = {
  render: Template,

  args: {
    backUrl: "/home",
    title: "Transactions",
  },
}

export const Button = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    title: "Transactions",
  },
}

export const Subtitle = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    title: "Transactions",
    subTitle: "Some subtitle",
  },
}

export const IgnoreDesktop = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    title: "Transactions",
    ignoreDesktop: true,
  },
}

export const WithActionButton = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    title: "Transactions",
    ignoreDesktop: true,
    actionButton: {
      onClick: () => {
        alert("Clicked")
      },
      children: <DeleteOutlineIcon />,
    },
  },
}

export const WithActionLink = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    title: "Transactions",
    ignoreDesktop: true,
    actionLink: {
      to: "/",
      children: "Skip",
    },
  },
}

export const WithoutTitle = {
  render: Template,

  args: {
    onClickBack: () => {
      console.log("Click")
    },
    ignoreDesktop: true,
    actionLink: {
      to: "/",
      children: "Skip",
    },
  },
}
