import { useState } from 'react';
import { ExternalLink, Search, X, AlertCircle, Newspaper } from 'lucide-react';
import { NewsItem } from '@/data/mockData';
import { formatTimeAgo } from '@/utils/priceReason';
import { cn } from '@/lib/utils';

interface NewsListProps {
  news: NewsItem[];
  isLoading: boolean;
  isDemo: boolean;
}

type MetalFilter = 'all' | 'gold' | 'silver' | 'copper';

const getMetalBadgeStyle = (metal: string) => {
  switch (metal.toLowerCase()) {
    case 'gold': return 'bg-gold/15 text-gold border-gold/25';
    case 'silver': return 'bg-silver-metal/15 text-silver-metal border-silver-metal/25';
    case 'copper': return 'bg-copper-metal/15 text-copper-metal border-copper-metal/25';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

const getMetalEmoji = (metal: string) => {
  switch (metal.toLowerCase()) {
    case 'gold': return '🥇';
    case 'silver': return '🥈';
    case 'copper': return '🥉';
    default: return '📰';
  }
};

const getMetalGradient = (metal: string) => {
  switch (metal.toLowerCase()) {
    case 'gold': return 'bg-gradient-to-br from-gold/20 to-gold/5';
    case 'silver': return 'bg-gradient-to-br from-silver-metal/20 to-silver-metal/5';
    case 'copper': return 'bg-gradient-to-br from-copper-metal/20 to-copper-metal/5';
    default: return 'bg-muted';
  }
};

const FeaturedCard = ({ item }: { item: NewsItem }) => (
  <article className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border bg-card card-elevated gold-ring-hover overflow-hidden">
    <div className={cn("hidden md:flex shrink-0 w-[100px] h-[100px] rounded-xl items-center justify-center text-4xl", getMetalGradient(item.metal))}>
      {getMetalEmoji(item.metal)}
    </div>
    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-body font-semibold uppercase tracking-widest text-muted-foreground">{item.source}</span>
        <span className="text-xs font-body text-muted-foreground">{formatTimeAgo(item.time)}</span>
        <span className={cn("ml-auto px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full border", getMetalBadgeStyle(item.metal))}>{item.metal}</span>
      </div>
      <h3 className="text-xl font-display font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-gold transition-colors">{item.headline}</h3>
      <p className="text-sm font-body text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-body font-medium text-gold hover:text-gold-light transition-colors">
        Read full article <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </article>
);

const StandardCard = ({ item }: { item: NewsItem }) => (
  <article className="group flex flex-col p-4 rounded-xl border border-border bg-card card-elevated gold-ring-hover h-full">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-body font-semibold uppercase tracking-widest text-muted-foreground">{item.source}</span>
      <span className={cn("px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full border", getMetalBadgeStyle(item.metal))}>{item.metal}</span>
    </div>
    <div className="flex-1 space-y-2 mb-4">
      <h3 className="text-base font-display font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-gold transition-colors">{item.headline}</h3>
    </div>
    <div className="pt-3 border-t border-border/30 flex items-center justify-between">
      <span className="text-xs font-body text-muted-foreground">{formatTimeAgo(item.time)}</span>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-body font-medium text-gold hover:text-gold-light transition-colors">
        Read <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  </article>
);

const NewsList = ({ news, isLoading, isDemo }: NewsListProps) => {
  const [filter, setFilter] = useState<MetalFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemoBanner, setShowDemoBanner] = useState(() => sessionStorage.getItem('news-demo-banner-dismissed') !== 'true');

  const filteredNews = news.filter((item) => {
    const matchesMetal = filter === 'all' || item.metal === filter;
    const matchesSearch = searchQuery === '' || item.headline.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMetal && matchesSearch;
  });

  const dismissBanner = () => { setShowDemoBanner(false); sessionStorage.setItem('news-demo-banner-dismissed', 'true'); };

  return (
    <section className="py-12 space-y-8" id="market-news">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-normal text-foreground tracking-tight">Market Intelligence</h2>
            <div className="divider-gold w-24" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
              <input type="text" placeholder="Search headlines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-4 py-1.5 bg-transparent border-b border-border/50 focus:border-gold outline-none text-sm font-body font-medium transition-all w-full sm:w-48"
                aria-label="Search news headlines" />
            </div>
            <div className="flex items-center bg-muted/30 border border-border/50 rounded-full p-1">
              {(['all', 'gold', 'silver', 'copper'] as const).map((m) => (
                <button key={m} onClick={() => setFilter(m)} className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-body font-semibold uppercase tracking-wider transition-all",
                  filter === m ? "bg-gold text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                )}>{m}</button>
              ))}
            </div>
          </div>
        </div>

        {isDemo && showDemoBanner && (
          <div className="flex items-center justify-between p-4 rounded-xl border-l-4 border-amber-500 bg-amber-500/5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-xs font-body font-medium text-amber-500/90">
                Showing sample headlines — <span className="opacity-70">connect NewsData.io API for live news</span>
              </p>
            </div>
            <button onClick={dismissBanner} className="p-1 hover:bg-amber-500/10 rounded-lg transition-colors" aria-label="Dismiss demo banner">
              <X className="w-4 h-4 text-amber-500/50 hover:text-amber-500" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-[140px] w-full shimmer rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[...Array(4)].map((_, i) => <div key={i} className="h-[160px] shimmer rounded-xl" />)}</div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <Newspaper className="w-16 h-16 text-muted-foreground/30 stroke-[1.5]" />
          <h3 className="text-2xl font-display text-foreground">No market news found</h3>
          <p className="text-sm font-body text-muted-foreground max-w-xs mx-auto">We couldn't find any articles matching your criteria.</p>
          <button onClick={() => { setFilter('all'); setSearchQuery(''); }} className="px-6 py-2 rounded-full border border-gold/30 text-xs font-body font-semibold text-gold hover:bg-gold/5 transition-all mt-4">Clear all filters</button>
        </div>
      ) : (
        <div className="space-y-6">
          <FeaturedCard item={filteredNews[0]} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNews.slice(1).map((item, idx) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <StandardCard item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsList;
