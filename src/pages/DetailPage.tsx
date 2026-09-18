import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Star, Calendar, ChevronLeft, Tv, Film, Sparkles } from 'lucide-react';
import { AdBanner, AdSidebar, useAdsterraAds } from '@/lib/ads';
import { trackPageView, trackPlayClick } from '@/lib/analytics';
import { hasApiKey, fetchMovieDetails, fetchTVDetails, backdropUrl, posterUrl, profileUrl } from '@/lib/tmdb';
import { getFallbackById } from '@/lib/fallbackData';
import type { Title } from '@/types';

export function DetailPage() {
  useAdsterraAds();
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);

  const contentType = type as 'movie' | 'tv' | 'anime';

  useEffect(() => {
    trackPageView(`/${type}/${id}`);
    async function loadData() {
      const tmdbId = parseInt(id || '0');
      if (hasApiKey()) {
        try {
          const data = contentType === 'movie'
            ? await fetchMovieDetails(tmdbId)
            : await fetchTVDetails(tmdbId);
          if (contentType === 'anime') data.content_type = 'anime';
          setTitle(data);
        } catch {
          setTitle(getFallbackById(tmdbId));
        }
      } else {
        setTitle(getFallbackById(tmdbId));
      }
      setLoading(false);
    }
    loadData();
  }, [type, id, contentType]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="h-[50vh] skeleton" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
          <div className="flex gap-6">
            <div className="w-64 aspect-[2/3] skeleton rounded-xl" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-2/3 skeleton rounded" />
              <div className="h-4 w-1/3 skeleton rounded" />
              <div className="h-20 skeleton rounded" />
            </div>
          </div>
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

  const watchPath = `/watch/${contentType}/${title.tmdb_id}`;

  function handlePlay() {
    if (title) {
      trackPlayClick(title.tmdb_id, contentType, title.title);
      navigate(watchPath);
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[300px] w-full overflow-hidden">
        <img
          src={backdropUrl(title.backdrop_path)}
          alt={title.title}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 -mt-48 relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-zinc-400 hover:text-cyan-400 transition-colors mb-4 text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="w-40 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img
                src={posterUrl(title.poster_path)}
                alt={title.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/300x450/18181b/71717a?text=${encodeURIComponent(title.title)}`;
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                {contentType === 'movie' ? <Film className="w-3 h-3" /> : contentType === 'anime' ? <Sparkles className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {contentType}
              </span>
              {title.vote_average > 0 && (
                <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {title.vote_average.toFixed(1)}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{title.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-zinc-400">
              {title.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {title.release_date.slice(0, 4)}
                </span>
              )}
              {title.seasons && (
                <span>{title.seasons.length} Seasons</span>
              )}
            </div>

            {/* Genres */}
            {title.genres && title.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {title.genres.map((genre) => (
                  <span key={genre.id} className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
              {title.overview}
            </p>

            {/* Play Button */}
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all mb-8"
            >
              <Play className="w-5 h-5 fill-black" /> Watch Now
            </button>
          </div>
        </div>

        {/* Cast & Seasons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
          <div className="lg:col-span-2">
            {/* Cast */}
            {title.cast && title.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-400 rounded-full" />
                  Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {title.cast.slice(0, 8).map((member) => (
                    <div key={member.id} className="glass-card p-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden flex-shrink-0">
                        {member.profile_path && (
                          <img
                            src={profileUrl(member.profile_path)}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seasons for TV/Anime */}
            {title.seasons && title.seasons.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-cyan-400 rounded-full" />
                  Seasons
                </h2>
                <div className="space-y-3">
                  {title.seasons.map((season) => (
                    <Link
                      key={season.season_number}
                      to={watchPath + `?season=${season.season_number}`}
                      className="glass-card p-4 flex items-center justify-between hover:border-cyan-500/30 transition-all block"
                    >
                      <div>
                        <h3 className="text-white font-semibold text-sm">{season.name}</h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          {season.episode_count} Episodes
                          {season.air_date && ` • ${season.air_date.slice(0, 4)}`}
                        </p>
                        {season.overview && (
                          <p className="text-zinc-400 text-xs mt-2 line-clamp-2">{season.overview}</p>
                        )}
                      </div>
                      <Play className="w-5 h-5 text-cyan-400 flex-shrink-0 ml-4" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Ad */}
          <div>
            <AdSidebar />
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="mt-8 mb-8">
          <AdBanner label="Advertisement" />
        </div>
      </div>
    </div>
  );
}
