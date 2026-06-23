import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Meta, StoryObj } from "@storybook/react-vite"
import { useForm } from "react-hook-form"
import { expect, fn, within, userEvent } from "storybook/test"
import * as yup from "yup"
import Typography from "../../Basic/Typography"
import CustomCombobox, { SelectedOption } from "./CustomCombobox"

export default {
  title: "Forms/CustomCombobox",
  component: CustomCombobox,
  args: {
    name: "businessName",
    label: "Business name",
    helpText: "Type 'Gaston' to search for sample data",
    onChange: fn(),
    createOption: {
      title: "I can’t find my correct business details",
      description: "We’ll ask you to add your business information later",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-y-4" style={{ width: "500px" }}>
        <Story />
      </div>
    ),
  ],
} as Meta<typeof CustomCombobox>

type Story = StoryObj<typeof CustomCombobox>

const SAMPLE_COMPANIES = [
  {
    value: "Gaston Technologies Inc",
    label: "Gaston Technologies Inc",
  },
  {
    value: "Gaston Global Solutions",
    label: "Gaston Global Solutions",
  },
  {
    value: "Gaston Innovations Ltd",
    label: "Gaston Innovations Ltd",
  },
  {
    value: "Gaston",
    label: "Gaston",
  },
  {
    value: "Gaston Global",
    label: "Gaston Global",
  },
  {
    value: "Gaston Enterprise Systems",
    label: "Gaston Enterprise Systems",
  },
  {
    value: "Gaston Software Corp",
    label: "Gaston Software Corp",
  },
  {
    value: "Gaston Data Analytics",
    label: "Gaston Data Analytics",
  },
  {
    value: "Gaston Cloud Solutions",
    label: "Gaston Cloud Solutions",
  },
  {
    value: "Gaston Tech Partners",
    label: "Gaston Tech Partners",
  },
  {
    value: "Gaston Systems Group",
    label: "Gaston Systems Group",
  },
] satisfies SelectedOption[]

const loadOptions = (searchQuery: string): Promise<SelectedOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        (SAMPLE_COMPANIES satisfies SelectedOption[]).filter((i) =>
          i.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }, 300)
  })
}

export const Sandbox: Story = {
  render: (args) => {
    const { watch, control } = useForm({
      resolver: yupResolver(
        yup.object({
          businessName: yup.string().required(),
        })
      ),
      mode: "onBlur",
    })

    return (
      <>
        <CustomCombobox
          {...args}
          name="businessName"
          control={control}
          loadFn={loadOptions}
        />
        <Typography type="bodyTitle">
          Selected: {watch("businessName")}
        </Typography>
      </>
    )
  },
}

export const Validation: Story = {
  render: (args) => {
    const { watch, control, trigger } = useForm({
      resolver: yupResolver(
        yup.object({
          businessName: yup.string().required(),
        })
      ),
      mode: "onBlur",
    })

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      trigger("businessName")
    }, [trigger])

    return (
      <>
        <CustomCombobox
          {...args}
          name="businessName"
          control={control}
          loadFn={loadOptions}
        />
        <Typography type="bodyTitle">
          Selected: {watch("businessName")}
        </Typography>
      </>
    )
  },
}

export const DefaultValue: Story = {
  render: (args) => {
    const { control, watch } = useForm({
      defaultValues: { businessName: SAMPLE_COMPANIES[3].value },
    })

    return (
      <>
        <CustomCombobox
          {...args}
          name="businessName"
          control={control}
          loadFn={loadOptions}
        />
        <Typography type="bodyTitle">
          Selected: {watch("businessName")}
        </Typography>
      </>
    )
  },
}

export const Disabled: Story = {
  render: (args) => {
    const { control, watch } = useForm({
      defaultValues: { businessName: SAMPLE_COMPANIES[3].value },
    })

    return (
      <>
        <CustomCombobox
          {...args}
          name="businessName"
          control={control}
          loadFn={loadOptions}
          disabled
        />
        <Typography type="bodyTitle">
          Selected: {watch("businessName")}
        </Typography>
      </>
    )
  },
}

export const Interactions: Story = {
  render: (args) => {
    const { control, watch } = useForm({
      defaultValues: { businessName: "" },
    })

    return (
      <>
        <CustomCombobox
          {...args}
          name="businessName"
          control={control}
          loadFn={loadOptions}
        />
        <Typography type="bodyTitle">
          Selected: {watch("businessName")}
        </Typography>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole("combobox")

    // Focus input
    await userEvent.click(input)

    // Type "Gas"
    await userEvent.type(input, "Gas")

    // Leave input
    await userEvent.tab()

    // Focus and verify value is "Gas"
    await userEvent.click(input)
    await expect(input).toHaveValue("Gas")

    // Type "Gaston"
    await userEvent.type(input, "ton")
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    await userEvent.type(input, "{arrowdown}{enter}")

    // Verify input value is "Gaston"
    await expect(input).toHaveValue("Gaston Global")

    // Clear input
    await userEvent.clear(input)

    // Verify input is empty
    await expect(input).toHaveValue("")

    // Focus input
    await userEvent.click(input)

    // Type "Gas"
    await userEvent.type(input, "Gas")

    // Leave input
    await userEvent.tab()

    // Focus and verify value is "Gas"
    await userEvent.click(input)
    await expect(input).toHaveValue("Gas")

    // Type "Gaston"
    await userEvent.type(input, "ton")
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
    await userEvent.type(input, "{arrowdown}{enter}")

    // Verify input value is "Gaston"
    await expect(input).toHaveValue("Gaston Technologies Inc")

    // Clear input
    await userEvent.clear(input)

    // Verify input is empty
    await expect(input).toHaveValue("")
  },
}
