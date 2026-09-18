import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PosterCard } from '@/components/PosterCard';
import type { Title } from '@/types';

interface ContentRowProps {
  title: string;
  titles: Title[];
  viewAllLink?: string;
}

export function ContentRow({ title, titles, viewAllLink }: ContentRowProps) {
  if (!titles.length) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-cyan-400 rounded-full accent-glow" />
          {title}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="scroll-row px-4 md:px-6">
        {titles.map((t) => (
          <PosterCard key={`${t.content_type}-${t.tmdb_id}`} title={t} />
        ))}
      </div>
    </div>
  );
}
