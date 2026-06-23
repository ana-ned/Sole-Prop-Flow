import { ColorTypes } from "../types/Color.types"

export const getTextColorClass = (color?: ColorTypes): string => {
  const textClasses: Record<ColorTypes, string> = {
    primary: "text-neutral-800",
    secondary: "text-brand-600",
    "brand-200": "text-brand-200",
    "brand-300": "text-brand-300",
    "brand-400": "text-brand-400",
    "brand-600": "text-brand-600",
    "brand-700": "text-brand-700",
    "secondary-300": "text-secondary-300",
    "surface-canvas": "text-surface-canvas",
    "surface-elevated-1": "text-surface-elevated-1",
    "neutral-100": "text-neutral-100",
    "neutral-300": "text-neutral-300",
    "neutral-500": "text-neutral-500",
    "neutral-600": "text-neutral-600",
    "neutral-700": "text-neutral-700",
    "neutral-800": "text-neutral-800",
    "neutral-900": "text-neutral-900",
    "error-100": "text-error-100",
    "error-200": "text-error-200",
    "error-600": "text-error-600",
    "error-700": "text-error-700",
    "success-600": "text-success-600",
    "warning-200": "text-warning-200",
    "warning-600": "text-warning-600",
    "info-300": "text-info-300",
    "accent-1-contrast": "text-accent-1-contrast",
    white: "text-white",
    black: "text-black",
  }

  return color ? textClasses[color] : ""
}

export const getBackgroundColorClass = (color?: ColorTypes): string => {
  const bgClasses: Record<ColorTypes, string> = {
    primary: "bg-neutral-800",
    secondary: "bg-brand-600",
    "brand-200": "bg-brand-200",
    "brand-300": "bg-brand-300",
    "brand-400": "bg-brand-400",
    "brand-600": "bg-brand-600",
    "brand-700": "bg-brand-700",
    "secondary-300": "bg-secondary-300",
    "surface-canvas": "bg-surface-canvas",
    "surface-elevated-1": "bg-surface-elevated-1",
    "neutral-100": "bg-neutral-100",
    "neutral-300": "bg-neutral-300",
    "neutral-500": "bg-neutral-500",
    "neutral-600": "bg-neutral-600",
    "neutral-700": "bg-neutral-700",
    "neutral-800": "bg-neutral-800",
    "neutral-900": "bg-neutral-900",
    "error-100": "bg-error-100",
    "error-200": "bg-error-200",
    "error-600": "bg-error-600",
    "error-700": "bg-error-700",
    "success-600": "bg-success-600",
    "warning-200": "bg-warning-200",
    "warning-600": "bg-warning-600",
    "info-300": "bg-info-300",
    "accent-1-contrast": "bg-accent-1-contrast",
    white: "bg-white",
    black: "bg-black",
  }

  return color ? bgClasses[color] : ""
}

export const getBorderColorClass = (color?: ColorTypes): string => {
  const borderClasses: Record<ColorTypes, string> = {
    primary: "border-neutral-800",
    secondary: "border-brand-600",
    "brand-200": "border-brand-200",
    "brand-300": "border-brand-300",
    "brand-400": "border-brand-400",
    "brand-600": "border-brand-600",
    "brand-700": "border-brand-700",
    "secondary-300": "border-secondary-300",
    "surface-canvas": "border-surface-canvas",
    "surface-elevated-1": "border-surface-elevated-1",
    "neutral-100": "border-neutral-100",
    "neutral-300": "border-neutral-300",
    "neutral-500": "border-neutral-500",
    "neutral-600": "border-neutral-600",
    "neutral-700": "border-neutral-700",
    "neutral-800": "border-neutral-800",
    "neutral-900": "border-neutral-900",
    "error-100": "border-error-100",
    "error-200": "border-error-200",
    "error-600": "border-error-600",
    "error-700": "border-error-700",
    "success-600": "border-success-600",
    "warning-200": "border-warning-200",
    "warning-600": "border-warning-600",
    "info-300": "border-info-300",
    "accent-1-contrast": "border-accent-1-contrast",
    white: "border-white",
    black: "border-black",
  }

  return color ? borderClasses[color] : ""
}
