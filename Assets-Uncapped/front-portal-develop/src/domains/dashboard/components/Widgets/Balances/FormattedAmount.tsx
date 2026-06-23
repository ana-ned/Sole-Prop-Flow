import Typography from "../../../../../components/Basic/Typography"
import { separate } from "../../../../../utils/money"

interface FormattedAmountProps {
  amount: number
  currency: string
}

const FormattedAmount = ({ amount, currency }: FormattedAmountProps) => {
  const { whole, fraction } = separate(amount, currency)
  return (
    <Typography type="h5" className="!font-sans">
      {whole}
      <Typography tag="span" color="neutral-800" className="!font-sans">
        {fraction}
      </Typography>
    </Typography>
  )
}

export default FormattedAmount
