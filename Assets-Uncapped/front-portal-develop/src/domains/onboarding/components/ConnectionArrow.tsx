import React from "react"
import { ArrowDownward, ArrowUpward } from "@material-ui/icons"
import Typography from "../../../components/Basic/Typography"

const ConnectionArrow = ({
  children,
  bidirectional,
}: {
  children: React.ReactNode
  bidirectional?: boolean
}) => {
  return (
    <div className="flex flex-col items-center justify-between">
      <div className="flex gap-2 [&>*]:size-4">
        <div className="flex items-center justify-center">
          <div className="border-brand-400 h-4 w-px border-1" />
        </div>
        {bidirectional && (
          <div className="flex items-center justify-center">
            <ArrowUpward className="text-brand-400 size-4" />
          </div>
        )}
      </div>
      <Typography type="smallTitle" className="text-center">
        {children}
      </Typography>
      <div className="flex gap-2 [&>*]:size-4">
        <div className="flex items-center justify-center">
          <ArrowDownward className="text-brand-400 size-4" />
        </div>
        {bidirectional && (
          <div className="flex items-center justify-center">
            <div className="border-brand-400 h-4 w-px border-1" />
          </div>
        )}
      </div>
    </div>
  )
}

export default ConnectionArrow
