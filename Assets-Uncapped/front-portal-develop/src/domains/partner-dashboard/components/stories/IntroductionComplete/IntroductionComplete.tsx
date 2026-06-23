import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import ProductStory from "../../../../../components/UI/ProductStory"
import IntroductionImg from "../../../assets/introduction-complete.svg"

const IntroductionComplete = () => {
  const { t } = useTranslation("partner-dashboard", {
    keyPrefix: "stories.IntroductionComplete",
  })
  const navigate = useNavigate()

  return (
    <ProductStory
      isOpen
      onClose={async () => {
        await navigate("/", { state: {} })
      }}
      theme="dark"
      dots={false}
    >
      <ProductStory.Item
        nextButton={t("cta")}
        title={t("title")}
        imagePath={IntroductionImg}
        imageClassName="[&>img]:!w-auto [&>img]:!h-1/2"
        onFinish={async () => {
          await navigate("/", { state: {} })
        }}
      />
    </ProductStory>
  )
}

export default IntroductionComplete
