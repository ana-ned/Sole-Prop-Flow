import { cva } from "class-variance-authority"
import { useTranslation } from "react-i18next"
import Typography from "../../../components/Basic/Typography"
import IntroduceClientButton from "./IntroduceClientButton"

const listItemVariants = cva([
  "relative mb-4 pl-11 [counter-increment:ol-counter]",
  // number circle
  "before:absolute before:top-0 before:left-0 before:flex before:size-7",
  "before:items-center before:justify-center before:rounded-full before:text-sm before:leading-none",
  "before:bg-neutral-300 before:font-bold before:text-neutral-800",
  "before:content-[counter(ol-counter)]",
  // first item accent
  "first:before:bg-secondary-300",
  // dotted connector line
  "after:absolute after:top-8.5 after:left-3 after:z-5",
  "after:h-[calc(100%-28px)] after:w-1 after:[content:'']",
  "after:bg-[radial-gradient(ellipse,var(--color-secondary-300)_0%,var(--color-secondary-300)_30%,transparent_34%)]",
  "after:bg-size-[0.25rem_0.25rem] after:bg-repeat",
  "last:after:hidden",
])

const NoResults = () => {
  const { t } = useTranslation("partner-dashboard")

  return (
    <div className="rounded-xl bg-white p-4 lg:px-4 lg:py-7.5 lg:pr-6">
      <ol className="m-0 list-none p-0 [counter-reset:ol-counter]">
        {t("noResults.points", {
          returnObjects: true,
        }).map((item) => (
          <li key={item.title} className={listItemVariants()}>
            <Typography type="bodyTitle" className="mb-1">
              {item.title}
            </Typography>
            <Typography type="body">{item.content}</Typography>
          </li>
        ))}
      </ol>

      <div className="mt-6 text-right">
        <IntroduceClientButton />
      </div>
    </div>
  )
}

export default NoResults
