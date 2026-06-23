import clsx from "clsx"
import Typography from "../../Basic/Typography"

export const ErrorListItem = ({
  icon,
  iconWrapped = true,
  title,
  subtitle,
  button,
}: {
  icon: React.ReactNode
  iconWrapped?: boolean
  title: React.ReactNode
  subtitle?: React.ReactNode
  button?: React.ReactNode
}) => {
  return (
    <div className="bg-error-100 flex w-full flex-col gap-3 rounded-lg border border-[#FFCCD4] p-2 sm:flex-row">
      <div className="flex grow gap-3">
        <div
          className={clsx({
            "text-accent-5-contrast flex size-[42px] shrink-0 items-center justify-center rounded-lg border-1 border-[#FFCCD4] bg-[#FFF9FB] p-1 [&_svg]:size-6":
              iconWrapped,
          })}
        >
          {icon}
        </div>
        <div className="grow-1 self-center">
          <Typography type="bodyMedium" color="neutral-800">
            {title}
          </Typography>
          <Typography type="smallCopy" color="neutral-700">
            {subtitle}
          </Typography>
        </div>
      </div>
      <div className="w-full sm:w-auto sm:self-center">{button}</div>
    </div>
  )
}
