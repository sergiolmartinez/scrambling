import type {
  ApiErrorResponse,
  CourseRead,
  HealthResponse,
  HoleScoreRead,
  LeaderboardEntryRead,
  RoundAggregateRead,
  RoundPlayerRead,
  RoundRead,
  RoundSummaryRead,
  ShotContributionRead,
} from '@scrambling/shared-types';

type RequestInitWithMethod = RequestInit & { method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' };

export type ApiClient = {
  health: () => Promise<HealthResponse>;
  createRound: () => Promise<RoundRead>;
  getRoundAggregate: (roundId: number) => Promise<RoundAggregateRead>;
  addPlayer: (roundId: number, payload: { display_name: string; sort_order: number }) => Promise<RoundPlayerRead>;
  updatePlayer: (
    roundId: number,
    playerId: number,
    payload: { display_name?: string; sort_order?: number },
  ) => Promise<RoundPlayerRead>;
  deletePlayer: (roundId: number, playerId: number) => Promise<void>;
  assignCourse: (roundId: number, courseId: number) => Promise<RoundRead>;
  searchCourses: (query: string) => Promise<CourseRead[]>;
  upsertHoleScore: (
    roundId: number,
    holeNumber: number,
    payload: { score?: number | null; par_snapshot?: number | null; completed?: boolean },
  ) => Promise<HoleScoreRead>;
  addShotContributions: (
    roundId: number,
    holeNumber: number,
    payload: { shot_number: number; round_player_ids: number[]; shot_type?: string | null },
  ) => Promise<ShotContributionRead[]>;
  getHoleContributions: (roundId: number, holeNumber: number) => Promise<ShotContributionRead[]>;
  deleteContribution: (
    roundId: number,
    holeNumber: number,
    shotNumber: number,
    playerId: number,
  ) => Promise<void>;
  completeRound: (roundId: number) => Promise<RoundRead>;
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
      let errorMessage = `Request failed: ${response.status}`;
      try {
        const payload = (await response.json()) as ApiErrorResponse;
        if (payload.message) {
          errorMessage = payload.message;
        }
      } catch {
        // Keep default error message when body is missing or non-JSON.
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as T;
  }

  async function requestNoContent(path: string, init: RequestInitWithMethod): Promise<void> {
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
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
    async addPlayer(
      roundId: number,
      payload: { display_name: string; sort_order: number },
    ): Promise<RoundPlayerRead> {
      return requestJson<RoundPlayerRead>(`/rounds/${roundId}/players`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async updatePlayer(
      roundId: number,
      playerId: number,
      payload: { display_name?: string; sort_order?: number },
    ): Promise<RoundPlayerRead> {
      return requestJson<RoundPlayerRead>(`/rounds/${roundId}/players/${playerId}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    },
    async deletePlayer(roundId: number, playerId: number): Promise<void> {
      return requestNoContent(`/rounds/${roundId}/players/${playerId}`, {
        method: 'DELETE',
      });
    },
    async assignCourse(roundId: number, courseId: number): Promise<RoundRead> {
      return requestJson<RoundRead>(`/rounds/${roundId}/course`, {
        method: 'POST',
        body: JSON.stringify({ course_id: courseId }),
      });
    },
    async searchCourses(query: string): Promise<CourseRead[]> {
      const encoded = encodeURIComponent(query);
      return requestJson<CourseRead[]>(`/courses/search?q=${encoded}`, { method: 'GET' });
    },
    async upsertHoleScore(
      roundId: number,
      holeNumber: number,
      payload: { score?: number | null; par_snapshot?: number | null; completed?: boolean },
    ): Promise<HoleScoreRead> {
      return requestJson<HoleScoreRead>(`/rounds/${roundId}/holes/${holeNumber}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    async addShotContributions(
      roundId: number,
      holeNumber: number,
      payload: { shot_number: number; round_player_ids: number[]; shot_type?: string | null },
    ): Promise<ShotContributionRead[]> {
      return requestJson<ShotContributionRead[]>(`/rounds/${roundId}/holes/${holeNumber}/shots`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    async getHoleContributions(roundId: number, holeNumber: number): Promise<ShotContributionRead[]> {
      return requestJson<ShotContributionRead[]>(`/rounds/${roundId}/holes/${holeNumber}/shots`, {
        method: 'GET',
      });
    },
    async deleteContribution(
      roundId: number,
      holeNumber: number,
      shotNumber: number,
      playerId: number,
    ): Promise<void> {
      return requestNoContent(
        `/rounds/${roundId}/holes/${holeNumber}/shots/${shotNumber}/players/${playerId}`,
        { method: 'DELETE' },
      );
    },
    async completeRound(roundId: number): Promise<RoundRead> {
      return requestJson<RoundRead>(`/rounds/${roundId}/complete`, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    },
    async getLeaderboard(roundId: number): Promise<LeaderboardEntryRead[]> {
      return requestJson<LeaderboardEntryRead[]>(`/rounds/${roundId}/leaderboard`, { method: 'GET' });
    },
    async getSummary(roundId: number): Promise<RoundSummaryRead> {
      return requestJson<RoundSummaryRead>(`/rounds/${roundId}/summary`, { method: 'GET' });
    },
  };
}
