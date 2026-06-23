import React from "react"
import clsx from "clsx"

const FormLayout = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={clsx(className)}>{children}</div>
}

// eslint-disable-next-line react/display-name
FormLayout.Content = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={clsx(className)}>{children}</div>
}

// eslint-disable-next-line react/display-name
FormLayout.Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-8 flex flex-col gap-y-4">{children}</div>
}

export default FormLayout
