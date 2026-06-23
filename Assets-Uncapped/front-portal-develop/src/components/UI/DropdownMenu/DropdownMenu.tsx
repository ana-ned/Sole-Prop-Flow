import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react"
import clsx from "clsx"
import Typography from "../../Basic/Typography/Typography"

type Align = "start" | "end"
type Placement = "top" | "right" | "bottom" | "left"

interface DropdownMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface DropdownMenuProps {
  options: DropdownMenuItem[]
  className?: string
  icon: React.ReactNode
  anchor?: Placement | "selection" | `${Placement | "selection"} ${Align}`
}

const DropdownMenu = ({
  options,
  icon,
  className,
  anchor,
}: DropdownMenuProps) => (
  <Listbox
    onChange={(option: DropdownMenuItem) => {
      option.onClick()
    }}
  >
    <ListboxButton
      className={clsx(
        `hover:border-brand-400 relative flex cursor-pointer items-center justify-center gap-0.5 rounded-md border border-neutral-300 bg-white p-2 focus-visible:outline-none`,
        className
      )}
    >
      <span className="text-brand-700 w-full">{icon}</span>
    </ListboxButton>

    <ListboxOptions
      anchor={{ to: anchor }}
      className="shadow-light-sm text-brand-700 absolute z-10 mt-1 flex max-h-60 flex-col items-start gap-3 overflow-auto rounded-sm bg-white px-3 py-1.5"
    >
      {options.map((option) => (
        <ListboxOption
          key={option.label}
          value={option}
          className={`relative w-full cursor-pointer select-none focus-visible:outline-none`}
        >
          <div className="flex items-center gap-2">
            {option.icon}
            <Typography type={"tableHeader"} color="brand-700">
              {option.label}
            </Typography>
          </div>
        </ListboxOption>
      ))}
    </ListboxOptions>
  </Listbox>
)

export default DropdownMenu
