import React, { useState } from 'react';
import { Gem, Info } from 'lucide-react';
import { MetalPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KaratInfo {
  karat: string;
  purity: string;
  factor: number;
  use: string;
  intensity: string;
}

const karatData: KaratInfo[] = [
  { karat: '24K', purity: '99.9%', factor: 1.0, use: 'Investment bars, coins, and ceremonial jewellery.', intensity: 'bg-gold/8' },
  { karat: '22K', purity: '91.6%', factor: 0.916, use: 'Traditional Indian wedding jewellery and bangles.', intensity: 'bg-gold/5' },
  { karat: '18K', purity: '75.0%', factor: 0.75, use: 'Ideal for diamond and stone-studded jewellery.', intensity: 'bg-gold/3' },
  { karat: '14K', purity: '58.5%', factor: 0.585, use: 'Daily wear, rings, and affordable luxury pieces.', intensity: 'bg-gold/1' }
];

const KaratChecker = ({ prices }: { prices: MetalPrice[] }) => {
  const [selectedKarat, setSelectedKarat] = useState<string | null>(null);
  const goldPrice24K = (prices.find(p => p.id === 'gold')?.todayPrice ?? 0) / 10;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col card-elevated gold-ring-hover">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2.5">
          <Gem className="w-5 h-5 text-gold" />
          <h2 className="text-xl font-display font-semibold text-foreground">24K 22K 18K Gold Rate Per Gram India Today</h2>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1 overflow-auto scrollbar-thin">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Karat</th>
                <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Purity</th>
                <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">/ Gram</th>
                <th className="pb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold text-right">/ 10g</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {karatData.map((item) => {
                const pricePerGram = goldPrice24K * item.factor;
                const pricePer10g = pricePerGram * 10;
                const isSelected = selectedKarat === item.karat;

                return (
                  <tr 
                    key={item.karat}
                    onClick={() => setSelectedKarat(isSelected ? null : item.karat)}
                    className={cn(
                      "group cursor-pointer transition-all duration-300",
                      item.intensity,
                      isSelected ? "bg-gold/20" : "hover:bg-gold/10"
                    )}
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-display font-bold text-foreground">{item.karat}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-3 h-3 text-muted-foreground/40 group-hover:text-gold transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-popover text-popover-foreground border border-border p-3 max-w-[200px] rounded-xl shadow-xl">
                              <p className="text-xs leading-relaxed italic">{item.use}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-body font-medium text-muted-foreground/80">{item.purity}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-price font-medium text-foreground">
                        ₹{pricePerGram.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <span className="text-sm font-price font-semibold text-gold">
                        ₹{pricePer10g.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={cn(
          "mt-6 p-4 rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500",
          selectedKarat ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none h-0 p-0 overflow-hidden"
        )}>
          <div className="flex items-start gap-3">
            <Gem className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-display font-bold text-foreground uppercase tracking-widest">{selectedKarat} Usage</h4>
              <p className="text-xs font-body text-muted-foreground mt-1 leading-relaxed italic">
                {karatData.find(k => k.karat === selectedKarat)?.use}
              </p>
            </div>
          </div>
        </div>
        
        {!selectedKarat && (
          <div className="mt-6 flex items-center justify-center py-3 border border-dashed border-border/50 rounded-xl">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold flex items-center gap-2">
              <Info className="w-3 h-3" /> Select a row for details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(KaratChecker);
