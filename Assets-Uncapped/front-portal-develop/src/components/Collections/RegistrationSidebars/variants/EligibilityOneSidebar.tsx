import React from "react"
import { useTranslation } from "react-i18next"
import Typography from "../../../Basic/Typography"
import Layout from "../../../UI/Layout"
import eligibilityOne from "../assets/illustration-eligibility-one.webp"

export const Header = ({ children }: { children: React.ReactNode }) => (
  <Typography type="h5" className="mb-8">
    {children}
  </Typography>
)

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Typography type="body" color="neutral-700">
    {children}
  </Typography>
)

export const Image = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="mx-auto my-6 block max-w-full" />
)

export const Sidebar = ({ children }: { children: React.ReactNode }) => (
  <Layout.Sidebar className="max-w-200 bg-white p-16" content={children} />
)

const EligibilityOneSidebar = () => {
  const { t } = useTranslation("common", {
    keyPrefix: "sidebars.EligibilityOne",
  })

  return (
    <Sidebar>
      <>
        <Header>{t("title")}</Header>
        <Paragraph>{t("content")}</Paragraph>
        <Image src={eligibilityOne} alt={t("title")} />
        <Paragraph>{t("content2")}</Paragraph>
      </>
    </Sidebar>
  )
}

export default EligibilityOneSidebar
