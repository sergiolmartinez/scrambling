import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layout';
import { LeaderboardRoute } from '@/routes/leaderboard-route';
import { ScoringRoute } from '@/routes/scoring-route';
import { SetupRoute } from '@/routes/setup-route';
import { SummaryRoute } from '@/routes/summary-route';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(Navigate, { replace: true, to: '/setup' }) },
            { path: 'setup', element: _jsx(SetupRoute, {}) },
            { path: 'scoring', element: _jsx(ScoringRoute, {}) },
            { path: 'leaderboard', element: _jsx(LeaderboardRoute, {}) },
            { path: 'summary', element: _jsx(SummaryRoute, {}) },
        ],
    },
]);
