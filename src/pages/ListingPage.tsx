import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PosterCard } from '@/components/PosterCard';
import { AdBanner, useAdsterraAds } from '@/lib/ads';
import { trackPageView } from '@/lib/analytics';
import { hasApiKey, fetchByGenre, fetchPopularMovies, fetchPopularTV, fetchAnime, GENRES } from '@/lib/tmdb';
import { getFallbackTitles } from '@/lib/fallbackData';
import type { Title, ContentType } from '@/types';

interface ListingPageProps {
  contentType: ContentType;
  pageTitle: string;
  pageTitleAr: string;
}

export function ListingPage({ contentType, pageTitle, pageTitleAr }: ListingPageProps) {
  useAdsterraAds();
  const [titles, setTitles] = useState<Title[]>([]);
  const [filtered, setFiltered] = useState<Title[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'latest'>('popularity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView(`/${contentType}`);
    async function loadData() {
      if (hasApiKey()) {
        try {
          let data: Title[];
          if (contentType === 'movie') data = await fetchPopularMovies();
          else if (contentType === 'tv') data = await fetchPopularTV();
          else data = await fetchAnime();
          setTitles(data);
          setFiltered(data);
        } catch {
          const fallback = getFallbackTitles(contentType);
          setTitles(fallback);
          setFiltered(fallback);
        }
      } else {
        const fallback = getFallbackTitles(contentType);
        setTitles(fallback);
        setFiltered(fallback);
      }
      setLoading(false);
    }
    loadData();
  }, [contentType]);

  useEffect(() => {
    let result = [...titles];
    if (selectedGenre !== null) {
      result = result.filter(t =>
        t.genres?.some(g => g.id === selectedGenre) || t.genre_ids?.includes(selectedGenre)
      );
    }
    if (sortBy === 'rating') {
      result.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'latest') {
      result.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
    }
    setFiltered(result);
  }, [selectedGenre, sortBy, titles]);

  const genres = GENRES[contentType] || [];

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2">{pageTitle}</h1>
            <p className="text-lg text-cyan-400 font-semibold" dir="rtl">{pageTitleAr}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedGenre === null
                  ? 'bg-cyan-400 text-black'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30'
              }`}
            >
              All
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedGenre === genre.id
                    ? 'bg-cyan-400 text-black'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-cyan-500/30'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="popularity">Sort: Popularity</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="latest">Sort: Latest</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">No titles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((title) => (
              <PosterCard key={`${title.content_type}-${title.tmdb_id}`} title={title} width="w-full" />
            ))}
          </div>
        )}

        {/* Ad */}
        <div className="mt-8">
          <AdBanner label="Advertisement" />
        </div>
      </div>
    </div>
  );
}

export function MoviesPage() {
  return <ListingPage contentType="movie" pageTitle="Movies" pageTitleAr="الأفلام" />;
}
export function TVPage() {
  return <ListingPage contentType="tv" pageTitle="TV Series" pageTitleAr="المسلسلات" />;
}
export function AnimePage() {
  return <ListingPage contentType="anime" pageTitle="Anime" pageTitleAr="الأنمي" />;
}
