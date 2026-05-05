import { useState, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, Area, AreaChart, XAxis } from 'recharts';
import { MetalPrice } from '@/data/mockData';
import { generateMockHistory } from '@/data/mockHistorical';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceChartsProps {
  prices: MetalPrice[];
}

type TimePeriod = '7D' | '30D' | '1Y';

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { date: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-foreground text-background px-3 py-2 rounded-xl text-[10px] font-bold shadow-2xl border border-background/10">
        <p className="opacity-50 uppercase tracking-widest font-body mb-1">{payload[0].payload.date}</p>
        <p className="text-base font-price tracking-tighter">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const ChartPanel = ({ metal, basePrice, color }: { metal: string; basePrice: number; color: string }) => {
  const [period, setPeriod] = useState<TimePeriod>('30D');
  const days = period === '7D' ? 7 : period === '30D' ? 30 : 365;
  const volatility = metal === 'gold' ? 0.005 : metal === 'silver' ? 0.008 : 0.01;

  const data = useMemo(() => generateMockHistory(basePrice, days, volatility), [basePrice, days, volatility]);

  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));
  const firstPrice = data[0].price;
  const lastPrice = data[data.length - 1].price;
  const changePercent = ((lastPrice - firstPrice) / firstPrice) * 100;
  const isPositive = changePercent >= 0;

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex bg-muted/40 p-1 rounded-full border border-border/50">
          {(['7D', '30D', '1Y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-4 py-1.5 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest",
                period === p 
                  ? "bg-foreground text-background shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-price font-bold border",
          isPositive 
            ? "bg-chart-up/10 text-chart-up border-chart-up/20" 
            : "bg-chart-down/10 text-chart-down border-chart-down/20"
        )}>
          {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
        </div>
      </div>

      <div className="relative h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${metal}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <YAxis hide domain={['auto', 'auto']} padding={{ top: 20, bottom: 20 }} />
            <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2.5} fill={`url(#gradient-${metal})`} animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border/30 pt-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Period Low</span>
          <p className="text-base font-price font-semibold text-foreground">₹{minPrice.toLocaleString('en-IN')}</p>
        </div>
        <div className="space-y-1 text-right">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Period High</span>
          <p className="text-base font-price font-semibold text-foreground">₹{maxPrice.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </div>
  );
};

const PriceCharts = ({ prices }: PriceChartsProps) => {
  const gold = prices.find(p => p.id === 'gold');
  const silver = prices.find(p => p.id === 'silver');
  const copper = prices.find(p => p.id === 'copper');

  return (
    <section className="py-8" id="price-trends">
      <div className="flex items-center gap-5 mb-8">
        <h2 className="text-3xl font-display font-semibold text-foreground whitespace-nowrap">Gold & Silver Price Trend Chart India</h2>
        <div className="h-px w-full divider-gold hidden sm:block" />
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden card-elevated">
        <Tabs defaultValue="gold" className="w-full">
          <div className="px-6 pt-6 border-b border-border/30 bg-muted/20">
            <TabsList className="bg-transparent gap-8 p-0 h-auto overflow-x-auto scrollbar-none flex-nowrap justify-start">
              {(['gold', 'silver', 'copper'] as const).map(metal => (
                <TabsTrigger 
                  key={metal}
                  value={metal} 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gold rounded-none pb-4 px-0 text-[11px] font-bold tracking-[0.2em] uppercase transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-2 h-2 rounded-full", metal === 'gold' ? 'bg-gold' : metal === 'silver' ? 'bg-silver-metal' : 'bg-copper-metal')} />
                    {metal}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="p-8">
            <TabsContent value="gold" className="mt-0 outline-none"><ChartPanel metal="gold" basePrice={gold?.todayPrice ?? 72000} color="hsl(var(--gold))" /></TabsContent>
            <TabsContent value="silver" className="mt-0 outline-none"><ChartPanel metal="silver" basePrice={silver?.todayPrice ?? 7200} color="hsl(var(--silver-metal))" /></TabsContent>
            <TabsContent value="copper" className="mt-0 outline-none"><ChartPanel metal="copper" basePrice={copper?.todayPrice ?? 720} color="hsl(var(--copper-metal))" /></TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default PriceCharts;
