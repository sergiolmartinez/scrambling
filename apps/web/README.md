# Web App (`apps/web`)

React + Vite web shell for the Scrambling MVP frontend.

## Stack

- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- shadcn-style UI primitives (`src/components/ui`)
- React Hook Form + Zod

## Current UX status

- progress-aware shell navigation across setup, scoring, leaderboard, and summary
- setup flow includes readiness checklist for round/course/player completion
- visual system refreshed for clearer hierarchy and mobile responsiveness

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

Planned next route:

- `/login` (auth gate before round workflows)
