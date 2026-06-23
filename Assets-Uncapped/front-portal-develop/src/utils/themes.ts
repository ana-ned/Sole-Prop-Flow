export const THEMES = [
  { key: "uncapped", id: ["uncapped"], label: "Uncapped" },
  { key: "amazon", id: ["amazon"], label: "Amazon Seller Portal" },
  {
    key: "demo",
    id: ["b833f56a-8c30-4fd0-9cdd-f8ac0de27826"],
    label: "Demo",
  },
  {
    key: "jungle-scout",
    id: [
      "d57b24c0-ef91-41fb-9997-6d139a213f89",
      "a6b49d07-acef-4441-87f4-19830dddae3a",
    ],
    label: "Jungle Scout",
  },
  {
    key: "seller-mate",
    id: [
      "3a7d39bf-01e6-4cfb-83c3-345d640cf71e",
      "6afb9730-041f-492d-b33e-4abf8b528c95",
    ],
    label: "Seller Mate",
  },
] as const

export type ThemeKey = (typeof THEMES)[number]["key"]
export type Theme = (typeof THEMES)[number]["id"][number]

export const DEFAULT_THEME: Theme = "uncapped"

export const isValidTheme = (id: string): id is Theme => {
  return THEMES.some((theme) => (theme.id as readonly string[]).includes(id))
}

export const getThemeKey = (id: string): ThemeKey | undefined => {
  return THEMES.find((theme) => (theme.id as readonly string[]).includes(id))
    ?.key
}

export const getThemePrimaryId = (id: readonly string[]): Theme =>
  id[0] as Theme
