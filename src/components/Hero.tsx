import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Info, ChevronDown } from 'lucide-react';
import { backdropUrl } from '@/lib/tmdb';
import type { Title } from '@/types';

interface HeroProps {
  titles: Title[];
}

export function Hero({ titles }: HeroProps) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (titles.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % titles.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [titles.length]);

  if (!titles.length) return null;
  const title = titles[index];

  const detailPath = title.content_type === 'movie'
    ? `/movie/${title.tmdb_id}`
    : title.content_type === 'anime'
    ? `/anime/${title.tmdb_id}`
    : `/tv/${title.tmdb_id}`;

  const watchPath = `/watch/${title.content_type}/${title.tmdb_id}`;

  return (
    <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl(title.backdrop_path)}
          alt={title.title}
          className="w-full h-full object-cover animate-fade-in"
          key={index}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 md:pb-24">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 w-full">
          <div className="max-w-2xl animate-slide-up" key={index}>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
                {title.content_type}
              </span>
              {title.vote_average > 0 && (
                <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {title.vote_average.toFixed(1)}
                </span>
              )}
              <span className="text-zinc-400 text-sm">{title.release_date?.slice(0, 4)}</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
              {title.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {title.genres?.slice(0, 4).map((genre) => (
                <span key={genre.id} className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-0.5">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-3 max-w-xl">
              {title.overview}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(watchPath)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-semibold hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all"
              >
                <Play className="w-5 h-5 fill-black" /> Play Now
              </button>
              <button
                onClick={() => navigate(detailPath)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-zinc-800/80 backdrop-blur border border-zinc-700 text-white font-medium hover:border-cyan-500/50 transition-all"
              >
                <Info className="w-5 h-5" /> More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {titles.length > 1 && (
        <div className="absolute bottom-6 right-6 md:right-10 flex gap-2">
          {titles.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-8 bg-cyan-400' : 'w-2 bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
