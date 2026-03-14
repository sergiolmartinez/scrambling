import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { LoadingState } from '@/components/state/loading-state';

import { useAuth } from './auth-state';

export function ProtectedRoute(): JSX.Element {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='mx-auto max-w-3xl py-10'>
        <LoadingState title='Restoring your session' />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}${location.hash}`);
    return <Navigate replace to={`/sign-in?next=${redirect}`} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute(): JSX.Element {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='mx-auto max-w-3xl py-10'>
        <LoadingState title='Restoring your session' />
      </div>
    );
  }

  if (isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    const requested = searchParams.get('next');
    return <Navigate replace to={requested || '/setup'} />;
  }

  return <Outlet />;
}
