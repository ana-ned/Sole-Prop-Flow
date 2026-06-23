import clsx from "clsx"
import SanitizedHtml from "../../Basic/SanitizedHtml"

interface CheckListProps {
  items: string[]
  className?: string
}

const CheckList = ({ items, className }: CheckListProps) => {
  if (items.length === 0) return <div />

  return (
    <ul className={clsx("list-none p-0", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="relative mb-4 pl-10 text-neutral-800 before:absolute before:-top-[7px] before:left-0 before:block before:h-8 before:w-8 before:content-[''] before:[background:var(--checkbox-icon-path)_no-repeat] last:mb-0"
        >
          <SanitizedHtml as="span" content={item} />
        </li>
      ))}
    </ul>
  )
}

export default CheckList
