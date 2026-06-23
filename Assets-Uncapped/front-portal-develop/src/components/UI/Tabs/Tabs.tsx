import { useState, ReactNode } from "react"
import Switcher from "../../Basic/Switcher"

const Tabs = ({
  titles,
  children,
  tabsClassName,
  bodyClassName,
  hideTabIfOne = false,
}: {
  titles: string[]
  children: ReactNode[]
  tabsClassName: string
  bodyClassName?: string
  hideTabIfOne?: boolean
}) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const shouldDisplaySwitcher = !(hideTabIfOne && titles.length === 1)

  return (
    <div>
      {shouldDisplaySwitcher && (
        <Switcher
          values={titles.map((item) => ({ value: item, label: item }))}
          onChange={(selected) => {
            setActiveTab(titles.indexOf(selected))
          }}
          className={tabsClassName}
        />
      )}

      <div className={bodyClassName}>{children[activeTab]}</div>
    </div>
  )
}

export default Tabs
