import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogData';
import Header from '@/components/Header';
import Footer from '@/components/SimpleFooter';
import ScrollToTop from '@/components/ScrollToTop';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', post.metaDescription);
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts
    .filter(p => p.id !== post.id && (p.category === post.category || p.featured))
    .slice(0, 3);

  const categoryColor: Record<string, string> = {
    gold:    'bg-yellow-500/15 text-yellow-600 border-yellow-500/30',
    silver:  'bg-slate-500/15 text-slate-600 border-slate-500/30',
    copper:  'bg-orange-500/15 text-orange-600 border-orange-500/30',
    general: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDemo={false} prices={[]} lastUpdated={null} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Market Guide
        </Link>

        {/* Article header */}
        <article>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryColor[post.category]}`}>
                {post.category}
              </span>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                <Clock className="w-3 h-3" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed border-l-4 border-gold/40 pl-4 mb-8">
              {post.excerpt}
            </p>

            <img src={post.coverImage} alt={post.title} className="w-full h-auto rounded-2xl border border-border shadow-sm mb-12" />
          </div>

          {/* Article content */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:font-semibold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-li:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-table:border-collapse prose-td:border prose-td:border-border
              prose-td:px-3 prose-td:py-2 prose-th:border prose-th:border-border
              prose-th:px-3 prose-th:py-2 prose-th:bg-muted
              prose-a:text-gold hover:prose-a:text-gold-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </article>

        {/* Live price CTA */}
        <div className="my-12 bg-gold/8 border border-gold/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">
              Check Today's Live {post.category === 'general' ? 'Gold & Silver' : post.category.charAt(0).toUpperCase() + post.category.slice(1)} Price
            </h3>
            <p className="text-muted-foreground text-sm">Real-time prices updated every 25 minutes</p>
          </div>
          <Link
            to="/#prices"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-gold text-background px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-light transition-colors"
          >
            View Live Prices <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-gold/40 hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-32 w-full overflow-hidden border-b border-border">
                    <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-gold transition-colors leading-snug line-clamp-3 mb-2">
                        {rel.title}
                      </h3>
                    </div>
                    <span className="text-gold text-xs flex items-center gap-1 mt-2">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default BlogPost;
