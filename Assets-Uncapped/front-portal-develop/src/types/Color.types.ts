export const COLORS = [
  "primary", // neutral-800
  "secondary", // brand-600
  "brand-200",
  "brand-300",
  "brand-400",
  "brand-600",
  "brand-700",
  "secondary-300",
  "surface-canvas",
  "surface-elevated-1",
  "neutral-100",
  "neutral-300",
  "neutral-500",
  "neutral-600",
  "neutral-700",
  "neutral-800",
  "neutral-900",
  "error-100",
  "error-200",
  "error-600",
  "error-700",
  "success-600",
  "warning-200",
  "warning-600",
  "info-300",
  "white",
  "black",
  "accent-1-contrast",
] as const

export type ColorTypes = (typeof COLORS)[number]
