import { toast } from "react-toastify"
import i18n from "../inits/i18next"

export const saveToClipboard = async (text?: string) => {
  try {
    if (!text) {
      throw new Error("No text to copy")
    }
    await navigator.clipboard.writeText(text)
    toast.success(i18n.t("common:clipboard.copied"))
  } catch {
    toast.error(i18n.t("common:clipboard.error"))
  }
}
