import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card"

const EmptyState = ({ message }: { message: string }) => (
  <Card className="rounded-card-md !py-3.5">
    <Typography type="bodyTitle" color="neutral-600" className="text-center">
      {message}
    </Typography>
  </Card>
)

export default EmptyState
