import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router"
import Layout from "../../components/UI/Layout"
import PageBar from "../../components/UI/PageBar"
import useDevice from "../../hooks/useDevice"
import useHubSpotChat from "../../hooks/useHubSpotChat"

const Chat = () => {
  const { t } = useTranslation("profile")
  const { isMobile } = useDevice()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const getBackUrl = () => {
    const backUrl = params.get("back")

    if (backUrl) {
      return backUrl
    }

    globalThis.history.back()

    return ""
  }

  const { openChat, closeChat } = useHubSpotChat({
    onClose: async () => {
      await navigate(getBackUrl())
    },
  })

  useEffect(() => {
    openChat()

    return () => {
      closeChat()
    }
  }, [closeChat, isMobile, openChat])

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <PageBar title={t("supportTitle")} backUrl={getBackUrl()} />
      </Layout.Parent>
    </Layout>
  )
}

export default Chat
