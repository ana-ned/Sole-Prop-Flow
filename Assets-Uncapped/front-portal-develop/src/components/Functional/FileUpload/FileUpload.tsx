import { HugeiconsIcon } from "@hugeicons/react"
import { Upload01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import i18n from "../../../inits/i18next"
import Button from "../../Basic/Button"
import Typography from "../../Basic/Typography"
import CardV2 from "../../UI/CardV2"
import Loader from "../../UI/Loader"

const MIME_TYPES: Record<string, string> = {
  xls: "application/vnd.ms-excel",
  pdf: "application/pdf",
  csv: "text/csv",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
}

export const getReadableExtensionsList = (extensions: string[]) => {
  const str = extensions.join(", ")
  const lastIndex = str.lastIndexOf(", ")
  const replacement = ` ${i18n.t("common:fileUpload.extensionSeparator")}`

  if (extensions.length === 1) {
    return str
  }

  return (
    str.slice(0, Math.max(0, lastIndex)) +
    replacement +
    str.slice(Math.max(0, lastIndex + 1))
  )
}

export const getAcceptedFileMimeTypes = (extensions?: string[]) => {
  const acceptedFiles: Record<string, []> = {}

  extensions?.forEach((item) => {
    if (MIME_TYPES[item]) {
      acceptedFiles[MIME_TYPES[item]] = []
    } else {
      throw new Error(
        `Unsupported extension of ${item} provided to FileUpload. You need to declare new mime type.`
      )
    }
  })

  return acceptedFiles
}

const FileUpload = ({
  extensions,
  handleUpload,
  loading,
  multiple = true,
  title,
  subtitle,
}: {
  extensions?: string[]
  handleUpload: (files: File[]) => void
  loading: boolean
  multiple?: boolean
  title: string
  subtitle?: string
}) => {
  const { t } = useTranslation("common", { keyPrefix: "fileUpload" })
  const { getRootProps, open, getInputProps } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple,
    accept: getAcceptedFileMimeTypes(extensions),
    onDrop: (acceptedFiles) => {
      handleUpload(acceptedFiles)
    },
  })

  return (
    <CardV2
      title={title}
      icon={<HugeiconsIcon icon={Upload01SolidStandard} />}
      severity="accent-brand"
    >
      {subtitle && <p className="mb-2 text-neutral-700">{subtitle}</p>}

      <div
        {...getRootProps({
          className:
            "p-4 text-center bg-black/3 border-2 border-dashed border-neutral-300 rounded-card-lg space-y-2",
        })}
      >
        <input
          {...getInputProps({
            "aria-label": typeof title === "string" ? title : t("title"),
          })}
        />
        {loading ? (
          <>
            <Typography type="smallTitle" className="font-semibold">
              {t("titleLoading")}
            </Typography>
            <Typography type="smallCopy" color="neutral-700">
              {t("subtitleLoading")}
            </Typography>
            <div className="mt-3">
              <Loader size="xs" />
            </div>
          </>
        ) : (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={open}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  open()
                }
              }}
              className="cursor-pointer space-y-2"
            >
              <Typography type="smallTitle" className="font-semibold">
                {t("title")}
              </Typography>
              <Typography type="smallCopy" color="neutral-700">
                {extensions && extensions.length > 0
                  ? t("subtitleFormats", {
                      formats: getReadableExtensionsList(extensions),
                    })
                  : t("subtitleAny")}
              </Typography>
            </div>
            <Button type="button" variant="secondary" onClick={open}>
              <HugeiconsIcon icon={Upload01SolidStandard} />
              {multiple ? t("addFiles") : t("addFile")}
            </Button>
          </>
        )}
      </div>
    </CardV2>
  )
}

export default FileUpload
