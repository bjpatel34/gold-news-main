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
      // ── Mistral AI API call ─────────────────────────────────────
      const systemPrompt = `You are POLICE AI, an expert gold and silver market analyst 
for Indian investors. You speak in a friendly, helpful tone. 
Keep all answers under 100 words — be concise and clear.
Always show prices in Indian Rupees (₹).
Never give direct buy/sell advice — always end investment suggestions with 
"(Not financial advice — consult your advisor)".

LIVE MARKET DATA RIGHT NOW — use these exact numbers in your answers:
- Gold (24K): ₹${gold?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per 10 grams
  Today's change: ${(gold?.change ?? 0) >= 0 ? '+' : ''}₹${gold?.change ?? 0} (${gold?.changePercent ?? 0}%)
- Silver: ₹${silver?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per kg  
  Today's change: ${(silver?.change ?? 0) >= 0 ? '+' : ''}₹${silver?.change ?? 0} (${silver?.changePercent ?? 0}%)
- Copper: ₹${copper?.todayPrice?.toLocaleString('en-IN') ?? 'N/A'} per kg
  Today's change: ${(copper?.change ?? 0) >= 0 ? '+' : ''}₹${copper?.change ?? 0} (${copper?.changePercent ?? 0}%)
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
            {
              role: 'system',
              content: systemPrompt,
            },
            // Include last 4 messages for context (keeps tokens low)
            ...messages.slice(-4).map(m => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 180,      // ~100 words — keeps responses tight
          temperature: 0.7,     // balanced creativity
          safe_prompt: false,   // we handle safety ourselves
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('RATE_LIMIT');
        }
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
      startCooldown(32); // 32 seconds = safe buffer above 30s Mistral limit

    } catch (error: any) {
      const isRateLimit = error?.message === 'RATE_LIMIT';
      const errorMsg = isRateLimit
        ? '⏳ Mistral free tier allows 2 requests/minute. Please wait 30 seconds and try again.'
        : '⚠️ Could not connect to AI. Check your VITE_MISTRAL_API_KEY in .env and restart the server.';

      setMessages(prev => [...prev, {
        role: 'ai' as const,
        text: errorMsg,
        time: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
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
        style={{ filter: isOpen ? 'drop-shadow(0 0-12px rgba(183,149,42,0.8))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
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
            {/* Shoes */}
            <ellipse cx="44" cy="162" rx="14" ry="6" fill="#4A2C0A" />
            <ellipse cx="76" cy="162" rx="14" ry="6" fill="#3D2408" />
            <rect x="34" y="155" width="20" height="10" rx="4" fill="#5C3510" />
            <rect x="66" y="155" width="20" height="10" rx="4" fill="#4A2C0A" />
            {/* Belt */}
            <rect x="32" y="117" width="56" height="8" rx="2" fill="#5C3010" />
            <rect x="52" y="117" width="16" height="8" rx="1" fill="#8C7030" />
            <rect x="56" y="119" width="8" height="4" rx="1" fill="#C4A040" />
            {/* Pants */}
            <rect x="34" y="123" width="22" height="38" rx="4" fill="#8C7A50" />
            <rect x="64" y="123" width="22" height="38" rx="4" fill="#7A6A44" />
            {/* Shirt body */}
            <rect x="28" y="78" width="64" height="48" rx="8" fill="#C8B068" />
            <rect x="40" y="88" width="16" height="12" rx="2" fill="#B8A050" stroke="#A8902A" strokeWidth="0.5" />
            <rect x="43" y="85" width="10" height="4" rx="1" fill="#A89030" />
            <rect x="40" y="100" width="5" height="3" rx="0.5" fill="#E04040" />
            <rect x="46" y="100" width="5" height="3" rx="0.5" fill="#F0C040" />
            <rect x="52" y="100" width="5" height="3" rx="0.5" fill="#4090E0" />
            {/* Wave arm */}
            <g className="officer-wave-arm">
              <rect x="82" y="82" width="18" height="38" rx="9" fill="#D4B870" />
              <circle cx="91" cy="122" r="8" fill="#C8935A" />
            </g>
            {/* Left arm */}
            <rect x="20" y="82" width="18" height="36" rx="9" fill="#C8A858" />
            <circle cx="29" cy="120" r="8" fill="#B8835A" />
            {/* Epaulettes */}
            <rect x="25" y="76" width="20" height="8" rx="3" fill="#A89030" />
            <rect x="75" y="76" width="20" height="8" rx="3" fill="#A89030" />
            <line x1="27" y1="79" x2="43" y2="79" stroke="#C8B040" strokeWidth="1" />
            <line x1="77" y1="79" x2="93" y2="79" stroke="#C8B040" strokeWidth="1" />
            {/* Neck */}
            <rect x="50" y="66" width="20" height="16" rx="4" fill="#C8935A" />
            {/* Head */}
            <ellipse cx="60" cy="52" rx="26" ry="28" fill="#C8935A" />
            <ellipse cx="34" cy="54" rx="6" ry="8" fill="#B8835A" />
            <ellipse cx="86" cy="54" rx="6" ry="8" fill="#B8835A" />
            {/* Cap */}
            <ellipse cx="60" cy="26" rx="32" ry="5" fill="#6A5020" opacity="0.3" />
            <ellipse cx="60" cy="26" rx="30" ry="6" fill="#7A6028" />
            <rect x="32" y="12" width="56" height="18" rx="8" fill="#8C7030" />
            <rect x="34" y="12" width="52" height="14" rx="6" fill="#9A7C38" />
            <rect x="32" y="24" width="56" height="5" fill="#6A1010" />
            {/* Badge */}
            <g className="officer-badge">
              <polygon points="60,10 63,16 70,16 65,20 67,27 60,23 53,27 55,20 50,16 57,16" fill="#C0A030" stroke="#E8C040" strokeWidth="0.5" />
              <circle cx="60" cy="19" r="4" fill="#8090D0" stroke="#6070B0" strokeWidth="0.5" />
            </g>
            {/* Eyebrows */}
            <path d="M46 44 Q52 40 56 43" stroke="#3A2008" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M64 43 Q68 40 74 44" stroke="#3A2008" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Eyes */}
            <g className="officer-eyes">
              <ellipse cx="51" cy="50" rx="6" ry="6" fill="#fff" />
              <ellipse cx="51" cy="51" rx="3.5" ry="3.5" fill="#1A1008" />
              <ellipse cx="52.5" cy="49.5" rx="1" ry="1" fill="#fff" />
              <ellipse cx="69" cy="50" rx="6" ry="6" fill="#fff" />
              <ellipse cx="69" cy="51" rx="3.5" ry="3.5" fill="#1A1008" />
              <ellipse cx="70.5" cy="49.5" rx="1" ry="1" fill="#fff" />
            </g>
            {/* Nose */}
            <path d="M58 56 Q60 62 62 56" stroke="#A87040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Moustache */}
            <path d="M51 65 Q56 69 60 66 Q64 69 69 65" stroke="#2A1808" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Smile */}
            <path d="M53 70 Q60 76 67 70" stroke="#C07040" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Whistle cord */}
            <path d="M48 84 Q42 90 38 98" stroke="#2040A0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        {/* Name tag below character */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#B7952A',
            color: '#1A1000',
            fontSize: '10px',
            fontWeight: '600',
            padding: '3px 10px',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
          }}>
            POLICE
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div className={cn(
        "fixed bottom-24 right-8 z-50 w-[90vw] sm:w-[380px] h-[520px] max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-out origin-bottom-right",
        isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95 pointer-events-none"
      )}>
        {/* Header */}
        <div className="h-12 px-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <div className="flex flex-col">
              <span className="text-sm font-display font-bold text-foreground leading-none">POLICE AI</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">POWERED BY GOLDPolice
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Questions */}
        <div className="px-4 py-3 bg-muted/10 border-b border-border overflow-x-auto scrollbar-none flex gap-2 no-scrollbar">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              disabled={cooldown > 0}
              className="text-[11px] bg-muted border border-border/50 hover:border-gold/30 hover:bg-gold/5 rounded-full px-3 py-1.5 whitespace-nowrap transition-all text-foreground/80 font-medium disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {/* Welcome Message */}
          <div className="flex flex-col gap-1 max-w-[85%]">
            <div className="flex items-center gap-1.5 text-[10px] text-gold font-bold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" /> POLICE
            </div>
            <div className="bg-muted text-foreground p-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">
              👋 Namaste! I'm POLICE. Ask me anything about today's gold & silver prices.
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex flex-col gap-1 max-w-[85%]",
              m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              {m.role === 'ai' && (
                <div className="flex items-center gap-1.5 text-[10px] text-gold font-bold uppercase tracking-wider mb-0.5">
                  <Sparkles className="w-3 h-3" /> POLICE
                </div>
              )}
              <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                m.role === 'user'
                  ? "bg-gold/15 text-foreground rounded-br-sm border border-gold/10"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}>
                {m.text}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                {m.time}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="flex items-center gap-1.5 text-[10px] text-gold font-bold uppercase tracking-wider mb-0.5">
                <Sparkles className="w-3 h-3" /> POLICE
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-bl-sm w-16 flex items-center justify-center gap-1 shadow-sm">
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce delay-0" />
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce delay-150" />
                <div className="w-1 h-1 bg-gold rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-background border-t border-border">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                cooldown > 0
                  ? `Please wait ${cooldown}s before next question...`
                  : 'Ask about gold prices...'
              }
              className="flex-1 bg-muted/50 border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/50 rounded-xl px-4 py-2 text-sm transition-all outline-none"
            />
            <button
              type="submit"
              disabled={isTyping || cooldown > 0 || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gold text-background flex items-center justify-center hover:scale-105 active:scale-90 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg text-[10px] font-bold"
              aria-label={cooldown > 0 ? `Wait ${cooldown}s` : 'Send message'}
            >
              {cooldown > 0 ? (
                <span className="text-xs font-price font-medium">{cooldown}s</span>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AiPriceBot;
