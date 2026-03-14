import { ApiRequestError } from '@scrambling/api-client';

type AuthAction = 'sign-in' | 'sign-up' | 'update-profile';

export function getAuthErrorMessage(error: unknown, action: AuthAction): string {
  if (error instanceof ApiRequestError) {
    if (action === 'sign-in' && error.status === 401) {
      return 'Sign in failed. Check your email and password and try again.';
    }
    if (action === 'sign-up' && error.status === 409) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (action === 'update-profile' && error.status === 422) {
      return 'Display name is invalid. Please review and try again.';
    }
    return error.message || 'Something went wrong. Please try again.';
  }

  if (error instanceof TypeError) {
    return 'Could not reach the API server. Confirm the backend is running and try again.';
  }

  if (action === 'update-profile') {
    return 'Could not save your display name. Please try again.';
  }
  if (action === 'sign-up') {
    return 'Sign up failed. Please try again.';
  }
  return 'Sign in failed. Please try again.';
}
