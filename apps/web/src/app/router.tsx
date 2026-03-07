import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/layout';
import { LeaderboardRoute } from '@/routes/leaderboard-route';
import { ScoringRoute } from '@/routes/scoring-route';
import { SetupRoute } from '@/routes/setup-route';
import { SummaryRoute } from '@/routes/summary-route';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate replace to='/setup' /> },
      { path: 'setup', element: <SetupRoute /> },
      { path: 'scoring', element: <ScoringRoute /> },
      { path: 'leaderboard', element: <LeaderboardRoute /> },
      { path: 'summary', element: <SummaryRoute /> },
    ],
  },
]);
