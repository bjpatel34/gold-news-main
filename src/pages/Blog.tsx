import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { blogPosts, blogCategories, BlogPost } from '@/data/blogData';
import Header from '@/components/Header';
import Footer from '@/components/SimpleFooter';
import ScrollToTop from '@/components/ScrollToTop';
import BlogBook from '@/components/BlogBook';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'book'>('book');

  // Update page title for SEO
  useEffect(() => {
    document.title = 'Gold & Silver Market Guide — Learn About Precious Metals | GoldPolice Blog';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content',
      'Learn how gold, silver and copper prices move in India. Expert articles on gold investment, silver trading, karat guide, making charges calculator and commodity market insights.'
    );
  }, []);

  const filtered = blogPosts.filter(post => {
    const matchCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featured = blogPosts.filter(p => p.featured).slice(0, 3);

  const categoryColor: Record<string, string> = {
    gold:    'bg-yellow-500/15 text-yellow-600 border-yellow-500/30 dark:text-yellow-400',
    silver:  'bg-slate-500/15 text-slate-600 border-slate-500/30 dark:text-slate-300',
    copper:  'bg-orange-500/15 text-orange-600 border-orange-500/30 dark:text-orange-400',
    general: 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDemo={false} prices={[]} lastUpdated={null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── PAGE HERO ─────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-medium text-gold uppercase tracking-wider">Market Education</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-foreground mb-4">
            Gold & Silver Market Guide
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn how precious metal prices move in India. Expert articles on gold, silver and copper — from beginner basics to advanced investment strategies.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50"
            />
            <span className="absolute right-3 top-3 text-muted-foreground text-lg">🔍</span>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-card border border-border rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('book')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'book' ? 'bg-gold text-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Book View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${viewMode === 'grid' ? 'bg-gold text-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* ── CATEGORY FILTER ───────────────────────── */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {blogCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat.id
                  ? 'bg-gold text-background border-gold'
                  : 'bg-card text-muted-foreground border-border hover:border-gold/50 hover:text-foreground'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} articles</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
          </div>
        ) : viewMode === 'book' ? (
          <div className="mt-8 mb-16">
            <BlogBook posts={filtered} />
          </div>
        ) : (
          <>
            {/* ── FEATURED ARTICLES ─────────────────────── */}
            {activeCategory === 'all' && !searchQuery && (
              <section className="mb-14">
                <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-gold" />
              <h2 className="font-display text-xl font-semibold text-foreground">Featured Articles</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/40 to-transparent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featured.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className={`group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col ${idx === 0 ? 'lg:col-span-2 lg:row-span-1' : ''}`}
                  style={{ willChange: 'transform, box-shadow' }}
                >
                  {/* Image cover */}
                  <div className={`h-48 w-full overflow-hidden border-b border-border bg-muted`}>
                    <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ willChange: 'transform' }} />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryColor[post.category]}`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>

                    <h3 className={`font-display font-semibold text-foreground group-hover:text-gold transition-colors mb-3 leading-snug ${idx === 0 ? 'text-xl' : 'text-base'}`}>
                      {post.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-gold text-sm font-medium group-hover:gap-2 transition-all">
                        Read article <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── ALL ARTICLES GRID ─────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(post => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-gold/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                style={{ willChange: 'transform, box-shadow' }}
              >
                {/* Image cover */}
                <div className="h-40 w-full overflow-hidden border-b border-border bg-muted">
                  <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ willChange: 'transform' }} />
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColor[post.category]}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min</span>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-gold transition-colors leading-snug line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-gold text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
        )}

        {/* ── CTA BANNER ────────────────────────────── */}
        <div className="mt-16 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/20 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
            Check Live Gold & Silver Prices
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Use our real-time price tracker, gold calculator and market signals to make smarter commodity decisions.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gold text-background px-6 py-3 rounded-xl font-medium text-sm hover:bg-gold-light transition-colors"
          >
            View Live Prices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Blog;
