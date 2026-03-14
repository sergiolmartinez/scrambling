import { createContext, useContext } from 'react';

export type AuthUser = {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<AuthUser | null>;
  clearSession: () => void;
};

export const AUTH_QUERY_KEY = ['auth', 'current-user'];

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return value;
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: number }).status === 401
  );
}
