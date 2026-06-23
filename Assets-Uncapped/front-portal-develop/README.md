# Front Portal

Customer-facing portal built with React, TypeScript, and Vite.

## Prerequisites

- **Node.js** >= 24.0.0 (see `.nvmrc` for exact version)
- **pnpm** >= 10.0.0

```bash
# If using nvm
nvm install
nvm use

# Enable pnpm via corepack
corepack enable
corepack prepare pnpm@10.30.2 --activate
```

## Setup

```bash
# Install dependencies
pnpm install

# Start the dev server (http://localhost:3000)
pnpm dev
```

Environment variables are pre-configured in `.env.development` for the dev environment. All env vars use the `REACT_APP_*` prefix and are accessed at runtime via `env()` from `src/utils/runtime-env`.

## Scripts

```bash
pnpm dev                # Dev server
pnpm build              # Production build
pnpm preview            # Preview production build

pnpm test               # Unit tests (Vitest)
pnpm test:watch         # Unit tests in watch mode
pnpm test:coverage      # Unit tests with coverage report
pnpm test:e2e           # E2E tests (Cypress)

pnpm lint               # ESLint + Stylelint
pnpm lint:types         # TypeScript type checking
pnpm exec knip          # Check for unused exports/dependencies

pnpm storybook          # Storybook (port 6006)
pnpm validate:i18n      # Validate i18n JSON files
```

### OpenAPI Client Generation

API clients in `src/services/api/` are auto-generated from Swagger schemas. Never edit them manually.

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

## Project Structure

The codebase follows a domain-driven architecture:

```
src/
├── domains/           # Feature modules (onboarding, kyc, dashboard, etc.)
│   └── {domain}/
│       ├── pages/     # Route-level components
│       ├── components/# Domain-specific components
│       ├── hooks/     # Domain-specific hooks
│       └── routes.tsx # Route definitions
├── components/        # Shared UI components (Basic, Forms, UI, Collections)
├── hooks/             # Global hooks (useAuth, useStore, useBrowserStorage)
├── services/api/      # Auto-generated API clients
├── utils/             # Shared utilities
├── mocks/             # MSW mock handlers
└── inits/             # App initialization (providers, unleash, sentry)
```

## Key Technologies

| Category         | Technology                             |
| ---------------- | -------------------------------------- |
| Framework        | React 19 + TypeScript (strict)         |
| Build            | Vite                                   |
| Styling          | Tailwind CSS 4 + SCSS Modules (legacy) |
| State            | Zustand + React Query                  |
| Routing          | React Router                           |
| Forms            | react-hook-form + Yup                  |
| Auth             | Auth0                                  |
| Feature Flags    | Unleash                                |
| Testing          | Vitest, Cypress, Testing Library       |
| i18n             | i18next                                |

## Prototypes

Prototypes are sandboxed UI experiments that live in `src/domains/prototypes/`. They should prefer mock data and avoid calling production APIs, but may reuse shared layouts/components/hooks from the main app (which can still perform real data fetching). When creating new prototypes, favor local mocks or test data over live integrations whenever possible.

To scaffold a new prototype, run the `/prototype` command in Claude Code:

```
/prototype data-rich dashboard for loan overview
```

This creates a new page at `src/domains/prototypes/pages/{name}.tsx`, adds the route, and makes it available at `http://localhost:3000/prototypes/{name}`.

## Development Guidelines

See [AGENTS.md](./AGENTS.md) for detailed conventions covering code architecture, file naming, git workflow, TypeScript practices, and testing strategy.
