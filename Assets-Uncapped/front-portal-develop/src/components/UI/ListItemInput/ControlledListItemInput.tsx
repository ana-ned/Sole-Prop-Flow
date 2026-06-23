import {
  Control,
  FieldPath,
  FieldValues,
  PathValue,
  useController,
} from "react-hook-form"
import ListItemInput, { ListItemInputProps } from "./ListItemInput"

type ControlledListItemInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  control: Control<TFieldValues>
  defaultValue?: PathValue<TFieldValues, TName>
} & Pick<ListItemInputProps, "type" | "title" | "subtitle">

const ControlledListItemInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  ...props
}: ControlledListItemInputProps<TFieldValues, TName>) => {
  const { field } = useController({ name, control })

  return (
    <ListItemInput
      {...props}
      checked={field.value}
      onChange={field.onChange}
      value={field.value}
    />
  )
}

export default ControlledListItemInput
