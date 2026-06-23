import { yupResolver } from "@hookform/resolvers/yup"
import { Search } from "@material-ui/icons"
import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import PhoneFormat from "../../../utils/validator-rules/phone"
import Input from "./Input"

export default {
  title: "Forms/Input",
  component: Input,
} as Meta<typeof Input>

export const Default = () => {
  const { control } = useForm()

  return <Input label="Company name" name="companyName" control={control} />
}

export const Password = () => {
  const { control } = useForm()

  return (
    <Input label="Password" name="password" type="password" control={control} />
  )
}

export const Disabled = () => {
  const { control } = useForm()

  return (
    <Input
      label="Company name"
      name="companyName"
      control={control}
      disabled
      defaultValue="Acme Inc."
    />
  )
}

export const Currency = () => {
  const { control } = useForm()

  return (
    <Input
      label="Amount ($)"
      name="amount"
      control={control}
      renderType="currency"
      currency="$"
    />
  )
}

export const DateInput = () => {
  const { control } = useForm()

  return (
    <Input
      label="Birth date (MM/DD/YYYY)"
      name="birthDate"
      control={control}
      renderType="mask"
      mask="00/00/0000"
    />
  )
}

export const Ssn = () => {
  const { control, watch } = useForm()

  const value = watch("ssn")

  return (
    <>
      <Input
        label="Social security number"
        name="ssn"
        control={control}
        renderType="mask"
        mask="000-00-0000"
      />
      <p>Value: {value}</p>
    </>
  )
}

export const WithCharCounter = () => {
  const { control } = useForm()

  return (
    <Input
      label="Description"
      name="description"
      control={control}
      maxLength={10}
      charCount={10}
    />
  )
}

export const ReadOnly = () => {
  const { control } = useForm()

  return <Input label="Amount ($)" name="test" control={control} readonly />
}

export const Placeholder = () => {
  const { control } = useForm()

  return <Input placeholder="Type to search" name="test" control={control} />
}

export const Phone = () => {
  const { control, watch } = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      yup.object().shape({
        phone: yup.string().required().test(PhoneFormat()),
        phone2: yup.string().required().test(PhoneFormat()),
        phone3: yup.string().required().test(PhoneFormat()),
        phone4: yup.string().required().test(PhoneFormat()),
        phone5: yup.string().required().test(PhoneFormat()),
      })
    ),
    defaultValues: {
      phone: "",
      phone2: "+48222444666",
      phone3: "330-555-8831",
      phone4: "+1 330-555-8831",
      phone5: "3036019226",
    },
  })

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Input
          label="Phone"
          name="phone"
          control={control}
          renderType="phone"
        />
        Input Value: {watch("phone")}
      </div>
      <div>
        <Input
          label="Phone (pre-filled)"
          name="phone2"
          control={control}
          renderType="phone"
        />
        Input Value: {watch("phone2")}
      </div>
      <div>
        <Input
          label="Phone (pre-filled)"
          name="phone3"
          control={control}
          renderType="phone"
        />
        Input Value: {watch("phone3")}
      </div>
      <div>
        <Input
          label="Phone (pre-filled)"
          name="phone4"
          control={control}
          renderType="phone"
        />
        Input Value: {watch("phone4")}
      </div>
    </div>
  )
}

export const NoLabel = () => {
  const { control } = useForm()

  return <Input name="companyName" control={control} />
}

export const WithIcon = () => {
  const { control } = useForm()

  return (
    <Input
      label="Search"
      name="search"
      control={control}
      placeholder="Type to search"
      icon={<Search />}
    />
  )
}

export const Email = () => {
  const { control } = useForm()

  return (
    <Input
      label="Email address"
      name="email"
      type="email"
      control={control}
      placeholder="you@example.com"
    />
  )
}

export const NumberType = () => {
  const { control } = useForm()

  return (
    <Input
      label="Quantity"
      name="quantity"
      type="number"
      control={control}
      placeholder="Enter a number"
    />
  )
}

export const WithHelpText = () => {
  const { control } = useForm()

  return (
    <Input
      label="Username"
      name="username"
      control={control}
      helpText="Your username must be between 3-20 characters"
    />
  )
}

export const WithCharCounterAlert = () => {
  const { control } = useForm({
    defaultValues: {
      description: "This text is getting long",
    },
  })

  return (
    <Input
      label="Description"
      name="description"
      control={control}
      maxLength={50}
      charCount={50}
      charCountAlertOver={30}
      helpText="Keep it brief"
    />
  )
}
