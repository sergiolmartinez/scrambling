import type { HealthResponse } from '@scrambling/shared-types';

export type ApiClient = {
  health: () => Promise<HealthResponse>;
};

export function createApiClient(baseUrl: string): ApiClient {
  return {
    async health(): Promise<HealthResponse> {
      const response = await fetch(`${baseUrl}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return (await response.json()) as HealthResponse;
    },
  };
}
