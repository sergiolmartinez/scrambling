import { createApiClient } from '@scrambling/api-client';
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';
export const apiClient = createApiClient(baseUrl);
