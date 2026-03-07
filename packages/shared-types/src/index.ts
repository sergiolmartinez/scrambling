export type HealthResponse = {
  status: 'ok';
};

export type RoundStatus = 'draft' | 'active' | 'completed';

export type CourseRead = {
  id: number;
  external_course_id: string | null;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  total_holes: number;
  source: string;
};

export type ExternalCourseSearchRead = {
  external_id: string;
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
  total_holes: number;
  source: string;
};

export type ExternalCourseDetailRead = ExternalCourseSearchRead & {
  holes: CourseHoleRead[];
};

export type CourseHoleRead = {
  id: number;
  hole_number: number;
  par: number;
  yardage: number | null;
  handicap: number | null;
  tee_name: string;
};

export type RoundRead = {
  id: number;
  status: RoundStatus;
  course_id: number | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
};

export type RoundPlayerRead = {
  id: number;
  round_id: number;
  display_name: string;
  sort_order: number;
};

export type HoleScoreRead = {
  id: number;
  round_id: number;
  hole_number: number;
  score: number | null;
  par_snapshot: number | null;
  completed: boolean;
};

export type ShotContributionRead = {
  id: number;
  round_id: number;
  hole_number: number;
  shot_number: number;
  round_player_id: number;
  shot_type: string | null;
};

export type RoundAggregateRead = {
  round: RoundRead;
  course: CourseRead | null;
  players: RoundPlayerRead[];
  hole_scores: HoleScoreRead[];
  contributions: ShotContributionRead[];
};

export type LeaderboardEntryRead = {
  round_player_id: number;
  display_name: string;
  total_contributions: number;
};

export type RoundSummaryRead = {
  round: RoundRead;
  course: CourseRead | null;
  players: RoundPlayerRead[];
  hole_scores: HoleScoreRead[];
  leaderboard: LeaderboardEntryRead[];
};

export type ApiErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string> | null;
};
