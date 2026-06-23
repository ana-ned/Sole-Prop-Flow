import { Meta } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import Input from "../Input"
import FormControl from "./FormControl"

export default {
  title: "Forms/FormControl",
  component: FormControl,
} as Meta<typeof FormControl>

export const Default = () => {
  const { control } = useForm()

  return (
    <>
      <FormControl>
        <Input
          label="Account number"
          name="accountNumber"
          type="number"
          control={control}
        />
      </FormControl>

      <FormControl>
        <Input
          label="Routing number"
          name="routingNumber"
          type="number"
          control={control}
        />
      </FormControl>
    </>
  )
}
