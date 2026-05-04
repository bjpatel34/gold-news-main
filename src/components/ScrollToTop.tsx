import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-24 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
      }`}
      style={{ background: 'linear-gradient(135deg, hsl(var(--gold-dim)), hsl(var(--gold-light)))' }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-[18px] h-[18px] text-black/80" />
    </button>
  );
};

export default ScrollToTop;
