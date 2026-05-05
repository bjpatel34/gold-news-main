import { Info, AlertTriangle, Activity } from 'lucide-react';
import { MetalPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MarketSignals = ({ prices }: { prices: MetalPrice[] }) => {
  const gold = prices.find(p => p.id === 'gold');
  const silver = prices.find(p => p.id === 'silver');
  const goldOz = (gold?.todayPrice ?? 0) / 10 * 31.1035;
  const silverOz = (silver?.todayPrice ?? 0) / 1000 * 31.1035;
  const ratio = goldOz / silverOz;

  const getRatioSignal = (r: number) => {
    if (r < 55) return { text: "Gold undervalued vs silver.", color: "text-chart-up" };
    if (r > 80) return { text: "Silver undervalued vs gold.", color: "text-chart-down" };
    return { text: "Ratio in healthy historical range.", color: "text-muted-foreground" };
  };
  const ratioSignal = getRatioSignal(ratio);
  const ratioPos = Math.min(Math.max((ratio / 120) * 100, 0), 100);

  const avgVol = prices.reduce((acc, p) => acc + Math.abs(p.changePercent), 0) / prices.length;
  const volLevel = avgVol < 0.5 ? 'LOW' : avgVol < 1.5 ? 'MEDIUM' : 'HIGH';
  const volBars = volLevel === 'LOW' ? 1 : volLevel === 'MEDIUM' ? 2 : 3;

  const getActionSignal = (p: MetalPrice) => {
    if (p.changePercent < -1.0) return { label: "BUY", color: "bg-chart-up/12 text-chart-up border-chart-up/25", text: "Dip detected." };
    if (p.changePercent > 1.5) return { label: "WATCH", color: "bg-warning/12 text-warning border-warning/25", text: "Wait for pullback." };
    return { label: "HOLD", color: "bg-muted text-muted-foreground border-border/50", text: "Market stable." };
  };

  return (
    <section className="py-8" id="market-signals">
      <div className="flex items-center gap-5 mb-8">
        <h2 className="text-3xl font-display font-semibold text-foreground whitespace-nowrap">Gold Market Signals & Buy Analysis India</h2>
        <div className="h-px w-full divider-gold hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PANEL 1: Ratio */}
        <div className="bg-card rounded-2xl border border-border p-6 card-elevated gold-ring-hover space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Gold / Silver Ratio</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><Info className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-gold cursor-help" /></TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border border-border p-3 max-w-[220px] rounded-xl shadow-xl">
                  <p className="text-xs italic leading-relaxed">How many oz of silver equal 1 oz of gold. Avg: 65–70.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="text-5xl font-price font-bold text-foreground">{ratio.toFixed(1)}</div>
            <div className="space-y-2">
              <div className="relative h-1.5 w-full rounded-full overflow-hidden flex bg-muted/30">
                <div className="h-full bg-chart-up w-[45%]" /><div className="h-full bg-warning w-[21%]" /><div className="h-full bg-chart-down w-[34%]" />
                <div className="absolute top-0 w-3 h-3 bg-foreground border-2 border-background rounded-full -mt-[3px] shadow-lg transition-all duration-1000 ease-out" style={{ left: `${ratioPos}%`, transform: 'translateX(-50%)' }} />
              </div>
              <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                <span>Silver Exp</span><span>Normal</span><span>Silver Cheap</span>
              </div>
            </div>
          </div>
          <p className={cn("text-xs font-body italic", ratioSignal.color)}>{ratioSignal.text}</p>
        </div>

        {/* PANEL 2: Volatility */}
        <div className="bg-card rounded-2xl border border-border p-6 card-elevated gold-ring-hover space-y-6 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Market Volatility</h3>
            <AlertTriangle className={cn("w-4 h-4", volLevel === 'HIGH' ? "text-chart-down" : volLevel === 'MEDIUM' ? "text-warning" : "text-chart-up")} />
          </div>
          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="flex items-baseline gap-2">
              <div className="text-5xl font-price font-bold text-foreground">{volLevel}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Signal</div>
            </div>
            <div className="flex gap-1.5 h-10 items-end">
              {[1, 2, 3].map((bar) => (
                <div key={bar} className={cn("flex-1 rounded transition-all duration-700", 
                  bar <= volBars ? (volLevel === 'LOW' ? "bg-chart-up h-4" : volLevel === 'MEDIUM' ? "bg-warning h-7" : "bg-chart-down h-10") : "bg-muted h-2 opacity-20"
                )} />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            {volLevel === 'LOW' ? "Stable market — low price swings." : volLevel === 'MEDIUM' ? "Standard volatility — monitor intraday." : "High volatility — extreme swings expected."}
          </p>
        </div>

        {/* PANEL 3: Action */}
        <div className="bg-card rounded-2xl border border-border p-6 card-elevated gold-ring-hover flex flex-col">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Action Signals</h3>
          <div className="flex-1 space-y-4">
            {prices.map((p) => {
              const signal = getActionSignal(p);
              return (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/30 bg-muted/10 group transition-colors hover:bg-muted/20">
                  <div className={cn("w-2 h-2 rounded-full shadow-sm", p.id === 'gold' ? "bg-gold" : p.id === 'silver' ? "bg-silver-metal" : "bg-copper-metal")} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">{p.id}</span>
                      <span className={cn("px-2 py-0.5 text-[10px] font-black rounded-md border", signal.color)}>{signal.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground italic line-clamp-1">{signal.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSignals;
