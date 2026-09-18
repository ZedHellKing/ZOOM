import { supabase } from '@/lib/supabase';

function getOrCreateVisitorId(): string {
  const KEY = 'zoom_visitor_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function trackPageView(path: string) {
  const visitorId = getOrCreateVisitorId();
  supabase.from('page_views').insert({ path, visitor_id: visitorId }).then(() => {});
}

export function trackPlayClick(tmdbId: number, contentType: string, title: string) {
  supabase.from('play_clicks').insert({
    tmdb_id: tmdbId,
    content_type: contentType,
    title,
  }).then(() => {});
}

export async function fetchCustomServers(tmdbId: number, season?: number, episode?: number) {
  let query = supabase.from('custom_servers').select('*').eq('tmdb_id', tmdbId);
  if (season !== undefined) {
    query = query.eq('season', season);
  } else {
    query = query.is('season', null);
  }
  if (episode !== undefined) {
    query = query.eq('episode', episode);
  } else {
    query = query.is('episode', null);
  }
  const { data, error } = await query;
  if (error) return [];
  return data || [];
}
