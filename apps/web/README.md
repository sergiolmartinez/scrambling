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
npm run dev --prefix apps/web
npm run lint --prefix apps/web
npm run test --prefix apps/web
npm run build --prefix apps/web
npm run typecheck --prefix apps/web
```

## Environment

Create `apps/web/.env` from `.env.example`.

## Implemented shell routes

- `/setup`
- `/scoring`
- `/leaderboard`
- `/summary`
