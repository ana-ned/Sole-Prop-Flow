import clsx from "clsx"
import useDevice from "../../../hooks/useDevice"
import ActionButtons from "../../Collections/ActionButtons/ActionButtons"
import Logo from "../Logo"
import LogoutMenuButton from "./LogoutMenuButton"

const LogoOnlyMenu = ({
  withActionButtons = true,
  withSeparator = true,
  withLogout = false,
}: {
  withActionButtons?: boolean
  withSeparator?: boolean
  withLogout?: boolean
}) => {
  const { isMobile } = useDevice()

  const header = (
    <div
      className={clsx(
        "flex items-center justify-between px-4 pt-3 lg:mb-8 lg:px-0 lg:pt-0",
        {
          "shadow-light-sm pb-3 lg:pb-0 lg:shadow-none": withSeparator,
          "mb-[14px]": !withSeparator,
        }
      )}
    >
      {isMobile && withActionButtons && <div className="size-11"></div>}

      <Logo
        linkClassName="inline-block"
        className="h-[30px] max-w-full self-start lg:h-10"
      />

      {isMobile && withActionButtons && (
        <div className="flex size-11 items-center justify-center">
          <ActionButtons />
        </div>
      )}
    </div>
  )

  if (!withLogout) {
    return header
  }

  return (
    <div className="flex h-full flex-col">
      <div className="grow">{header}</div>
      <LogoutMenuButton />
    </div>
  )
}

export default LogoOnlyMenu
