import { yupResolver } from "@hookform/resolvers/yup"
import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import Button from "../../Basic/Button"
import FormControl from "../FormControl"
import MoneyFields from "./MoneyFields"

export default {
  title: "Forms/MoneyFields",
  component: MoneyFields,
} as Meta<typeof MoneyFields>

const schema = yup.object().shape({
  balance: yup.object().shape({
    currency: yup.string().required(),
    amount: yup.number().required(),
  }),
})

export const Default = () => {
  const { control, handleSubmit, watch, formState } = useForm({
    defaultValues: {
      balance: {
        currency: "USD",
      },
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
  })

  return (
    <form
      onSubmit={handleSubmit((data) => {
        alert(JSON.stringify(data))
      })}
    >
      <FormControl>
        <MoneyFields
          control={control}
          watch={watch}
          prefix="balance"
          label="Balance"
          order={1}
        />
      </FormControl>
      <FormControl>
        <MoneyFields
          control={control}
          watch={watch}
          prefix="deposit"
          label="Deposit"
          order={2}
        />
      </FormControl>
      <Button type="submit" className="mt-4" disabled={!formState.isValid}>
        Submit
      </Button>
    </form>
  )
}

export const Prefilled = () => {
  const defaultValues: yup.Asserts<typeof schema> = {
    balance: {
      currency: "USD",
      amount: 100,
    },
  }

  const { control, handleSubmit, watch, formState } = useForm({
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
      <MoneyFields
        control={control}
        watch={watch}
        prefix="balance"
        label="Balance"
        order={1}
      />
      <Button type="submit" className="mt-4" disabled={!formState.isValid}>
        Submit
      </Button>
    </form>
  )
}

export const Disabled = () => {
  const { control, watch } = useForm({
    defaultValues: {
      balance: {
        currency: "EUR",
        amount: 5000,
      },
    },
  })

  return (
    <MoneyFields
      control={control}
      watch={watch}
      prefix="balance"
      label="Locked balance"
      order={1}
      disabled
    />
  )
}

export const CustomCurrencies = () => {
  const { control, watch } = useForm({
    defaultValues: {
      balance: {
        currency: "GBP",
      },
    },
  })

  return (
    <MoneyFields
      control={control}
      watch={watch}
      prefix="balance"
      label="Amount (UK/EU only)"
      order={1}
      currencies={["GBP", "EUR"]}
    />
  )
}

export const NoLabel = () => {
  const { control, watch } = useForm({
    defaultValues: {
      amount: {
        currency: "USD",
      },
    },
  })

  return (
    <MoneyFields control={control} watch={watch} prefix="amount" order={1} />
  )
}
