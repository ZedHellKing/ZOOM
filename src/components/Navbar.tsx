import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, Crown, User, LogOut, Home, Film, Tv, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { hasApiKey, searchTitles } from '@/lib/tmdb';
import { searchFallback } from '@/lib/fallbackData';
import { posterUrl } from '@/lib/tmdb';
import type { Title } from '@/types';

export function Navbar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    const timer = setTimeout(async () => {
      if (hasApiKey()) {
        const results = await searchTitles(searchQuery);
        setSearchResults(results.slice(0, 8));
      } else {
        const results = searchFallback(searchQuery);
        setSearchResults(results.slice(0, 8));
      }
      setShowSearch(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/movies', label: 'Movies', icon: Film },
    { to: '/tv', label: 'TV Series', icon: Tv },
    { to: '/anime', label: 'Anime', icon: Sparkles },
  ];

  function handleResultClick(result: Title) {
    setSearchQuery('');
    setShowSearch(false);
    const path = result.content_type === 'movie'
      ? `/movie/${result.tmdb_id}`
      : result.content_type === 'anime'
      ? `/anime/${result.tmdb_id}`
      : `/tv/${result.tmdb_id}`;
    navigate(path);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center accent-glow">
              <span className="text-black font-black text-lg">Z</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white hidden sm:block">
              ZOOM
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link text-sm ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                placeholder="Search movies, series, anime..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
            </div>
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl overflow-hidden shadow-2xl max-h-[400px] overflow-y-auto animate-fade-in">
                {searchResults.map((result) => (
                  <button
                    key={`${result.content_type}-${result.tmdb_id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-zinc-800/50 transition-colors text-left border-b border-zinc-800/50 last:border-0"
                  >
                    <img
                      src={posterUrl(result.poster_path)}
                      alt={result.title}
                      className="w-10 h-14 object-cover rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{result.title}</p>
                      <p className="text-xs text-zinc-500 capitalize">{result.content_type} • {result.release_date?.slice(0, 4) ?? ''}</p>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                      ★ {result.vote_average?.toFixed(1) ?? 'N/A'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {profile && !profile.is_vip && (
              <Link
                to="/premium"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
              >
                <Crown className="w-4 h-4" />
                Go Premium
              </Link>
            )}
            {profile?.is_vip && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold">
                <Crown className="w-4 h-4" />
                VIP
              </div>
            )}

            {/* Profile / Login */}
            {profile ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-black font-bold text-sm">
                    {profile.email[0]?.toUpperCase()}
                  </div>
                </button>
                {showProfileMenu && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
                    <div className="p-3 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white truncate">{profile.email}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {profile.is_vip ? 'VIP Member' : 'Free Member'}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    {profile.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-cyan-400 hover:bg-zinc-800/50 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setShowProfileMenu(false); navigate('/'); }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-zinc-800/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-700 text-white text-sm font-medium hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-cyan-400 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
              {!profile && (
                <Link
                  to="/premium"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-amber-400 font-semibold hover:bg-zinc-800/50 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Go Premium
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
