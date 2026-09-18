import type { Title, ContentType, Season, CastMember } from '@/types';

export const TMDB_API_KEY = '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZE = 'w500';
export const TMDB_BACKDROP_SIZE = 'original';
export const TMDB_PROFILE_SIZE = 'w185';

export function posterUrl(path: string | null): string {
  if (!path) return '/placeholder-poster.png';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZE}${path}`;
}

export function backdropUrl(path: string | null): string {
  if (!path) return '/placeholder-backdrop.png';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${TMDB_BACKDROP_SIZE}${path}`;
}

export function profileUrl(path: string | null): string {
  if (!path) return '/placeholder-profile.png';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${TMDB_PROFILE_SIZE}${path}`;
}

export function hasApiKey(): boolean {
  return TMDB_API_KEY.length > 0;
}

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export async function fetchTrending(mediaType: 'movie' | 'tv' = 'movie', window: 'day' | 'week' = 'week'): Promise<Title[]> {
  const data = await tmdbFetch(`/trending/${mediaType}/${window}`);
  return (data.results || []).map((item: any) => ({
    ...item,
    tmdb_id: item.id,
    content_type: mediaType as ContentType,
  }));
}

export async function fetchPopularMovies(page = 1): Promise<Title[]> {
  const data = await tmdbFetch('/movie/popular', { page: String(page) });
  return (data.results || []).map((item: any) => ({
    ...item,
    tmdb_id: item.id,
    content_type: 'movie' as ContentType,
  }));
}

export async function fetchPopularTV(page = 1): Promise<Title[]> {
  const data = await tmdbFetch('/tv/popular', { page: String(page) });
  return (data.results || []).map((item: any) => ({
    ...item,
    tmdb_id: item.id,
    content_type: 'tv' as ContentType,
  }));
}

export async function fetchByGenre(contentType: ContentType, genreId: number, page = 1): Promise<Title[]> {
  const endpoint = contentType === 'movie' ? '/discover/movie' : '/discover/tv';
  const data = await tmdbFetch(endpoint, {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  });
  return (data.results || []).map((item: any) => ({
    ...item,
    tmdb_id: item.id,
    content_type: contentType,
  }));
}

export async function fetchAnime(page = 1): Promise<Title[]> {
  const data = await tmdbFetch('/discover/tv', {
    with_genres: '16', // Animation genre
    with_original_language: 'ja',
    page: String(page),
    sort_by: 'popularity.desc',
  });
  return (data.results || []).map((item: any) => ({
    ...item,
    tmdb_id: item.id,
    content_type: 'anime' as ContentType,
  }));
}

export async function fetchMovieDetails(id: number): Promise<Title> {
  const data = await tmdbFetch(`/movie/${id}`, { append_to_response: 'credits' });
  return {
    ...data,
    tmdb_id: data.id,
    content_type: 'movie' as ContentType,
    cast: (data.credits?.cast || []).slice(0, 15).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })),
  };
}

export async function fetchTVDetails(id: number): Promise<Title> {
  const data = await tmdbFetch(`/tv/${id}`, { append_to_response: 'credits' });
  return {
    ...data,
    tmdb_id: data.id,
    content_type: 'tv' as ContentType,
    seasons: (data.seasons || []).map((s: any) => ({
      season_number: s.season_number,
      name: s.name,
      episode_count: s.episode_count,
      poster_path: s.poster_path,
      air_date: s.air_date,
      overview: s.overview,
    })),
    cast: (data.credits?.cast || []).slice(0, 15).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })),
  };
}

export async function fetchSeasonDetails(tvId: number, seasonNumber: number): Promise<Season> {
  const data = await tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
  return {
    season_number: data.season_number,
    name: data.name,
    episode_count: data.episodes?.length || 0,
    poster_path: data.poster_path,
    air_date: data.air_date,
    overview: data.overview,
    episodes: (data.episodes || []).map((e: any) => ({
      episode_number: e.episode_number,
      season_number: e.season_number,
      name: e.name,
      overview: e.overview,
      still_path: e.still_path,
      air_date: e.air_date,
      runtime: e.runtime,
    })),
  };
}

export async function searchTitles(query: string): Promise<Title[]> {
  const data = await tmdbFetch('/search/multi', { query });
  return (data.results || [])
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item: any) => ({
      ...item,
      tmdb_id: item.id,
      content_type: item.media_type as ContentType,
    }));
}

export const GENRES = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 18, name: 'Drama' },
    { id: 35, name: 'Comedy' },
    { id: 9648, name: 'Mystery' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 80, name: 'Crime' },
  ],
  anime: [
    { id: 16, name: 'Animation' },
    { id: 10759, name: 'Action & Adventure' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
  ],
};

export function getEmbedUrl(tmdbId: number, contentType: ContentType, season?: number, episode?: number): string {
  if (contentType === 'movie') {
    return `https://vidsrc.to/embed/movie/${tmdbId}`;
  }
  return `https://vidsrc.to/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`;
}
