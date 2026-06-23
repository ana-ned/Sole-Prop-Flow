import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
import BookCallBox from "../../onboarding/components/BookCallBox"

const DashboardBookCall = () => {
  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <Layout.Parent>
        <BookCallBox pageMode />
      </Layout.Parent>
    </Layout>
  )
}

export default DashboardBookCall
