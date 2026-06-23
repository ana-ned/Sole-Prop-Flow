import { cx } from "class-variance-authority"
import { Trans } from "react-i18next"
import Layout from "../../../UI/Layout"
import ButternutLogo from "../assets/butternut.webp"
import FooterImg from "../assets/kevin.webp"
import QuoteImage from "../assets/quote.webp"

const QuoteSidebar = () => (
  <Layout.Sidebar
    className="bg-surface-canvas relative"
    content={
      <>
        <header
          className={cx([
            "mt-12 mr-8 ml-21 w-91",
            "before:absolute before:top-13 before:left-8 before:block before:content-['']",
            "before:h-7 before:w-9",
            `before:[background-image:var(--quote-image-url)] before:bg-contain`,
          ])}
          style={
            {
              "--quote-image-url": `url("${QuoteImage}")`,
            } as React.CSSProperties
          }
        >
          <h2 className="font-heading text-3xl font-semibold text-neutral-800">
            <Trans i18nKey="registrationSidebar.header" ns="common">
              <b className="font-extrabold">Easy application</b> and fast
              decisions. I recommend Uncapped to every founder.”
            </Trans>
          </h2>
          <p className="mt-6 mb-4 text-lg font-normal text-neutral-800 uppercase">
            <Trans i18nKey="registrationSidebar.sub" ns="common">
              <b className="font-semibold">Kevin</b>, Co-founder
            </Trans>
          </p>
          <img src={ButternutLogo} alt="Butternut" className="h-auto w-27" />
        </header>
        <footer>
          <img
            src={FooterImg}
            alt="Butternut"
            className="absolute bottom-0 left-1/2 h-[58vh] w-auto -translate-x-1/2"
          />
        </footer>
      </>
    }
  />
)

export default QuoteSidebar
