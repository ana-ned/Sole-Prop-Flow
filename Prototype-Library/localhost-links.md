# Prototype Localhost Links

Quick reference for opening prototypes in your browser. Start the dev server first:

```
cd Assets-Uncapped/front-portal-develop
pnpm dev
```

Then open any link below. **Don't visit `http://localhost:3000/` on its own** — it tries to log you in and breaks.

---

## All prototypes

| Prototype | Localhost URL | Source file |
|---|---|---|
| Hello World (sandbox check) | http://localhost:3000/prototypes/hello-world | `pages/hello-world.tsx` |
| Offer Screen (template) | http://localhost:3000/prototypes/offer-screen | `pages/offer-screen.tsx` |
| Daily Payouts — active offer | http://localhost:3000/prototypes/daily-payouts | `pages/daily-payouts.tsx` |
| Daily Payouts — expired | http://localhost:3000/prototypes/daily-payouts-expired | `pages/daily-payouts-expired.tsx` |
| Daily Payouts — no connection | http://localhost:3000/prototypes/daily-payouts-no-connection | `pages/daily-payouts-no-connection.tsx` |
| Daily Payouts — loading | http://localhost:3000/prototypes/daily-payouts-loading | `pages/daily-payouts-loading.tsx` |

Source folder: `Assets-Uncapped/front-portal-develop/src/domains/prototypes/pages/`
Routes: `Assets-Uncapped/front-portal-develop/src/domains/prototypes/routes.tsx`

---

## By feature

### Daily Payouts (Amazon revenue advance)
Full library entry: [`daily-payouts.md`](./daily-payouts.md)

- Active offer → http://localhost:3000/prototypes/daily-payouts
- Expired → http://localhost:3000/prototypes/daily-payouts-expired
- No marketplace connected → http://localhost:3000/prototypes/daily-payouts-no-connection
- Loading skeleton → http://localhost:3000/prototypes/daily-payouts-loading

### Templates / sandbox checks
- Offer Screen (safe starter template) → http://localhost:3000/prototypes/offer-screen
- Hello World (sandbox smoke test — uses parts that don't work in sandbox; for reference only) → http://localhost:3000/prototypes/hello-world
