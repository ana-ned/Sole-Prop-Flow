import { useState, useEffect, useMemo, useCallback, useId } from "react"
import { Close } from "@material-ui/icons"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import ReactSelect, {
  components,
  InputActionMeta,
  MultiValue,
} from "react-select"
import { twMerge } from "tailwind-merge"
import Typography from "../../Basic/Typography"
import FormHelpers from "../FormHelpers"

const getTheme = ({ size, theme }: { size?: "small"; theme?: "dark" }) => {
  const inputBackgroundColor =
    theme === "dark"
      ? "var(--color-surface-elevated-1)"
      : "var(--color-input-background)"
  const inputHeight = size === "small" ? 20 : 44
  const inputBorderRadius = size === "small" ? "4px" : "8px"
  const inputBorderColor =
    theme === "dark" ? "transparent" : "var(--color-input-border)"

  return {
    inputBackgroundColor,
    inputHeight,
    inputBorderRadius,
    inputBorderColor,
  }
}

const SelectCustomStyles = ({
  invalid,
  isTouched,
  disabled,
  theme,
  size,
}: {
  invalid: boolean
  isTouched: boolean
  theme?: "dark"
  size?: "small"
  disabled: boolean
}) => ({
  control: (provided: any, state: any) => {
    const themeValues = getTheme({ size, theme })
    const getBorderColor = () => {
      if (disabled) return "var(--color-input-border-disabled)"
      if (invalid && isTouched) return "var(--color-input-border-error)"
      if (state.isFocused) return "var(--color-input-border-active)"
      return themeValues.inputBorderColor
    }

    return {
      ...provided,
      borderRadius: themeValues.inputBorderRadius,
      borderColor: getBorderColor(),
      boxShadow: state.isFocused
        ? "0 0 0 1px var(--color-input-border-active)"
        : "none",
      height: state.isMulti ? "auto" : themeValues.inputHeight,
      minHeight: themeValues.inputHeight,
      background: disabled
        ? "var(--color-input-background-disabled)"
        : themeValues.inputBackgroundColor,
      cursor: disabled ? "not-allowed" : "pointer",

      "&:hover": {},
    }
  },
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    paddingTop: 0,
    paddingLeft: size === "small" ? 4 : 10,
    paddingRight: size === "small" ? 0 : 10,
    paddingBottom: 0,
    maxHeight: "100%",
    ...(state.isMulti ? { padding: "9px 10px !important", gap: 8 } : {}),
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0px",
    fontSize: size === "small" ? 11 : 14,
  }),
  multiValue: (_styles: any, { data }: any) => {
    const colors = {
      background: "var(--color-brand-600)",
      border: "var(--color-brand-600)",
    }
    if (data.entity?.valid) {
      colors.background = "var(--color-success-200)"
      colors.border = "var(--color-success-300)"
    } else if (typeof data.entity?.valid === "boolean" && !data.entity?.valid) {
      colors.background = "var(--color-error-200)"
      colors.border = "var(--color-error-300)"
    }

    return {
      borderRadius: "100px",
      background: colors.background,
      display: "flex",
      padding: "2px 4px 2px 8px",
      border: `1px solid ${colors.border}`,
      alignItems: "center",
      gap: 4,

      '[role="button"]': {
        fontSize: 0,
      },
    }
  },
  multiValueLabel: (_styles: any, { data }: any) => {
    const colors = {
      text: "var(--color-white)",
    }
    if (data.entity?.valid) {
      colors.text = "var(--color-text-success)"
    } else if (typeof data.entity?.valid === "boolean" && !data.entity?.valid) {
      colors.text = "var(--color-text-error)"
    }

    return {
      color: colors.text,
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      padding: 0,
      fontStyle: "normal",
    }
  },
  multiValueRemove: (_styles: any, { data }: any) => {
    const colors = {
      text: "var(--color-white)",
    }
    if (data.entity?.valid) {
      colors.text = "var(--color-text-success)"
    } else if (typeof data.entity?.valid === "boolean" && !data.entity?.valid) {
      colors.text = "var(--color-text-error)"
    }

    return {
      color: colors.text,
    }
  },
  singleValue: (provided: any) => ({
    ...provided,
    color: disabled ? "var(--color-neutral-500)" : "var(--color-text-primary)",
    marginLeft: 0,
    fontSize: "14px",

    "& > p:nth-of-type(2)": { display: "none" },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    marginTop: 0,
    fontSize: "14px",
    color: "var(--color-text-disabled)",
    transition: "all 0.3s ease",
  }),
  indicatorsContainer: (provided: any, state: any) => ({
    ...provided,
    ...(state.isMulti ? { display: "none" } : {}),
    maxHeight: "100%",
    height: getTheme({ size, theme }).inputHeight,
    svg: {
      width: size === "small" ? 16 : 24,
      height: size === "small" ? 16 : 24,
      color: disabled ? "var(--color-neutral-500)" : "var(--color-neutral-800)",
    },
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    display: "block",
    ...(size === "small" ? { padding: 0 } : {}),
  }),
  noOptionsMessage: (provided: any) => ({
    ...provided,
    ...(size === "small" ? { fontSize: 12 } : {}),
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: "none",
  }),
  menu: (provided: any) => ({
    ...provided,
    boxShadow:
      "0px 0px 2px 0px rgba(0, 0, 0, 0.08), 0px 2px 10px 0px rgba(0, 0, 0, 0.07)",
    borderRadius:
      size === "small" ? getTheme({ size, theme }).inputBorderRadius : 12,
    overflow: "hidden",
    marginTop: 8,
    zIndex: 10,
    width: size === "small" ? "auto" : "100%",
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor:
      state.isSelected || state.isFocused
        ? "var(--color-surface-elevated-1)"
        : "transparent",
    color: "var(--color-neutral-800)",
    fontSize: "14px",
    padding: "8px 12px",

    ":active": {
      backgroundColor: state.isDisabled
        ? undefined
        : "var(--color-surface-elevated-1)",
      color: "currentColor",
    },
  }),
})

const ChevronDownIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDownIcon size={props.selectProps.size === "small" ? 16 : 20} />
    </components.DropdownIndicator>
  )
}

const MultiValueRemove = (props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <Close className="size-4!" />
    </components.MultiValueRemove>
  )
}

interface OptionItem<T = any> {
  value: string
  label: string
  sub?: string
  entity?: T
}

interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  defaultValue?: PathValue<TFieldValues, TName>
  name: TName
  label?: string
  disabled?: boolean
  options: OptionItem[]
  searchable?: boolean
  control: Control<TFieldValues>
  valueKey?: "value" | "label"
  onChange?: (selected: OptionItem) => void
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void
  className?: string
  filterOption?: any
  isMulti?: boolean
  placeholder?: string
  theme?: "dark"
  size?: "small"
  helpText?: string
  isLoading?: boolean
}

const Select = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  defaultValue,
  name,
  label,
  disabled = false,
  options,
  searchable = false,
  control,
  onChange = () => null,
  onInputChange = () => undefined,
  valueKey = "value",
  className,
  filterOption,
  isMulti = false,
  placeholder,
  theme,
  size,
  helpText,
  isLoading = false,
}: SelectProps<TFieldValues, TName>) => {
  const currentId = useId()

  const {
    field: { ref, ...inputProps },
    fieldState: { invalid, isTouched, error },
  } = useController({
    name,
    control,
    defaultValue,
  })
  const { t } = useTranslation()
  const initialValue = useMemo(() => {
    if (isMulti) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        options.filter((item) => inputProps.value?.includes(item[valueKey])) ||
        []
      )
    }
    return options.find((item) => item[valueKey] === inputProps.value) || null
  }, [isMulti, inputProps.value, options, valueKey])
  const [value, setValue] = useState<
    OptionItem | MultiValue<OptionItem> | null
  >(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const CustomLabel = useCallback(
    (option: OptionItem) => {
      if (isMulti) {
        return option.label
      }

      return (
        <>
          <Typography
            color={disabled ? "neutral-500" : "neutral-800"}
            type={size === "small" ? "footnote" : "smallCopy"}
          >
            {option.label}
          </Typography>
          {option.sub && (
            <Typography
              color={disabled ? "neutral-500" : "neutral-700"}
              type="smallCopy"
            >
              {option.sub}
            </Typography>
          )}
        </>
      )
    },
    [isMulti, size, disabled]
  )

  return (
    <div className={twMerge(className)} data-testid={name}>
      {label && (
        <FormHelpers.Label htmlFor={currentId} disabled={disabled}>
          {label}
        </FormHelpers.Label>
      )}
      <ReactSelect
        styles={SelectCustomStyles({
          invalid,
          isTouched,
          theme,
          size,
          disabled,
        })}
        theme={
          size === "small"
            ? (themeX) => ({
                ...themeX,
                spacing: {
                  ...themeX.spacing,
                  baseUnit: 0,
                  controlHeight: 20,
                },
              })
            : undefined
        }
        options={options}
        placeholder={placeholder || t("select.placeholder")}
        inputId={currentId}
        name={name}
        isSearchable={searchable}
        isDisabled={disabled}
        components={{ DropdownIndicator, MultiValueRemove }}
        isLoading={isLoading}
        isMulti={isMulti}
        onChange={(selected) => {
          setValue(selected)
          if (selected) {
            if (Array.isArray(selected)) {
              inputProps.onChange(selected.map((el) => el[valueKey]))
            } else {
              // @ts-expect-error react-select multitype typings problem
              inputProps.onChange(selected[valueKey])
            }
            // @ts-expect-error react-select multitype typings problem
            onChange(selected)
          }
        }}
        onInputChange={onInputChange}
        onBlur={inputProps.onBlur}
        blurInputOnSelect
        controlShouldRenderValue
        value={value}
        // @ts-expect-error: react-select type conflicts with react-hook-form type
        inputRef={ref}
        formatOptionLabel={CustomLabel}
        role="textbox"
        filterOption={filterOption}
      />
      <FormHelpers.Message
        error={error?.message?.replace(name, label || "")}
        helpText={helpText}
        isTouched={isTouched}
      />
    </div>
  )
}

export default Select
