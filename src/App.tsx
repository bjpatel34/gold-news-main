import { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { toast } from 'sonner';

import Header from '@/components/Header';
import MetalPriceCards from '@/components/MetalPriceCards';
import PriceReasonSection from '@/components/PriceReason';
import NewsList from '@/components/NewsList';
import Footer from '@/components/SimpleFooter';
import ScrollToTop from '@/components/ScrollToTop';
import ToolsDrawer from '@/components/ToolsDrawer';
import GoldCalculator from '@/components/GoldCalculator';
import KaratChecker from '@/components/KaratChecker';
import PriceCharts from '@/components/PriceCharts';
import MarketSignals from '@/components/MarketSignals';
import FloatingTools from '@/components/FloatingTools';
import AiPriceBot from '@/components/AiPriceBot';

import { fetchLivePrices, isGoldApiConfigured } from '@/lib/goldApi';
import { fetchCommodityNews, isNewsdataConfigured } from '@/lib/newsApi';
import { mockPrices, mockNews, NewsItem, MetalPrice } from '@/data/mockData';
import { isLiveMode } from '@/utils/priceReason';

const App = () => {
  const [prices, setPrices] = useState<MetalPrice[]>(mockPrices);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const firstLoad = useRef(true);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [isLivePrices, setIsLivePrices] = useState(false);

  // ── Prices: Metals.Dev — 8 hour refresh ─────────────────────────────
  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!isGoldApiConfigured()) {
        setPrices(mockPrices);
        setIsLivePrices(false);
        return;
      }

      const freshPrices = await fetchLivePrices();
      setPrices(freshPrices);
      setIsLivePrices(true);
      setIsQuotaExhausted(false);
      setLastUpdated(Date.now());
    } catch (error: any) {
      console.error('Price fetch error:', error);
      setIsLivePrices(false);
      
      // Check for quota exhaustion (Metals.Dev error 1204)
      if (error.message?.includes('1204') || error.message?.includes('quota')) {
        setIsQuotaExhausted(true);
        toast.warning('API Quota Exhausted', {
          description: 'Monthly limit reached. Switched to high-fidelity demo mode.',
        });
      } else {
        toast.error('Market Connection Failed', {
          description: 'Showing demo data while we retry...',
        });
      }
      setPrices(mockPrices);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── News: NewsData.io — 25 minute refresh ───────────────────────────
  const fetchNews = useCallback(async () => {
    try {
      if (!isNewsdataConfigured()) { setNews(mockNews); return; }
      const freshNews = await fetchCommodityNews();
      setNews(freshNews.length > 0 ? freshNews : mockNews);
    } catch {
      setNews(mockNews);
    }
  }, []);

  // Initial load — both fire together on mount
  useEffect(() => {
    fetchPrices();
    fetchNews();
  }, [fetchPrices, fetchNews]);

  // Prices auto-refresh — 8 hours (Metals.Dev free: 90 req/month)
  useEffect(() => {
    const i = setInterval(fetchPrices, 28_800_000);
    return () => clearInterval(i);
  }, [fetchPrices]);

  // News auto-refresh — 25 minutes (NewsData free: 114 credits/day)
  useEffect(() => {
    const i = setInterval(fetchNews, 1_500_000);
    return () => clearInterval(i);
  }, [fetchNews]);

  useEffect(() => {
    if (!isLoading && firstLoad.current) {
      firstLoad.current = false;
      const timer = setTimeout(() => setShowInitialLoader(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (showInitialLoader) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100] animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-gold/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gold rounded-full animate-ping" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-serif text-foreground tracking-tight">GoldPolice</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-50">Loading Market Data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />

      <div className="min-h-screen bg-background relative">
        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold/5 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-copper-metal/5 blur-[120px]" />
        </div>

        <Header
          isDemo={!isLivePrices}
          prices={prices}
          lastUpdated={lastUpdated}
        />
        <ToolsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          prices={prices}
        />



        <FloatingTools onOpenCalculator={() => setIsDrawerOpen(true)} />

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          {/* Today's Metal Rates — HERO UI */}
          <section id="prices" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0s' }}>
            <MetalPriceCards prices={prices} isLoading={isLoading} />
          </section>

          {/* Price Trends — Sparkline Charts */}
          <section id="trends" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <PriceCharts prices={prices} />
          </section>

          {/* Calculator & Karat Breakdown */}
          <section id="calculator" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoldCalculator prices={prices} />
              <KaratChecker prices={prices} />
            </div>
          </section>

          {/* Market Signals — Intelligent Insights */}
          <section id="market-signals" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <MarketSignals prices={prices} />
          </section>

          {/* Why Price Changed Today? + Who Should Care */}
          <section id="intelligence" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <PriceReasonSection
              prices={prices}
              news={news}
              isLoading={isLoading}
            />
          </section>

          {/* Latest Real News */}
          <section id="news" className="scroll-mt-24 animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <NewsList
              news={news}
              isLoading={isLoading}
              isDemo={!isLiveMode()}
            />
          </section>
        </main>

        <Footer />
        <ScrollToTop />
        <AiPriceBot prices={prices} />
      </div>
    </TooltipProvider>
  );
};

export default App;
