import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetalPrice } from '@/data/mockData';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'ai';
  text: string;
  time: string;
}

interface AiPriceBotProps {
  prices: MetalPrice[];
}

const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_MODEL = 'mistral-small-latest'; // Free tier model — fast + capable

const MessageContent = ({ text }: { text: string }) => {
  // Simple formatter for bullet points, prices and bold text
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
        const cleanLine = isBullet ? line.trim().substring(2) : line;

        // Bold prices, percentages and items in **bold**
        const formatted = cleanLine
          .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-foreground">$1</span>')
          .replace(/(₹[\d,]+(\.\d+)?|(\+|-)?\d+(\.\d+)?%)/g, '<span class="font-price font-bold text-gold">$1</span>');

        if (isBullet) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-gold shrink-0">•</span>
              <span className="text-sm" dangerouslySetInnerHTML={{ __html: formatted }} />
            </div>
          );
        }

        return <p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
      })}
    </div>
  );
};

const AiPriceBot = ({ prices }: AiPriceBotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRequestPending = useRef(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const gold = prices.find(p => p.id === 'gold');
  const silver = prices.find(p => p.id === 'silver');
  const copper = prices.find(p => p.id === 'copper');

  const goldPriceNum = gold?.todayPrice || 0;
  const silverPriceNum = silver?.todayPrice || 0;
  const ratio = goldPriceNum && silverPriceNum ? (goldPriceNum / (silverPriceNum / 1000)).toFixed(1) : 'N/A';

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    if (isRequestPending.current) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Please wait for my previous response before asking again.',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      }]);
      return;
    }

    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    if (!apiKey) {
      toast.error('AI Analyst not configured', {
        description: 'Please add VITE_MISTRAL_API_KEY to your .env file and restart the dev server.',
      });
      return;
    }

    const userMessage = text;
    const newMessage: Message = {
      role: 'user',
      text: userMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage].slice(-10));
    setInput('');
    setIsTyping(true);
    isRequestPending.current = true;

    try {
      const systemPrompt = `You are POLICE AI, an expert gold and silver market analyst 
for Indian investors. You speak in a friendly, helpful tone. 
Keep all answers under 120 words. 
Use bullet points for lists. 
Always show prices in Indian Rupees (₹).
Never give direct buy/sell advice — always end investment suggestions with 
"(Not financial advice — consult your advisor)".

LIVE MARKET DATA RIGHT NOW — use these exact numbers in your answers:
- Gold (24K): ₹${gold?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per 10 grams
  Day Change (24h): ${(gold?.dailyChange ?? 0) >= 0 ? '+' : ''}₹${gold?.dailyChange ?? 0} (${gold?.dailyChangePercent ?? 0}%)
- Silver: ₹${silver?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per kg  
  Day Change (24h): ${(silver?.dailyChange ?? 0) >= 0 ? '+' : ''}₹${silver?.dailyChange ?? 0} (${silver?.dailyChangePercent ?? 0}%)
- Copper: ₹${copper?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per kg
  Day Change (24h): ${(copper?.dailyChange ?? 0) >= 0 ? '+' : ''}₹${copper?.dailyChange ?? 0} (${copper?.dailyChangePercent ?? 0}%)
- Gold/Silver ratio: ${ratio ?? 'N/A'}`;

      const response = await fetch(MISTRAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-4).map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: userMessage },
          ],
          max_tokens: 220,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('RATE_LIMIT');
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data.choices?.[0]?.message?.content?.trim()
        ?? 'Sorry, I could not get a response right now. Please try again.';

      const botMessage: Message = {
        role: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage].slice(-10));
      startCooldown(32);

    } catch (error: any) {
      const isRateLimit = error?.message === 'RATE_LIMIT';
      const errorMsg = isRateLimit
        ? '⏳ Mistral free tier allows 2 requests/minute. Please wait 30 seconds and try again.'
        : '⚠️ Could not connect to AI. Check your API key and network connection.';

      setMessages(prev => [...prev, {
        role: 'ai',
        text: errorMsg,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsTyping(false);
      isRequestPending.current = false;
    }
  };

  const suggestions = [
    "Should I buy gold today?",
    "Is silver a good investment now?",
    "Why is gold price changing?",
    "Compare gold vs silver"
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-6 z-50 w-20 h-28 bg-transparent border-none p-0 cursor-pointer group"
        aria-label="Open Police AI assistant"
        style={{ filter: isOpen ? 'drop-shadow(0 0 15px rgba(183,149,42,0.4))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
      >
        <style>{`
          @keyframes officer-idle {
            0%,100% { transform: translateY(0) rotate(0deg); }
            30% { transform: translateY(-5px) rotate(-1.5deg); }
            70% { transform: translateY(-3px) rotate(1deg); }
          }
          @keyframes officer-wave {
            0%,100% { transform: rotate(0deg); }
            20% { transform: rotate(28deg); }
            40% { transform: rotate(-8deg); }
            60% { transform: rotate(22deg); }
            80% { transform: rotate(-4deg); }
          }
          @keyframes officer-blink {
            0%,95%,100% { transform: scaleY(1); }
            97% { transform: scaleY(0.08); }
          }
          @keyframes badge-shine {
            0%,100% { opacity:1; }
            50% { opacity:0.55; }
          }
          @keyframes shadow-breathe {
            0%,100% { transform:scaleX(1); opacity:0.18; }
            50% { transform:scaleX(0.82); opacity:0.09; }
          }
          .officer-body { animation: officer-idle 3.2s ease-in-out infinite; transform-origin: center bottom; }
          .officer-wave-arm { animation: officer-wave 2.8s ease-in-out infinite; transform-origin: 88px 92px; }
          .officer-eyes { animation: officer-blink 5s ease-in-out infinite; transform-origin: center; }
          .officer-badge { animation: badge-shine 2.5s ease-in-out infinite; }
          .officer-shadow { animation: shadow-breathe 3.2s ease-in-out infinite; transform-origin: center; }
          .group:hover .officer-body { animation: none; transform: translateY(-10px) scale(1.05); transition: transform 0.2s ease; }
        `}</style>

        <svg width="80" height="120" viewBox="0 0 120 175" xmlns="http://www.w3.org/2000/svg">
          <ellipse className="officer-shadow" cx="60" cy="172" rx="28" ry="5" fill="#000" opacity="0.18" />
          <g className="officer-body">
            <ellipse cx="44" cy="162" rx="14" ry="6" fill="#4A2C0A" />
            <ellipse cx="76" cy="162" rx="14" ry="6" fill="#3D2408" />
            <rect x="34" y="155" width="20" height="10" rx="4" fill="#5C3510" />
            <rect x="66" y="155" width="20" height="10" rx="4" fill="#4A2C0A" />
            <rect x="32" y="117" width="56" height="8" rx="2" fill="#5C3010" />
            <rect x="52" y="117" width="16" height="8" rx="1" fill="#8C7030" />
            <rect x="56" y="119" width="8" height="4" rx="1" fill="#C4A040" />
            <rect x="34" y="123" width="22" height="38" rx="4" fill="#8C7A50" />
            <rect x="64" y="123" width="22" height="38" rx="4" fill="#7A6A44" />
            <rect x="28" y="78" width="64" height="48" rx="8" fill="#C8B068" />
            <rect x="40" y="88" width="16" height="12" rx="2" fill="#B8A050" stroke="#A8902A" strokeWidth="0.5" />
            <rect x="43" y="85" width="10" height="4" rx="1" fill="#A89030" />
            <rect x="40" y="100" width="5" height="3" rx="0.5" fill="#E04040" />
            <rect x="46" y="100" width="5" height="3" rx="0.5" fill="#F0C040" />
            <rect x="52" y="100" width="5" height="3" rx="0.5" fill="#4090E0" />
            <g className="officer-wave-arm">
              <rect x="82" y="82" width="18" height="38" rx="9" fill="#D4B870" />
              <circle cx="91" cy="122" r="8" fill="#C8935A" />
            </g>
            <rect x="20" y="82" width="18" height="36" rx="9" fill="#C8A858" />
            <circle cx="29" cy="120" r="8" fill="#B8835A" />
            <rect x="25" y="76" width="20" height="8" rx="3" fill="#A89030" />
            <rect x="75" y="76" width="20" height="8" rx="3" fill="#A89030" />
            <line x1="27" y1="79" x2="43" y2="79" stroke="#C8B040" strokeWidth="1" />
            <line x1="77" y1="79" x2="93" y2="79" stroke="#C8B040" strokeWidth="1" />
            <rect x="50" y="66" width="20" height="16" rx="4" fill="#C8935A" />
            <ellipse cx="60" cy="52" rx="26" ry="28" fill="#C8935A" />
            <ellipse cx="34" cy="54" rx="6" ry="8" fill="#B8835A" />
            <ellipse cx="86" cy="54" rx="6" ry="8" fill="#B8835A" />
            <ellipse cx="60" cy="26" rx="32" ry="5" fill="#6A5020" opacity="0.3" />
            <ellipse cx="60" cy="26" rx="30" ry="6" fill="#7A6028" />
            <rect x="32" y="12" width="56" height="18" rx="8" fill="#8C7030" />
            <rect x="34" y="12" width="52" height="14" rx="6" fill="#9A7C38" />
            <rect x="32" y="24" width="56" height="5" fill="#6A1010" />
            <g className="officer-badge">
              <polygon points="60,10 63,16 70,16 65,20 67,27 60,23 53,27 55,20 50,16 57,16" fill="#C0A030" stroke="#E8C040" strokeWidth="0.5" />
              <circle cx="60" cy="19" r="4" fill="#8090D0" stroke="#6070B0" strokeWidth="0.5" />
            </g>
            <path d="M46 44 Q52 40 56 43" stroke="#3A2008" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M64 43 Q68 40 74 44" stroke="#3A2008" strokeWidth="2" fill="none" strokeLinecap="round" />
            <g className="officer-eyes">
              <ellipse cx="51" cy="50" rx="6" ry="6" fill="#fff" />
              <ellipse cx="51" cy="51" rx="3.5" ry="3.5" fill="#1A1008" />
              <ellipse cx="52.5" cy="49.5" rx="1" ry="1" fill="#fff" />
              <ellipse cx="69" cy="50" rx="6" ry="6" fill="#fff" />
              <ellipse cx="69" cy="51" rx="3.5" ry="3.5" fill="#1A1008" />
              <ellipse cx="70.5" cy="49.5" rx="1" ry="1" fill="#fff" />
            </g>
            <path d="M58 56 Q60 62 62 56" stroke="#A87040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M51 65 Q56 69 60 66 Q64 69 69 65" stroke="#2A1808" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M53 70 Q60 76 67 70" stroke="#C07040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M48 84 Q42 90 38 98" stroke="#2040A0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        {/* Name tag below character */}
        {!isOpen && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gold/90 backdrop-blur-sm text-[#1A1000] text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-gold/20 whitespace-nowrap uppercase tracking-wider">
            POLICE AI
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div className={cn(
        "fixed bottom-24 right-8 z-50 w-[95vw] sm:w-[400px] h-[580px] max-h-[80vh] bg-card/95 backdrop-blur-xl border border-gold/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden transition-all duration-500 cubic-bezier(0.22, 1, 0.36, 1) origin-bottom-right",
        isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95 pointer-events-none"
      )}>
        {/* Header */}
        <div className="h-16 px-6 border-b border-gold/10 flex items-center justify-between bg-gold/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-display font-bold text-foreground leading-none">POLICE AI</span>
              <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-bold mt-1">Smart Commodity Analyst</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gold/10 text-muted-foreground hover:text-gold transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-3 bg-gold/5 border-b border-gold/10 overflow-x-auto scrollbar-none flex gap-2 no-scrollbar">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={cooldown > 0}
              className="text-[11px] bg-background/50 backdrop-blur-sm border border-gold/20 hover:border-gold hover:bg-gold/10 rounded-full px-4 py-2 whitespace-nowrap transition-all text-foreground/80 font-semibold disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="flex flex-col gap-2 max-w-[90%]">
            <div className="flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-widest px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> POLICE
            </div>
            <div className="bg-muted/50 backdrop-blur-sm text-foreground p-4 rounded-2xl rounded-bl-none text-sm leading-relaxed border border-border/50 shadow-sm">
              <p>👋 Namaste! I'm <b>POLICE</b>, your personal gold and silver analyst.</p>
              <p className="mt-2 text-muted-foreground">Ask me about current trends, prices, or if it's a good time to invest.</p>
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex flex-col gap-2 max-w-[90%]",
              m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              {m.role === 'ai' && (
                <div className="flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-widest px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> POLICE
                </div>
              )}
              <div className={cn(
                "p-4 rounded-2xl shadow-sm border",
                m.role === 'user'
                  ? "bg-gold text-background font-medium rounded-br-none border-gold/20"
                  : "bg-card text-foreground rounded-bl-none border-gold/10"
              )}>
                {m.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{m.text}</p>
                ) : (
                  <MessageContent text={m.text} />
                )}
              </div>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-tighter px-2">
                {m.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col gap-2 max-w-[90%]">
              <div className="flex items-center gap-2 text-[10px] text-gold font-bold uppercase tracking-widest px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> POLICE
              </div>
              <div className="bg-muted/50 p-4 rounded-2xl rounded-bl-none w-20 flex items-center justify-center gap-1.5 border border-border/50 shadow-sm">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-0" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-150" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-background/80 backdrop-blur-md border-t border-gold/10">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3"
          >
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  cooldown > 0
                    ? `Wait ${cooldown}s...`
                    : 'Ask your market question...'
                }
                className="w-full bg-muted/30 border border-gold/10 group-hover:border-gold/30 focus:border-gold focus:ring-4 focus:ring-gold/5 rounded-2xl px-5 py-3 text-sm transition-all outline-none pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  cooldown > 0 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-gold shadow-[0_0_8px_rgba(183,149,42,0.5)]"
                )} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isTyping || cooldown > 0 || !input.trim()}
              className="w-12 h-12 rounded-2xl bg-gold text-background flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_8px_20px_rgba(183,149,42,0.3)] group"
            >
              {cooldown > 0 ? (
                <span className="text-xs font-bold">{cooldown}</span>
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AiPriceBot;
