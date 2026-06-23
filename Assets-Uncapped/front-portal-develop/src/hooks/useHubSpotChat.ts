import { useEffect } from "react"
import { isE2e } from "../utils/env"
import { useTracking } from "./useTracking"

const openChat = () => {
  if (globalThis.HubSpotConversations?.widget && !isE2e()) {
    const widget = globalThis.HubSpotConversations?.widget
    widget.load()
    widget.open()
  }
}

const closeChat = () => {
  if (globalThis.HubSpotConversations?.widget) {
    globalThis.HubSpotConversations.widget.remove()
  }
}

const reloadChat = () => {
  if (globalThis.HubSpotConversations?.widget) {
    globalThis.HubSpotConversations.widget.refresh()
  }
}

const useHubSpotChat = ({ onClose }: { onClose?: () => void } = {}) => {
  const { trackEvent } = useTracking()

  useEffect(() => {
    const handleChatOpenEvent = (event: { origin: string; data: string }) => {
      if (event.origin === "https://app.hubspot.com" && event.data) {
        try {
          const payload: {
            type?: "open-change"
            data: {
              isOpen: boolean
            }
          } = JSON.parse(event.data)

          if (payload.type === "open-change" && payload.data.isOpen) {
            trackEvent({
              name: "chat-open",
              action: "chat-open",
              category: "hubspot",
            })
          }
        } catch {
          // HubSpot may send non-JSON messages (e.g., "unauthorized"), ignore them
        }
      }
    }

    const handleChatStartedEvent = () => {
      trackEvent({
        name: "conversation-started",
        action: "conversation-started",
        category: "hubspot",
      })
    }

    const handleChatCloseEvent = (event: {
      origin: string
      data: string | object
    }) => {
      if (event.origin === "https://app.hubspot.com") {
        try {
          const payload =
            typeof event.data === "string" ? JSON.parse(event.data) : event.data
          if (
            payload.data &&
            !payload.data.isOpen &&
            payload.type === "open-change" &&
            onClose
          )
            onClose()
        } catch {
          // HubSpot may send non-JSON messages, ignore them
        }
      }
    }

    window.addEventListener("message", handleChatOpenEvent)
    window.addEventListener("message", handleChatCloseEvent)
    globalThis.HubSpotConversations?.on(
      "conversationStarted",
      handleChatStartedEvent
    )
    return () => {
      window.removeEventListener("message", handleChatOpenEvent)
      window.removeEventListener("message", handleChatCloseEvent)
      globalThis.HubSpotConversations?.off(
        "conversationStarted",
        handleChatStartedEvent
      )
    }
  }, [trackEvent, onClose])

  return {
    openChat,
    closeChat,
    reloadChat,
  }
}

export default useHubSpotChat
