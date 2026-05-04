// DEPRECATED — replaced by goldApi.ts (Gold-API.com)
// Metals.Dev had a 100 req/month free limit and LME-XCU copper bug
// Gold-API.com is unlimited, no key, CORS enabled, fixes copper

import { MetalPrice } from '@/data/mockData';

const API_KEY = import.meta.env.VITE_METALS_DEV_API_KEY;
const BASE_URL = 'https://api.metals.dev/v1/latest';

const TOZ_TO_GRAM = 31.1035;

export async function fetchLivePrices(): Promise<MetalPrice[]> {
  if (!API_KEY) {
    throw new Error('VITE_METALS_DEV_API_KEY is not set in .env');
  }

  const url = `${BASE_URL}?api_key=${API_KEY}&currency=INR&unit=toz`;

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Metals.Dev API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(`Metals.Dev returned status: ${data.status}`);
  }

  const { metals, timestamp } = data;

  // Gold: INR per troy oz → per gram → per 10 grams
  const goldPer10g = Math.round((metals.gold / TOZ_TO_GRAM) * 10);

  // Silver: INR per troy oz → per gram → per 1000 grams (per kg)
  const silverPerKg = Math.round((metals.silver / TOZ_TO_GRAM) * 1000);

  // Metals.Dev returns copper as 'LME-XCU' in metric tonne (mt)
  // Fallback chain: try all possible key names
  const copperRaw = metals['LME-XCU'] ?? metals['copper'] ?? metals['XCU'] ?? 0;

  // LME-XCU is per metric tonne → divide by 1000 for per kg
  // But if it comes as per troy oz (some plans), convert differently
  const copperPerKg = copperRaw > 1000
    ? Math.round(copperRaw / 1000)   // metric tonne → per kg
    : Math.round(copperRaw * 32.15); // troy oz → per kg (fallback)

  const now = timestamp ?? new Date().toISOString();

  // Persistence logic for Daily Change
  const nowStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const storedRefDate = localStorage.getItem('metals_ref_date');
  const storedRefPrices = localStorage.getItem('metals_ref_prices');
  const lastKnownPrices = localStorage.getItem('metals_last_known_prices');

  let prevPrices: Record<string, number>;

  if (!storedRefPrices || storedRefDate !== nowStr) {
    // It's a new day or first visit. 
    // Yesterday's price should be the last known price from the previous session.
    if (lastKnownPrices) {
      prevPrices = JSON.parse(lastKnownPrices);
    } else {
      prevPrices = { gold: goldPer10g, silver: silverPerKg, copper: copperPerKg };
    }
    // Set this as the reference for today
    localStorage.setItem('metals_ref_prices', JSON.stringify(prevPrices));
    localStorage.setItem('metals_ref_date', nowStr);
  } else {
    // Same day, use the stored reference
    prevPrices = JSON.parse(storedRefPrices);
  }

  const buildMetal = (
    id: string,
    name: string,
    nameHindi: string,
    symbol: string,
    todayPrice: number,
    unit: string
  ): MetalPrice => {
    const yesterdayPrice = prevPrices[id] ?? todayPrice;
    const change = todayPrice - yesterdayPrice;
    
    // Improved percent precision for small movements
    let changePercent = 0;
    if (yesterdayPrice !== 0) {
      const rawPercent = (change / yesterdayPrice) * 100;
      // If the change is very small but not zero, show at least 2 decimals
      changePercent = Number(rawPercent.toFixed(Math.abs(rawPercent) < 0.01 && change !== 0 ? 3 : 2));
    }

    return { id, name, nameHindi, symbol, todayPrice, yesterdayPrice, change, changePercent, unit, updated: now };
  };

  const prices: MetalPrice[] = [
    buildMetal('gold', 'Gold', 'सोना', 'XAU', goldPer10g, '10 grams (24K)'),
    buildMetal('silver', 'Silver', 'चांदी', 'XAG', silverPerKg, 'per kg'),
    buildMetal('copper', 'Copper', 'तांबा', 'XCU', copperPerKg, 'per kg'),
  ];

  // Store current prices as 'last known' for the next day's reference
  localStorage.setItem('metals_last_known_prices', JSON.stringify({
    gold: goldPer10g,
    silver: silverPerKg,
    copper: copperPerKg,
  }));

  return prices;
}

export function isMetalsDevConfigured(): boolean {
  return !!import.meta.env.VITE_METALS_DEV_API_KEY;
}
