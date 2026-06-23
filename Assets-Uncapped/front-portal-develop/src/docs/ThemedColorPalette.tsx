import { ColorPalette, ColorItem } from "@storybook/addon-docs/blocks"
import Typography from "../components/Basic/Typography"
import { getThemePrimaryId, THEMES } from "../utils/themes"

function getListForColor(color: string) {
  return [
    `var(--color-${color}-50)`,
    `var(--color-${color}-100)`,
    `var(--color-${color}-200)`,
    `var(--color-${color}-300)`,
    `var(--color-${color}-400)`,
    `var(--color-${color}-500)`,
    `var(--color-${color}-600)`,
    `var(--color-${color}-700)`,
    `var(--color-${color}-800)`,
    `var(--color-${color}-900)`,
  ]
}

function extractColorFromVariable(variable: string, theme: string) {
  const elem = document.createElement("div")
  const originalTheme = document.documentElement.dataset.theme

  elem.style.display = "none"
  elem.style.color = variable
  document.documentElement.dataset.theme = theme
  document.body.append(elem)
  const rgb = globalThis.getComputedStyle(elem, null).getPropertyValue("color")

  const ctx = document.createElement("canvas").getContext("2d")!
  ctx.fillStyle = rgb

  elem.remove()
  if (originalTheme === undefined) {
    delete document.documentElement.dataset.theme
  } else {
    document.documentElement.dataset.theme = originalTheme
  }

  return ctx.fillStyle
}

const processColors = (
  variables: string[],
  theme: string
): Record<string, string> =>
  Object.fromEntries(
    variables
      .map((color) => {
        return [
          color
            .replace("var(--color-", "")
            .replace("var(--", "")
            .replace(")", ""),
          extractColorFromVariable(color, theme),
        ]
      })
      .filter(([, value]) => value !== "#212529")
  )

const ThemedColorPalette = () => {
  return (
    <>
      {THEMES.map((theme) => {
        const primaryId = getThemePrimaryId(theme.id)
        return (
          <div key={theme.label} className={primaryId}>
            <Typography type="h1">{theme.label}</Typography>
            <ColorPalette>
              <ColorItem
                title="Brand"
                subtitle=""
                colors={processColors(getListForColor("brand"), primaryId)}
              />

              <ColorItem
                title="Secondary"
                subtitle=""
                colors={processColors(getListForColor("secondary"), primaryId)}
              />

              <ColorItem
                title="Tertiary"
                subtitle=""
                colors={processColors(getListForColor("tertiary"), primaryId)}
              />

              <ColorItem
                title="Neutral"
                subtitle=""
                colors={processColors(getListForColor("neutral"), primaryId)}
              />

              <ColorItem
                title="Error"
                subtitle=""
                colors={processColors(getListForColor("error"), primaryId)}
              />

              <ColorItem
                title="Success"
                subtitle=""
                colors={processColors(getListForColor("success"), primaryId)}
              />

              <ColorItem
                title="Warning"
                subtitle=""
                colors={processColors(getListForColor("warning"), primaryId)}
              />

              <ColorItem
                title="Info"
                subtitle=""
                colors={processColors(getListForColor("info"), primaryId)}
              />

              {Array.from({ length: 11 }, (_, i) => i + 1).map((num) => (
                <ColorItem
                  key={`accent-${num}`}
                  title={`Accent ${num}`}
                  subtitle=""
                  colors={processColors(
                    [
                      `var(--color-accent-${num}-contrast)`,
                      `var(--color-accent-${num}-subtle)`,
                      `var(--color-accent-${num}-border)`,
                    ],
                    primaryId
                  )}
                />
              ))}

              <ColorItem
                title="Other"
                subtitle=""
                colors={processColors(
                  ["var(--color-white)", "var(--color-black)"],
                  primaryId
                )}
              />
            </ColorPalette>
          </div>
        )
      })}
    </>
  )
}

export default ThemedColorPalette
