import { useTranslation } from "react-i18next"
import image from "../assets/illustration-eligibility-two.webp"
import { Header, Paragraph, Sidebar, Image } from "./EligibilityOneSidebar"

const EligibilityTwoSidebar = ({ smallTier }: { smallTier: boolean }) => {
  const { t } = useTranslation("common", {
    keyPrefix: smallTier
      ? "sidebars.EligibilityTwoSmallTier"
      : "sidebars.EligibilityTwo",
  })

  return (
    <Sidebar>
      <>
        <Header>{t("title")}</Header>
        <Paragraph>{t("content")}</Paragraph>
        <Image src={image} alt={t("title")} />
      </>
    </Sidebar>
  )
}

export default EligibilityTwoSidebar
