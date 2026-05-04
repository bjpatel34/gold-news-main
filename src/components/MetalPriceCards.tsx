import React from 'react';
import { TrendingUp, TrendingDown, Minus, Clock, Activity } from 'lucide-react';
import { MetalPrice } from '@/data/mockData';
import { formatINR, formatChange, formatPercent, formatTimeAgo } from '@/utils/priceReason';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface PriceCardsProps {
  prices: MetalPrice[];
  isLoading: boolean;
}

const PriceCardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card overflow-hidden card-elevated">
    <div className="h-1 shimmer w-full" />
    <div className="p-6 space-y-6">
      <div className="flex justify-between"><div className="w-14 h-6 shimmer rounded-md" /><div className="w-20 h-4 shimmer rounded" /></div>
      <div className="w-52 h-14 shimmer rounded-lg" />
      <div className="w-36 h-3 shimmer rounded" />
      <div className="w-40 h-8 shimmer rounded-full" />
      <div className="pt-4 border-t border-border flex justify-between"><div className="w-28 h-3 shimmer rounded" /><div className="w-16 h-3 shimmer rounded" /></div>
    </div>
  </div>
);

const PriceCard = ({ metal }: { metal: MetalPrice }) => {
  const isUp = metal.change > 0;
  const isDown = metal.change < 0;
  const isGold = metal.id === 'gold';
  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const prevPrice = useRef(metal.todayPrice);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (prevPrice.current !== metal.todayPrice) {
      setFlashClass(metal.todayPrice > prevPrice.current ? "flash-up" : "flash-down");
      const timer = setTimeout(() => setFlashClass(""), 1000);
      prevPrice.current = metal.todayPrice;
      return () => clearTimeout(timer);
    }
  }, [metal.todayPrice]);

  const stripClass = metal.id === 'gold' ? "strip-gold" : metal.id === 'silver' ? "strip-silver" : "strip-copper";
  const symbol = metal.id === 'gold' ? "XAU" : metal.id === 'silver' ? "XAG" : "XCU";
  const isLive = (Date.now() - new Date(metal.updated).getTime()) < 60000;

  return (
    <div className={cn("group relative rounded-2xl border border-border bg-card overflow-hidden card-elevated gold-ring-hover", flashClass)}>
      {isGold && <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(ellipse at top right, hsl(var(--gold) / 0.06) 0%, transparent 60%)' }} />}
      <div className={cn("h-1 w-full shrink-0", stripClass)} />
      <div className="relative p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="bg-muted text-foreground font-price text-xs px-2 py-0.5 rounded-md border border-border/50 font-medium">{symbol}</div>
          <div className="text-right">
            <div className="text-base font-body font-semibold text-foreground">{metal.name}</div>
            <div className="text-xs font-body text-foreground/80 mt-0.5">{metal.nameHindi}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className={cn("text-2xl font-price font-semibold leading-none mt-1", isGold ? "text-gold-gradient" : "text-foreground")}>₹</span>
            <div className={cn("text-5xl font-semibold font-price tracking-tight leading-none", isGold ? "text-gold-gradient" : "text-foreground")}>
              {metal.todayPrice.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-xs font-body uppercase tracking-[0.12em] text-foreground/90 font-medium mt-2">
            per {metal.id === 'gold' ? '10 grams (24K)' : 'kilogram'}
          </div>
        </div>
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-price text-sm font-bold",
          isUp && "bg-chart-up/20 text-chart-up border border-chart-up/30",
          isDown && "bg-chart-down/20 text-chart-down border border-chart-down/30",
          !isUp && !isDown && "bg-muted text-foreground border border-border",
        )}>
          <TrendIcon className="w-3 h-3" aria-label={isUp ? 'Price increased' : isDown ? 'Price decreased' : 'Price unchanged'} />
          <span>{formatChange(metal.change)}</span>
          <span className="opacity-60">({formatPercent(metal.changePercent)})</span>
        </div>
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
          <div className="text-xs font-body text-foreground/80 font-medium">
            vs yesterday <span className="font-price font-bold text-foreground">{formatINR(metal.yesterdayPrice)}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-body text-muted-foreground/60">
            <Clock className="w-3 h-3" />
            <span className={cn(isLive && "text-chart-up font-medium")}>{isLive ? "Live" : formatTimeAgo(metal.updated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetalPriceCards = ({ prices, isLoading }: PriceCardsProps) => (
  <section className="py-8" id="todays-rates">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-5 flex-1">
        <h2 className="text-3xl font-display font-semibold text-foreground whitespace-nowrap">Today's Rates</h2>
        <div className="h-px w-full divider-gold hidden sm:block" />
      </div>

    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {isLoading ? (<><PriceCardSkeleton /><PriceCardSkeleton /><PriceCardSkeleton /></>) : prices.map(m => <PriceCard key={m.id} metal={m} />)}
    </div>
  </section>
);

export default React.memo(MetalPriceCards);
