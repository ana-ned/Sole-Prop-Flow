import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import ProductStory from "../../../../../components/UI/ProductStory"
import DocumentImg from "../../../assets/document.svg"
import { DashboardStories } from "../../../constants"

const ProvideDetails = ({ dealId }: { dealId: string }) => {
  const { t } = useTranslation("partner-dashboard", {
    keyPrefix: "stories.ProvideDetails",
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
        nextButton={t("complete")}
        altButton={t("skip")}
        title={t("title")}
        imagePath={DocumentImg}
        imageClassName="[&>img]:!w-auto [&>img]:!h-full"
        onAltFinish={async () => {
          await navigate(`/?story=${DashboardStories.IntroductionComplete}`)
        }}
        onFinish={async () => {
          await navigate(`/partner/application/business-details/${dealId}`)
        }}
      />
    </ProductStory>
  )
}

export default ProvideDetails
