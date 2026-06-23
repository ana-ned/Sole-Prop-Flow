import { useEffect, useId } from "react"
import { capitalize } from "lodash-es"
import Autocomplete from "react-google-autocomplete"
import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import { twMerge } from "tailwind-merge"
import env from "../../../utils/runtime-env"
import FormHelpers from "../FormHelpers"

interface IGoogleAutoCompleteProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  onSelect: (selectectedAddress: any) => void
  country?: string[]
  className?: string
  name: TName
  control: Control<TFieldValues>
  label: string
  defaultValue?: PathValue<TFieldValues, TName>
  disabled?: boolean
}

export interface TGoogleAddress {
  postalCode: string
  country: string
  countryAlpha2Code: string
  region: string
  locality: string
  addressLine1: string
  addressLine2: string
  street: string
  buildingNumber: string
  apartmentNumber: string
}

const API_KEY = env("REACT_APP_GOOGLE_PLACES_API_KEY")
const DEFAULT_OPTIONS = {
  types: ["address"],
  fields: ["address_components", "geometry", "formatted_address"],
}

export const getAddressObject = (
  components: google.maps.GeocoderAddressComponent[] | undefined
): TGoogleAddress => {
  const address: TGoogleAddress = {
    postalCode: "",
    country: "",
    countryAlpha2Code: "",
    region: "",
    locality: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
  }
  let streetNumber = ""

  if (components && Array.isArray(components)) {
    components.forEach((item: any) => {
      const type = item.types[0]
      switch (type) {
        case "country": {
          address.country = item.long_name
          address.countryAlpha2Code = item.short_name
          break
        }
        case "postal_code": {
          address.postalCode = item.long_name
          break
        }
        case "locality": {
          address.locality = item.long_name
          break
        }
        case "postal_town": {
          address.locality = item.long_name
          break
        }
        case "route": {
          address.addressLine1 = item.long_name
          address.street = item.long_name
          break
        }
        case "subpremise": {
          address.addressLine2 = capitalize(item.long_name)
          address.apartmentNumber = capitalize(item.long_name)
          break
        }
        case "administrative_area_level_1": {
          address.region = item.long_name
          break
        }
        case "street_number": {
          streetNumber = item.long_name
          address.buildingNumber = item.long_name
          break
        }
        default: {
          break
        }
      }
    })

    if (streetNumber) {
      address.addressLine1 = `${address.addressLine1} ${streetNumber}`
    }
  }

  return address
}

const GoogleAutocompleteInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  country,
  onSelect,
  className,
  name,
  control,
  label,
  defaultValue,
  disabled = false,
}: IGoogleAutoCompleteProps<TFieldValues, TName>) => {
  const currentId = useId()
  const {
    field: inputProps,
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const inputClasses = twMerge(
    "h-11 w-full rounded-lg border border-(--color-input-border) bg-(--color-input-background) px-2.5 text-sm text-(--color-text-primary) transition-all",
    "placeholder:text-sm placeholder:text-(--color-text-disabled)",
    "focus:border-(--color-input-border-active) focus:ring-(--color-input-border-active) focus:outline-none focus:ring",
    "disabled:text-neutral-500 disabled:bg-(--color-input-background-disabled) disabled:border-(--color-input-border-disabled)",
    invalid && "border-(--color-input-border-error)"
  )

  return (
    <div className={className}>
      {label && (
        <FormHelpers.Label htmlFor={currentId} disabled={disabled}>
          {label}
        </FormHelpers.Label>
      )}
      <Autocomplete
        apiKey={API_KEY}
        data-testid={inputProps.name}
        onPlaceSelected={(place) => {
          inputProps.onChange(place.formatted_address)
          onSelect(getAddressObject(place.address_components))
        }}
        language="en-US"
        options={{
          ...DEFAULT_OPTIONS,
          ...(country &&
            country.length > 0 &&
            country.length < 6 && {
              componentRestrictions: {
                country,
              },
            }),
        }}
        id={currentId}
        placeholder={label}
        disabled={disabled}
        className={inputClasses}
        {...inputProps}
      />
      <FormHelpers.Message error={error?.message?.replace(name, label)} />
    </div>
  )
}

export default GoogleAutocompleteInput
