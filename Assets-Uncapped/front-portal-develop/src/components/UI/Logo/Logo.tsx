import { Link } from "react-router"
import useTheme from "../../../hooks/useTheme"
import { getThemeKey, type ThemeKey } from "../../../utils/themes"
import { ReactComponent as AmazonLogo } from "../../../svgs/partners/amazon.svg"
import { ReactComponent as JungleScoutLogo } from "../../../svgs/partners/jungle-scout.svg"
import SellerMateLogo from "../../../svgs/partners/seller-mate.png"
import { ReactComponent as UncappedLogo } from "../../../svgs/logoUncapped.svg"

function renderLogo(themeKey: ThemeKey | undefined, className?: string) {
  switch (themeKey) {
    case "amazon":
      return <AmazonLogo className={className} />
    case "jungle-scout":
      return <JungleScoutLogo className={className} />
    case "seller-mate":
      return (
        <img src={SellerMateLogo} alt="Seller Mate" className={className} />
      )
    default:
      return <UncappedLogo className={className} />
  }
}

const Logo = ({
  className,
  linkClassName,
  link = true,
}: {
  className?: string
  linkClassName?: string
  link?: boolean
}) => {
  const [theme] = useTheme()

  const logo = renderLogo(getThemeKey(theme), className)

  if (link) {
    return (
      <Link to="/" className={linkClassName}>
        {logo}
      </Link>
    )
  }

  return logo
}

export default Logo
