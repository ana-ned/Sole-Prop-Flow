import { Routes, Route } from "react-router"
import OwnerForm from "./beneficial-owners/OwnerForm"
import OwnersList from "./beneficial-owners/OwnersList"

const BeneficialOwnersFlow = () => {
  return (
    <Routes>
      <Route path="/" element={<OwnersList />} />
      <Route path="/add" element={<OwnerForm />} />
      <Route path="/edit/:id" element={<OwnerForm />} />
    </Routes>
  )
}

export default BeneficialOwnersFlow
