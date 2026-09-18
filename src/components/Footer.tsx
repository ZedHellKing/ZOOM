import { Link } from 'react-router-dom';
import { Crown, Film, Tv, Sparkles, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-black/50 mt-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <span className="text-black font-black text-sm">Z</span>
              </div>
              <span className="text-lg font-black text-white">ZOOM</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your ultimate destination for movies, TV series, and anime. Stream in HD, ad-free with VIP.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Browse</h4>
            <div className="flex flex-col gap-2">
              <Link to="/movies" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Film className="w-3.5 h-3.5" /> Movies
              </Link>
              <Link to="/tv" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Tv className="w-3.5 h-3.5" /> TV Series
              </Link>
              <Link to="/anime" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Anime
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Account</h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors">Login</Link>
              <Link to="/signup" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors">Sign Up</Link>
              <Link to="/premium" className="text-sm text-zinc-500 hover:text-cyan-400 transition-colors flex items-center gap-2">
                <Crown className="w-3.5 h-3.5" /> Go Premium
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800/50 text-center">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Zoom (زوم). All rights reserved. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
