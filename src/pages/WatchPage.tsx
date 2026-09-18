import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Play, Server, ChevronLeft, List, ChevronDown } from 'lucide-react';
import { AdBanner, useAdsterraAds } from '@/lib/ads';
import { trackPageView, trackPlayClick, fetchCustomServers } from '@/lib/analytics';
import { hasApiKey, fetchMovieDetails, fetchTVDetails, fetchSeasonDetails, getEmbedUrl, backdropUrl } from '@/lib/tmdb';
import { getFallbackById } from '@/lib/fallbackData';
import type { Title, Episode, CustomServer } from '@/types';

const DEFAULT_SERVERS = [
  { label: 'Server 1 HD (Auto)', type: 'auto' },
  { label: 'Server 2 (Backup)', type: 'backup' },
  { label: 'Server 3 (4K)', type: '4k' },
  { label: 'Server 4 (Arabic Subtitled)', type: 'arabic' },
];

export function WatchPage() {
  useAdsterraAds();
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const contentType = type as 'movie' | 'tv' | 'anime';
  const tmdbId = parseInt(id || '0');

  const [title, setTitle] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(parseInt(searchParams.get('season') || '1'));
  const [currentEpisode, setCurrentEpisode] = useState(parseInt(searchParams.get('episode') || '1'));
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [customServers, setCustomServers] = useState<CustomServer[]>([]);
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    trackPageView(`/watch/${type}/${id}`);
    async function loadData() {
      if (hasApiKey()) {
        try {
          const data = contentType === 'movie'
            ? await fetchMovieDetails(tmdbId)
            : await fetchTVDetails(tmdbId);
          if (contentType === 'anime') data.content_type = 'anime';
          setTitle(data);
          if (data.seasons && data.seasons.length > 0) {
            const seasonData = await fetchSeasonDetails(tmdbId, currentSeason);
            setEpisodes(seasonData.episodes || []);
          }
        } catch {
          const fallback = getFallbackById(tmdbId);
          setTitle(fallback);
          if (fallback?.seasons) {
            const season = fallback.seasons.find(s => s.season_number === currentSeason);
            if (season) {
              setEpisodes(
                Array.from({ length: season.episode_count }, (_, i) => ({
                  episode_number: i + 1,
                  season_number: currentSeason,
                  name: `Episode ${i + 1}`,
                  overview: '',
                  still_path: null,
                  air_date: '',
                  runtime: null,
                }))
              );
            }
          }
        }
      } else {
        const fallback = getFallbackById(tmdbId);
        setTitle(fallback);
        if (fallback?.seasons) {
          const season = fallback.seasons.find(s => s.season_number === currentSeason);
          if (season) {
            setEpisodes(
              Array.from({ length: season.episode_count }, (_, i) => ({
                episode_number: i + 1,
                season_number: currentSeason,
                name: `Episode ${i + 1}`,
                overview: '',
                still_path: null,
                air_date: '',
                runtime: null,
              }))
            );
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [type, id]);

  useEffect(() => {
    async function loadSeason() {
      if (contentType === 'movie' || !title?.seasons) return;
      if (hasApiKey()) {
        try {
          const seasonData = await fetchSeasonDetails(tmdbId, currentSeason);
          setEpisodes(seasonData.episodes || []);
        } catch {
          setEpisodes([]);
        }
      } else {
        const season = title.seasons.find(s => s.season_number === currentSeason);
        if (season) {
          setEpisodes(
            Array.from({ length: season.episode_count }, (_, i) => ({
              episode_number: i + 1,
              season_number: currentSeason,
              name: `Episode ${i + 1}`,
              overview: '',
              still_path: null,
              air_date: '',
              runtime: null,
            }))
          );
        }
      }
      setCurrentEpisode(1);
      setSearchParams({ season: String(currentSeason), episode: '1' });
    }
    loadSeason();
  }, [currentSeason]);

  useEffect(() => {
    async function loadCustomServers() {
      if (contentType === 'movie') {
        const servers = await fetchCustomServers(tmdbId);
        setCustomServers(servers);
      } else {
        const servers = await fetchCustomServers(tmdbId, currentSeason, currentEpisode);
        setCustomServers(servers);
      }
    }
    loadCustomServers();
  }, [tmdbId, currentSeason, currentEpisode, contentType]);

  useEffect(() => {
    if (title) {
      trackPlayClick(tmdbId, contentType, title.title);
    }
  }, [selectedServer, currentEpisode, currentSeason]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
          <div className="aspect-video skeleton rounded-xl mb-4" />
          <div className="h-8 w-1/3 skeleton rounded mb-4" />
        </div>
      </div>
    );
  }

  if (!title) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-lg mb-4">Title not found.</p>
          <Link to="/" className="text-cyan-400 hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Build server URLs
  const serverUrls = DEFAULT_SERVERS.map((server, idx) => {
    // Check for custom server matching this label
    const custom = customServers.find(cs =>
      cs.server_label.toLowerCase().includes(server.type) ||
      (idx === 3 && cs.server_label.toLowerCase().includes('arabic'))
    );
    if (custom) return custom.server_url;
    if (server.type === 'auto') {
      return getEmbedUrl(tmdbId, contentType, currentSeason, currentEpisode);
    }
    // For backup/4k, use vidsrc.to with different base or same
    return getEmbedUrl(tmdbId, contentType, currentSeason, currentEpisode);
  });

  const currentServerUrl = serverUrls[selectedServer] || getEmbedUrl(tmdbId, contentType, currentSeason, currentEpisode);

  const isSeries = contentType === 'tv' || contentType === 'anime';

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-zinc-400 hover:text-cyan-400 transition-colors mb-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white">{title.title}</h1>
          {isSeries && (
            <p className="text-zinc-400 text-sm mt-1">
              Season {currentSeason} • Episode {currentEpisode}
            </p>
          )}
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800">
          <iframe
            src={currentServerUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        </div>

        {/* Server Selector */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Select Server:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_SERVERS.map((server, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedServer(idx)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedServer === idx
                    ? 'bg-cyan-400 text-black accent-glow'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedServer === idx ? 'bg-black' : 'bg-cyan-400/50'}`} />
                {server.label}
              </button>
            ))}
            {customServers.map((cs, idx) => (
              <button
                key={`custom-${idx}`}
                onClick={() => setSelectedServer(DEFAULT_SERVERS.length + idx)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedServer === DEFAULT_SERVERS.length + idx
                    ? 'bg-cyan-400 text-black accent-glow'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${selectedServer === DEFAULT_SERVERS.length + idx ? 'bg-black' : 'bg-cyan-400/50'}`} />
                {cs.server_label}
              </button>
            ))}
          </div>
        </div>

        {/* Ad below player */}
        <div className="mt-4">
          <AdBanner label="Advertisement" />
        </div>

        {/* Season & Episode Selector for TV/Anime */}
        {isSeries && title.seasons && title.seasons.length > 0 && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Season Selector */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <List className="w-4 h-4 text-cyan-400" /> Seasons
                </h3>
                <div className="flex flex-wrap gap-2">
                  {title.seasons.map((season) => (
                    <button
                      key={season.season_number}
                      onClick={() => {
                        setCurrentSeason(season.season_number);
                        setSearchParams({ season: String(season.season_number), episode: '1' });
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        currentSeason === season.season_number
                          ? 'bg-cyan-400 text-black'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30'
                      }`}
                    >
                      {season.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Episode List */}
              <div>
                <button
                  onClick={() => setShowEpisodes(!showEpisodes)}
                  className="w-full flex items-center justify-between p-3 bg-zinc-900/80 border border-zinc-800 rounded-lg mb-3 hover:border-cyan-500/30 transition-all"
                >
                  <span className="text-sm font-semibold text-white">
                    Episodes ({episodes.length})
                  </span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showEpisodes ? 'rotate-180' : ''}`} />
                </button>
                {showEpisodes && (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto animate-fade-in">
                    {episodes.map((ep) => (
                      <button
                        key={ep.episode_number}
                        onClick={() => {
                          setCurrentEpisode(ep.episode_number);
                          setSearchParams({ season: String(currentSeason), episode: String(ep.episode_number) });
                          setShowEpisodes(false);
                        }}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                          currentEpisode === ep.episode_number
                            ? 'bg-cyan-500/10 border border-cyan-500/30'
                            : 'bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0">
                          <span className="text-xs font-bold text-cyan-400">{ep.episode_number}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{ep.name}</p>
                          {ep.overview && (
                            <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">{ep.overview}</p>
                          )}
                          {ep.air_date && (
                            <p className="text-xs text-zinc-600 mt-0.5">{ep.air_date}</p>
                          )}
                        </div>
                        {currentEpisode === ep.episode_number && (
                          <Play className="w-4 h-4 text-cyan-400 fill-cyan-400 flex-shrink-0 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Now Playing</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-zinc-800 mb-3">
                  <img
                    src={backdropUrl(title.backdrop_path)}
                    alt={title.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <p className="text-sm font-medium text-white">{title.title}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {isSeries && `S${currentSeason} • E${currentEpisode}`}
                </p>
                <p className="text-xs text-zinc-500 mt-2 line-clamp-3">{title.overview}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
