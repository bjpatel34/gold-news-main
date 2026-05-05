import React from 'react';
// @ts-ignore
import HTMLFlipBook from 'react-pageflip';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '@/data/blogData';

// --- Page Components ---

const PageCover = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>((props, ref) => {
  return (
    <div
      className="page page-cover bg-neutral-900 border border-gold/20 shadow-xl flex flex-col relative overflow-hidden rounded-r-xl"
      ref={ref}
      data-density="hard"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-black/80 pointer-events-none" />
      
      {/* Binding accent */}
      <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-20 border-r border-black/20" />

      <div className="page-content p-10 h-full w-full flex flex-col items-center justify-center relative z-10 text-center">
        {props.children}
      </div>
    </div>
  );
});
PageCover.displayName = 'PageCover';

const Page = React.forwardRef<HTMLDivElement, { number: number; children: React.ReactNode; isLeft?: boolean }>((props, ref) => {
  return (
    <div
      className="page bg-[#fcf9f2] text-neutral-900 border border-neutral-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] flex flex-col relative"
      ref={ref}
    >
      {/* Page shadow near the binding */}
      <div className={`absolute top-0 ${props.isLeft ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent w-8 h-full pointer-events-none`} />
      
      <div className="page-content p-8 sm:p-10 h-full w-full flex flex-col z-10">
        {props.children}
      </div>
      
      <div className={`page-footer absolute bottom-5 w-full text-xs text-neutral-500 font-body px-8 flex justify-between ${props.isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
        <span>{props.number}</span>
        <span className="opacity-50">GoldPolice Market Guide</span>
      </div>
    </div>
  );
});
Page.displayName = 'Page';

const BackCover = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>((props, ref) => {
  return (
    <div
      className="page page-cover bg-neutral-900 border border-gold/20 shadow-xl flex flex-col relative overflow-hidden rounded-l-xl"
      ref={ref}
      data-density="hard"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-bl from-gold/10 via-transparent to-black/80 pointer-events-none" />
      
      {/* Binding accent */}
      <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none z-20 border-l border-black/20" />

      <div className="page-content p-10 h-full w-full flex flex-col items-center justify-center relative z-10 text-center">
        {props.children}
      </div>
    </div>
  );
});
BackCover.displayName = 'BackCover';


// --- Main Component ---

interface BlogBookProps {
  posts: BlogPost[];
}

const BlogBook: React.FC<BlogBookProps> = ({ posts }) => {
  // We need to determine how many pages we have.
  // Cover (1), Table of Contents (2, 3), Article Pages...
  // Each article will take 2 pages (a spread). Left page: Image + Metadata. Right page: Title + Excerpt + Link.
  
  const categoryColor: Record<string, string> = {
    gold:    'bg-yellow-500/15 text-yellow-800 border-yellow-500/30',
    silver:  'bg-slate-500/15 text-slate-800 border-slate-500/30',
    copper:  'bg-orange-500/15 text-orange-800 border-orange-500/30',
    general: 'bg-blue-500/15 text-blue-800 border-blue-500/30',
  };

  return (
    <div className="w-full flex justify-center py-10 perspective-[2000px]">
      <HTMLFlipBook
        key={posts.length + '-' + posts.map(p => p.id).join('-')}
        width={450}
        height={650}
        size="stretch"
        minWidth={315}
        maxWidth={500}
        minHeight={400}
        maxHeight={700}
        maxShadowOpacity={0}
        showCover={true}
        mobileScrollSupport={true}
        className="demo-book shadow-xl"
        flippingTime={400}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        drawShadow={false}
        swipeDistance={30}
        clickEventForward={true}
        useMouseEvents={true}
        style={{}}
        startPage={0}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        
        {/* FRONT COVER */}
        <PageCover>
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo-icon.png" alt="GoldPolice" className="w-16 h-16 drop-shadow-md" decoding="async" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gold tracking-widest uppercase mb-4 drop-shadow-md">
            Market Guide
          </h1>
          <div className="w-16 h-0.5 bg-gold/50 mb-8 mx-auto" />
          <p className="text-muted-foreground font-body italic text-sm mb-12">
            The Complete Encyclopedia of Precious Metals
          </p>
          
          <div className="mt-auto flex flex-col items-center gap-2">
            <span className="text-gold/50 text-xs tracking-[0.3em] uppercase">Volume 1</span>
            <span className="text-gold/30 text-[10px] tracking-widest uppercase">2026 Edition</span>
          </div>
        </PageCover>

        {/* PAGE 1: TOC */}
        <Page number={1} isLeft={false}>
          <h2 className="font-display text-2xl font-bold text-neutral-800 border-b-2 border-neutral-300 pb-2 mb-6 uppercase tracking-wider">
            Table of Contents
          </h2>
          <ul className="space-y-4 font-body text-neutral-700">
            {posts.map((post, idx) => (
              <li key={`toc-${post.id}`} className="flex justify-between items-baseline group cursor-pointer hover:text-yellow-700 transition-colors">
                <span className="text-sm line-clamp-1 pr-4">{post.title}</span>
                <span className="flex-1 border-b border-dotted border-neutral-400 opacity-50 relative top-[-6px] mx-2"></span>
                <span className="text-sm font-semibold">{idx * 2 + 2}</span>
              </li>
            ))}
          </ul>
        </Page>

        {/* ARTICLE SPREADS */}
        {posts.map((post, idx) => {
          const pageNumStart = idx * 2 + 2;
          return [
            // LEFT PAGE: Image & Meta
            <Page key={`img-${post.id}`} number={pageNumStart} isLeft={true}>
              <div className="h-48 sm:h-64 w-full rounded-xl overflow-hidden mb-6 border border-neutral-200 shadow-sm relative group">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" loading="eager" decoding="async" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              
              <div className="flex flex-col gap-3">
                <span className={`self-start text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${categoryColor[post.category]}`}>
                  {post.category}
                </span>
                <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime} min read</span>
                </div>
                <div className="text-neutral-500 text-xs font-medium mt-1">
                  Published: {new Date(post.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </Page>,
            
            // RIGHT PAGE: Content & Link
            <Page key={`content-${post.id}`} number={pageNumStart + 1} isLeft={false}>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-neutral-900 leading-tight mb-4">
                {post.title}
              </h2>
              <div className="w-12 h-1 bg-yellow-500 mb-6" />
              
              <p className="font-body text-sm text-neutral-600 leading-relaxed mb-8 flex-1">
                {post.excerpt}
                <br/><br/>
                <span className="italic text-neutral-400">Flip the page or click below to read the full analysis on our digital terminal...</span>
              </p>
              
              <div className="mt-auto">
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 text-gold px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Full Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Page>
          ];
        })}

        {/* BACK COVER */}
        <BackCover>
          <div className="flex flex-col items-center justify-center h-full opacity-60">
            <img src="/logo-icon.png" alt="GoldPolice" className="w-12 h-12 mix-blend-screen mb-4 grayscale" />
            <p className="text-xs text-muted-foreground font-body tracking-widest uppercase">
              GoldPolice Terminal
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-2">
              Real prices for real people.
            </p>
          </div>
        </BackCover>

      </HTMLFlipBook>
    </div>
  );
};

export default BlogBook;
