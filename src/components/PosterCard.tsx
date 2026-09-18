import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import type { Title } from '@/types';
import { posterUrl } from '@/lib/tmdb';

interface PosterCardProps {
  title: Title;
  width?: string;
}

export function PosterCard({ title, width = 'w-40 md:w-48' }: PosterCardProps) {
  const detailPath = title.content_type === 'movie'
    ? `/movie/${title.tmdb_id}`
    : title.content_type === 'anime'
    ? `/anime/${title.tmdb_id}`
    : `/tv/${title.tmdb_id}`;

  return (
    <Link to={detailPath} className={`poster-card ${width} group`}>
      <div className="aspect-[2/3] bg-zinc-900 rounded-xl overflow-hidden">
        <img
          src={posterUrl(title.poster_path)}
          alt={title.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/300x450/18181b/71717a?text=${encodeURIComponent(title.title)}`;
          }}
        />
      </div>
      <div className="card-overlay">
        <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          {title.vote_average?.toFixed(1) ?? 'N/A'}
        </div>
        <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2">{title.title}</h3>
        <p className="text-zinc-400 text-xs mt-1">{title.release_date?.slice(0, 4) ?? ''}</p>
        <div className="flex items-center gap-1 text-cyan-400 text-xs mt-2 font-medium">
          <Play className="w-3 h-3 fill-cyan-400" />
          Watch Now
        </div>
      </div>
    </Link>
  );
}

export function PosterCardSkeleton({ width = 'w-40 md:w-48' }: { width?: string }) {
  return (
    <div className={`${width} aspect-[2/3] skeleton rounded-xl`} />
  );
}
