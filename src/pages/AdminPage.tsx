import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, Eye, Play, Server, Plus, Trash2, Settings, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { trackPageView } from '@/lib/analytics';
import { useAdsterraAds } from '@/lib/ads';
import type { AdminDashboardData, CustomServer, ContentType } from '@/types';

export function AdminPage() {
  useAdsterraAds();
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    tmdb_id: '',
    content_type: 'movie' as ContentType,
    season: '',
    episode: '',
    server_label: '',
    server_url: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    trackPageView('/admin');
  }, []);

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'admin')) {
      navigate('/');
    }
  }, [profile, authLoading, navigate]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadDashboard();
    }
  }, [profile]);

  async function loadDashboard() {
    try {
      const { data: result, error } = await supabase.rpc('get_admin_dashboard');
      if (error) throw error;
      setData(result as AdminDashboardData);
    } catch {
      // Fallback: load data manually
      const [pv, pc, cs, profiles] = await Promise.all([
        supabase.from('page_views').select('*'),
        supabase.from('play_clicks').select('*'),
        supabase.from('custom_servers').select('*'),
        supabase.from('profiles').select('*'),
      ]);

      const uniqueVisitors = new Set(pv.data?.map(r => r.visitor_id) || []).size;
      setData({
        total_users: profiles.data?.length || 0,
        vip_users: profiles.data?.filter(p => p.is_vip).length || 0,
        total_page_views: pv.data?.length || 0,
        unique_visitors: uniqueVisitors,
        total_play_clicks: pc.data?.length || 0,
        recent_plays: (pc.data || []).slice(0, 20).map(p => ({
          title: p.title,
          content_type: p.content_type,
          created_at: p.created_at,
        })),
        all_servers: (cs.data || []) as CustomServer[],
      });
    }
    setLoading(false);
  }

  async function handleAddServer(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    const tmdbId = parseInt(formData.tmdb_id);
    if (!tmdbId || !formData.server_label || !formData.server_url) {
      setFormError('TMDB ID, server label, and URL are required.');
      return;
    }

    const insert: Record<string, any> = {
      tmdb_id: tmdbId,
      content_type: formData.content_type,
      server_label: formData.server_label,
      server_url: formData.server_url,
    };

    if (formData.season) insert.season = parseInt(formData.season);
    if (formData.episode) insert.episode = parseInt(formData.episode);

    const { error } = await supabase.from('custom_servers').insert(insert);

    if (error) {
      setFormError('Could not add server. You may not have admin permissions.');
      return;
    }

    setFormSuccess(true);
    setFormData({ tmdb_id: '', content_type: 'movie', season: '', episode: '', server_label: '', server_url: '' });
    loadDashboard();
    setTimeout(() => setFormSuccess(false), 3000);
  }

  async function handleDeleteServer(id: string) {
    await supabase.from('custom_servers').delete().eq('id', id);
    loadDashboard();
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-zinc-500">Loading admin dashboard...</p>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') return null;

  const stats = [
    { label: 'Total Users', value: data?.total_users ?? 0, icon: Users, color: 'text-cyan-400' },
    { label: 'VIP Members', value: data?.vip_users ?? 0, icon: BarChart3, color: 'text-amber-400' },
    { label: 'Page Views', value: data?.total_page_views ?? 0, icon: Eye, color: 'text-blue-400' },
    { label: 'Unique Visitors', value: data?.unique_visitors ?? 0, icon: Activity, color: 'text-green-400' },
    { label: 'Play Clicks', value: data?.total_play_clicks ?? 0, icon: Play, color: 'text-purple-400' },
    { label: 'Custom Servers', value: data?.all_servers?.length ?? 0, icon: Server, color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <Settings className="w-7 h-7 text-cyan-400" />
            Admin Dashboard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time analytics and server management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-black text-white">{stat.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Play Activity */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400" />
              Recent Play Activity
            </h2>
            {data?.recent_plays && data.recent_plays.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {data.recent_plays.map((play, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div>
                      <p className="text-sm font-medium text-white truncate">{play.title}</p>
                      <p className="text-xs text-zinc-500 capitalize">{play.content_type}</p>
                    </div>
                    <p className="text-xs text-zinc-600 flex-shrink-0 ml-3">
                      {new Date(play.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-8">No play activity yet.</p>
            )}
          </div>

          {/* Server Management */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                Custom Servers
              </h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Server
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <form onSubmit={handleAddServer} className="mb-4 p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-3 animate-fade-in">
                {formError && (
                  <p className="text-sm text-red-400">{formError}</p>
                )}
                {formSuccess && (
                  <p className="text-sm text-green-400">Server added successfully!</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="TMDB ID"
                    value={formData.tmdb_id}
                    onChange={(e) => setFormData({ ...formData, tmdb_id: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                  />
                  <select
                    value={formData.content_type}
                    onChange={(e) => setFormData({ ...formData, content_type: e.target.value as ContentType })}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="movie">Movie</option>
                    <option value="tv">TV</option>
                    <option value="anime">Anime</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Season (optional)"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                  />
                  <input
                    type="number"
                    placeholder="Episode (optional)"
                    value={formData.episode}
                    onChange={(e) => setFormData({ ...formData, episode: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Server Label (e.g. Server 4 Arabic Subtitled)"
                  value={formData.server_label}
                  onChange={(e) => setFormData({ ...formData, server_label: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                />
                <input
                  type="url"
                  placeholder="Server URL (https://...)"
                  value={formData.server_url}
                  onChange={(e) => setFormData({ ...formData, server_url: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
                />
                <button type="submit" className="w-full btn-primary py-2 text-sm">
                  Add Server
                </button>
              </form>
            )}

            {/* Server List */}
            {data?.all_servers && data.all_servers.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {data.all_servers.map((server) => (
                  <div key={server.id} className="flex items-start justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{server.server_label}</p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{server.server_url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-cyan-400">TMDB: {server.tmdb_id}</span>
                        <span className="text-xs text-zinc-600">•</span>
                        <span className="text-xs text-zinc-500 capitalize">{server.content_type}</span>
                        {server.season && (
                          <>
                            <span className="text-xs text-zinc-600">•</span>
                            <span className="text-xs text-zinc-500">S{server.season}E{server.episode}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteServer(server.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-8">No custom servers yet. Click "Add Server" to create one.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
