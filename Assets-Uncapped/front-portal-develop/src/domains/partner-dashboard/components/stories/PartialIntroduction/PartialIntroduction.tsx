import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import ProductStory from "../../../../../components/UI/ProductStory"
import IntroductionImg from "../../../assets/partial-introduction.svg"

const PartialIntroduction = () => {
  const { t } = useTranslation("partner-dashboard", {
    keyPrefix: "stories.PartialIntroduction",
  })
  const navigate = useNavigate()

  return (
    <ProductStory
      isOpen
      onClose={async () => {
        await navigate("/")
      }}
      theme="dark"
      dots={false}
    >
      <ProductStory.Item
        nextButton={t("cta")}
        title={t("title")}
        imagePath={IntroductionImg}
        imageClassName="[&>img]:!w-auto [&>img]:!h-7/10"
        onFinish={async () => {
          await navigate("/")
        }}
      />
    </ProductStory>
  )
}

export default PartialIntroduction
