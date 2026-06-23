# Partner Callback Feature Specification

## Overview

The Partner Callback system handles partner attribution flow, allowing partners to send users to the application with a tokenized link. The system:
- Stores partner tokens across authentication flows
- Creates applications for new partner applicants
- Applies attribution to authenticated users
- Handles registration/login redirects appropriately

## Architecture

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| PartnerCallback | `src/domains/auth/pages/partner-callback.tsx` | Main entry point for partner token processing |
| usePartnerToken | `src/hooks/usePartnerToken.ts` | Manages token retrieval from URL/session storage |
| useTheme | `src/hooks/useTheme.ts` | Applies partner theme based on `partnerId` |
| PrivateRoute | `src/components/Functional/PrivateRoute/PrivateRoute.tsx` | Redirects authenticated users with tokens to `/auth/partner` |

## Token Structure

```typescript
interface PartnerToken {
  partnerId: string           // Partner identifier (also used for theming)
  applicationId?: string      // Set after createApplication is called
  partnerApplicantId: string  // Partner's applicant identifier
  applicantUserId?: string    // User ID in our system (after registration)
}
```

## User Flows

### Flow 1: New User (Not Registered)

```
Partner Site
    │
    ▼
/auth/partner?token=XXX
    │
    ▼
createApplication API ──► returns NOT_REGISTERED
    │
    ▼
Token stored in session storage
    │
    ▼
Redirect to /registration
    │
    ▼
User completes registration
    │
    ▼
Login redirects to /
    │
    ▼
PrivateRoute detects token ──► redirect to /auth/partner
    │
    ▼
applyAttributionByToken API
    │
    ▼
Redirect to /
```

### Flow 2: Existing User (Not Logged In)

```
Partner Site
    │
    ▼
/auth/partner?token=XXX
    │
    ▼
createApplication API ──► returns REGISTERED
    │
    ▼
Token stored in session storage
    │
    ▼
Auth0 loginWithRedirect (redirect_uri=/auth/partner)
    │
    ▼
User logs in
    │
    ▼
Return to /auth/partner
    │
    ▼
applyAttributionByToken API
    │
    ▼
Redirect to /
```

### Flow 3: Already Authenticated User

```
Partner Site
    │
    ▼
/auth/partner?token=XXX
    │
    ▼
createApplication API (if needed)
    │
    ▼
applyAttributionByToken API
    │
    ▼
Redirect to /
```

## API Endpoints

| Endpoint | Service | Purpose |
|----------|---------|---------|
| `POST /applications` | Partners | Creates application for partner applicant |
| `POST /attribution/by-token` | Organisation Users | Applies partner attribution to user |

## Session Storage

| Key | Purpose |
|-----|---------|
| `partner_token` | Persists token across auth redirects |
| `theme` | Stores partner theme preference |

## Theming

When a partner token is present, the `partnerId` is used to apply partner-specific theming. The theme is validated against available themes and falls back to `uncapped` if invalid.

## Related Documentation

- [Code Review Issues](./PARTNER-CALLBACK-ISSUES.md) - Known issues and recommendations
