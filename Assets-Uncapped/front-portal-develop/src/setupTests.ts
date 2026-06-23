import "@testing-library/jest-dom"
import { UserRoles } from "./hooks/useAuth.types"
import { server } from "./test/server"
import testQueryClient from "./test/test-query-client"

vi.mock("react-i18next", () => ({
  withTranslation: () => (y: any) => y,
  Trans: ({ children }: { children: any }) => children,
  useTranslation: () => {
    return {
      t: (str: string, options?: { returnObjects: boolean }) => {
        if (options?.returnObjects) {
          return [str]
        }
        return str
      },
      i18n: {
        changeLanguage: () => new Promise(() => null),
      },
    }
  },
}))

vi.mock("./inits/i18next", () => ({
  default: {
    t: (str: string) => str,
    exists: () => false,
  },
}))

vi.mock("./hooks/useAuth", () => ({
  default: () => {
    const user = {
      sub: "TEST-SUB",
      "https://weareuncapped.com/roles": ["admin"],
    }
    return {
      isAuthenticated: true,
      getToken: () => Promise.resolve("TEST-TOKEN"),
      organisation: {
        organisationId: "TEST-ORG-ID",
        countryCode: "USA",
      },
      user,
      hasRole: (role: UserRoles) =>
        user["https://weareuncapped.com/roles"].includes(role),
      organisationData: {
        averageMonthlyRevenue: {
          amount: 150000,
        },
      },
    }
  },
}))

beforeAll(() => {
  // Enable the mocking in tests.
  server.listen({ onUnhandledRequest: "error" })
})

beforeEach(() => {
  // Clear React Query cache between tests.
  testQueryClient.clear()
})

afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers()
})

afterAll(() => {
  // Clean up once the tests are done.
  server.close()
})
