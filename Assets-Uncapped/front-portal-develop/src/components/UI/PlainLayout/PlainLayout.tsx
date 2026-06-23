import Page from "../../Headless/Page"
import Logo from "../Logo"

const PlainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Page>
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:py-10 lg:justify-between">
        <div className="md:w-[270px]">
          <div className="inline-block">
            <Logo className="h-[32px]" />
          </div>
        </div>
        <div className="md:w-[560px]">{children}</div>
        <div className="hidden md:w-[270px] lg:block"></div>
      </div>
    </Page>
  )
}

export default PlainLayout
