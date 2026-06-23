import React from "react"
import Typography from "../../../../components/Basic/Typography"

const Instructions = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="[&_li]:before:bg-secondary-300 [&_a]:text-brand-600 [&_a]:font-bold [&_a]:no-underline [&_li]:relative [&_li]:pt-0.75 [&_li]:pr-4 [&_li]:pb-4 [&_li]:pl-10 [&_li]:before:absolute [&_li]:before:top-0 [&_li]:before:left-0 [&_li]:before:flex [&_li]:before:size-7.5 [&_li]:before:items-center [&_li]:before:justify-center [&_li]:before:rounded-full [&_li]:before:font-semibold [&_li]:before:content-[counter(number)] [&_li]:before:[counter-increment:number] [&_ol]:list-none [&_ol]:p-0 [&_ol]:break-normal [&_ol]:wrap-anywhere [&_ol]:[counter-reset:number]">
      <Typography type="bodyTitle" className="mb-8 text-center">
        How to connect
      </Typography>
      {children}
    </div>
  )
}

export default Instructions
