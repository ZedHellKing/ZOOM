import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X, CreditCard, Smartphone, Building2, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { trackPageView } from '@/lib/analytics';
import { useAdsterraAds } from '@/lib/ads';

export function PremiumPage() {
  useAdsterraAds();
  const { profile, user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('paymob');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    trackPageView('/premium');
  }, []);

  const paymentMethods = [
    { id: 'paymob', label: 'Paymob', icon: CreditCard, desc: 'Visa / Mastercard via Paymob' },
    { id: 'vodafone_cash', label: 'Vodafone Cash', icon: Smartphone, desc: 'Pay with Vodafone Cash wallet' },
    { id: 'fawry', label: 'Fawry', icon: Building2, desc: 'Pay at any Fawry outlet' },
  ];

  async function handleSubscribe() {
    if (!user) {
      navigate('/login');
      return;
    }
    setProcessing(true);

    try {
      await supabase.from('vip_subscriptions').insert({
        user_id: user.id,
        amount_egp: 200,
        payment_method: selectedMethod,
        status: 'completed',
      });

      const { error: rpcError } = await supabase.rpc('activate_vip', { p_user_id: user.id });
      if (rpcError) throw rpcError;

      await refreshProfile();
      setSuccess(true);
    } catch {
      setProcessing(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to VIP!</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Your VIP subscription is now active. Enjoy ad-free streaming across all of Zoom.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary px-6 py-2.5">
            Start Watching
          </button>
        </div>
      </div>
    );
  }

  const freeFeatures = [
    { text: 'Full catalog access', included: true },
    { text: 'HD streaming', included: true },
    { text: 'Ad-supported experience', included: true },
    { text: 'Multi-server playback', included: false },
    { text: 'Ad-free experience', included: false },
    { text: '4K quality servers', included: false },
    { text: 'Priority streaming', included: false },
  ];

  const vipFeatures = [
    { text: 'Full catalog access', included: true },
    { text: 'HD & 4K streaming', included: true },
    { text: '100% Ad-free experience', included: true },
    { text: 'All multi-server playback', included: true },
    { text: 'Priority streaming servers', included: true },
    { text: 'Arabic subtitled servers', included: true },
    { text: 'Early access to new releases', included: true },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold mb-4">
            <Crown className="w-4 h-4" />
            Zoom VIP Membership
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
            Go Premium, Go Ad-Free
          </h1>
          <p className="text-zinc-400 text-lg">
            Upgrade to VIP for just <span className="text-amber-400 font-bold">200 EGP/month</span> and enjoy the ultimate streaming experience
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Free */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Free</h3>
              <span className="text-2xl font-black text-zinc-500">0 EGP</span>
            </div>
            <p className="text-zinc-500 text-sm mb-6">Basic streaming with ads</p>
            <div className="space-y-3">
              {freeFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  {f.included ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                  )}
                  <span className={f.included ? 'text-zinc-300' : 'text-zinc-600 line-through'}>{f.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              {profile && !profile.is_vip && (
                <p className="text-center text-sm text-zinc-500">Your current plan</p>
              )}
            </div>
          </div>

          {/* VIP */}
          <div className="glass-card p-6 relative border-amber-500/30" style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.08)' }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold">
              RECOMMENDED
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Crown className="w-5 h-5" /> VIP
              </h3>
              <span className="text-2xl font-black text-white">200 <span className="text-sm text-zinc-400">EGP/mo</span></span>
            </div>
            <p className="text-amber-400/70 text-sm mb-6">Premium ad-free streaming</p>
            <div className="space-y-3">
              {vipFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-zinc-200">{f.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-800">
              {profile?.is_vip ? (
                <p className="text-center text-sm text-amber-400 font-semibold flex items-center justify-center gap-1">
                  <Crown className="w-4 h-4" /> You are a VIP member
                </p>
              ) : (
                <p className="text-center text-sm text-zinc-500">Scroll down to subscribe</p>
              )}
            </div>
          </div>
        </div>

        {/* Checkout */}
        {!profile?.is_vip && (
          <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-2">Complete Your Subscription</h2>
            <p className="text-zinc-500 text-sm mb-6">Choose your preferred payment method</p>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    selectedMethod === method.id
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedMethod === method.id ? 'bg-amber-500/20' : 'bg-zinc-800'
                  }`}>
                    <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-amber-400' : 'text-zinc-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white">{method.label}</p>
                    <p className="text-xs text-zinc-500">{method.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id ? 'border-amber-500 bg-amber-500' : 'border-zinc-700'
                  }`}>
                    {selectedMethod === method.id && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </button>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-zinc-900/50 rounded-lg p-4 mb-6 border border-zinc-800">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">VIP Subscription (1 month)</span>
                <span className="text-white font-semibold">200 EGP</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Tax</span>
                <span className="text-white">Included</span>
              </div>
              <div className="border-t border-zinc-800 pt-2 mt-2 flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-black text-amber-400">200 EGP</span>
              </div>
            </div>

            {!user && (
              <div className="mb-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm text-center">
                Please <button onClick={() => navigate('/login')} className="underline font-semibold">sign in</button> to subscribe
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={processing || !user}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><Crown className="w-5 h-5" /> Subscribe Now — 200 EGP</>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-zinc-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure payment. Cancel anytime.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
