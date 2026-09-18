import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { ContentRow } from '@/components/ContentRow';
import { AdBanner } from '@/lib/ads';
import { useAdsterraAds } from '@/lib/ads';
import { trackPageView } from '@/lib/analytics';
import { hasApiKey, fetchTrending, fetchPopularMovies, fetchPopularTV, fetchAnime } from '@/lib/tmdb';
import { getFallbackTrending, getFallbackTitles } from '@/lib/fallbackData';
import type { Title } from '@/types';

export function HomePage() {
  useAdsterraAds();
  const [trending, setTrending] = useState<Title[]>([]);
  const [movies, setMovies] = useState<Title[]>([]);
  const [tv, setTv] = useState<Title[]>([]);
  const [anime, setAnime] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView('/');
    async function loadData() {
      if (hasApiKey()) {
        try {
          const [trend, popMovies, popTV, popAnime] = await Promise.all([
            fetchTrending('movie'),
            fetchPopularMovies(),
            fetchPopularTV(),
            fetchAnime(),
          ]);
          setTrending(trend.slice(0, 5));
          setMovies(popMovies);
          setTv(popTV);
          setAnime(popAnime);
        } catch {
          setTrending(getFallbackTrending());
          setMovies(getFallbackTitles('movie'));
          setTv(getFallbackTitles('tv'));
          setAnime(getFallbackTitles('anime'));
        }
      } else {
        setTrending(getFallbackTrending());
        setMovies(getFallbackTitles('movie'));
        setTv(getFallbackTitles('tv'));
        setAnime(getFallbackTitles('anime'));
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16">
        <div className="h-[70vh] min-h-[500px] skeleton" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 mt-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mb-8">
              <div className="h-6 w-48 skeleton rounded mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="w-40 md:w-48 aspect-[2/3] skeleton rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <Hero titles={trending} />

      <div className="max-w-[1600px] mx-auto py-8">
        <ContentRow title="Trending Now" titles={trending} />
        <ContentRow title="Popular Movies" titles={movies} viewAllLink="/movies" />
        <ContentRow title="Popular TV Series" titles={tv} viewAllLink="/tv" />
        <ContentRow title="Popular Anime" titles={anime} viewAllLink="/anime" />

        <div className="px-4 md:px-6 my-8">
          <AdBanner label="Advertisement" className="max-w-3xl mx-auto" />
        </div>

        <ContentRow title="Top Rated Movies" titles={[...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10)} viewAllLink="/movies" />
        <ContentRow title="Top Rated Series" titles={[...tv].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10)} viewAllLink="/tv" />
        <ContentRow title="Trending Anime" titles={anime} viewAllLink="/anime" />
      </div>
    </div>
  );
}
