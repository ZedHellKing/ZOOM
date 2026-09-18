import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const ADSTERRA_POPUNDER_KEY = 'adsterra_popunder_loaded';
const ADSTERRA_SOCIALBAR_KEY = 'adsterra_socialbar_loaded';

function loadScript(src: string, id: string, isAsync = true): void {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.src = src;
  script.id = id;
  script.async = isAsync;
  document.body.appendChild(script);
}

function removeScript(id: string): void {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
}

export function useAdsterraAds() {
  const { profile } = useAuth();
  const isVip = profile?.is_vip ?? false;

  useEffect(() => {
    if (isVip) {
      removeScript(ADSTERRA_POPUNDER_KEY);
      removeScript(ADSTERRA_SOCIALBAR_KEY);
      return;
    }

    loadScript(
      'https://www.profitableratecpmnetwork.com/31305598',
      ADSTERRA_POPUNDER_KEY
    );
    loadScript(
      'https://www.profitableratecpmnetwork.com/31305599',
      ADSTERRA_SOCIALBAR_KEY
    );

    return () => {
      removeScript(ADSTERRA_POPUNDER_KEY);
      removeScript(ADSTERRA_SOCIALBAR_KEY);
    };
  }, [isVip]);
}

export function AdBanner({ label = 'Advertisement', className = '' }: { label?: string; className?: string }) {
  const { profile } = useAuth();
  const isVip = profile?.is_vip ?? false;

  if (isVip) return null;

  return (
    <div className={`relative w-full bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden ${className}`}>
      <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-zinc-500 z-10">
        {label}
      </div>
      <div className="flex items-center justify-center min-h-[90px] md:min-h-[120px] p-4">
        <div
          className="adsterra-banner"
          data-key="31305598"
          style={{ width: '100%', minHeight: '90px' }}
        />
      </div>
    </div>
  );
}

export function AdSidebar({ className = '' }: { className?: string }) {
  const { profile } = useAuth();
  const isVip = profile?.is_vip ?? false;

  if (isVip) return null;

  return (
    <div className={`relative w-full bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden ${className}`}>
      <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-zinc-500 z-10">
        Advertisement
      </div>
      <div className="flex items-center justify-center min-h-[250px] p-4">
        <div
          className="adsterra-banner"
          data-key="31305599"
          style={{ width: '100%', minHeight: '250px' }}
        />
      </div>
    </div>
  );
}
