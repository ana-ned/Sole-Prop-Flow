import { yupResolver } from "@hookform/resolvers/yup"
import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import Button from "../../Basic/Button"
import AddressFields, {
  AddressValidationSchema,
  AddressValidationSchemaEquifax,
  IAddressAutocomplete,
  IAddressAutocompleteEquifax,
} from "./AddressAutocompleteFields"

export default {
  title: "Forms/AddressAutocompleteFields",
  component: AddressFields,
} as Meta<typeof AddressFields>

export const Default = () => {
  const schema = yup.object().shape({
    billingAddress: AddressValidationSchema,
  })

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data))
      })}
    >
      <AddressFields
        control={control}
        setValue={setValue}
        watch={watch}
        prefix="billingAddress"
      />
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
}

export const Prefilled = () => {
  const defaultValues: { billingAddress: IAddressAutocomplete } = {
    billingAddress: {
      location: "",
      country: "USA",
      addressLine1: "123 Main St",
      addressLine2: "Apt. 1",
      locality: "New York",
      region: "New York",
      postalCode: "10001",
    },
  }

  const schema = yup.object().shape({
    billingAddress: AddressValidationSchema,
  })

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data))
      })}
    >
      <AddressFields
        control={control}
        setValue={setValue}
        watch={watch}
        prefix="billingAddress"
      />
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
}

export const Equifax = () => {
  const schema = yup.object().shape({
    billingAddress: AddressValidationSchemaEquifax,
  })

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data))
      })}
    >
      <AddressFields
        control={control}
        setValue={setValue}
        watch={watch}
        prefix="billingAddress"
        variant="equifax"
      />
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
}

export const EquifaxPrefilled = () => {
  const defaultValues: { billingAddress: IAddressAutocompleteEquifax } = {
    billingAddress: {
      location: "",
      country: "USA",
      street: "Main St",
      buildingNumber: "123",
      apartmentNumber: "1A",
      locality: "New York",
      region: "New York",
      postalCode: "10001",
    },
  }

  const schema = yup.object().shape({
    billingAddress: AddressValidationSchemaEquifax,
  })

  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onBlur",
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data))
      })}
    >
      <AddressFields
        control={control}
        setValue={setValue}
        watch={watch}
        prefix="billingAddress"
        variant="equifax"
      />
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
}
