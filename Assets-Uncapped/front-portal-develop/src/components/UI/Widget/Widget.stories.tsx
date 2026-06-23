import { Meta } from "@storybook/react-vite"
import Widget from "./Widget"

export default {
  title: "Domains/Dashboard/Widget",
  component: Widget,
} as Meta<typeof Widget>

export const Default = () => (
  <Widget title="Widget title" action={{ url: "/" }}>
    {" "}
    <p>Test body</p>
  </Widget>
)

export const TextAction = () => (
  <Widget title="Widget title" action={{ text: "See all", url: "/" }}>
    <p>Test body</p>
  </Widget>
)

export const OnClick = () => (
  <Widget
    title="Widget title"
    action={{
      onClick: () => {
        alert("Clicked")
      },
    }}
  >
    <p>Test body</p>
  </Widget>
)

export const OnClickText = () => (
  <Widget
    title="Widget title"
    action={{
      text: "See all",
      onClick: () => {
        alert("Clicked")
      },
    }}
  >
    <p>Test body</p>
  </Widget>
)
export const NoAction = () => (
  <Widget title="Widget title">
    <p>Test body</p>
  </Widget>
)
