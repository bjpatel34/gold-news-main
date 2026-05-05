import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Calculator, TrendingUp, Scale, ArrowLeftRight, Gem, LucideIcon, Coins, CircleDashed } from 'lucide-react';
import { MetalPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prices: MetalPrice[];
}

const ToolsDrawer = ({ isOpen, onClose, prices }: ToolsDrawerProps) => {
  // 1. useRef and useEffect hooks
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) onClose(); };
    if (isOpen) setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  // 2. const gold = prices.find(...)
  const gold = prices.find(p => p.id === 'gold');
  // 3. const silver = prices.find(...)
  const silver = prices.find(p => p.id === 'silver');

  // 4. const goldPerGram = ...
  const goldPerGram = gold ? gold.todayPrice / 10 : 7245;
  // 5. const silverPerGram = ...
  const silverPerGram = silver ? silver.todayPrice / 1000 : 89.5;

  // 6. All useState declarations
  const [calcMetal, setCalcMetal] = useState<'gold24' | 'gold22' | 'gold18' | 'silver'>('gold24');
  const [calcGrams, setCalcGrams] = useState(10);
  const [makingPct, setMakingPct] = useState(12);
  const [includeGST, setIncludeGST] = useState(false);
  const [budget, setBudget] = useState(50000);
  const [convertAmount, setConvertAmount] = useState(10);
  const [activeSection, setActiveSection] = useState<string | null>('calculator');

  // 7. All derived values
  const pricePerGram = { 
    gold24: goldPerGram, 
    gold22: goldPerGram * 0.916, 
    gold18: goldPerGram * 0.75, 
    silver: silverPerGram 
  }[calcMetal];
  
  const baseValue = Math.round(pricePerGram * calcGrams);
  const making = Math.round(baseValue * makingPct / 100);
  const totalValue = baseValue + making + (includeGST ? Math.round((baseValue + making) * 0.03) : 0);

  const gramsYouGet = budget / goldPerGram;
  const silverYouGet = (budget / silverPerGram) / 1000;
  
  const ratio = gold && silver ? (gold.todayPrice / 10 / (silver.todayPrice / 1000)).toFixed(1) : '80.9';

  // 8. const Section = ... component definition
  const Section = ({ id, icon: Icon, title, children }: { id: string; icon: LucideIcon; title: string; children: React.ReactNode; }) => (
    <div className="border border-border/50 rounded-2xl overflow-hidden shadow-sm">
      <button onClick={() => setActiveSection(activeSection === id ? null : id)} className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-all">
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-gold" />
          <span className="text-sm font-display font-semibold text-foreground tracking-tight">{title}</span>
        </div>
        <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform duration-300", activeSection === id && "rotate-90")} />
      </button>
      {activeSection === id && <div className="px-4 py-5 bg-background/50 border-t border-border/30 space-y-4 animate-in fade-in duration-300">{children}</div>}
    </div>
  );

  // 9. return (...)
  return (
    <>
      <div className={cn("fixed inset-0 bg-background/80 backdrop-blur-md z-40 transition-opacity duration-500", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} />
      <div ref={drawerRef} className={cn("fixed top-0 left-0 h-full w-[360px] max-w-[90vw] bg-background border-r border-border/50 z-50 flex flex-col shadow-2xl transition-transform duration-500 ease-out", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 bg-card/50">
          <div className="flex items-center gap-3">
            <img
              src="/logo-icon.png"
              alt="GoldPolice icon"
              className="w-10 h-10 object-contain filter brightness-110 contrast-105 dark:mix-blend-screen dark:drop-shadow-gold-glow"
              decoding="async"
              loading="lazy"
            />
            <div>
              <h2 className="text-lg font-display font-bold text-foreground leading-none">
                <span className="text-gold">GOLD</span>Police
              </h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-body mt-1">Editorial Insights</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-4">
          <Section id="calculator" icon={Calculator} title="Rate Calculator">
            <div className="grid grid-cols-4 gap-1.5">
              {(['gold24', 'gold22', 'gold18', 'silver'] as const).map(m => (
                <button key={m} onClick={() => setCalcMetal(m)} className={cn("text-[10px] py-2 rounded-xl font-bold border transition-all", calcMetal === m ? "bg-gold text-black border-gold shadow-gold-glow" : "bg-muted border-border/50 text-muted-foreground hover:border-gold/30")}>{m === 'silver' ? 'Ag' : m.slice(4) + 'K'}</button>
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-semibold"><span>Weight</span><span className="font-price text-gold">{calcGrams}g</span></div>
              <input type="range" min={1} max={100} value={calcGrams} onChange={e => setCalcGrams(Number(e.target.value))} className="w-full accent-gold" />
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Total</span><span className="text-lg font-price font-semibold text-gold">₹{totalValue.toLocaleString('en-IN')}</span></div>
            </div>
          </Section>

          <Section id="investment" icon={TrendingUp} title="Market Entry">
            <div className="space-y-4">
              <div className="space-y-2"><div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-semibold"><span>Budget</span><span className="font-price text-gold">₹{budget.toLocaleString('en-IN')}</span></div><input type="range" min={5000} max={500000} step={5000} value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-gold" /></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50"><div><div className="text-[10px] text-muted-foreground uppercase font-semibold">Gold</div><div className="text-sm font-price font-bold text-gold">{gramsYouGet.toFixed(2)}g</div></div><Coins className="w-6 h-6 text-gold opacity-80" /></div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50"><div><div className="text-[10px] text-muted-foreground uppercase font-semibold">Silver</div><div className="text-sm font-price font-bold text-foreground">{silverYouGet.toFixed(3)}kg</div></div><CircleDashed className="w-6 h-6 text-slate-300 opacity-80" /></div>
              </div>
            </div>
          </Section>

          <Section id="ratio" icon={Scale} title="Bullion Ratio">
            <div className="text-center py-2"><div className="text-5xl font-price font-bold text-foreground">{ratio}</div><div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Gold / Silver</div></div>
            <div className="p-3 rounded-xl bg-muted/40 text-[11px] font-medium text-center italic text-muted-foreground">Historical avg: 65–70</div>
          </Section>

          <Section id="karat" icon={Gem} title="Purity Guide">
            <div className="space-y-2">{[24, 22, 18, 14].map(k => { const p = Math.round(goldPerGram * 10 * (k === 24 ? 1 : k === 22 ? 0.916 : k === 18 ? 0.75 : 0.585)); return (<div key={k} className="flex justify-between items-center p-3 rounded-xl bg-card border border-border/50"><div><div className="text-sm font-display font-bold text-gold">{k}K</div><div className="text-[10px] text-muted-foreground italic">{(k === 24 ? 99.9 : k === 22 ? 91.6 : k === 18 ? 75 : 58.5)}% pure</div></div><div className="text-right font-price font-medium text-sm">₹{p.toLocaleString('en-IN')}<span className="text-[9px] block text-muted-foreground uppercase">per 10g</span></div></div>); })}</div>
          </Section>
        </div>

        <div className="p-6 border-t border-border/50 bg-card/30"><p className="text-[9px] text-muted-foreground text-center uppercase tracking-[0.2em] font-semibold opacity-50">Precision Market Data · Gold-API.com</p></div>
      </div>
    </>
  );
};

export default ToolsDrawer;
