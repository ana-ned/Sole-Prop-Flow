import React from "react"
import useAuth from "../../../hooks/useAuth"
import { UserRoles } from "../../../hooks/useAuth.types"

const Guard = ({
  children,
  role,
}: {
  children: React.ReactElement
  role: UserRoles
}) => {
  const auth = useAuth()

  if (auth.hasRole(role)) {
    return children
  }

  return null
}

export default Guard
