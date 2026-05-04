import React, { useState, useEffect, useRef } from 'react';
import { Calculator, Copy, Check } from 'lucide-react';
import { MetalPrice } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface GoldCalculatorProps {
  prices: MetalPrice[];
}

type MetalType = '24k' | '22k' | '18k' | 'silver';

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const startValueRef = useRef<number>(displayValue);

  const animate = (time: number) => {
    if (!startTimeRef.current) startTimeRef.current = time;
    const progress = Math.min((time - startTimeRef.current) / 400, 1);
    const newValue = startValueRef.current + (value - startValueRef.current) * progress;
    setDisplayValue(newValue);
    if (progress < 1) requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    startTimeRef.current = undefined;
    startValueRef.current = displayValue;
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [value]);

  return (
    <span className="font-price">
      ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(displayValue)}
    </span>
  );
};

const GoldCalculator = ({ prices }: GoldCalculatorProps) => {
  const [metalType, setMetalType] = useState<MetalType>('24k');
  const [weight, setWeight] = useState<number>(10);
  const [makingCharge, setMakingCharge] = useState<number>(() => {
    const saved = localStorage.getItem('gold-calc-making');
    return saved ? parseInt(saved, 10) : 12;
  });
  const [includeGST, setIncludeGST] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('gold-calc-making', makingCharge.toString());
  }, [makingCharge]);

  const goldPrice = prices.find(p => p.id === 'gold')?.todayPrice ?? 0;
  const silverPrice = prices.find(p => p.id === 'silver')?.todayPrice ?? 0;

  const getPricePerGram = () => {
    const gold24K = goldPrice / 10;
    switch (metalType) {
      case '24k': return gold24K;
      case '22k': return gold24K * 0.916;
      case '18k': return gold24K * 0.75;
      case 'silver': return silverPrice / 1000;
      default: return 0;
    }
  };

  const pricePerGram = getPricePerGram();
  const metalValue = pricePerGram * weight;
  const makingValue = metalValue * (makingCharge / 100);
  const subtotal = metalValue + makingValue;
  const gstValue = includeGST ? subtotal * 0.03 : 0;
  const total = subtotal + gstValue;

  const handleCopy = () => {
    const text = `Metal: ${metalType.toUpperCase()}\nWeight: ${weight}g\nBase Price: ₹${metalValue.toFixed(2)}\nMaking (${makingCharge}%): ₹${makingValue.toFixed(2)}\nGST (3%): ₹${gstValue.toFixed(2)}\nTotal: ₹${total.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Breakdown copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col card-elevated gold-ring-hover">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2.5">
          <Calculator className="w-5 h-5 text-gold" />
          <h2 className="text-xl font-display font-semibold text-foreground">Rate Calculator</h2>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div className="space-y-3">
          <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Purity / Metal</Label>
          <div className="grid grid-cols-4 gap-2">
            {(['24k', '22k', '18k', 'silver'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMetalType(type)}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold border transition-all duration-300",
                  metalType === type 
                    ? "bg-gold text-black border-gold shadow-gold-glow" 
                    : "bg-muted/50 border-border/50 text-muted-foreground hover:border-gold/30 hover:text-foreground"
                )}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Weight (grams)</Label>
            <span className="text-sm font-price font-semibold text-gold">{weight}g</span>
          </div>
          <input
            type="number"
            value={weight || ''}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-2xl font-price focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all text-foreground"
            placeholder="0.00"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[1, 5, 8, 10, 50, 100].map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                className="px-3 py-1 rounded-full text-[10px] font-bold border border-border/50 bg-muted/30 text-muted-foreground hover:border-gold/50 hover:text-foreground transition-all uppercase"
              >
                {w}g
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Making Charges</Label>
            <span className="text-sm font-price font-semibold text-foreground">{makingCharge}%</span>
          </div>
          <Slider value={[makingCharge]} onValueChange={(vals) => setMakingCharge(vals[0])} max={25} step={1} className="py-2" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold uppercase tracking-wider">Include 3% GST</Label>
            <p className="text-[10px] text-muted-foreground italic">Standard govt tax</p>
          </div>
          <Switch checked={includeGST} onCheckedChange={setIncludeGST} />
        </div>

        <div className="mt-4 rounded-2xl bg-foreground text-background p-6 space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-gold/20 transition-all duration-500" />
          
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-background/50">Estimated Total</p>
            <div className="text-4xl font-semibold mt-1 tracking-tight">
              <AnimatedNumber value={total} />
            </div>
          </div>

          <div className="relative pt-4 border-t border-background/10 space-y-2">
            <div className="flex justify-between text-[11px] font-medium text-background/60">
              <span>Metal:</span>
              <span className="font-price text-background/80">₹{metalValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-[11px] font-medium text-background/60">
              <span>Making ({makingCharge}%):</span>
              <span className="font-price text-background/80">₹{makingValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            {includeGST && (
              <div className="flex justify-between text-[11px] font-medium text-background/60">
                <span>GST (3%):</span>
                <span className="font-price text-background/80">₹{gstValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </div>

          <Button onClick={handleCopy} className="w-full bg-gold text-black hover:bg-gold-bright transition-all font-bold rounded-xl h-11 relative overflow-hidden shadow-gold-glow">
            {copied ? (
              <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Copied</span>
            ) : (
              <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy Breakdown</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GoldCalculator);
