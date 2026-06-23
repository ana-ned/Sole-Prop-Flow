import clsx from "clsx"
import { ReactComponent as CopyIcon } from "../../../svgs/content-copy.svg"
import { saveToClipboard } from "../../../utils/clipboard"
import Typography from "../../Basic/Typography"
import bgBranded from "./bg-clipboard-box-branded.svg"

const ClipboardBox = ({
  title,
  value,
  variant = "default",
}: {
  title: string
  value: string
  variant?: "default" | "branded"
}) => {
  const isBranded = variant === "branded"

  return (
    <div
      className={clsx(
        "my-2 rounded-xl bg-white p-3",
        isBranded && "bg-cover bg-no-repeat"
      )}
      style={isBranded ? { backgroundImage: `url(${bgBranded})` } : undefined}
    >
      <Typography type="body" color="neutral-600">
        {title}
      </Typography>
      <div
        className={clsx(isBranded && "mt-1 rounded-lg bg-white px-1.5 py-3")}
      >
        <div className="flex w-full flex-nowrap gap-x-4">
          <div className="flex-1">
            <Typography type="body" className="break-words">
              {value}
            </Typography>
          </div>
          <div className="w-auto">
            <button
              aria-label="Save to clipboard"
              className="text-brand-600 flex h-6 w-6 items-end justify-center border-none bg-transparent p-0"
              type="button"
              onClick={async () => {
                await saveToClipboard(value)
              }}
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClipboardBox
