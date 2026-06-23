import { cx } from "class-variance-authority"
import { Trans, useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import Layout from "../../../components/UI/Layout"
import { ReactComponent as Logos } from "../../../svgs/brands/logos.svg"

const PartnerRegistrationSidebar = () => {
  const { t } = useTranslation("partner-registration", {
    keyPrefix: "partnerRegistrationSidebar",
  })

  return (
    <Layout.Sidebar
      className="flex flex-col justify-center bg-white"
      content={
        <>
          <header className="mx-auto mt-12 mb-8 w-full max-w-110">
            <Typography
              type="h2"
              className="font-heading text-left !text-[40px] font-semibold text-neutral-800"
            >
              <Trans
                i18nKey="partnerRegistrationSidebar.title"
                ns="partner-registration"
                components={{
                  bold: <strong className="font-extrabold" />,
                }}
              />
            </Typography>
          </header>
          <ol className="mx-auto my-0 w-full max-w-110 list-none p-0 [counter-reset:number]">
            {t("points", {
              returnObjects: true,
            }).map((el) => (
              <li
                key={el.title}
                className={cx(
                  "relative h-27 pt-1 pr-4 pb-10 pl-15",
                  "before:absolute before:top-0 before:left-0",
                  "before:flex before:items-center before:justify-center",
                  "before:size-7.5 before:rounded-full before:bg-neutral-300 before:font-semibold",
                  "before:content-[counter(number)] before:[counter-increment:number]",
                  "after:absolute after:top-10 after:left-0",
                  "after:h-14 after:w-7.5",
                  "after:bg-(image:--icon-steps-list-dots-sm) after:bg-center after:bg-no-repeat",
                  "first:before:bg-secondary-300 first:after:bg-(image:--icon-steps-list-dots-md)",
                  "last:h-auto last:pb-0 last:after:bg-none"
                )}
              >
                <Typography type="h6" className="mb-2">
                  {el.title}
                </Typography>
                <p>{el.copy}</p>
              </li>
            ))}
          </ol>
          <footer className="mx-auto my-14 max-w-125 text-center">
            <p className="mb-6 text-base font-bold text-neutral-700">
              {t("footer")}
            </p>
            <Logos className="max-w-full" />
          </footer>
        </>
      }
    />
  )
}

export default PartnerRegistrationSidebar
