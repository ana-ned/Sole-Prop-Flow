import { QueryClient } from "@tanstack/react-query"

const testQueryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

export default testQueryClient
