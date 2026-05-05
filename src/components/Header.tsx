import { Moon, Sun } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MetalPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface HeaderProps {
  isDemo: boolean;
  prices: MetalPrice[];
  lastUpdated?: number | null;
}

const Header = ({ isDemo, prices, lastUpdated }: HeaderProps) => {
  const prevIsDemoRef = useRef(isDemo);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (prevIsDemoRef.current !== isDemo) {
      toast.success(isDemo ? 'Switched to Demo Mode' : 'Connected to Live Market');
      prevIsDemoRef.current = isDemo;
    }
  }, [isDemo]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('dailygoldnews-theme') === 'dark' ||
        (!localStorage.getItem('dailygoldnews-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('dailygoldnews-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('dailygoldnews-theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-transparent">
      {/* Thin gold gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 divider-gold" />

      <div className="max-w-7xl mx-auto h-14 md:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logo-icon.png"
            alt="GoldPolice icon"
            className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-gold-glow mix-blend-screen"
          />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-display font-bold leading-none text-foreground tracking-tight">
              <span className="text-gold">GOLD</span>Police
            </h1>
            <span className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-[0.3em] mt-1">
              Live Commodity Terminal
            </span>
          </div>
        </div>



        {/* Center: Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: 'LIVE Rates', href: '#prices' },
            { label: 'Trends', href: '#trends' },
            { label: 'Calculator', href: '#calculator' },
            { label: 'Market Signals', href: '#market-signals' },
            { label: 'Market Intelligence', href: '#intelligence' },
          ].map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/blog"
            className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
          >
            Market Guide
          </Link>
        </nav>

        {/* Right Side: Status & Theme */}
        <div className="flex items-center gap-3 shrink-0">


          {/* Live/Demo Badge */}
          <div className={cn(
            "px-3 py-1 rounded-full text-[11px] font-price font-medium uppercase tracking-wider flex items-center gap-2",
            isDemo
              ? "bg-warning/10 text-warning border border-warning/30"
              : "bg-chart-up/8 text-chart-up border border-chart-up/30"
          )}>
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isDemo ? "bg-warning" : "bg-chart-up animate-live"
            )} />
            {isDemo ? 'DEMO' : 'LIVE'}
          </div>

          {/* Theme Pill Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-[52px] h-[28px] rounded-full bg-muted/60 border border-border/50 p-1 flex items-center transition-colors"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
          >
            {/* Active indicator */}
            <div className={cn(
              "absolute w-5 h-5 rounded-full bg-gold shadow-md transition-transform duration-300",
              isDark ? "translate-x-[24px]" : "translate-x-0"
            )} />
            {/* Icons */}
            <Sun className={cn(
              "w-3 h-3 relative z-10 transition-colors",
              !isDark ? "text-black" : "text-muted-foreground"
            )} />
            <Moon className={cn(
              "w-3 h-3 ml-auto relative z-10 transition-colors",
              isDark ? "text-black" : "text-muted-foreground"
            )} />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
