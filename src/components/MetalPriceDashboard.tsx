/**
 * MetalPriceDashboard
 *
 * A self-contained, premium financial dashboard component that
 * fetches live Gold & Silver prices via the useMetalPrices hook
 * and renders them in sleek, responsive cards with:
 *  - Skeleton loading states
 *  - Graceful error handling with retry
 *  - INR formatting via Intl.NumberFormat
 *  - Live timestamps & change indicators
 *  - Micro-animations & glassmorphism
 */

import { useMetalPrices } from "@/hooks/use-metal-prices";
import { MetalPrice } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

// ---------------------------------------------------------
//  Formatters
// ---------------------------------------------------------

/** Format a number as ₹ INR with Indian grouping */
function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format price change with sign */
function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(change)}`;
}

/** Format percentage change */
function formatPercent(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/** Relative time in human-readable form */
function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(diff / 3_600_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ---------------------------------------------------------
//  Sub-components
// ---------------------------------------------------------

/** Skeleton placeholder for a single price card */
const CardSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-6 space-y-5 animate-pulse">
    {/* Header row */}
    <div className="flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>

    {/* Price row */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-4 w-28" />
    </div>

    {/* Footer row */}
    <div className="flex justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

/** The full skeleton dashboard shown during loading */
const DashboardSkeleton = () => (
  <section className="py-6 animate-fade-in">
    {/* Title skeleton */}
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-60" />
        <Skeleton className="h-4 w-44" />
      </div>
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>

    {/* Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <CardSkeleton />
      <CardSkeleton />
    </div>

    {/* Summary bar skeleton */}
    <div className="mt-5 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-wrap gap-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
    </div>
  </section>
);

/** Stylised error state with retry */
const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <section className="py-6 animate-fade-in">
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Unable to Load Prices
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          {message}
        </p>
      </div>
      <button
        onClick={onRetry}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium",
          "bg-primary text-primary-foreground",
          "hover:bg-primary/90 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  </section>
);

/** Metal icon badge */
const MetalBadge = ({
  metal,
}: {
  metal: string;
}) => {
  const config: Record<string, { emoji: string; bg: string; border: string }> =
    {
      gold: {
        emoji: "🥇",
        bg: "bg-gold/10",
        border: "border-gold/30",
      },
      silver: {
        emoji: "🥈",
        bg: "bg-silver/10",
        border: "border-silver/30",
      },
    };
  const c = config[metal] ?? {
    emoji: "💰",
    bg: "bg-muted",
    border: "border-border",
  };

  return (
    <div
      className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border",
        c.bg,
        c.border
      )}
    >
      {c.emoji}
    </div>
  );
};

/** Single metal price card */
const PriceCard = ({ metal }: { metal: MetalPrice }) => {
  const isUp = metal.change > 0;
  const isDown = metal.change < 0;

  // Gradient + accent based on metal type
  const gradients: Record<string, string> = {
    gold: "from-gold/15 via-gold/5 to-transparent",
    silver: "from-silver/15 via-silver/5 to-transparent",
  };
  const borders: Record<string, string> = {
    gold: "border-gold/25 hover:border-gold/50",
    silver: "border-silver/25 hover:border-silver/50",
  };

  const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const ArrowIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card overflow-hidden card-gold-hover",
        "transition-all duration-500 ease-out",
        "hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20",
        "hover:scale-[1.015]",
        borders[metal.id] ?? "border-border"
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-60 group-hover:opacity-100 transition-opacity duration-500",
          gradients[metal.id] ?? "from-muted/20 to-transparent"
        )}
      />

      {/* Content */}
      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MetalBadge metal={metal.id} />
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {metal.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {metal.nameHindi} • {metal.unit}
              </span>
            </div>
          </div>

          {/* Change pill */}
          <div
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold",
              "transition-colors duration-300",
              isUp && "bg-chart-up/15 text-chart-up",
              isDown && "bg-chart-down/15 text-chart-down",
              !isUp && !isDown && "bg-muted text-muted-foreground"
            )}
          >
            <ArrowIcon className="w-3.5 h-3.5" />
            <span>{formatPercent(metal.changePercent)}</span>
          </div>
        </div>

        {/* Price */}
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-foreground font-price tracking-tight">
            {formatINR(metal.todayPrice)}
            <span className="text-sm font-medium text-muted-foreground ml-2">
              / {metal.id === 'gold' ? '10g' : metal.id === 'silver' ? '1kg' : 'unit'}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 mt-1.5 text-sm font-medium",
              isUp && "text-chart-up",
              isDown && "text-chart-down",
              !isUp && !isDown && "text-muted-foreground"
            )}
          >
            <TrendIcon className="w-4 h-4" />
            <span>{formatChange(metal.change)}</span>
            <span className="text-muted-foreground font-normal">today</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60" />

        {/* Footer — yesterday + timestamp */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Yesterday:{" "}
              <span className="font-semibold text-foreground/70">
                {formatINR(metal.yesterdayPrice)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(metal.updated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
//  Main Dashboard Component
// ---------------------------------------------------------

const MetalPriceDashboard = () => {
  const { data, loading, error, refetch } = useMetalPrices();

  // ---------- Loading ----------
  if (loading) {
    return <DashboardSkeleton />;
  }

  // ---------- Error (no data at all) ----------
  if (error && !data) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  // ---------- Data ready ----------
  const prices = data!;
  const gold = prices.find((p) => p.id === "gold");
  const silver = prices.find((p) => p.id === "silver");

  // Compute a market summary
  const allUp = prices.every((p) => p.change > 0);
  const allDown = prices.every((p) => p.change < 0);
  const marketLabel = allUp
    ? "Bullish"
    : allDown
    ? "Bearish"
    : "Mixed";
  const marketColor = allUp
    ? "text-chart-up"
    : allDown
    ? "text-chart-down"
    : "text-warning";

  return (
    <section className="py-6 animate-fade-in" id="metal-price-dashboard">
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" />
            Live Metal Prices
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time Gold & Silver prices in ₹ INR via{" "}
            <span className="font-medium text-foreground/60">GoldAPI.io</span>
          </p>
        </div>

        <button
          onClick={refetch}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium",
            "border border-border bg-card/60 backdrop-blur",
            "text-muted-foreground hover:text-foreground",
            "hover:border-gold/40 hover:bg-gold/5",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "active:scale-95"
          )}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Prices
        </button>
      </div>

      {/* Price cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gold && (
          <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
            <PriceCard metal={gold} />
          </div>
        )}
        {silver && (
          <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
            <PriceCard metal={silver} />
          </div>
        )}
      </div>

      {/* Market summary bar */}
      <div
        className={cn(
          "mt-5 rounded-2xl border border-border/60 glass p-4",
          "animate-slide-up"
        )}
        style={{ animationDelay: "160ms" }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          {/* Sentiment */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-foreground/70">
              Market Sentiment:
            </span>
            <span className={cn("font-bold", marketColor)}>{marketLabel}</span>
          </div>

          {/* Spread */}
          {gold && silver && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground/70">
                Gold / Silver Ratio:
              </span>
              <span className="font-price font-semibold text-foreground/80">
                {(gold.todayPrice / (silver.todayPrice / 100)).toFixed(1)}
              </span>
            </div>
          )}

          {/* Last updated */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Clock className="w-3 h-3" />
            <span>
              Updated{" "}
              {gold
                ? timeAgo(gold.updated)
                : silver
                ? timeAgo(silver.updated)
                : "—"}
            </span>
            <span className="hidden sm:inline opacity-40 mx-1">•</span>
            <span className="hidden sm:inline text-[10px] font-bold text-gold/60 uppercase tracking-tighter">
              Auto-updates every 8 hours
            </span>
          </div>
        </div>
      </div>

      {/* Error banner (non-blocking — data exists from fallback) */}
      {error && data && (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 flex items-center gap-3 text-xs text-warning animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Live fetch failed — showing cached / fallback data.{" "}
            <button
              onClick={refetch}
              className="underline font-medium hover:text-foreground transition-colors"
            >
              Retry
            </button>
          </span>
        </div>
      )}
    </section>
  );
};

export default MetalPriceDashboard;
