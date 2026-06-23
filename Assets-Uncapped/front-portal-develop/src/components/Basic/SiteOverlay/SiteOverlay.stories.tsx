import { Meta } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { ReactComponent as ArrowBackIcon } from "../../../svgs/arrow-back.svg"
import Button from "../Button"
import SiteOverlay from "./SiteOverlay"

export default {
  title: "UI/SiteOverlay",
  component: SiteOverlay,
} as Meta<typeof SiteOverlay>

export const WithText = {
  args: {
    isOpen: true,
    children: (
      <div className="container" style={{ marginTop: 32, maxWidth: 340 }}>
        <div style={{ marginBottom: 32 }}>
          <Button onClick={fn()} type="button" variant="secondary">
            <ArrowBackIcon />
          </Button>
        </div>
        <p>foo bar</p>
      </div>
    ),
  },
}
