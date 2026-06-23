---
name: prototype
description: >
  Bootstrap a new prototype page in src/domains/prototypes/. Use when the user says
  "/prototype", "create a prototype", "new prototype", or "bootstrap prototype".
  The user may include details inline, e.g. "/prototype data-rich dashboard for loan overview".
  CRITICAL: Do NOT read files, explore, or research before scaffolding. Parse the prompt first,
  only ask for missing details, then create the page immediately.
---

# Prototype Bootstrapper

STOP. Do NOT read files, use Explore, use Bash, or do any research. Follow the steps below.

## 1. Parse prompt and ask only if needed

Extract from the user's prompt:
- **Name**: derive kebab-case (e.g. "data rich dashboard" → `data-rich-dashboard`)
- **Layout**: infer from keywords — "dashboard" → Dashboard, "wizard"/"flow"/"steps" → Onboarding, "form"/"signup" → Registration. Default to Dashboard if unclear.
- **Description**: what the user wants to build — the rest of the prompt after name/layout hints.

If anything is missing (e.g. bare `/prototype`), ask only for what's missing:

- **Name** and **description**: ask in plain text chat, not via AskUserQuestion. E.g. "What should the prototype be called, and what do you want to build?"
- **Layout**: use AskUserQuestion with these options:
- **Dashboard** — Full app shell with left sidebar navigation and main content area.
- **Onboarding** — Step-by-step flow with left sidebar navigation and main content area.
- **Registration** — Centered content with a decorative sidebar on the right.
- **Blank** — No layout wrapper. Full-page blank canvas.

## 2. Scaffold

Create `src/domains/prototypes/pages/{name}.tsx` and add a `<Route>` in `src/domains/prototypes/routes.tsx`. Use these layout patterns:

**Dashboard:**
```tsx
import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
// wrap content in <Layout menu={<PortalMenu />}><Layout.Parent>...</Layout.Parent></Layout>
```

**Onboarding:**
```tsx
import OnboardingLayout from "../../onboarding/components/OnboardingLayout"
// wrap content in <OnboardingLayout><OnboardingLayout.Parent>...</OnboardingLayout.Parent></OnboardingLayout>
```

**Registration:**
```tsx
import RegistrationLayout from "../../registration/components/RegistrationLayout"
// wrap content in <RegistrationLayout sidebar={<div />}>...</RegistrationLayout>
```

**Blank:** just `<div className="p-10">`.

Component name in PascalCase. Add initial content matching the description — enough to render something real, not just placeholder text. Tell the user it's live at `http://localhost:3000/prototypes/{name}`.

## 3. Iterate

Now build out the description. Before writing any custom markup, **always explore `src/components/` first** to find existing components. Use the Explore agent or Glob/Grep to search — the component library has many options across `Basic/`, `UI/`, `Collections/`, and `Forms/`. Read the component file to understand its props before using it.

When looking for a component, search by concept:
- Buttons, text, dividers → `src/components/Basic/`
- Cards, tabs, modals, alerts, charts, lists, chips → `src/components/UI/`
- Transaction lists, field summaries, search lists → `src/components/Collections/`
- Inputs, selects, checkboxes, sliders → `src/components/Forms/`

Apply visual tweaks directly without asking for confirmation on small changes. Keep a single file until complexity warrants extraction into `src/domains/prototypes/components/{name}/`.

### Components to avoid in prototypes

Do NOT import these — they have internal dependencies that break in a sandboxed context:
- `Widget` (`src/components/UI/Widget`) — uses `useTracking` internally
- `ListItemLarge` (`src/components/UI/ListItemLarge`) — uses `useTracking` internally
- `SearchableList` (`src/components/Collections/SearchableList`) — depends on `ListItemLarge` + `react-hook-form`
- `GraphWidget` (`src/components/UI/GraphWidget`) — requires specific real data shape
- `CheckboxGroup`, `MoneyFields`, `MultipleRadio`, `CustomCombobox` — require `react-hook-form` `Control` or API types
- `GodMode`, `Guard`, `PrivateRoute` — require auth context
- Anything in `src/components/Shared/` — requires live API data

### Forms in prototypes

Forms components (`Input`, `Select`, `Checkbox`, `SliderInput`, `DatePicker`, `SliderInput`) are safe to use with **local `useState`**. Do not wire them up with `react-hook-form` — use `value`/`onChange` props directly with local state instead.

## Rules

- **Sandbox**: all changes stay within `src/domains/prototypes/`. Never modify files outside unless explicitly asked.
- **Mock data**: use inline hardcoded data, `useState`, or local constants. Never call real APIs, React Query, or import from `src/services/api/`.
- **Reuse components**: always explore `src/components/` before writing custom markup. Read the component file to understand props.
- **No new dependencies**: only use packages already in `package.json`.
- **TypeScript**: never use `any` or `@ts-ignore`. All props must be properly typed. Use `useState<Type>` generics explicitly.
- **No unused imports**: remove any import not referenced in JSX.

## Quality check (after every scaffold or major iteration)

After creating or significantly updating a prototype file, run:
```bash
pnpm lint:types 2>&1 | grep "src/domains/prototypes"
pnpm lint:js src/domains/prototypes/ 2>&1
```
Fix any errors before telling the user the prototype is ready. The PostToolUse hook runs prettier + eslint-fix automatically on every file write/edit, but TypeScript errors must be checked manually.

## Shipping

When the user says "ship it", "create PR", "I'm done", or similar:

1. Create or switch to branch `prototype/{name}`
2. Stage only files inside `src/domains/prototypes/`
3. Commit: `feat: add {name} prototype` (or `feat: update {name} prototype` if branch existed)
4. Push and create a **draft** PR to `develop` via `gh pr create --draft` (title: `prototype: {name}`, body: description + route path). If PR already exists, just push.
5. Return the PR URL.
