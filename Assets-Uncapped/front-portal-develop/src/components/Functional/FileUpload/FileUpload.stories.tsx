import { Meta } from "@storybook/react-vite"
import FileUpload from "./FileUpload"

const handleUpload = (files: File[]) => {
  alert(JSON.stringify(files))
}

export default {
  title: "Forms/FileUpload",
  component: FileUpload,
} as Meta<typeof FileUpload>

export const Default = () => (
  <FileUpload
    title="Upload Documents"
    handleUpload={handleUpload}
    loading={false}
  />
)

export const Loading = () => (
  <FileUpload title="Upload Documents" handleUpload={handleUpload} loading />
)

export const PredefinedExtensions = () => (
  <FileUpload
    title="Upload Documents"
    handleUpload={handleUpload}
    loading={false}
    extensions={["pdf", "png", "jpeg"]}
  />
)

export const WithSubtitle = () => (
  <FileUpload
    title="Upload Bank Statement"
    subtitle="Please upload your most recent bank statement for verification."
    handleUpload={handleUpload}
    loading={false}
    extensions={["pdf"]}
  />
)

export const SingleFile = () => (
  <FileUpload
    title="Upload Profile Picture"
    subtitle="Choose a photo to represent your profile."
    handleUpload={handleUpload}
    loading={false}
    multiple={false}
    extensions={["png", "jpeg", "jpg"]}
  />
)
