import type {
  CourseRead,
  HealthResponse,
  LeaderboardEntryRead,
  RoundAggregateRead,
  RoundRead,
  RoundSummaryRead,
} from '@scrambling/shared-types';

type RequestInitWithMethod = RequestInit & { method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' };

export type ApiClient = {
  health: () => Promise<HealthResponse>;
  createRound: () => Promise<RoundRead>;
  getRoundAggregate: (roundId: number) => Promise<RoundAggregateRead>;
  searchCourses: (query: string) => Promise<CourseRead[]>;
  getLeaderboard: (roundId: number) => Promise<LeaderboardEntryRead[]>;
  getSummary: (roundId: number) => Promise<RoundSummaryRead>;
};

export function createApiClient(baseUrl: string): ApiClient {
  async function requestJson<T>(path: string, init?: RequestInitWithMethod): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  }

  return {
    async health(): Promise<HealthResponse> {
      return requestJson<HealthResponse>('/health', { method: 'GET' });
    },
    async createRound(): Promise<RoundRead> {
      return requestJson<RoundRead>('/rounds', {
        method: 'POST',
        body: JSON.stringify({}),
      });
    },
    async getRoundAggregate(roundId: number): Promise<RoundAggregateRead> {
      return requestJson<RoundAggregateRead>(`/rounds/${roundId}`, { method: 'GET' });
    },
    async searchCourses(query: string): Promise<CourseRead[]> {
      const encoded = encodeURIComponent(query);
      return requestJson<CourseRead[]>(`/courses/search?q=${encoded}`, { method: 'GET' });
    },
    async getLeaderboard(roundId: number): Promise<LeaderboardEntryRead[]> {
      return requestJson<LeaderboardEntryRead[]>(`/rounds/${roundId}/leaderboard`, { method: 'GET' });
    },
    async getSummary(roundId: number): Promise<RoundSummaryRead> {
      return requestJson<RoundSummaryRead>(`/rounds/${roundId}/summary`, { method: 'GET' });
    },
  };
}
