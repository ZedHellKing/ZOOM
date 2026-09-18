export type ContentType = 'movie' | 'tv' | 'anime';

export interface Title {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  media_type?: ContentType;
  tmdb_id: number;
  content_type: ContentType;
  seasons?: Season[];
  cast?: CastMember[];
}

export interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: Episode[];
  poster_path: string | null;
  air_date: string;
  overview: string;
}

export interface Episode {
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  is_vip: boolean;
  vip_expires_at: string | null;
  created_at: string;
}

export interface CustomServer {
  id: string;
  tmdb_id: number;
  content_type: ContentType;
  season: number | null;
  episode: number | null;
  server_label: string;
  server_url: string;
  created_at: string;
}

export interface VipSubscription {
  id: string;
  user_id: string;
  amount_egp: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export interface AnalyticsData {
  total_page_views: number;
  unique_visitors: number;
  total_play_clicks: number;
  recent_plays: { title: string; content_type: string; created_at: string }[];
}

export interface AdminDashboardData {
  total_users: number;
  vip_users: number;
  total_page_views: number;
  unique_visitors: number;
  total_play_clicks: number;
  recent_plays: { title: string; content_type: string; created_at: string }[];
  all_servers: CustomServer[];
}
