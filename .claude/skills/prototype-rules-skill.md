---
name: prototype-rules
description: Use whenever working on Uncapped prototypes. The hard rules for safe local prototyping — no live Uncapped servers, sandbox setup, route conventions, mock data only, the safe template. Read this before starting, modifying, or running any prototype.
---

# Skill: Uncapped Prototype Rules

## When to use this skill
Before you create, modify, or run any prototype.
Before you add a new dependency or hook to a prototype
file. Whenever you're unsure if something might phone
home to a live Uncapped server.

## ⚠️ THE HARD RULE

**Prototypes never connect to live Uncapped servers.**

That means no real Auth0 logins, no calls to
`*.weareuncapped.com` (login.dev., dev., portal.,
unleash.prod.internal., etc.), no real API requests
of any kind. Even read-only. Even when "it works in dev".

If you're unsure whether a piece of code might reach a
live Uncapped server, stop and ask before running.

## Sandbox setup

Prototypes run in offline-sandbox mode, controlled
by an environment variable in `.env.local`:

```
REACT_APP_PROTOTYPE_MODE=true
```

When sandbox mode is on:
- All live URLs (Auth0, dev API, Unleash, Google Places) are blackholed to `127.0.0.1:9`
- `src/inits/app-providers.tsx` short-circuits — only renders NuqsAdapter, QueryClient, ModalProvider. **No** Auth0, **no** Unleash, **no** AppBase, **no** Tracking.
- HubSpot script disabled
- Sentry, Segment, Clarity, Tracking — all off
- MSW (Mock Service Worker) handles any mocked API endpoints; unhandled requests log a warning to console

The sandbox is on by default in `.env.local` (gitignored). Never commit a `.env.local` that disables it.

## The `isPrototypeMode()` gate

Helper at `src/utils/env.ts`. Use it to gate any code
path that could phone home:

```tsx
import { isPrototypeMode } from "@/utils/env"

if (isPrototypeMode()) {
  // skip the live call, use mock data
} else {
  // real API call
}
```

Anything new that could reach an external service
(analytics, monitoring, payment, geolocation) must
be wrapped in this gate or short-circuited entirely.

## Route conventions

- All prototype URLs: `http://localhost:3000/prototypes/<name>`
- **Never** visit `http://localhost:3000/` directly — it hits `PrivateRoute` and crashes without Auth0Provider
- Each prototype is one `.tsx` file at `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/<name>.tsx`
- Register the route in `Assets-Uncapped/front-portal-develop/src/routes.tsx`

## Mock data only

Prototype `.tsx` files declare their data as constants
at the top. No `fetch`, no `useQuery` against real
endpoints, no API hooks.

```tsx
// At the top of the file:
const OFFERS = [
  { id: "standard", amount: "$150,000", fee: "$15,000", ... },
  { id: "flex",     amount: "$100,000", fee: "$8,000",  ... },
]
```

If a prototype genuinely needs to mimic an API call
(e.g. to demonstrate loading or error states), use MSW
to intercept the call locally — never let it leave
the machine.

## The page wrapper (required)

Every prototype starts with this wrapper. The
`w-full` is non-negotiable — without it, the layout
breaks because `#root` is `display:flex` in Tailwind v4.

```tsx
<div className="min-h-screen w-full bg-surface-canvas">
  {/* page content */}
</div>
```

## Safe template

Copy `offer-screen.tsx` as the starting point for any
new prototype. It's self-contained — no auth hooks,
no API calls, mock data inline.

```
Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/offer-screen.tsx
```

**Don't copy `hello-world.tsx`.** It uses `OnboardingLayout`
which depends on `useDeal` and `useApplicationSteps` —
those fail when the API is blackholed.

## Things that are off-limits in prototype mode

| Service | Why it's blocked |
|---|---|
| Auth0 (`login.dev.weareuncapped.com`) | Live customer logins |
| Dev API (`dev.weareuncapped.com/api`) | Live data |
| Unleash (`unleash.prod.internal.weareuncapped.com`) | Feature flag service — config sometimes leaks live state |
| Google Places API | External call, not needed for prototypes |
| HubSpot script | Customer marketing analytics |
| Sentry | Error reporting (could leak prototype noise to prod project) |
| Segment / Clarity | User tracking |
| Tracking pixels generally | Anything user-facing |

Don't add a new service to a prototype unless you've
gated it behind `isPrototypeMode()` or short-circuited
it entirely.

## Quick start

1. `cd Assets-Uncapped/front-portal-develop`
2. First time only: `pnpm install` and drop the `.env.development` file from 1Password into the repo root
3. Verify `.env.local` has `REACT_APP_PROTOTYPE_MODE=true`
4. `pnpm dev`
5. Open `http://localhost:3000/prototypes/<your-prototype>`

## Before you commit

- No `.env.local` committed (it's gitignored — verify)
- No real credentials, tokens, or API keys in the prototype file
- No `fetch` to a `weareuncapped.com` URL
- No new service dependencies that bypass `isPrototypeMode()`

## When in doubt

If you're not sure whether something is sandbox-safe,
**stop and ask** before running. Better one extra
question than one accidental call to live customer data.
