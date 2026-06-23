import { useEffect, useState } from "react"
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import countries from "../../../models/countries"
import CountryService from "../../../services/country"
import PostalCode from "../../../utils/validator-rules/postal-codes"
import Button from "../../Basic/Button"
import Typography from "../../Basic/Typography"
import FormControl from "../FormControl"
import GoogleAutocompleteInput, {
  TGoogleAddress,
} from "../GoogleAutocompleteInput"
import Input from "../Input"
import Select from "../Select"

export type IAddressAutocomplete = yup.Asserts<typeof AddressValidationSchema>

export const AddressValidationSchema = yup.object({
  location: yup.string().when("addressLine1", {
    is: (value: string) => !value,
    then: (s) => s.required(),
  }),
  country: yup.string().required(),
  addressLine1: yup.string().required().max(49),
  addressLine2: yup.string().max(40),
  locality: yup.string().required().max(49),
  region: yup.string().when("country", {
    is: (country: string) => CountryService.hasRegions(country),
    then: (s) => s.required().max(49),
  }),
  postalCode: yup.string().required().test(PostalCode),
})

export type IAddressAutocompleteEquifax = yup.Asserts<
  typeof AddressValidationSchemaEquifax
>

export const AddressValidationSchemaEquifax = yup.object({
  location: yup.string().when("street", {
    is: (value: string) => !value,
    then: (s) => s.required(),
  }),
  country: yup.string().required(),
  street: yup.string().required().max(49),
  buildingNumber: yup.string().required().max(20),
  apartmentNumber: yup.string().max(20),
  locality: yup.string().required().max(49),
  region: yup.string().when("country", {
    is: (country: string) => CountryService.hasRegions(country),
    then: (s) => s.required().max(49),
  }),
  postalCode: yup.string().required().test(PostalCode),
})

type AddressFieldsVariant = "default" | "equifax"

const AddressFields = ({
  control,
  setValue,
  prefix,
  watch,
  label,
  searchable = true,
  variant = "default",
}: {
  control: Control<any>
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  prefix: string
  label?: string
  searchable?: boolean
  variant?: AddressFieldsVariant
}) => {
  const { t } = useTranslation()
  const country = watch(`${prefix}.country`)
  const addressLineField = variant === "equifax" ? "street" : "addressLine1"
  const isFilled = watch(`${prefix}.${addressLineField}`)
  const [manualMode, setManualMode] = useState<boolean>(!searchable)

  useEffect(() => {
    if (isFilled) {
      setManualMode(true)
    }
  }, [isFilled])

  const getRegionLabel = () => {
    if (country === "USA") {
      return t("addressAutocompleteFields.state")
    }

    if (country === "CAN") {
      return t("addressAutocompleteFields.province")
    }

    return t("addressAutocompleteFields.region")
  }

  const handleAddressSelect = (
    address: TGoogleAddress,
    shouldValidate = true
  ) => {
    setValue(
      `${prefix}.country`,
      countries.find((item) => item["alpha-2"] === address.countryAlpha2Code)?.[
        "alpha-3"
      ]!,
      { shouldValidate }
    )
    if (variant === "equifax") {
      setValue(`${prefix}.street`, address.street, {
        shouldValidate,
      })
      setValue(`${prefix}.buildingNumber`, address.buildingNumber, {
        shouldValidate,
      })
      setValue(`${prefix}.apartmentNumber`, address.apartmentNumber, {
        shouldValidate,
      })
    } else {
      setValue(`${prefix}.addressLine1`, address.addressLine1, {
        shouldValidate,
      })
      setValue(`${prefix}.addressLine2`, address.addressLine2, {
        shouldValidate,
      })
    }
    setValue(`${prefix}.locality`, address.locality, { shouldValidate })
    setValue(`${prefix}.region`, address.region, { shouldValidate })
    setValue(`${prefix}.postalCode`, address.postalCode, { shouldValidate })
    setManualMode(true)
  }

  return (
    <>
      {label && (
        <Typography type="bodyTitle" color="neutral-700" className="mb-2">
          {label}
        </Typography>
      )}
      {!manualMode && (
        <FormControl>
          <GoogleAutocompleteInput
            control={control}
            name={`${prefix}.location`}
            label={t("addressAutocompleteFields.location")}
            onSelect={handleAddressSelect}
            country={countries.map((item) => item["alpha-2"])}
          />
        </FormControl>
      )}
      {manualMode && (
        <>
          {searchable && (
            <FormControl>
              <Select
                label={t("addressAutocompleteFields.country")}
                name={`${prefix}.country`}
                searchable
                control={control}
                options={CountryService.getSelectOptions()}
                filterOption={CountryService.getSelectFilter}
                onChange={(selected) => {
                  setValue(`${prefix}.location`, "")
                  if (variant === "equifax") {
                    setValue(`${prefix}.street`, "", { shouldValidate: false })
                    setValue(`${prefix}.buildingNumber`, "", {
                      shouldValidate: false,
                    })
                    setValue(`${prefix}.apartmentNumber`, "", {
                      shouldValidate: false,
                    })
                    setValue(`${prefix}.locality`, "", {
                      shouldValidate: false,
                    })
                    setValue(`${prefix}.region`, "", {
                      shouldValidate: false,
                    })
                    setValue(`${prefix}.postalCode`, "", {
                      shouldValidate: false,
                    })
                    setValue(
                      `${prefix}.country`,
                      countries.find(
                        (item) => item["alpha-2"] === selected.entity["alpha-2"]
                      )?.["alpha-3"]!,
                      { shouldValidate: false }
                    )
                  } else {
                    handleAddressSelect(
                      {
                        postalCode: "",
                        country: selected.entity,
                        countryAlpha2Code: selected.entity["alpha-2"],
                        region: "",
                        locality: "",
                        addressLine1: "",
                        addressLine2: "",
                        street: "",
                        buildingNumber: "",
                        apartmentNumber: "",
                      },
                      false
                    )
                  }
                }}
              />
            </FormControl>
          )}
          {variant === "equifax" ? (
            <>
              <FormControl>
                <Input
                  control={control}
                  name={`${prefix}.street`}
                  label={t("addressAutocompleteFields.street")}
                />
              </FormControl>
              <FormControl>
                <Input
                  control={control}
                  name={`${prefix}.buildingNumber`}
                  label={t("addressAutocompleteFields.buildingNumber")}
                />
              </FormControl>
              <FormControl>
                <Input
                  control={control}
                  name={`${prefix}.apartmentNumber`}
                  label={t("addressAutocompleteFields.apartmentNumber")}
                />
              </FormControl>
            </>
          ) : (
            <>
              <FormControl>
                <Input
                  control={control}
                  name={`${prefix}.addressLine1`}
                  label={t("addressAutocompleteFields.addressLine1")}
                />
              </FormControl>
              <FormControl>
                <Input
                  control={control}
                  name={`${prefix}.addressLine2`}
                  label={t("addressAutocompleteFields.addressLine2")}
                />
              </FormControl>
            </>
          )}
          <FormControl>
            <Input
              control={control}
              name={`${prefix}.locality`}
              label={t("addressAutocompleteFields.city")}
            />
          </FormControl>
          <FormControl>
            {CountryService.hasRegions(country) ? (
              <Select
                control={control}
                name={`${prefix}.region`}
                label={getRegionLabel()}
                options={
                  CountryService.getByAlpha3(country)?.regions?.map((item) => ({
                    value: item.name,
                    label: item.name,
                  })) || []
                }
                searchable
              />
            ) : (
              <Input
                control={control}
                name={`${prefix}.region`}
                label={getRegionLabel()}
              />
            )}
          </FormControl>
          <FormControl>
            <Input
              control={control}
              name={`${prefix}.postalCode`}
              label={
                country === "USA"
                  ? t("addressAutocompleteFields.zipCode")
                  : t("addressAutocompleteFields.postcode")
              }
            />
          </FormControl>
          {!searchable && (
            <FormControl>
              <Select
                label={t("addressAutocompleteFields.country")}
                name={`${prefix}.country`}
                searchable
                control={control}
                options={CountryService.getSelectOptions()}
                filterOption={CountryService.getSelectFilter}
              />
            </FormControl>
          )}
        </>
      )}
      {searchable && (
        <div className="-mt-2">
          <Button
            type="button"
            variant="link"
            onClick={() => {
              setManualMode(!manualMode)
            }}
            data-testid={`${prefix}.manualButton`}
          >
            {manualMode
              ? t("addressAutocompleteFields.searchMode")
              : t("addressAutocompleteFields.manualMode")}
          </Button>
        </div>
      )}
    </>
  )
}

export default AddressFields
