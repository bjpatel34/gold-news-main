/**
 * Mock data for Daily Gold News
 * Used when API keys are not configured (DEMO mode)
 * Prices are in INR (Indian Rupees)
 */

export interface MetalPrice {
  id: string;
  name: string;
  nameHindi: string;
  symbol: string;
  todayPrice: number;       // Price per 10 grams for Gold/Silver, per kg for Copper
  yesterdayPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  updated: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  description: string;
  metal: 'gold' | 'silver' | 'copper' | 'all';
  url: string;
}

// Current date for mock data
const now = new Date();
const today = now.toISOString();

// Mock metal prices in INR
export const mockPrices: MetalPrice[] = [
  {
    id: 'gold',
    name: 'Gold',
    nameHindi: 'सोना',
    symbol: 'XAU',
    todayPrice: 72450,      // ₹72,450 per 10 grams (24K)
    yesterdayPrice: 71980,
    change: 470,
    changePercent: 0.65,
    unit: '10 grams (24K)',
    updated: today,
  },
  {
    id: 'silver',
    name: 'Silver',
    nameHindi: 'चांदी',
    symbol: 'XAG',
    todayPrice: 89500,      // ₹89,500 per kg
    yesterdayPrice: 88200,
    change: 1300,
    changePercent: 1.47,
    unit: 'per kg',
    updated: today,
  },
  {
    id: 'copper',
    name: 'Copper',
    nameHindi: 'तांबा',
    symbol: 'XCU',
    todayPrice: 825,        // ₹825 per kg
    yesterdayPrice: 830,
    change: -5,
    changePercent: -0.60,
    unit: 'per kg',
    updated: today,
  },
];

// Mock news items focused on Indian gold/silver/copper market
export const mockNews: NewsItem[] = [
  {
    id: '1',
    headline: 'Gold prices rise ahead of wedding season',
    source: 'Economic Times',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Gold prices in India increased as jewellers stock up for the upcoming wedding season. Demand from tier-2 and tier-3 cities remains strong.',
    metal: 'gold',
    url: '#',
  },
  {
    id: '2',
    headline: 'Silver demand grows among small investors',
    source: 'Mint',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    description: 'Silver is becoming popular among retail investors looking for affordable precious metal investments. Experts suggest silver could outperform in coming months.',
    metal: 'silver',
    url: '#',
  },
  {
    id: '3',
    headline: 'Akshaya Tritiya 2025: Best time to buy gold?',
    source: 'India Today',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    description: 'Jewellers expect strong sales during Akshaya Tritiya. Many families are planning gold purchases for upcoming weddings and festivals.',
    metal: 'gold',
    url: '#',
  },
  {
    id: '4',
    headline: 'Copper prices stable despite global volatility',
    source: 'Business Standard',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    description: 'Indian copper market remains stable. Industrial demand continues to support prices even as international markets see fluctuations.',
    metal: 'copper',
    url: '#',
  },
  {
    id: '5',
    headline: 'Government may reduce import duty on gold',
    source: 'The Hindu',
    time: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    description: 'Reports suggest the government is considering reducing import duty on gold to curb smuggling and make gold more affordable for consumers.',
    metal: 'gold',
    url: '#',
  },
  {
    id: '6',
    headline: 'Silver jewellery gains popularity in metros',
    source: 'Deccan Herald',
    time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    description: 'Young consumers in metropolitan cities are increasingly choosing silver jewellery for its affordability and trendy designs.',
    metal: 'silver',
    url: '#',
  },
  {
    id: '7',
    headline: 'Hallmarking now mandatory for gold jewellery',
    source: 'PTI',
    time: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    description: 'The government has made hallmarking mandatory for gold jewellery in more districts. This ensures consumers get pure gold.',
    metal: 'gold',
    url: '#',
  },
  {
    id: '8',
    headline: 'Copper demand rises in construction sector',
    source: 'Financial Express',
    time: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    description: 'Growing infrastructure projects across India are driving copper demand. The construction sector accounts for major copper consumption.',
    metal: 'copper',
    url: '#',
  },
];

// Keywords for price change analysis
export const priceChangeKeywords = {
  increase: {
    gold: ['wedding', 'festive', 'demand', 'akshaya', 'diwali', 'dhanteras', 'global uncertainty', 'dollar weak', 'inflation', 'investment'],
    silver: ['industrial', 'solar', 'investment', 'affordable', 'demand', 'festive'],
    copper: ['construction', 'infrastructure', 'electric vehicle', 'demand', 'industrial'],
  },
  decrease: {
    gold: ['profit booking', 'dollar strong', 'import duty', 'selling', 'low demand'],
    silver: ['profit booking', 'oversupply', 'weak demand'],
    copper: ['weak demand', 'oversupply', 'global slowdown'],
  },
};
