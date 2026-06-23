import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react"
import { KeyboardArrowDown } from "@material-ui/icons"
import clsx from "clsx"
import Typography from "../../Basic/Typography/Typography"

export interface Option {
  label: string
  value: string
  icon?: React.ReactNode
}

interface DropdownProps {
  label?: string
  options: Option[]
  value?: Option
  onChange: (value: Option) => void
  className?: string
  disabled?: boolean
}

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  className = "",
  disabled = false,
}: DropdownProps) => (
  <Listbox value={value} onChange={onChange} disabled={disabled}>
    {({ open }) => (
      <div className="relative">
        <ListboxButton
          className={clsx(
            `relative flex cursor-pointer items-center justify-center gap-0.5 rounded-md border p-2 focus-visible:outline-none`,
            className,
            disabled
              ? "border-neutral-400 bg-neutral-200"
              : "hover:border-brand-400 border-neutral-300 bg-white"
          )}
        >
          <span className="flex w-full items-center justify-between">
            <Typography
              type="tableHeader"
              color={disabled ? "neutral-500" : "brand-700"}
              className="!font-normal"
            >
              {!!label && `${label}: `}
              {!!value && value.label}
            </Typography>
            <KeyboardArrowDown
              className={`text-brand-700 h-5 w-5 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </span>
        </ListboxButton>

        <ListboxOptions
          className="shadow-light-sm absolute z-10 mt-1 flex max-h-60 flex-col items-start gap-3 overflow-auto rounded-sm bg-white p-3"
          portal={false}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option}
              className={`align-end relative flex w-full cursor-pointer items-center gap-2 whitespace-nowrap select-none focus-visible:outline-none`}
            >
              {({
                selected,
                active,
              }: {
                selected: boolean
                active: boolean
              }) => (
                <>
                  {!!option.icon && option.icon}
                  <Typography
                    type={selected || active ? "tableHeader" : "tableValue"}
                    color="neutral-800"
                    className="!font-normal"
                  >
                    {option.label}
                  </Typography>
                </>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    )}
  </Listbox>
)

export default Dropdown
