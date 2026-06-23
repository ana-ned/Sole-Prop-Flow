import { useState, useCallback, useEffect, useMemo, useRef, useId } from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
} from "@headlessui/react"
import { useMutation } from "@tanstack/react-query"
import Fuse from "fuse.js"
import debounce from "lodash-es/debounce"
import { Control, FieldPath, FieldValues, useController } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { twMerge } from "tailwind-merge"
import useDevice from "../../../hooks/useDevice"
import { ExternalCompanyResponse } from "../../../services/api/organisation-users"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"
import { ReactComponent as SearchIcon } from "../../../svgs/search.svg"
import { getTextSuggestions } from "../../../utils/string"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"
import Loader from "../../UI/Loader"
import FormHelpers from "../FormHelpers"

export interface SelectedOption {
  label: string
  value: string
  subtitle?: {
    left?: string
    right?: string
  }
  data?: ExternalCompanyResponse
}

function getFormattedErrorMessage(
  errorMessage: string | undefined,
  name: string,
  label: string
): string | undefined {
  if (!errorMessage) return undefined
  const firstWord = errorMessage.split(" ")[0]
  if (firstWord === name && label) {
    return errorMessage.replace(name, label)
  }
  return errorMessage
}

const CustomCombobox = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  control,
  helpText,
  onChange,
  loadFn,
  createOption,
  disabled,
  displayValue = (item?: SelectedOption) => item?.label || "",
}: {
  label: string
  name: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  helpText?: string
  onChange: (value?: SelectedOption) => void
  loadFn: (searchQuery: string) => Promise<SelectedOption[]>
  createOption?: {
    title: string
    description: string
  }
  disabled?: boolean
  displayValue?: (item?: SelectedOption) => string
}) => {
  const { t } = useTranslation()
  const inputId = useId()
  const { field, fieldState } = useController({
    name,
    control,
  })
  const [query, setQuery] = useState("")
  const { isMobile } = useDevice()
  const [selectedOption, setSelectedOption] = useState<SelectedOption | null>(
    null
  )
  const [isInputMode, setIsInputMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) return []

      return loadFn(searchQuery)
    },
  })

  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current && !selectedOption && query) {
        inputRef.current.value = query
      }
    }

    inputRef.current?.addEventListener("focus", handleFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => inputRef.current?.removeEventListener("focus", handleFocus)
  }, [selectedOption, query])

  useEffect(() => {
    const handleDefaultValue = () => {
      if (!selectedOption && field.value && !query) {
        setSelectedOption({
          value: field.value,
          label: field.value,
          data: undefined,
        })
        setQuery(field.value)
        mutation.mutate(field.value)
      }
    }

    handleDefaultValue()
  }, [field.value, selectedOption, mutation, query])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      mutation.mutate(searchQuery)
    }, 300),
    [mutation.mutate]
  )

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearch = (searchQuery: string) => {
    mutation.reset()
    setSelectedOption(null)
    setQuery(searchQuery)
    debouncedSearch(searchQuery)
  }

  const improvedSearch = useMemo(() => {
    const fuse = new Fuse(mutation.data || [], {
      keys: ["value"],
      threshold: 0.4,
    })

    return fuse.search(selectedOption?.value || query || "")
  }, [mutation.data, query, selectedOption])

  return (
    <Field className="relative w-full" disabled={disabled}>
      <FormHelpers.Label htmlFor={inputId} disabled={disabled}>
        {label}
      </FormHelpers.Label>
      <Combobox
        immediate
        value={selectedOption}
        onChange={(value?: SelectedOption | null) => {
          setSelectedOption(value || null)
          field.onChange(value?.value || null)
          field.onBlur()
          onChange(value || undefined)

          // Switch to input mode if custom option was created (no data attached)
          if (value && !value.data) {
            setIsInputMode(true)
          }
        }}
        onClose={() => {
          field.onBlur()
        }}
      >
        <div className="relative">
          {!disabled && !isInputMode && (
            <button
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer border-none bg-none p-1 [&>svg]:size-5"
              type="button"
              onClick={() => {
                if (selectedOption) {
                  setQuery("")
                  field.onChange(null)
                  onChange(undefined)
                  mutation.reset()
                  setSelectedOption(null)
                }
                inputRef.current?.focus()
              }}
            >
              {selectedOption ? <CloseIcon /> : <SearchIcon />}
            </button>
          )}
          <ComboboxInput
            id={inputId}
            ref={inputRef}
            className={twMerge(
              "h-11 w-full rounded-lg border border-(--color-input-border) bg-(--color-input-background) px-2.5 text-sm text-(--color-text-primary) transition-all",
              "placeholder:text-sm placeholder:text-(--color-text-disabled)",
              "focus:border-(--color-input-border-active) focus:ring focus:ring-(--color-input-border-active) focus:outline-none",
              "disabled:border-(--color-input-border-disabled) disabled:bg-(--color-input-background-disabled) disabled:text-neutral-500",
              fieldState.error &&
                fieldState.isTouched &&
                "border-(--color-input-border-error) focus:ring-(--color-input-border-error)"
            )}
            displayValue={displayValue}
            onChange={(event) => {
              if (isInputMode) {
                setQuery(event.target.value)
                field.onChange(event.target.value)
              } else {
                handleSearch(event.target.value)
              }
            }}
            placeholder={label}
            data-testid={name}
          />
        </div>
        <ComboboxOptions
          anchor="bottom"
          className="z-2 mt-px w-(--input-width) rounded-lg bg-white shadow-[0_1px_3px_0_rgb(0_0_0/0.16),0_8px_24px_0_rgb(0_0_0/0.08)]"
          modal={false}
        >
          {!isInputMode && mutation.isPending && (
            <ComboboxOption
              disabled
              value={null}
              className="bg-white px-4 py-2"
            >
              <div className="flex items-center justify-center gap-x-2">
                <Loader size="xxs" />
                <Typography>{t("CustomCombobox.loading")}</Typography>
              </div>
            </ComboboxOption>
          )}
          {!isInputMode &&
            !mutation.isPending &&
            improvedSearch.slice(0, isMobile ? 5 : 7).map((option) => (
              <ComboboxOption
                key={option.item.data?.id || option.item.value}
                value={option.item}
                className="data-focus:bg-surface-elevated-1 bg-white px-4 py-2 data-focus:cursor-pointer"
              >
                <Typography color="neutral-800" type="bodyTitle">
                  <SanitizedHtml
                    className="u-text-suggestions"
                    as="span"
                    content={getTextSuggestions(option.item.label || "", query)}
                  />
                </Typography>
                {option.item.subtitle && (
                  <div className="mt flex justify-between">
                    {option.item.subtitle.left && (
                      <Typography type="smallTitle" color="neutral-700">
                        {option.item.subtitle.left}
                      </Typography>
                    )}
                    {option.item.subtitle.right && (
                      <Typography type="smallCopy" color="neutral-700">
                        {option.item.subtitle.right}
                      </Typography>
                    )}
                  </div>
                )}
              </ComboboxOption>
            ))}
          {!isInputMode &&
            !mutation.isPending &&
            !mutation.isIdle &&
            query.length >= 2 &&
            createOption && (
              <ComboboxOption
                value={
                  {
                    value: query,
                    label: query,
                    data: undefined,
                  } satisfies SelectedOption
                }
                className="data-focus:bg-surface-elevated-1 bg-white px-4 py-2 not-only:border-t not-only:border-neutral-300 data-focus:cursor-pointer"
              >
                <>
                  <Typography color="brand-600" type="bodyTitle">
                    {createOption.title}
                  </Typography>
                  <Typography color="neutral-700" type="smallCopy">
                    {createOption.description}
                  </Typography>
                </>
              </ComboboxOption>
            )}
        </ComboboxOptions>
      </Combobox>

      <FormHelpers.Message
        error={getFormattedErrorMessage(fieldState.error?.message, name, label)}
        helpText={
          !fieldState.error && helpText ? (
            <>
              {helpText}
              {isInputMode && (
                <>
                  {" "}
                  <button
                    type="button"
                    className="text-text-link text-xs font-bold hover:underline"
                    onClick={() => {
                      setIsInputMode(false)
                      setQuery("")
                      setSelectedOption(null)
                      field.onChange(null)
                      onChange(undefined)
                      mutation.reset()
                      inputRef.current?.focus()
                    }}
                  >
                    {t("CustomCombobox.searchInstead")}
                  </button>
                </>
              )}
            </>
          ) : undefined
        }
        isTouched={fieldState.isTouched}
      />
    </Field>
  )
}

export default CustomCombobox
