import { Moon, Sun, Menu, X, ArrowRight } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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

  const navLinks = [
    { label: 'LIVE Rates', href: '#prices' },
    { label: 'Trends', href: '#trends' },
    { label: 'Calculator', href: '#calculator' },
    { label: 'Market Signals', href: '#market-signals' },
    { label: 'Market Intelligence', href: '#intelligence' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-transparent">
      {/* Thin gold gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 divider-gold" />

      <div className="max-w-7xl mx-auto h-14 md:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Left Side: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a 
            href={isHome ? "#prices" : "/#prices"} 
            className="flex items-center gap-3 group"
          >
            <img
              src="/logo-icon.png"
              alt="Assetory — Live Gold Rate India Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain filter brightness-110 contrast-105 dark:mix-blend-screen dark:drop-shadow-gold-glow group-hover:scale-105 transition-transform"
              decoding="async"
              loading="eager"
            />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-display font-bold leading-none text-foreground tracking-tight group-hover:text-gold transition-colors">
                <span className="text-gold">GOLD</span>Police
              </h1>
              <span className="text-[10px] font-body font-medium text-muted-foreground uppercase tracking-[0.3em] mt-1">
                Live Commodity Terminal
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation (Center) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={isHome ? link.href : `/${link.href}`}
              className="text-[10px] font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-gold transition-all duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Link
            to="/blog"
            className="text-[10px] font-body font-bold uppercase tracking-widest text-muted-foreground hover:text-gold transition-all duration-300 relative group"
          >
            Market Guide
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
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
            className="hidden sm:flex relative w-[52px] h-[28px] rounded-full bg-muted/60 border border-border/50 p-1 items-center transition-colors shrink-0"
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

      {/* ── MOBILE SIDEBAR MENU ─────────────────────────────── */}
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/40 backdrop-blur-[4px] z-[60] transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ 
          visibility: isMobileMenuOpen ? 'visible' : 'hidden',
          willChange: 'opacity'
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-[100dvh] w-[300px] max-w-[80vw] bg-card border-r border-border z-[70] flex flex-col shadow-2xl transition-transform duration-400 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ 
          willChange: 'transform',
          visibility: isMobileMenuOpen ? 'visible' : 'hidden'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <span className="font-display font-bold text-lg text-foreground">
            Menu
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-body font-bold uppercase tracking-wider text-foreground hover:text-gold transition-colors flex items-center justify-between group"
              >
                {link.label}
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </a>
            ))}
            
            <div className="h-px bg-border w-full my-2" />

            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-base font-body font-bold uppercase tracking-wider text-foreground hover:text-gold transition-colors flex items-center justify-between group"
            >
              Market Guide
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </Link>
          </nav>
        </div>

        {/* Footer actions inside mobile menu */}
        <div className="p-6 border-t border-border/50 bg-muted/20 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Appearance</span>
          {/* Theme Toggle (Mobile) */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="relative w-[52px] h-[28px] rounded-full bg-muted border border-border/50 p-1 flex items-center transition-colors"
            role="switch"
          >
            <div className={cn(
              "absolute w-5 h-5 rounded-full bg-gold shadow-md transition-transform duration-300",
              isDark ? "translate-x-[24px]" : "translate-x-0"
            )} />
            <Sun className={cn("w-3 h-3 relative z-10 transition-colors", !isDark ? "text-black" : "text-muted-foreground")} />
            <Moon className={cn("w-3 h-3 ml-auto relative z-10 transition-colors", isDark ? "text-black" : "text-muted-foreground")} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
