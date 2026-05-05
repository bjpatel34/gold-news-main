import { Activity, BookOpen } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className="relative bg-background mt-16 overflow-hidden">
      {/* Gold divider top */}
      <div className="divider-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-icon.png"
                alt="GoldPolice icon"
                className="w-10 h-10 object-contain filter brightness-110 contrast-105 dark:mix-blend-screen dark:drop-shadow-gold-glow"
                decoding="async"
                loading="lazy"
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
              <a href={isHome ? "#prices" : "/#prices"} className="text-sm font-body text-foreground hover:text-gold transition-colors">LIVE Rates</a>
              <a href={isHome ? "#trends" : "/#trends"} className="text-sm font-body text-foreground hover:text-gold transition-colors">Trends</a>
              <a href={isHome ? "#calculator" : "/#calculator"} className="text-sm font-body text-foreground hover:text-gold transition-colors">Calculator</a>
              <a href={isHome ? "#market-signals" : "/#market-signals"} className="text-sm font-body text-foreground hover:text-gold transition-colors">Market Signals</a>
              <a href={isHome ? "#intelligence" : "/#intelligence"} className="text-sm font-body text-foreground hover:text-gold transition-colors">Market Intelligence</a>
            </nav>
          </div>

          {/* Column 3: Market Guide */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-body font-semibold uppercase tracking-widest text-muted-foreground">Market Guide</h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                to="/blog"
                className="text-sm text-foreground hover:text-gold transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Market Guide
              </Link>
              <Link
                to="/blog/why-gold-price-rises-india"
                className="text-xs text-muted-foreground hover:text-gold transition-colors block"
              >
                Why Gold Price Rises
              </Link>
              <Link
                to="/blog/24k-vs-22k-vs-18k-gold-difference"
                className="text-xs text-muted-foreground hover:text-gold transition-colors block"
              >
                24K vs 22K vs 18K Gold
              </Link>
              <Link
                to="/blog/silver-price-india-why-it-moves"
                className="text-xs text-muted-foreground hover:text-gold transition-colors block"
              >
                Why Silver Price Moves
              </Link>
              <Link
                to="/blog/gold-vs-silver-investment-india-2026"
                className="text-xs text-muted-foreground hover:text-gold transition-colors block"
              >
                Gold vs Silver 2026
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Live Gold Rate in India — About Assetory
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Assetory provides live gold rate in India updated every 25 minutes
              from international spot markets, MCX (Multi Commodity Exchange) and
              IBJA (India Bullion and Jewellers Association). Today's 24K gold rate
              reflects the international price converted to Indian Rupees (INR)
              including 6% customs duty and 3% GST. Gold rates vary slightly between
              cities like Mumbai, Delhi, Chennai, Bangalore, Ahmedabad, Surat, Jaipur,
              Kolkata, Hyderabad, Kochi and Patna due to local taxes and demand.
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Silver price in India is quoted per kilogram and updated in real-time.
              Our free gold rate calculator helps you find the exact value of gold by
              weight — including making charges (5-25%) and 3% GST — for 24K, 22K,
              18K and 14K gold. The Gold/Silver ratio gauge helps investors decide
              when to switch between the two metals for maximum returns.
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Popular searches: gold rate today india · sona ka bhav aaj ·
              22k gold rate today · silver price per kg india ·
              gold calculator with making charges · mcx gold rate today ·
              chandi ka bhav · copper price india · gold rate ahmedabad ·
              gold rate surat · gold rate mumbai · gold rate delhi ·
              gold rate chennai · ibja gold rate today
            </p>

            <p className="text-[10px] text-muted-foreground/50 italic">
              Disclaimer: All prices shown are indicative and sourced from Gold-API.com
              with live USD-INR conversion via open.er-api.com. Actual prices may vary
              at your local jeweller. Not financial advice. For accurate rates contact
              your nearest IBJA-registered jeweller or check MCX directly.
            </p>
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
