# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Technology Stack

- **Framework**: React 18.3.1 with TypeScript 5.9.3 (strict mode enabled)
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17 + SCSS Modules (legacy). When touching a `.module.scss` file, ask whether to migrate it to Tailwind. Do not migrate without explicit approval.
- **State Management**: Zustand (`src/hooks/useStore.ts`), React Query (@tanstack/react-query)
- **Routing**: React Router 7.9.6
- **Testing**: Vitest (unit), Cypress (E2E), @testing-library/react
- **Forms**: react-hook-form + Yup validation
- **Authentication**: Auth0 (@auth0/auth0-react)
- **Package Manager**: pnpm 10.x (required)
- **i18n**: i18next with translations in `public/static/locales/`
- **Feature Flags**: Unleash (@unleash/proxy-client-react)
- **Monitoring**: Segment Analytics, Sentry
- **API Mocking**: MSW (Mock Service Worker) in `src/mocks/`

## Common Commands

```bash
# Development
pnpm dev                # Run dev server (opens on http://localhost:3000)
pnpm build              # Production build to build/ directory
pnpm preview            # Preview production build

# Testing
pnpm test               # Run unit tests with Vitest
pnpm test:e2e           # Run Cypress E2E tests

# Linting & Type Checking
pnpm lint               # Run ESLint + Stylelint
pnpm lint:js            # ESLint only
pnpm lint:types         # TypeScript type checking (no emit)
pnpm exec knip          # Check for unused exports/dependencies

# Utilities
pnpm storybook          # Start Storybook on port 6006
pnpm validate:i18n      # Validate i18n JSON formatting
pnpm release            # Validate i18n + production build
```

### OpenAPI Client Generation

Auto-generated API clients live in `src/services/api/`. To regenerate from Swagger schemas:

```bash
pnpm generate:openapi:kyc
pnpm generate:openapi:organisation-users
pnpm generate:openapi:connections
pnpm generate:openapi:loan-operations
pnpm generate:openapi:agreements
pnpm generate:openapi:collections
pnpm generate:openapi:partners
pnpm generate:openapi:hubspot
pnpm generate:openapi:underwriting
pnpm generate:openapi:amazon-gateway
pnpm generate:openapi:reengagement
```

These fetch OpenAPI schemas from `https://dev.weareuncapped.com/api/{service}/api-docs/schema` and generate TypeScript clients using `openapi-generator-cli`.

### Running Single Tests

```bash
# Vitest
pnpm test path/to/test.test.tsx

# Cypress (specific spec)
pnpm test:e2e -- --spec cypress/e2e/path/to/spec.cy.ts
```

## Environment Setup

- Copy `.env.development` from a teammate or 1Password — required for `pnpm dev`
- Required vars include `REACT_APP_AUTH0_*`, `REACT_APP_UNLEASH_*`, and API base URLs
- Use `env()` from `src/utils/runtime-env.ts` to access env vars at runtime (not `import.meta.env` directly)
- MSW (Mock Service Worker) is active in dev and test modes by default — it intercepts API calls using handlers in `src/mocks/`. To bypass in dev, set `REACT_APP_MSW_ENABLED=false` in `.env.development`

# General Principles

- Only create an abstraction if it’s actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Use `knip` to remove unused code if making large changes
- The `gh` CLI is installed, use it
- Don't use emojis
- Do NOT run linters automatically, only when prompted explicitly.

## React

- Avoid massive JSX blocks and compose smaller components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely needed

## Code Architecture

### Domain-Driven Structure

The codebase uses a **domain-driven** architecture where features are organized by business domain in `src/domains/`:

```
src/domains/
├── onboarding/         # Customer onboarding flow
├── kyc/                # Know Your Customer verification
├── agreements/         # Loan agreements & signing
├── connections/        # Bank/accounting integrations
├── transactions/       # Transaction history
├── dashboard/          # Main dashboard
├── line-of-credit/     # Line of credit management
├── withdraw/           # Fund withdrawal
├── pay/                # Payment processing
├── partner-*           # Partner-related features
└── ...
```

Each domain typically contains:

- `pages/` - Route-level components (lowercase-with-dashes.tsx)
- `components/` - Domain-specific components (camelCase.tsx)
- `hooks/` - Domain-specific React hooks
- `routes.tsx` - React Router route definitions

### Routing Architecture

- **Main App Router**: `src/App.tsx` uses React Router with lazy-loaded route modules
- **Domain Routes**: Each domain exports a `<Routes>` component from `routes.tsx`
- **Path Constants**: Defined in domain-level files (e.g., `src/domains/kyc/paths.ts`, `src/domains/onboarding/constants.ts`)
- **Guards**: `PrivateRoute` and `Guard` components in `src/components/Functional/` handle auth/permission checks
- **Role-based Access**: Uses `UserRoles` from `src/hooks/useAuth.types.ts`

### Component Organization

```
src/components/
├── Basic/         # Primitive UI elements (Button, Typography, etc.)
├── Forms/         # Form inputs and controls
├── UI/            # Complex UI components (Modal, Toast, Tabs, etc.)
├── Collections/   # Composite components (lists, tables, feature groups)
├── Shared/        # Cross-domain shared components
├── Functional/    # Logic components (Guard, GodMode, ErrorBoundary)
├── Headless/      # Headless UI components (MultistepForm, Page)
└── Content/       # Content-specific components
```

### API Integration

**Auto-generated Clients**: All API types and clients in `src/services/api/` are auto-generated from OpenAPI schemas. **Never manually edit these files.**

**Custom API Client**: `src/services/api/_client.ts` provides a base fetch wrapper with:

- Token injection (`Authorization: Bearer {token}`)
- Organization headers (`xx-org-id`)
- Error handling (throws `ApiError` with code/message/details)
- Support for JSON, HTML, and binary responses

**Legacy APIs**: `src/services/api/legacy/` contains manually written API clients for services without OpenAPI specs.

**React Query Integration**: API calls wrapped in hooks using `@tanstack/react-query` for caching/state management.

### Shared Utilities (`src/utils/`)

- `runtime-env.ts` — safe env var access at runtime (always prefer over `import.meta.env` directly)
- `validator-rules/` — shared Yup validation rules for forms
- `money.ts` + `currency.ts` — financial amount and currency formatting
- `date.ts` — date formatting helpers
- `query-keys.ts` — centralized React Query key constants
- `error-handling.ts` — shared error handling utilities
- `string.ts`, `lists.ts`, `url.ts` — general-purpose helpers

### State Management

**Zustand Store** (`src/hooks/useStore.ts`):

- Manages onboarding flow state (`customNextOnboardingPath`, `lastOnboardingPath`)
- Offer customizations (`offerCustomizations`)
- Deferred repayment selections
- Document referer tracking

**React Query**: Handles server state, caching, and mutations throughout the app.

**Local/Session Storage**: Custom hook `useBrowserStorage` in `src/hooks/useBrowserStorage.ts`.

### Authentication Flow

- **Auth0** integration via `@auth0/auth0-react`
- Main auth logic in `src/hooks/useAuth.ts`
- Auth provider setup in `src/inits/app-providers.tsx`
- OAuth callbacks in `src/pages/oauth/`
- User roles and permissions managed via `usePermissions` hook

### Feature Flags

- Unleash integration for feature toggles
- Configuration in `src/inits/unleash.ts`
- Authorized config via `useAuthorizedUnleashConfig` hook

### Testing Strategy

**Unit Tests** (Vitest):

- Located alongside source files (`.test.tsx` / `.test.ts`)
- Setup in `src/setupTests.ts`
- Coverage excludes: `src/services/api/**`, `src/mocks/**`, `src/stubs/**`, `*.stories.*`

**E2E Tests** (Cypress):

- Located in `cypress/e2e/`
- Configuration in `cypress.config.ts`
- Uses custom commands from `cypress/support/`
- Auth0 test credentials configured in Cypress env vars

**Storybook**:

- Stories use `.stories.tsx` extension
- Run via `pnpm storybook`

## File Naming Conventions

- **Pages**: `lowercase-with-dashes.tsx` (e.g., `dashboard-page.tsx`)
- **React Components**: `camelCase.tsx` (e.g., `userProfile.tsx`)
- **Utility/Pure JS**: `lowercase-with-dashes.ts` (e.g., `format-date.ts`)
- **SCSS Modules**: `ComponentName.module.scss` with camelCase class names

## Tailwind

- Mostly use built-in values, occasionally allow dynamic values, rarely globals
- Always use Tailwind CSS v4 + global CSS file format

## TypeScript Practices

- **Strict mode enabled** - all code must type-check
- **Avoid `any` and `@ts-ignore`** - find proper types or use `unknown`
- **API types**: Always use auto-generated types from `src/services/api/`
- **Draft types**: If API/schema unavailable, create draft types with TODO comments to migrate later
- Use `pnpm lint:types` to verify type correctness

## Git Conventions

- **Branch naming**: `{prefix}/{ticket}-{description}` where prefix is `fix`, `hotfix`, `feature`, `refactor`, or `chore`
  - Example: `feature/bnk-123-contact-page`
- **Commit messages**: Use conventional commits with ticket refs
  - Example: `feat(BNK-123): add new contact page`
  - Example: `fix(BNK-456): button styles in modal`
- **Main branch**: `develop` (use this for PRs)
- **Do NOT squash** merge requests - keep commit history
- **Pre-commit hooks**: Lefthook enforces linting/formatting before commits

## Security & Best Practices

- Never commit secrets or API keys
- Auth flow follows Auth0 patterns in `src/hooks/useAuth.ts`
- Forms use `react-hook-form` + Yup validation (see `src/utils/validator-rules/`)
- Form validation schemas in `src/domains/{domain}/` or shared in `src/utils/validator-rules/`

## CI/CD Pipeline

The CI workflow runs:

1. Linting (ESLint, Stylelint, TypeScript, Knip)
2. Unit tests (Vitest)
3. Production build
4. E2E tests (Cypress) - skipped if PR title contains "skip e2e"
5. Preview deployment to GCP Cloud Run

## Environment Variables

- **Prefix**: `REACT_APP_*` (Vite configuration in `vite.config.mts`)
- **Runtime access**: Use `env()` from `src/utils/runtime-env`
- **Environment files**: `.env.development`, `.env.test`

## Prototypes (`src/domains/prototypes/`)

Prototypes are temporary, sandboxed UI experiments. Rules:

- **Sandbox**: All changes stay within `src/domains/prototypes/`. Never modify files outside this domain when working on a prototype.
- **Reuse components**: Import from `src/components/` (Basic, Forms, UI, Collections, etc.). Do not recreate existing components.
- **Mock all data**: Use inline mock data, hardcoded values, or local state. Never call real APIs, hooks like `useDeal`, `useAuth`, React Query, or any backend service.
- **No new dependencies**: Only use libraries already in the project.
- Use `/prototype` to scaffold a new one.

## Important Notes

- **Minimal changes principle**: Make smallest possible changes to achieve goals
- **Follow existing patterns**: Consistency over personal preference
- **Test business logic**, not implementation details
- **API clients are read-only**: Never manually edit `src/services/api/` - regenerate instead
- **Component reuse**: Check `src/components/` before creating new shared components
- **Check dependencies**: Prefer existing libraries over adding new ones
