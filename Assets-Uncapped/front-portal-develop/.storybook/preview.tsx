import type { Preview } from "@storybook/react-vite"
import "../src/styles/app.css"
import "../src/inits/i18next"
import React from "react"
import { MemoryRouter } from "react-router"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { withThemeByDataAttribute } from "@storybook/addon-themes"
import { DEFAULT_THEME, THEMES } from "../src/utils/themes"

const queryClient = new QueryClient()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      codePanel: true,
    },
  },

  decorators: [
    withThemeByDataAttribute({
      themes: THEMES.reduce(
        (acc, theme) => {
          acc[theme.label] = theme.id
          return acc
        },
        {} as Record<string, string>
      ),
      defaultTheme: THEMES.find(t => t.id === DEFAULT_THEME)?.label || THEMES[0].label,
    }),

    (Story) => (
      <React.Suspense fallback={<p>Loading...</p>}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <div id="storybook-root-container">
              <Story />
            </div>
          </MemoryRouter>
        </QueryClientProvider>
      </React.Suspense>
    ),
  ],

  tags: ["autodocs"],
}

export default preview
