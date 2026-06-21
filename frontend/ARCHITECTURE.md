# Frontend Architecture

This project follows a feature-sliced, domain-first structure to keep related code colocated and dependency direction clear.

Key conventions

- `app/` — Root application entry and provider composition (`App.tsx`, `providers.tsx`).
- `routes/` — Route definitions and route guards (`PublicRoute`, `PrivateRoute`).
- `layouts/` — Layout components used by route groups.
- `features/<domain>/` — Feature folder containing `api/`, `components/`, `hooks/`, `pages/`, `slice.ts`, and a barrel `index.ts` that exposes the public API.
- `components/` — Shared UI primitives (buttons, inputs, skeletons).
- `services/` — Infrastructure (axios client, typed API wrapper).
- `store/` — Redux store and root reducer composition.
- `utils/`, `constants/`, `types/` — Cross-cutting utilities, constants, and TypeScript types.

Best practices enforced here

- Feature barrels: each feature should export its public surface via `features/<x>/index.ts` to decouple callers from internal file layout.
- Provider composition: use `app/providers.tsx` to compose Redux, Router, and other global providers.
- Session init: `auth` exposes `isInitialized` so route guards can avoid flicker and incorrect redirects while the session restores.
- API layer: keep low-level HTTP in `services/` and feature-specific endpoints in `features/*/api`.
- Directional dependencies: features depend on shared layers (`components`, `services`, `utils`) but not vice versa — avoid circular imports.

Recommended next steps

- Add per-feature tests under `features/<x>/__tests__`.
- Consider adopting RTK Query for automatic caching and simpler data fetching.
- Add lint rules or a module boundary check to prevent circular dependencies.
