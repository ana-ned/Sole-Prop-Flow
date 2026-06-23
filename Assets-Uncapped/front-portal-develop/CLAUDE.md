## Quick Reference

**Package manager**: pnpm (required)

```bash
pnpm dev            # dev server → http://localhost:3000
pnpm test           # unit tests (Vitest)
pnpm lint:types     # TypeScript check
pnpm build          # production build
```

**Architecture**: domain-driven → `src/domains/`, shared components → `src/components/`
**API clients**: auto-generated in `src/services/api/` — never edit manually
**Branch target**: `develop`

For comprehensive guidance on working with this codebase, please refer to: **[AGENTS.md](./AGENTS.md)**.