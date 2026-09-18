import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Calendar, LogOut, User, Settings, Film, Tv, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { trackPageView } from '@/lib/analytics';
import { useAdsterraAds } from '@/lib/ads';
import type { VipSubscription } from '@/types';

export function ProfilePage() {
  useAdsterraAds();
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<VipSubscription[]>([]);

  useEffect(() => {
    trackPageView('/profile');
    if (!user) navigate('/login');
  }, [user]);

  useEffect(() => {
    if (user) {
      supabase
        .from('vip_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => setSubscriptions(data || []));
    }
  }, [user]);

  if (!profile) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <p className="text-zinc-500">Loading profile...</p>
      </div>
    );
  }

  const isVip = profile.is_vip && (!profile.vip_expires_at || new Date(profile.vip_expires_at) > new Date());

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Profile Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-black font-bold text-2xl">
              {profile.email[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{profile.email}</h1>
              <div className="flex items-center gap-2 mt-1">
                {isVip ? (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Crown className="w-3 h-3" /> VIP Member
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-semibold">
                    Free Member
                  </span>
                )}
                {profile.role === 'admin' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => { signOut(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:border-red-500/50 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" /> Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Email:</span>
                <span className="text-white truncate">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-400">Joined:</span>
                <span className="text-white">{new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
              {isVip && profile.vip_expires_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-400">VIP Expires:</span>
                  <span className="text-amber-400">{new Date(profile.vip_expires_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" /> Subscription
            </h3>
            {isVip ? (
              <div>
                <p className="text-sm text-amber-400 font-semibold mb-2">VIP Active</p>
                <p className="text-xs text-zinc-500">
                  Your VIP subscription is active until {new Date(profile.vip_expires_at!).toLocaleDateString()}.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-zinc-400 mb-3">You are on the free plan with ads.</p>
                <Link to="/premium" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black text-sm font-semibold">
                  <Crown className="w-4 h-4" /> Upgrade to VIP
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Subscription History */}
        {subscriptions.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Payment History</h3>
            <div className="space-y-2">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div>
                    <p className="text-sm text-white font-medium">{sub.amount_egp} EGP — {sub.payment_method}</p>
                    <p className="text-xs text-zinc-500">{new Date(sub.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    sub.status === 'completed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Link to="/movies" className="glass-card p-4 text-center hover:border-cyan-500/30 transition-all">
            <Film className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Movies</p>
          </Link>
          <Link to="/tv" className="glass-card p-4 text-center hover:border-cyan-500/30 transition-all">
            <Tv className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">TV Series</p>
          </Link>
          <Link to="/anime" className="glass-card p-4 text-center hover:border-cyan-500/30 transition-all">
            <Sparkles className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Anime</p>
          </Link>
        </div>

        {profile.role === 'admin' && (
          <Link to="/admin" className="glass-card p-4 mt-4 flex items-center gap-3 hover:border-cyan-500/30 transition-all">
            <Settings className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm font-semibold text-white">Admin Dashboard</p>
              <p className="text-xs text-zinc-500">View analytics and manage servers</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
