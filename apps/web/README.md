# Web App (`apps/web`)

React + Vite web shell for the Scrambling MVP frontend.

## Stack

- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- shadcn-style UI primitives (`src/components/ui`)
- React Hook Form + Zod

## Commands

```bash
npm install --prefix apps/web
npm run dev --prefix apps/web
npm run lint --prefix apps/web
npm run test --prefix apps/web
npm run build --prefix apps/web
npm run typecheck --prefix apps/web
```

## Environment

Create `apps/web/.env` from `.env.example`.

`VITE_API_BASE_URL` may be either:

- `http://localhost:8000`
- `http://localhost:8000/api/v1`

The client normalizes this automatically.

## Implemented shell routes

- `/setup`
- `/scoring`
- `/leaderboard`
- `/summary`
