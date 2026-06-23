import { Meta, StoryObj } from "@storybook/react-vite"
import { Route, Routes, Link } from "react-router"
import PortalMenu from "../PortalMenu"
import Layout from "./Layout"

export default {
  title: "UI/Layout",
  component: Layout,
} as Meta<typeof Layout>

type Story = StoryObj<typeof Layout>

export const SingleRoute: Story = {
  args: {
    menu: <PortalMenu />,
    children: (
      <Layout.Parent>
        <h1>First Column</h1>
      </Layout.Parent>
    ),
  },
}

export const NestedRoutes: Story = {
  args: {
    menu: <PortalMenu />,
    sidebar: (
      <Layout.Child>
        <Routes>
          <Route
            path="/nested"
            element={
              <>
                <h2>Second Column</h2>
                <Link to="/">Go back</Link>
              </>
            }
          />
        </Routes>
      </Layout.Child>
    ),
    children: (
      <Layout.Parent>
        <h1>First Column</h1>
        <Link to="/nested">Go to nested route</Link>
      </Layout.Parent>
    ),
  },
}
