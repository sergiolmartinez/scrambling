import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute, PublicOnlyRoute } from '@/app/auth-guard';
import { AppLayout } from '@/app/layout';
import { LeaderboardRoute } from '@/routes/leaderboard-route';
import { ProfileRoute } from '@/routes/profile-route';
import { ScoringRoute } from '@/routes/scoring-route';
import { SignInRoute } from '@/routes/sign-in-route';
import { SignUpRoute } from '@/routes/sign-up-route';
import { SettingsRoute } from '@/routes/settings-route';
import { SetupRoute } from '@/routes/setup-route';
import { SummaryRoute } from '@/routes/summary-route';

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: '/sign-in', element: <SignInRoute /> },
      { path: '/sign-up', element: <SignUpRoute /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate replace to='/setup' /> },
          { path: 'setup', element: <SetupRoute /> },
          { path: 'scoring', element: <ScoringRoute /> },
          { path: 'leaderboard', element: <LeaderboardRoute /> },
          { path: 'summary', element: <SummaryRoute /> },
          { path: 'profile', element: <ProfileRoute /> },
          { path: 'settings', element: <SettingsRoute /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate replace to='/' /> },
]);
