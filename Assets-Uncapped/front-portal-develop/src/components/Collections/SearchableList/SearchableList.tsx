import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ReactComponent as SearchIcon } from "../../../svgs/search.svg"
import {
  groupByFirstLetter,
  sortByPredefinedValues,
} from "../../../utils/lists"
import { initials } from "../../../utils/string"
import Typography from "../../Basic/Typography"
import Input from "../../Forms/Input"
import ListItemLarge from "../../UI/ListItemLarge"
import ListItemContainer from "../ListItemContainer"

interface SearchableListItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}
type TOnItemClick = (item: SearchableListItem) => void

const Group = ({
  title,
  items,
  onClick,
}: {
  title?: string
  items: SearchableListItem[]
  onClick: TOnItemClick
}) => (
  <div className="mt-8">
    {title && (
      <Typography type="bodyTitle" color="neutral-600" className="mb-2">
        {title}
      </Typography>
    )}
    <ListItemContainer size="sm">
      {items.map((item) => (
        <ListItemLarge
          key={item.id}
          more={{
            type: "button",
            onClick: () => {
              onClick(item)
            },
          }}
          icon={
            item.icon ? <img src={item.icon} alt={item.label} /> : undefined
          }
          title={item.label}
          disabled={item.disabled}
          initialIcon={item.icon ? undefined : initials(item.label)}
        />
      ))}
    </ListItemContainer>
  </div>
)

const SearchableList = ({
  onClick,
  frequentlySelectedIds = [],
  items,
  grouped = true,
  noResults,
}: {
  onClick: TOnItemClick
  frequentlySelectedIds?: string[]
  items: SearchableListItem[]
  grouped?: boolean
  noResults?: React.ReactNode
}) => {
  const { t } = useTranslation("common", { keyPrefix: "SearchableList" })
  const { control, watch } = useForm()
  const searchValue = watch("search") || ""

  const sortedItems = useMemo(() => {
    return items.toSorted((a, b) => a.label.localeCompare(b.label))
  }, [items])

  const frequencySelected = useMemo(
    () =>
      sortByPredefinedValues(
        items.filter((item) => frequentlySelectedIds.includes(item.id)),
        frequentlySelectedIds,
        "id"
      ),
    [items, frequentlySelectedIds]
  )

  const filteredItems = useMemo(
    () =>
      sortedItems.filter((item) => {
        if (searchValue.length < 2) return sortedItems

        return (
          item.label.toLowerCase().startsWith(searchValue.toLowerCase()) ||
          item.id.toLowerCase().startsWith(searchValue.toLowerCase()) ||
          initials(item.label)
            ?.toLowerCase()
            .startsWith(searchValue.toLowerCase())
        )
      }),
    [searchValue, sortedItems]
  )

  const groupedCountries = useMemo(
    () => groupByFirstLetter(filteredItems, "label"),
    [filteredItems]
  )

  return (
    <>
      <Input
        name="search"
        placeholder={t("placeholder")}
        className="mt-0"
        inputClassName="pt-4 pr-4 pb-4 pl-4"
        icon={<SearchIcon />}
        control={control}
      />
      {frequencySelected.length > 0 && searchValue.length < 2 && (
        <Group
          title={t("frequentlySelected")}
          items={frequencySelected}
          onClick={onClick}
        />
      )}
      {filteredItems.length > 0 ? (
        grouped ? (
          Object.entries(groupedCountries).map(([letter, countryGroup]) => (
            <Group
              key={letter}
              title={letter}
              items={countryGroup}
              onClick={onClick}
            />
          ))
        ) : (
          <Group items={filteredItems} onClick={onClick} />
        )
      ) : (
        noResults || (
          <Typography type="body" className="mt-8 text-center">
            {t("noResults")}
          </Typography>
        )
      )}
    </>
  )
}

export default SearchableList
