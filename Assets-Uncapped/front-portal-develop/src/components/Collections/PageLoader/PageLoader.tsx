import SiteOverlay from "../../Basic/SiteOverlay"
import Loader from "../../UI/Loader"
import { LoaderSize } from "../../UI/Loader/Loader"

const PageLoader = ({
  size = "sm",
  overlay = false,
}: {
  size?: LoaderSize
  overlay?: boolean
}) => {
  if (overlay)
    return (
      <SiteOverlay isOpen>
        <Loader size={size} />
      </SiteOverlay>
    )
  return (
    <div className="pointer-events-none fixed top-0 left-0 h-screen w-screen">
      <Loader size={size} />
    </div>
  )
}

export default PageLoader
