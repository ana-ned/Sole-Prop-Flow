import { UseFormRegister } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { ReactComponent as CheckIcon } from "../../../svgs/check.svg"
import Card from "../../UI/Card"
import FormHelpers from "../FormHelpers"

const CheckboxGroup = ({
  options,
  name,
  className,
  register,
  reverse = false,
  label,
  helpText,
  disabled = false,
}: {
  options: {
    value: string
    label: string
    disabled?: boolean
  }[]
  name: string
  className?: string
  register: UseFormRegister<any>
  reverse?: boolean
  label?: string
  helpText?: string
  disabled?: boolean
}) => {
  return (
    <div>
      {label && (
        <FormHelpers.Label disabled={disabled}>{label}</FormHelpers.Label>
      )}
      <Card className="mt-2">
        {options.map((option, index) => (
          <label
            key={`${option.label}-${option.value}`}
            className={twMerge(
              "flex cursor-pointer py-2 first:pt-0 last:pb-0",
              (disabled || option.disabled) && "opacity-40",
              !reverse && "flex-row-reverse",
              className
            )}
            data-testid={`checkbox-label-${name}-${index}`}
            htmlFor={`checkbox-${option.value}-${index}`}
          >
            <p
              className={twMerge(
                "order-2 mr-4 text-sm",
                reverse && "order-0 ml-0 flex-1"
              )}
            >
              {option.label}
            </p>
            <div className="relative">
              <input
                {...register(name)}
                key={option.value}
                type="checkbox"
                value={option.value}
                disabled={disabled || option.disabled}
                id={`checkbox-${option.value}-${index}`}
                className="peer pointer-events-none absolute top-0 left-0 opacity-0"
              />
              <div className="peer-checked:border-brand-600 peer-checked:bg-brand-600 flex size-6 items-center justify-center rounded-[3px] border border-neutral-800 bg-white text-white transition-all duration-300 peer-disabled:border-(--color-input-border-disabled) peer-disabled:bg-(--color-input-background-disabled) [&>svg]:size-4">
                <CheckIcon />
              </div>
            </div>
          </label>
        ))}
      </Card>
      <FormHelpers.Message helpText={helpText} />
    </div>
  )
}

export default CheckboxGroup
