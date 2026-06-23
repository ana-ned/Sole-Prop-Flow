import { Route, Routes } from "react-router"
import ErrorIndex from "../error/_error"
import ProfileIndex from "./_profile"
import ProfileDocuments from "./documents"

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileIndex />} />
      <Route path="/documents" element={<ProfileDocuments />} />
      <Route path="*" element={<ErrorIndex type="404" />} />
    </Routes>
  )
}

export default ProfileRoutes
