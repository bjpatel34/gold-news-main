import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price with appropriate decimal places
export function formatPrice(price: number, symbol: string): string {
  if (symbol === 'XCU' || symbol === 'copper') {
    return price.toFixed(3);
  }
  if (symbol === 'XAG' || symbol === 'silver') {
    return price.toFixed(2);
  }
  return price.toFixed(2);
}

// Format change with + or - sign
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}`;
}

// Format percentage change
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

// Get color class based on value (positive/negative)
export function getChangeColorClass(value: number): string {
  if (value > 0) return 'text-chart-up';
  if (value < 0) return 'text-chart-down';
  return 'text-muted-foreground';
}

// Get background color class based on value
export function getChangeBgClass(value: number): string {
  if (value > 0) return 'bg-chart-up/10 text-chart-up';
  if (value < 0) return 'bg-chart-down/10 text-chart-down';
  return 'bg-muted text-muted-foreground';
}

// Format relative time (e.g., "2h ago", "30m ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format time for display
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

// Detect metal tags from text content
export function detectMetalTags(text: string): ('gold' | 'silver' | 'copper')[] {
  const lowerText = text.toLowerCase();
  const tags: ('gold' | 'silver' | 'copper')[] = [];
  
  if (lowerText.includes('gold') || lowerText.includes('xau')) {
    tags.push('gold');
  }
  if (lowerText.includes('silver') || lowerText.includes('xag')) {
    tags.push('silver');
  }
  if (lowerText.includes('copper') || lowerText.includes('xcu')) {
    tags.push('copper');
  }
  
  return tags;
}

// Simple sentiment analysis based on keyword matching
export function analyzeSentiment(texts: string[]): { positive: number; negative: number; neutral: number } {
  const positiveWords = [
    'surge', 'rally', 'gain', 'rise', 'climb', 'soar', 'jump', 'advance', 'bullish',
    'record', 'high', 'strong', 'boost', 'outperform', 'growth', 'demand', 'accelerate'
  ];
  
  const negativeWords = [
    'fall', 'drop', 'decline', 'plunge', 'crash', 'bearish', 'weak', 'low',
    'concern', 'risk', 'uncertainty', 'volatile', 'slump', 'deficit', 'shortfall'
  ];

  let positive = 0;
  let negative = 0;

  texts.forEach(text => {
    const lowerText = text.toLowerCase();
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positive++;
    });
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negative++;
    });
  });

  const total = positive + negative || 1;
  return {
    positive: Math.round((positive / total) * 100),
    negative: Math.round((negative / total) * 100),
    neutral: Math.round(100 - (positive / total) * 100 - (negative / total) * 100),
  };
}

// Calculate simple support and resistance levels
export function calculateLevels(prices: number[]): { support: number; resistance: number } {
  if (prices.length === 0) {
    return { support: 0, resistance: 0 };
  }
  
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const lowerQuartile = Math.floor(sortedPrices.length * 0.25);
  const upperQuartile = Math.floor(sortedPrices.length * 0.75);
  
  return {
    support: sortedPrices[lowerQuartile] || sortedPrices[0],
    resistance: sortedPrices[upperQuartile] || sortedPrices[sortedPrices.length - 1],
  };
}

// Get metal color class
export function getMetalColorClass(metal: string): string {
  switch (metal.toLowerCase()) {
    case 'gold':
    case 'xau':
      return 'bg-gold/20 text-gold border-gold/30';
    case 'silver':
    case 'xag':
      return 'bg-silver/20 text-silver border-silver/30';
    case 'copper':
    case 'xcu':
      return 'bg-copper/20 text-copper border-copper/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// Get metal gradient class
export function getMetalGradient(metal: string): string {
  switch (metal.toLowerCase()) {
    case 'gold':
    case 'xau':
      return 'from-gold/20 to-gold/5';
    case 'silver':
    case 'xag':
      return 'from-silver/20 to-silver/5';
    case 'copper':
    case 'xcu':
      return 'from-copper/20 to-copper/5';
    default:
      return 'from-muted to-muted/50';
  }
}

// Check if running in live mode
export function isLiveMode(): boolean {
  return !!(import.meta.env.VITE_NEWS_API_KEY && import.meta.env.VITE_PRICE_API_URL);
}
