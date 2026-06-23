import { ComponentProps, ReactNode } from "react"
import { BoxIconSeverity } from "../../../../components/Basic/BoxIcon/BoxIcon"
import CardV2 from "../../../../components/UI/CardV2"
import Loader from "../../../../components/UI/Loader/Loader"
import SimpleTable from "../../../../components/UI/SimpleTable"

const CardTable = ({
  title,
  icon,
  severity,
  data,
  actions,
  propertyFontWeight,
  isLoading,
  emptyState,
  children,
}: {
  title: ReactNode
  icon?: ReactNode
  severity: keyof typeof BoxIconSeverity
  data?: ComponentProps<typeof SimpleTable>["data"]
  actions?: ReactNode
  propertyFontWeight?: ComponentProps<typeof SimpleTable>["propertyFontWeight"]
  isLoading?: boolean
  emptyState?: ReactNode
  children?: ReactNode
}) => {
  const hasData = data && data.length > 0
  const showEmptyState = !isLoading && !hasData && emptyState

  return (
    <CardV2 title={title} icon={icon} severity={severity} actions={actions}>
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader size="sm" />
        </div>
      )}
      {!isLoading && hasData && (
        <SimpleTable
          variant="simple"
          propertyFontWeight={propertyFontWeight}
          data={data}
          wrapped
          shadow
          className="!my-0"
        />
      )}
      {showEmptyState && emptyState}
      {!isLoading && children}
    </CardV2>
  )
}

export default CardTable
