import React, { ComponentType, ReactElement, ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import {
  render,
  renderHook,
  RenderHookResult,
  RenderOptions,
} from "@testing-library/react"
import { UnleashClient, FlagContext } from "@unleash/proxy-client-react"
import { BrowserRouter, Route, Routes } from "react-router"
import testQueryClient from "./test-query-client"

const FlagMockProvider = ({ children }: { children: ReactNode }) => {
  const context = {
    client: {
      on: vi.fn() as unknown,
      off: () => ({}) as UnleashClient,
      getAllToggles: () => [],
    } as unknown as UnleashClient,
    flagsReady: true,
    setFlagsError: () => true,
    flagsError: [],
    isEnabled: () => true,
    setFlagsReady: () => true,
    on: () => ({}) as UnleashClient,
    off: () => ({}) as UnleashClient,
    updateContext: () => {
      return Promise.resolve()
    },
    getVariant: () => ({ name: "test", enabled: true }),
  }
  return <FlagContext.Provider value={context}>{children}</FlagContext.Provider>
}

const AllTheProviders = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={testQueryClient}>
      <FlagMockProvider>{children}</FlagMockProvider>
    </QueryClientProvider>
  </BrowserRouter>
)

const appRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders as ComponentType, ...options })

function renderWithRouter(
  ui: React.ReactElement,
  options?: {
    path?: string
  }
) {
  const path = options?.path || "/"
  globalThis.history.pushState({}, "Test page", path)

  return {
    ...appRender(
      <Routes>
        <Route path={path} element={ui} />
        <Route path="*" element={null} />
      </Routes>
    ),
  }
}

function renderHookWithProviders<Result, Props>(
  renderHookFunction: (initialProps: Props) => Result
): RenderHookResult<Result, Props> {
  return renderHook(renderHookFunction, { wrapper: AllTheProviders })
}

export * from "@testing-library/react"

export { appRender, renderWithRouter, renderHookWithProviders }
