import type {
  ApiErrorResponse,
  CourseRead,
  ExternalCourseDetailRead,
  ExternalCourseSearchRead,
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
  searchCourses: (query: string) => Promise<ExternalCourseSearchRead[]>;
  getExternalCourseDetail: (externalId: string) => Promise<ExternalCourseDetailRead>;
  importCourseToRound: (roundId: number, externalId: string) => Promise<RoundRead>;
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
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);

  async function getErrorMessage(response: Response): Promise<string> {
    try {
      const payload = (await response.json()) as ApiErrorResponse;
      if (payload.message) {
        return payload.message;
      }
    } catch {
      // Keep fallback when response body is not JSON.
    }

    return `Request failed: ${response.status}`;
  }

  async function requestJson<T>(path: string, init?: RequestInitWithMethod): Promise<T> {
    const response = await fetch(`${normalizedBaseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
    }

    return (await response.json()) as T;
  }

  async function requestNoContent(path: string, init: RequestInitWithMethod): Promise<void> {
    const response = await fetch(`${normalizedBaseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...init,
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response));
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
    async searchCourses(query: string): Promise<ExternalCourseSearchRead[]> {
      const encoded = encodeURIComponent(query);
      return requestJson<ExternalCourseSearchRead[]>(`/courses/search?q=${encoded}`, { method: 'GET' });
    },
    async getExternalCourseDetail(externalId: string): Promise<ExternalCourseDetailRead> {
      const encoded = encodeURIComponent(externalId);
      return requestJson<ExternalCourseDetailRead>(`/courses/external/${encoded}`, { method: 'GET' });
    },
    async importCourseToRound(roundId: number, externalId: string): Promise<RoundRead> {
      return requestJson<RoundRead>(`/rounds/${roundId}/course/import`, {
        method: 'POST',
        body: JSON.stringify({ external_id: externalId }),
      });
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

function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
}
