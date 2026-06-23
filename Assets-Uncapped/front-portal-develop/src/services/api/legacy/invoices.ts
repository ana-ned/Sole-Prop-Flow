import client from "../_client"

const Invoices = {
  getImage: ({
    token,
    organisation,
    id,
    thumbnail = false,
  }: {
    token: string
    organisation: string
    id: string
    thumbnail?: boolean
  }): Promise<Blob> =>
    client(
      `invoices/invoices/${id}?thumbnail=${thumbnail ? "true" : "false"}`,
      {
        token,
        organisation,
        headers: {
          Accept: "application/octet-stream",
        },
      }
    ),
}

export default Invoices
