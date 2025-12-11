export interface QuaverStats {
  ranks: {
    global: number;
    country: number;
    total_hits: number;
  };
  total_score: number;
  ranked_score: number;
  overall_accuracy: number;
  overall_performance_rating: number;
  play_count: number;
  fail_count: number;
  max_combo: number;
  count_grade_x: number;
  count_grade_ss: number;
  count_grade_s: number;
  count_grade_a: number;
  count_grade_b: number;
  count_grade_c: number;
  count_grade_d: number;
}

export interface QuaverUser {
  id: number;
  steam_id: string;
  username: string;
  time_registered: string;
  latest_activity: string;
  country: string;
  avatar_url: string;
  stats_keys4: QuaverStats;
  stats_keys7: QuaverStats;
}

export interface QuaverQPVMUser {
  userId: number;
  username: string;
  avatarUrl: string;
  rating: number;
  rd: number;
  sigma: number;
  wins: number;
  matchesPlayed: number;
  banned: boolean;
  createdAt: string;
  rank: number;
  letterRank: string;
  history: unknown[];
}
