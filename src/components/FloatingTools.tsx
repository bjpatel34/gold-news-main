import { useState, useEffect } from 'react';
import { Wrench, X, Calculator, Zap, BrainCircuit, Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FloatingToolsProps {
  onOpenCalculator: () => void;
}

const FloatingTools = ({ onOpenCalculator }: FloatingToolsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsShared(true);
    toast.success('Terminal link copied!', {
      description: 'Share GoldPolice with your network.',
    });
    setTimeout(() => setIsShared(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const menuItems = [
    {
      icon: <Calculator className="w-5 h-5" />,
      label: 'Calculator',
      onClick: () => { onOpenCalculator(); setIsOpen(false); },
      color: 'bg-gold text-background',
      style: { transitionDelay: '0ms' }
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Signals',
      onClick: () => scrollToSection('market-signals'),
      color: 'bg-chart-up text-background',
      style: { transitionDelay: '50ms' }
    },
    {
      icon: <BrainCircuit className="w-5 h-5" />,
      label: 'Intelligence',
      onClick: () => scrollToSection('intelligence'),
      color: 'bg-chart-down text-background',
      style: { transitionDelay: '100ms' }
    },
    {
      icon: isShared ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />,
      label: 'Share',
      onClick: handleShare,
      color: 'bg-blue-500 text-white',
      style: { transitionDelay: '150ms' }
    },
  ];

  return (
    <div className="fixed bottom-20 left-8 z-50 flex flex-col items-start gap-4">
      {/* Expanded Menu Items */}
      <div className={cn(
        "flex flex-col items-start gap-3 transition-all duration-300 ease-out origin-bottom",
        isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-50 pointer-events-none"
      )}>
        {menuItems.map((item, index) => (
          <div key={index} className="flex flex-row-reverse items-center gap-3 group">
            <span className={cn(
              "px-3 py-1.5 rounded-lg bg-card border border-border/50 text-[11px] font-bold uppercase tracking-wider text-foreground shadow-xl opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0",
              isOpen && "opacity-0"
            )}>
              {item.label}
            </span>
            <button
              onClick={item.onClick}
              style={item.style}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95",
                item.color,
                isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}
              title={item.label}
            >
              {item.icon}
            </button>
          </div>
        ))}
      </div>

      {/* Main Trigger Button */}
      <button
        onClick={toggleMenu}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-500 hover:scale-105 active:scale-90 relative overflow-hidden group",
          isOpen ? "bg-card text-foreground rotate-90" : "bg-gold text-background"
        )}
        aria-label="Toggle tools menu"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Wrench className="w-6 h-6" />
            <span className="text-[8px] font-bold uppercase tracking-tighter">Tools</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingTools;
