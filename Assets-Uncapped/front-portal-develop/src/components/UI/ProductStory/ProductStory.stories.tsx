import { Meta } from "@storybook/react-vite"
import Typography from "../../Basic/Typography"
import ConnectionsImage from "./assets/story-connections.svg"
import OliverKentImage from "./assets/story-oliver-kent.webp"
import SecureImage from "./assets/story-secure.webp"
import ProductStory from "./ProductStory"

export default {
  title: "UI/ProductStory",
  component: ProductStory,
} as Meta<typeof ProductStory>

export const Default = () => {
  return (
    <ProductStory
      isOpen
      onClose={() => {
        alert("Story closed")
      }}
      onFinish={() => {
        alert("Story finished")
      }}
    >
      <ProductStory.Item
        imagePath={OliverKentImage}
        imageOverlay
        title="Free account with no balance limits"
        nextButton="Next"
      >
        <Typography type="h6" color="primary">
          <span className="text-brand-600">
            There are no fees or hidden charges
          </span>
          , so you can scale faster without worrying about hitting a maximum
          limit
        </Typography>
      </ProductStory.Item>
      <ProductStory.Item
        imagePath={ConnectionsImage}
        title="3 ways to start adding funds"
        nextButton="Next"
      >
        <Typography tag="div" color="primary" type="body">
          <ol>
            <li>3 ways to start adding funds</li>
            <li>Link with another bank account</li>
            <li>Copy your Uncapped account details</li>
          </ol>
        </Typography>
      </ProductStory.Item>
      <ProductStory.Item
        imagePath={SecureImage}
        title="Your money is safe & secure"
        nextButton="Let’s get started!"
      >
        <Typography type="h6" color="primary">
          All your money is secured by FIPS 140-2.
        </Typography>
      </ProductStory.Item>
    </ProductStory>
  )
}
