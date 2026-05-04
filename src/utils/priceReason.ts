/**
 * Price Reason Utility
 * Generates human-readable explanations for price changes
 * Uses rule-based keyword matching from news headlines
 */

import { MetalPrice, NewsItem, priceChangeKeywords } from '@/data/mockData';

interface PriceReason {
  metal: string;
  direction: 'up' | 'down' | 'stable';
  reason: string;
  confidence: 'high' | 'medium' | 'low';
}

// Analyze news headlines to find keywords
function findKeywordsInNews(news: NewsItem[], metal: string): string[] {
  const metalNews = news.filter(
    (n) => n.metal === metal || n.metal === 'all'
  );

  const allText = metalNews
    .map((n) => `${n.headline} ${n.description}`)
    .join(' ')
    .toLowerCase();

  const foundKeywords: string[] = [];

  // Check increase keywords
  const increaseKeywords = priceChangeKeywords.increase[metal as keyof typeof priceChangeKeywords.increase] || [];
  increaseKeywords.forEach((keyword) => {
    if (allText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  // Check decrease keywords
  const decreaseKeywords = priceChangeKeywords.decrease[metal as keyof typeof priceChangeKeywords.decrease] || [];
  decreaseKeywords.forEach((keyword) => {
    if (allText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  });

  return [...new Set(foundKeywords)];
}

// Generate human-readable reason
function generateReason(
  metal: MetalPrice,
  keywords: string[]
): string {
  const metalName = metal.name;
  const isUp = metal.change > 0;
  const isStable = Math.abs(metal.changePercent) < 0.1;

  if (isStable) {
    return `${metalName} prices remained stable today with minimal change.`;
  }

  // Default reasons if no keywords found
  const defaultReasons = {
    gold: {
      up: 'Gold prices increased due to steady demand from jewellery buyers and investors.',
      down: 'Gold prices decreased as some buyers took profits after recent gains.',
    },
    silver: {
      up: 'Silver prices rose due to growing interest from small investors.',
      down: 'Silver prices fell slightly due to profit booking.',
    },
    copper: {
      up: 'Copper prices increased on strong industrial demand.',
      down: 'Copper prices decreased due to slower industrial activity.',
    },
  };

  if (keywords.length === 0) {
    const metalKey = metal.id as keyof typeof defaultReasons;
    return defaultReasons[metalKey]?.[isUp ? 'up' : 'down'] ||
      `${metalName} prices ${isUp ? 'increased' : 'decreased'} today.`;
  }

  // Build reason from keywords
  const keywordText = keywords.slice(0, 2).join(' and ');

  if (isUp) {
    switch (metal.id) {
      case 'gold':
        if (keywords.some(k => ['wedding', 'festive', 'akshaya', 'diwali', 'dhanteras'].includes(k))) {
          return `Gold prices increased today due to higher ${keywordText} demand.`;
        }
        if (keywords.some(k => ['global uncertainty', 'inflation'].includes(k))) {
          return `Gold prices rose as investors seek safety amid ${keywordText}.`;
        }
        return `Gold prices increased due to ${keywordText}.`;

      case 'silver':
        if (keywords.some(k => ['investment', 'affordable'].includes(k))) {
          return `Silver prices rose as more people see it as an ${keywordText} option.`;
        }
        return `Silver prices increased due to ${keywordText}.`;

      case 'copper':
        if (keywords.some(k => ['construction', 'infrastructure'].includes(k))) {
          return `Copper prices rose on strong ${keywordText} demand.`;
        }
        return `Copper prices increased due to ${keywordText}.`;
    }
  } else {
    switch (metal.id) {
      case 'gold':
        if (keywords.some(k => ['profit booking', 'selling'].includes(k))) {
          return `Gold prices fell as some buyers engaged in ${keywordText}.`;
        }
        return `Gold prices decreased due to ${keywordText}.`;

      case 'silver':
        return `Silver prices fell due to ${keywordText}.`;

      case 'copper':
        return `Copper prices decreased due to ${keywordText}.`;
    }
  }

  return `${metalName} prices ${isUp ? 'increased' : 'decreased'} today.`;
}

// Main function to get price reasons
export function getPriceReasons(
  prices: MetalPrice[],
  news: NewsItem[]
): PriceReason[] {
  return prices.map((metal) => {
    const keywords = findKeywordsInNews(news, metal.id);
    const reason = generateReason(metal, keywords);

    return {
      metal: metal.name,
      direction: metal.change > 0 ? 'up' : metal.change < 0 ? 'down' : 'stable',
      reason,
      confidence: keywords.length >= 2 ? 'high' : keywords.length === 1 ? 'medium' : 'low',
    };
  });
}

// Get "Who Should Care Today?" suggestions
export function getAudienceSuggestions(prices: MetalPrice[]): string[] {
  const suggestions: string[] = [];

  const gold = prices.find(p => p.id === 'gold');
  const silver = prices.find(p => p.id === 'silver');
  const copper = prices.find(p => p.id === 'copper');

  // Gold-based suggestions
  if (gold) {
    if (gold.change > 0) {
      suggestions.push('💍 Wedding families – gold prices are rising, consider buying soon');
      suggestions.push('📈 Long-term gold holders – your investment value increased today');
    } else if (gold.change < 0) {
      suggestions.push('🛒 Jewellery buyers – good day to buy gold at lower prices');
      suggestions.push('💰 First-time investors – consider starting your gold investment');
    } else {
      suggestions.push('⏳ Gold buyers – prices stable, good time to plan purchases');
    }
  }

  // Silver-based suggestions
  if (silver) {
    if (silver.change > 0) {
      suggestions.push('🪙 Silver investors – prices moving up, hold your position');
    } else if (silver.change < 0) {
      suggestions.push('🎁 Gift buyers – silver jewellery more affordable today');
    }
  }

  // Copper-based suggestions
  if (copper) {
    if (Math.abs(copper.changePercent) > 1) {
      suggestions.push('🏠 Home builders – check copper prices before electrical work');
    }
  }

  // Always include these
  suggestions.push('👨‍👩‍👧 Festival planners – track prices for upcoming celebrations');

  return suggestions.slice(0, 5);
}

// Format price in Indian format
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format change with sign
export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}₹${Math.abs(change).toLocaleString('en-IN')}`;
}

// Format percentage
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  const absPercent = Math.abs(percent);
  // Show 3 decimals for very small changes, otherwise 2
  const precision = absPercent > 0 && absPercent < 0.1 ? 3 : 2;
  return `${sign}${percent.toFixed(precision)}%`;
}

// Format relative time in simple terms
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
}

// Get metal color classes
export function getMetalColor(metal: string): {
  bg: string;
  text: string;
  border: string;
  gradient: string;
} {
  switch (metal.toLowerCase()) {
    case 'gold':
      return {
        bg: 'bg-gold/10',
        text: 'text-gold',
        border: 'border-gold/30',
        gradient: 'from-gold/20 to-gold/5',
      };
    case 'silver':
      return {
        bg: 'bg-silver/10',
        text: 'text-silver',
        border: 'border-silver/30',
        gradient: 'from-silver/20 to-silver/5',
      };
    case 'copper':
      return {
        bg: 'bg-copper/10',
        text: 'text-copper',
        border: 'border-copper/30',
        gradient: 'from-copper/20 to-copper/5',
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border',
        gradient: 'from-muted to-muted/50',
      };
  }
}

// Check if live mode
export function isLiveMode(): boolean {
  // Gold-API.com requires no key — always live
  return true;
}
