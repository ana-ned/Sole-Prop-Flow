import { Control, FieldValues, UseFormWatch } from "react-hook-form"
import { CurrencyCode } from "../../../types/Country.types"
import { getCurrencyList } from "../../../utils/currency"
import { currencyToSymbol } from "../../../utils/money"
import FormHelpers from "../FormHelpers"
import Input from "../Input"
import Select from "../Select"

const MoneyFields = <TFieldValues extends FieldValues = FieldValues>({
  control,
  prefix,
  label,
  watch,
  order,
  currencies,
  disabled = false,
}: {
  control: Control<TFieldValues>
  prefix: string
  label?: string
  watch: UseFormWatch<TFieldValues>
  /**
   * We need to track amount of `MoneyFields` in the form to set proper z-index
   * to avoid overlapping dropdowns.
   */
  order: number
  currencies?: CurrencyCode[]
  disabled?: boolean
}) => {
  const currency = watch(`${prefix}.currency` as any)

  return (
    <div>
      {label && (
        <FormHelpers.Label disabled={disabled}>{label}</FormHelpers.Label>
      )}
      <div className="relative">
        <div
          className="absolute top-3 left-2.5 z-[3] w-[55px]"
          style={{ zIndex: 10 - order }}
        >
          <Select
            name={`${prefix}.currency` as any}
            searchable
            options={getCurrencyList(currencies).map((curr) => ({
              value: curr.value,
              label: curr.value,
            }))}
            control={control}
            theme="dark"
            size="small"
            disabled={disabled}
          />
        </div>
        <Input
          control={control}
          type="number"
          name={`${prefix}.amount` as any}
          renderType="currency"
          currency={currencyToSymbol(currency)}
          inputClassName="pl-[75px]"
          placeholder={currencyToSymbol(currency)}
          label={label}
          hideLabel
          padFractionalZeros={false}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default MoneyFields
