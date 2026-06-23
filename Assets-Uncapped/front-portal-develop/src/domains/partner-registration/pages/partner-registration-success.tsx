import { useTranslation } from "react-i18next"
import { Navigate, useNavigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader/PageLoader"
import ProductStory from "../../../components/UI/ProductStory"
import useAuth from "../../../hooks/useAuth"
import IntroduceImg from "../assets/introduce-img.svg"

const PartnerRegistrationSuccess = () => {
  const { t } = useTranslation("partner-registration", {
    keyPrefix: "partnerRegistrationSuccess",
  })
  const auth = useAuth()
  const navigate = useNavigate()

  if (auth.isLoading) {
    return <PageLoader />
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />
  }

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
        nextButton={t("introduce")}
        altButton={t("notNow")}
        title={t("title")}
        imagePath={IntroduceImg}
        imageClassName="[&>img]:!w-auto [&>img]:!h-4/5"
        onAltFinish={async () => {
          await navigate("/")
        }}
        onFinish={async () => {
          await navigate("/partner/application/create")
        }}
      />
    </ProductStory>
  )
}

export default PartnerRegistrationSuccess
