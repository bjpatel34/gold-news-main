import { Activity } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background mt-16 overflow-hidden">
      {/* Gold divider top */}
      <div className="divider-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-icon.png"
                alt="GoldPolice icon"
                className="w-10 h-10 object-contain drop-shadow-gold-glow mix-blend-screen"
              />
              <span className="text-xl font-display font-bold text-foreground tracking-tight">
                <span className="text-gold">GOLD</span>Police
              </span>
            </div>
            <p className="text-sm font-body text-muted-foreground italic">Real prices for real people.</p>
            <p className="text-xs font-body text-muted-foreground">🇮🇳 Made with love in India</p>
          </div>

          {/* Column 2: Navigate */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-body font-semibold uppercase tracking-widest text-muted-foreground">Navigate</h4>
            <nav className="flex flex-col gap-2.5">
              <a href="#prices" className="text-sm font-body text-foreground hover:text-gold transition-colors">LIVE Rates</a>
              <a href="#trends" className="text-sm font-body text-foreground hover:text-gold transition-colors">Trends</a>
              <a href="#calculator" className="text-sm font-body text-foreground hover:text-gold transition-colors">Calculator</a>
              <a href="#market-signals" className="text-sm font-body text-foreground hover:text-gold transition-colors">Market Signals</a>
              <a href="#intelligence" className="text-sm font-body text-foreground hover:text-gold transition-colors">Market Intelligence</a>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-body text-muted-foreground">
          <p>© {currentYear} GoldPolice</p>
          <p>Live gold & silver prices for India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
