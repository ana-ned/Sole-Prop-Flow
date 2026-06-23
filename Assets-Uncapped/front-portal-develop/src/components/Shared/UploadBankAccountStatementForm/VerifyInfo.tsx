import { useTranslation } from "react-i18next"
import useDevice from "../../../hooks/useDevice"
import Typography from "../../Basic/Typography"
import CheckList from "../../UI/CheckList"
import Layout from "../../UI/Layout"

const VerifyInfo = () => {
  const { t } = useTranslation("common", {
    keyPrefix: "UploadBankAccountStatementForm.VerifyInfo",
  })
  const { isMobile } = useDevice()

  if (isMobile) {
    return null
  }

  return (
    <Layout.Child desktopTitle={t("title")} autoHeight>
      <>
        <Typography color="neutral-600" className="mt-4">
          {t("copy")}
        </Typography>
        <CheckList
          items={t("list", { returnObjects: true })}
          className="mt-8"
        />
      </>
    </Layout.Child>
  )
}

export default VerifyInfo
