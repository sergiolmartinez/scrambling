import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import {
  AUTH_QUERY_KEY,
  AuthContext,
  type AuthContextValue,
  isUnauthorizedError,
} from '@/app/auth-state';
import { apiClient } from '@/lib/api';

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        return await apiClient.getCurrentUser();
      } catch (error) {
        if (isUnauthorizedError(error)) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 30_000,
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: sessionQuery.data ?? null,
      isLoading: sessionQuery.isLoading,
      isAuthenticated: Boolean(sessionQuery.data),
      refreshSession: async () => {
        const result = await queryClient.fetchQuery({
          queryKey: AUTH_QUERY_KEY,
          queryFn: async () => {
            try {
              return await apiClient.getCurrentUser();
            } catch (error) {
              if (isUnauthorizedError(error)) {
                return null;
              }
              throw error;
            }
          },
        });
        return result ?? null;
      },
      clearSession: () => {
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
      },
    }),
    [queryClient, sessionQuery.data, sessionQuery.isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
