import { yupResolver } from "@hookform/resolvers/yup"
import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import AddressAutocompleteFields from "./AddressAutocompleteFields"
import Checkbox from "./Checkbox"
import CheckboxGroup from "./CheckboxGroup/CheckboxGroup"
import CustomCombobox from "./CustomCombobox"
import DateInput from "./DateInput"
import DateMonthYearInput from "./DateMonthYearInput"
import DatePicker from "./DatePicker"
import GoogleAutocompleteInput from "./GoogleAutocompleteInput"
import Input from "./Input"
import MoneyFields from "./MoneyFields"
import MultipleRadio from "./MultipleRadio"
import Select from "./Select"
import SliderInput from "./SliderInput"

export default {
  title: "Forms/All Inputs",
} as Meta

// Shared mock function for combobox/autocomplete demos
const mockLoadFn = (query: string) =>
  Promise.resolve([
    { value: "1", label: `Result for "${query}"` },
    { value: "2", label: "Another result" },
  ])

// Empty loadFn for disabled combobox
const emptyLoadFn = () => Promise.resolve([])

// No-op function for event handlers
const noop = () => {
  // intentionally empty for storybook demos
}

// Form submit handler for validation demo
const onFormSubmit = (data: unknown) => {
  console.log("Form submitted:", data)
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 border-b border-neutral-200 pb-2 text-lg font-semibold text-neutral-800">
    {children}
  </h2>
)

const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6 max-w-md">{children}</div>
)

export const AllInputComponents = () => {
  const { control, watch, setValue } = useForm<any>({
    defaultValues: {
      money: { currency: "USD", amount: "" },
      address: { country: "USA" },
    },
  })

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">
          All Input Components
        </h1>
        <p className="mb-8 text-neutral-600">
          Overview of all form input components with the new label design (no
          floating labels).
        </p>
      </div>

      {/* Text Inputs */}
      <section>
        <SectionTitle>Text Input</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <Input label="Empty Input" name="textInput" control={control} />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Filled Input"
              name="textInputFilled"
              control={control}
              defaultValue="John Doe"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Disabled Input"
              name="disabledInput"
              control={control}
              disabled
              defaultValue="Disabled value"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="With Help Text"
              name="helpTextInput"
              control={control}
              helpText="This is some helpful information"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="With Placeholder"
              name="placeholderInput"
              control={control}
              placeholder="Enter your name..."
            />
          </InputWrapper>
        </div>
      </section>

      {/* Email & Password */}
      <section>
        <SectionTitle>Email & Password</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <Input
              label="Email Address"
              name="email"
              type="email"
              control={control}
              placeholder="you@example.com"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Password"
              name="password"
              type="password"
              control={control}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Special Input Types */}
      <section>
        <SectionTitle>Special Input Types</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <Input
              label="Currency"
              name="currency"
              control={control}
              renderType="currency"
              currency="$"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="SSN (Masked)"
              name="maskedInput"
              control={control}
              renderType="mask"
              mask="000-00-0000"
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              label="Phone Number"
              name="phone"
              control={control}
              renderType="phone"
            />
          </InputWrapper>
        </div>
      </section>

      {/* Select */}
      <section>
        <SectionTitle>Select</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <Select
              label="Empty Select"
              name="select"
              options={[
                { value: "checking", label: "Checking Account" },
                { value: "savings", label: "Savings Account" },
                { value: "funding", label: "Funding Account" },
              ]}
              control={control}
            />
          </InputWrapper>
          <InputWrapper>
            <Select
              label="Prefilled Select"
              name="selectFilled"
              options={[
                { value: "checking", label: "Checking Account" },
                { value: "savings", label: "Savings Account" },
                { value: "funding", label: "Funding Account" },
              ]}
              control={control}
              defaultValue="checking"
            />
          </InputWrapper>
          <InputWrapper>
            <Select
              label="Disabled Select"
              name="selectDisabled"
              options={[
                { value: "checking", label: "Checking Account" },
                { value: "savings", label: "Savings Account" },
              ]}
              control={control}
              defaultValue="checking"
              disabled
            />
          </InputWrapper>
        </div>
      </section>

      {/* Date Inputs */}
      <section>
        <SectionTitle>Date Inputs</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <DateInput
              label="Date of Birth (EU Format)"
              name="dateInput"
              control={control}
              inputFormat="EU"
            />
          </InputWrapper>
          <InputWrapper>
            <DateInput
              label="Date of Birth (US Format)"
              name="dateInputUS"
              control={control}
              inputFormat="US"
            />
          </InputWrapper>
          <InputWrapper>
            <DateMonthYearInput
              label="Expiry Date (Month/Year)"
              name="dateMonthYear"
              control={control}
            />
          </InputWrapper>
          <InputWrapper>
            <DatePicker
              label="Select a Date"
              name="datePicker"
              control={control}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Combobox */}
      <section>
        <SectionTitle>Combobox / Autocomplete</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <CustomCombobox
              label="Search Company"
              name="combobox"
              control={control}
              loadFn={mockLoadFn}
              onChange={noop}
              helpText="Start typing to search"
            />
          </InputWrapper>
          <InputWrapper>
            <GoogleAutocompleteInput
              label="Address"
              name="address"
              control={control}
              onSelect={noop}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Checkbox */}
      <section>
        <SectionTitle>Checkbox</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <Checkbox
              label="I agree to the terms and conditions"
              name="checkbox"
              control={control}
            />
          </InputWrapper>
          <InputWrapper>
            <Checkbox
              label="Disabled checkbox"
              name="checkboxDisabled"
              control={control}
              disabled
            />
          </InputWrapper>
        </div>
      </section>

      {/* Slider */}
      <section>
        <SectionTitle>Slider</SectionTitle>
        <InputWrapper>
          <SliderInput
            label="Select Amount"
            name="slider"
            control={control}
            min={0}
            max={100}
          />
        </InputWrapper>
      </section>

      {/* Radio Groups */}
      <section>
        <SectionTitle>Radio Groups (MultipleRadio)</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <MultipleRadio
              label="Do you agree?"
              name="agree"
              control={control}
            />
          </InputWrapper>
          <InputWrapper>
            <MultipleRadio
              label="Select payment method"
              name="paymentMethod"
              control={control}
              options={[
                { value: "card", label: "Credit Card" },
                { value: "bank", label: "Bank Transfer" },
                { value: "crypto", label: "Cryptocurrency" },
              ]}
            />
          </InputWrapper>
          <InputWrapper>
            <MultipleRadio
              label="Account type"
              name="accountType"
              control={control}
              options={[
                {
                  value: "personal",
                  label: "Personal",
                  sub: "For individuals",
                },
                { value: "business", label: "Business", sub: "For companies" },
              ]}
            />
          </InputWrapper>
          <InputWrapper>
            <MultipleRadio
              label="Compact variant"
              name="compactRadio"
              control={control}
              variant="compact"
              options={[
                { value: "monthly", label: "Monthly", sub: "$10/mo" },
                { value: "yearly", label: "Yearly", sub: "$100/yr" },
              ]}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Money Fields */}
      <section>
        <SectionTitle>Money Fields (Currency + Amount)</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <InputWrapper>
            <MoneyFields
              label="Investment Amount"
              prefix="money"
              control={control}
              watch={watch}
              order={1}
            />
          </InputWrapper>
        </div>
      </section>

      {/* Address Fields */}
      <section>
        <SectionTitle>Address Autocomplete Fields</SectionTitle>
        <div className="max-w-xl rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <AddressAutocompleteFields
            control={control}
            setValue={setValue}
            watch={watch}
            prefix="address"
            label="Business Address"
          />
        </div>
      </section>
    </div>
  )
}

export const RegisterBasedComponents = () => {
  const { register, watch } = useForm({
    defaultValues: {
      interests: [],
      features: [],
    },
  })

  const selectedInterests = watch("interests")
  const selectedFeatures = watch("features")

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">
          Register-based Components
        </h1>
        <p className="mb-8 text-neutral-600">
          These components use react-hook-form&apos;s `register` instead of
          `control`.
        </p>
      </div>

      <section>
        <SectionTitle>Checkbox Group (uses register)</SectionTitle>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <CheckboxGroup
              label="Select your interests"
              name="interests"
              register={register}
              reverse
              options={[
                { value: "tech", label: "Technology" },
                { value: "finance", label: "Finance" },
                { value: "health", label: "Healthcare" },
                { value: "retail", label: "Retail" },
              ]}
            />
            <p className="mt-2 text-sm text-neutral-600">
              Selected: {JSON.stringify(selectedInterests)}
            </p>
          </div>

          <div>
            <CheckboxGroup
              label="Product features"
              name="features"
              register={register}
              options={[
                { value: "analytics", label: "Analytics Dashboard" },
                { value: "reports", label: "Custom Reports" },
                { value: "api", label: "API Access" },
                { value: "support", label: "Priority Support", disabled: true },
              ]}
              helpText="Select the features you need"
            />
            <p className="mt-2 text-sm text-neutral-600">
              Selected: {JSON.stringify(selectedFeatures)}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export const EmptyStates = () => {
  const { control, watch, register } = useForm<any>({
    defaultValues: {
      money: { currency: "USD", amount: "" },
      checkboxGroup: [],
    },
  })

  return (
    <div className="space-y-6 p-6">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        Empty States (Placeholder Visible)
      </h1>
      <div className="grid max-w-2xl gap-6">
        <Input
          label="Text Input"
          name="text"
          control={control}
          placeholder="Enter text..."
        />
        <Select
          label="Select"
          name="select"
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}
          control={control}
          placeholder="Choose an option..."
        />
        <DateInput label="Date of Birth" name="date" control={control} />
        <DateMonthYearInput
          label="Expiry Date"
          name="dateMonthYear"
          control={control}
        />
        <DatePicker label="Pick a Date" name="datePicker" control={control} />
        <MultipleRadio
          label="Select an option"
          name="radio"
          control={control}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
        <SliderInput
          label="Select Amount"
          name="slider"
          control={control}
          min={0}
          max={100}
        />
        <CustomCombobox
          label="Search"
          name="combobox"
          control={control}
          loadFn={mockLoadFn}
          onChange={noop}
        />
        <GoogleAutocompleteInput
          label="Address"
          name="address"
          control={control}
          onSelect={noop}
        />
        <MoneyFields
          label="Amount"
          prefix="money"
          control={control}
          watch={watch}
          order={1}
        />
        <Checkbox label="Accept terms" name="checkbox" control={control} />
        <CheckboxGroup
          label="Select options"
          name="checkboxGroup"
          register={register}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
      </div>
    </div>
  )
}

export const FilledStates = () => {
  const { control, watch, register } = useForm<any>({
    defaultValues: {
      text: "John Doe",
      select: "1",
      date: "15-06-1990",
      dateMonthYear: "2025-12",
      datePicker: "15-06-2025",
      radio: "option1",
      slider: 50,
      checkbox: true,
      money: { currency: "EUR", amount: "1500" },
      address: "123 Main Street, New York, NY 10001",
      combobox: "Acme Corp",
      checkboxGroup: ["option1"],
    },
  })

  return (
    <div className="space-y-6 p-6">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        Filled States
      </h1>
      <div className="grid max-w-2xl gap-6">
        <Input label="Text Input" name="text" control={control} />
        <Select
          label="Select"
          name="select"
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}
          control={control}
        />
        <DateInput label="Date of Birth" name="date" control={control} />
        <DateMonthYearInput
          label="Expiry Date"
          name="dateMonthYear"
          control={control}
        />
        <DatePicker label="Pick a Date" name="datePicker" control={control} />
        <MultipleRadio
          label="Select an option"
          name="radio"
          control={control}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
        <SliderInput
          label="Select Amount"
          name="slider"
          control={control}
          min={0}
          max={100}
        />
        <CustomCombobox
          label="Search Company"
          name="combobox"
          control={control}
          loadFn={mockLoadFn}
          onChange={noop}
        />
        <GoogleAutocompleteInput
          label="Address"
          name="address"
          control={control}
          onSelect={noop}
        />
        <MoneyFields
          label="Amount"
          prefix="money"
          control={control}
          watch={watch}
          order={1}
        />
        <Checkbox label="Accept terms" name="checkbox" control={control} />
        <CheckboxGroup
          label="Select options"
          name="checkboxGroup"
          register={register}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
      </div>
    </div>
  )
}

export const DisabledStates = () => {
  const { control, watch, register } = useForm<any>({
    defaultValues: {
      text: "Disabled value",
      select: "1",
      date: "15-06-1990",
      dateMonthYear: "2025-12",
      datePicker: "15-06-2025",
      radio: "option1",
      slider: 50,
      checkbox: true,
      money: { currency: "USD", amount: "1000" },
      address: "123 Main Street, New York, NY 10001",
      checkboxGroup: ["option1"],
    },
  })

  return (
    <div className="space-y-6 p-6">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">
        Disabled States
      </h1>
      <div className="grid max-w-2xl gap-6">
        <Input label="Text Input" name="text" control={control} disabled />
        <Select
          label="Select"
          name="select"
          options={[
            { value: "1", label: "Option 1" },
            { value: "2", label: "Option 2" },
          ]}
          control={control}
          disabled
        />
        <DateInput
          label="Date of Birth"
          name="date"
          control={control}
          disabled
        />
        <DateMonthYearInput
          label="Expiry Date"
          name="dateMonthYear"
          control={control}
          disabled
        />
        <DatePicker
          label="Pick a Date"
          name="datePicker"
          control={control}
          disabled
        />
        <MultipleRadio
          label="Select an option"
          name="radio"
          control={control}
          disabled
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
        <SliderInput
          label="Select Amount"
          name="slider"
          control={control}
          min={0}
          max={100}
          disabled
        />
        <CustomCombobox
          label="Search"
          name="combobox"
          control={control}
          loadFn={emptyLoadFn}
          onChange={noop}
          disabled
        />
        <GoogleAutocompleteInput
          label="Address"
          name="address"
          control={control}
          onSelect={noop}
          disabled
        />
        <MoneyFields
          label="Amount"
          prefix="money"
          control={control}
          watch={watch}
          order={1}
          disabled
        />
        <Checkbox
          label="Accept terms"
          name="checkbox"
          control={control}
          disabled
        />
        <CheckboxGroup
          label="Select options"
          name="checkboxGroup"
          register={register}
          disabled
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
          ]}
        />
      </div>
    </div>
  )
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  accountType: yup.string().required("Please select an account type"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  expiryDate: yup.string().required("Expiry date is required"),
  appointmentDate: yup.string().required("Appointment date is required"),
  paymentMethod: yup.string().required("Please select a payment method"),
  amount: yup
    .number()
    .min(10, "Amount must be at least 10")
    .required("Amount is required"),
  company: yup.string().required("Company is required"),
  address: yup.string().required("Address is required"),
  money: yup.object().shape({
    currency: yup.string().required("Currency is required"),
    amount: yup.string().required("Amount is required"),
  }),
  termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
})

export const ValidationErrors = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    mode: "onTouched",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      money: { currency: "USD", amount: "" },
    },
  })

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold text-neutral-900">
        Validation Errors
      </h1>
      <p className="mb-6 text-neutral-600">
        Click on each field and then click away (blur) to trigger validation
        errors.
      </p>

      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="max-w-2xl space-y-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="First Name" name="firstName" control={control} />
          <Input label="Last Name" name="lastName" control={control} />
        </div>

        <Input
          label="Email Address"
          name="email"
          type="email"
          control={control}
          placeholder="you@example.com"
        />

        <Input
          label="Password"
          name="password"
          type="password"
          control={control}
          helpText="Must be at least 8 characters"
        />

        <Select
          label="Account Type"
          name="accountType"
          options={[
            { value: "personal", label: "Personal Account" },
            { value: "business", label: "Business Account" },
          ]}
          control={control}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <DateInput
            label="Date of Birth"
            name="dateOfBirth"
            control={control}
          />
          <DateMonthYearInput
            label="Card Expiry Date"
            name="expiryDate"
            control={control}
          />
        </div>

        <DatePicker
          label="Appointment Date"
          name="appointmentDate"
          control={control}
        />

        <MultipleRadio
          label="Payment Method"
          name="paymentMethod"
          control={control}
          options={[
            { value: "card", label: "Credit Card" },
            { value: "bank", label: "Bank Transfer" },
            { value: "paypal", label: "PayPal" },
          ]}
        />

        <SliderInput
          label="Investment Amount"
          name="amount"
          control={control}
          min={0}
          max={100}
        />

        <CustomCombobox
          label="Company"
          name="company"
          control={control}
          loadFn={mockLoadFn}
          onChange={noop}
        />

        <GoogleAutocompleteInput
          label="Address"
          name="address"
          control={control}
          onSelect={noop}
        />

        <MoneyFields
          label="Investment Amount"
          prefix="money"
          control={control}
          watch={watch}
          order={1}
        />

        <Checkbox
          label="I accept the terms and conditions"
          name="termsAccepted"
          control={control}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 rounded-lg px-6 py-2 text-white"
          >
            Submit Form
          </button>
          <button
            type="button"
            className="rounded-lg border border-neutral-300 px-6 py-2 hover:bg-neutral-50"
            onClick={() => {
              void handleSubmit(noop)()
            }}
          >
            Validate All
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="bg-error-50 mt-4 rounded-lg p-4">
            <h3 className="text-error-700 mb-2 font-semibold">
              Form has {Object.keys(errors).length} error(s)
            </h3>
            <ul className="text-error-600 list-inside list-disc text-sm">
              {Object.entries(errors).map(([key, error]) => (
                <li key={key}>
                  {key}: {error?.message as string}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}
