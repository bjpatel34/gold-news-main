import { Lightbulb, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { MetalPrice, NewsItem } from '@/data/mockData';
import { getPriceReasons, getAudienceSuggestions, getMetalColor } from '@/utils/priceReason';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PriceReasonProps {
  prices: MetalPrice[];
  news: NewsItem[];
  isLoading: boolean;
}

const ReasonSkeleton = () => (
  <div className="rounded-2xl border border-border bg-card p-5 animate-pulse">
    <Skeleton className="h-5 w-48 mb-4" />
    <div className="space-y-3">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
);

const PriceReasonSection = ({ prices, news, isLoading }: PriceReasonProps) => {
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReasonSkeleton />
          <ReasonSkeleton />
        </div>
      </section>
    );
  }

  const reasons = getPriceReasons(prices, news);
  const audienceSuggestions = getAudienceSuggestions(prices);

  return (
    <section className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Why Price Changed Today? */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Why Price Changed Today?
            </h2>
          </div>

          <div className="space-y-3">
            {reasons.map((reason) => {
              const colors = getMetalColor(reason.metal);
              const TrendIcon = reason.direction === 'up' 
                ? TrendingUp 
                : reason.direction === 'down' 
                  ? TrendingDown 
                  : Minus;
              
              return (
                <div
                  key={reason.metal}
                  className={cn(
                    'p-4 rounded-xl border',
                    colors.border,
                    colors.bg
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                      reason.direction === 'up' && 'bg-chart-up/20',
                      reason.direction === 'down' && 'bg-chart-down/20',
                      reason.direction === 'stable' && 'bg-muted'
                    )}>
                      <TrendIcon className={cn(
                        'w-4 h-4',
                        reason.direction === 'up' && 'text-chart-up',
                        reason.direction === 'down' && 'text-chart-down',
                        reason.direction === 'stable' && 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('font-semibold', colors.text)}>
                          {reason.metal}
                        </span>
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded-full',
                          reason.confidence === 'high' && 'bg-success/20 text-success',
                          reason.confidence === 'medium' && 'bg-warning/20 text-warning',
                          reason.confidence === 'low' && 'bg-muted text-muted-foreground'
                        )}>
                          {reason.confidence} confidence
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {reason.reason}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Who Should Care Today? */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              Who Should Care Today?
            </h2>
          </div>

          <div className="space-y-2">
            {audienceSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-lg shrink-0">{suggestion.split(' ')[0]}</span>
                <p className="text-sm text-foreground/80">
                  {suggestion.split(' ').slice(1).join(' ')}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Tip:</strong> Check prices daily before making big purchases
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceReasonSection;
