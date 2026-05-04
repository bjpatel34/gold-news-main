/**
 * Gold-API.com — Real-time precious metals prices
 * Website: https://gold-api.com
 * Docs:    https://gold-api.com/docs
 *
 * ✅ FREE — Unlimited requests to real-time price API
 * ✅ NO API KEY required
 * ✅ CORS enabled — works directly from browser/frontend
 * ✅ No rate limits on real-time endpoints
 *
 * BASE URL: https://api.gold-api.com
 *
 * ENDPOINTS USED:
 *   GET /price/XAU  → Gold   price in USD per troy oz
 *   GET /price/XAG  → Silver price in USD per troy oz
 *   GET /price/HG   → Copper price in USD per pound (lb)
 *
 * UNIT CONVERSIONS:
 *   Gold:   USD/troy_oz ÷ 31.1035 × 10 × USD_TO_INR  = INR per 10 grams
 *   Silver: USD/troy_oz ÷ 31.1035 × 1000 × USD_TO_INR = INR per kg
 *   Copper: USD/lb ÷ 0.453592 × USD_TO_INR ÷ 1000     = INR per kg
 *
 * RESPONSE FORMAT from API:
 * {
 *   "price": 3245.50,
 *   "symbol": "XAU",
 *   "timestamp": 1234567890,
 *   "currency": "USD"
 * }
 */

import { MetalPrice } from '@/data/mockData';

// ── Constants ──────────────────────────────────────────────────────────
const BASE_URL        = 'https://api.gold-api.com/price';
const TROY_OZ_TO_G    = 31.1035;   // 1 troy oz = 31.1035 grams
const LB_TO_KG        = 0.453592;  // 1 pound   = 0.453592 kg
// ── INDIA MARKET PREMIUM MULTIPLIERS ──────────────────────────────────
// These account for India's import duty + GST on bullion
// Calibrated against MCX / IBJA / Goodreturns prices — May 2026
//
// Gold:   6% customs duty + 3% GST + ~0.5% handling = ~1.085
// Silver: 10% import duty + 3% GST + ~0.5% misc     = ~1.135  
// Copper: Traded on MCX — already close, minor adjustment only
const GOLD_INDIA_FACTOR   = 1.085;
const SILVER_INDIA_FACTOR = 1.135;
const COPPER_INDIA_FACTOR = 1.02;  // minor MCX premium

// localStorage key for storing previous prices (used to compute change)
const STORAGE_KEY     = 'goldapi_prev_prices';

// ── Type for raw API response ──────────────────────────────────────────
interface GoldApiResponse {
  price:     number;
  symbol:    string;
  timestamp?: number;
  currency?: string;
}

// ── Fetch a single symbol ──────────────────────────────────────────────
async function fetchSymbol(symbol: string): Promise<GoldApiResponse> {
  const res = await fetch(`${BASE_URL}/${symbol}`, {
    method:  'GET',
    headers: { 'Accept': 'application/json' },
    cache:   'no-store',
  });

  if (!res.ok) {
    throw new Error(
      `Gold-API.com returned ${res.status} for symbol ${symbol}`
    );
  }

  const data = await res.json();

  if (typeof data.price !== 'number' || data.price <= 0) {
    throw new Error(
      `Gold-API.com returned invalid price for ${symbol}: ${JSON.stringify(data)}`
    );
  }

  return data as GoldApiResponse;
}

/**
 * Fetch live USD → INR exchange rate
 * Provider: ExchangeRate-API (open.er-api.com)
 * Free · No API key · No rate limits · CORS enabled
 * Docs: https://www.exchangerate-api.com/docs/free
 *
 * Endpoint: GET https://open.er-api.com/v6/latest/USD
 * Response: { "base_code": "USD", "rates": { "INR": 94.87 }, ... }
 */
async function fetchUSDtoINR(): Promise<number> {
  const FALLBACK_RATE = 94.87; // May 2026 fallback — updated if API fails

  try {
    const res = await fetch(
      'https://open.er-api.com/v6/latest/USD',
      {
        method:  'GET',
        headers: { 'Accept': 'application/json' },
        cache:   'no-store',
      }
    );

    if (!res.ok) {
      console.warn(`Frankfurter currency API returned ${res.status}, using fallback rate`);
      return FALLBACK_RATE;
    }

    const data = await res.json();
    const rate = data?.rates?.INR;

    if (typeof rate !== 'number' || rate <= 0) {
      console.warn('Invalid INR rate from Frankfurter API, using fallback');
      return FALLBACK_RATE;
    }

    // Cache the rate in localStorage so we have a fallback even if API is slow
    try {
      localStorage.setItem('usd_inr_rate', JSON.stringify({
        rate,
        fetchedAt: Date.now(),
      }));
    } catch (_) {}

    return rate;

  } catch (err) {
    console.warn('Frankfurter API fetch failed:', err);

    // Try to use cached rate from localStorage (max 24 hours old)
    try {
      const cached = localStorage.getItem('usd_inr_rate');
      if (cached) {
        const { rate: cachedRate, fetchedAt } = JSON.parse(cached);
        const ageMs = Date.now() - fetchedAt;
        const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours
        if (ageMs < maxAgeMs && typeof cachedRate === 'number' && cachedRate > 0) {
          console.info(`Using cached USD→INR rate: ${cachedRate} (${Math.round(ageMs / 3600000)}h old)`);
          return cachedRate;
        }
      }
    } catch (_) {}

    return FALLBACK_RATE;
  }
}

// ── Always configured — no API key needed ─────────────────────────────
export function isGoldApiConfigured(): boolean {
  return true;
}

// ── Main export: fetch all metal prices ───────────────────────────────
export async function fetchLivePrices(): Promise<MetalPrice[]> {
  // Fetch live currency rate + all metal prices simultaneously
  // All 4 fire in parallel — no extra time cost
  const [usdInr, goldData, silverData, copperData] = await Promise.all([
    fetchUSDtoINR(),     // live USD→INR rate from ECB via frankfurter.app
    fetchSymbol('XAU'),  // Gold   — USD per troy oz
    fetchSymbol('XAG'),  // Silver — USD per troy oz
    fetchSymbol('HG'),   // Copper — USD per pound
  ]);

  // Gold: USD/toz → INR/toz → INR/g → INR/10g × India factor
  const goldPer10g = Math.round(
    (goldData.price / TROY_OZ_TO_G) * 10 * usdInr * GOLD_INDIA_FACTOR
  );

  // Silver: USD/toz → INR/toz → INR/g → INR/kg × India factor
  const silverPerKg = Math.round(
    (silverData.price / TROY_OZ_TO_G) * 1000 * usdInr * SILVER_INDIA_FACTOR
  );

  // Copper: USD/lb → INR/kg × minor MCX premium
  const copperPerKg = Math.round(
    (copperData.price / LB_TO_KG) * usdInr * COPPER_INDIA_FACTOR
  );

  console.info(
    `💱 Live rates fetched | USD→INR: ₹${usdInr.toFixed(2)} | ` +
    `Gold: ₹${goldPer10g.toLocaleString('en-IN')}/10g | ` +
    `Silver: ₹${silverPerKg.toLocaleString('en-IN')}/kg | ` +
    `Copper: ₹${copperPerKg.toLocaleString('en-IN')}/kg`
  );

  const timestamp = new Date().toISOString();

  // ── Load previous prices from localStorage ────────────────────────
  // Used to compute today's change amount and change %
  let prev: Record<string, number> = {
    gold:   goldPer10g,
    silver: silverPerKg,
    copper: copperPerKg,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate stored data has all keys
      if (parsed.gold && parsed.silver && parsed.copper) {
        prev = parsed;
      }
    }
  } catch (_) {
    // localStorage not available or corrupt — use today's price as baseline
  }

  // ── Build MetalPrice objects ───────────────────────────────────────
  function buildMetal(
    id:           string,
    name:         string,
    nameHindi:    string,
    symbol:       string,
    todayPrice:   number,
    unit:         string,
  ): MetalPrice {
    const yesterdayPrice  = prev[id] ?? todayPrice;
    const change          = todayPrice - yesterdayPrice;
    const changePercent   = yesterdayPrice !== 0
      ? Number(((change / yesterdayPrice) * 100).toFixed(2))
      : 0;

    return {
      id,
      name,
      nameHindi,
      symbol,
      todayPrice,
      yesterdayPrice,
      change,
      changePercent,
      unit,
      updated: timestamp,
    };
  }

  const prices: MetalPrice[] = [
    buildMetal('gold',   'Gold',   'सोना',  'XAU', goldPer10g,  '10 grams (24K)'),
    buildMetal('silver', 'Silver', 'चांदी', 'XAG', silverPerKg, 'per kg'),
    buildMetal('copper', 'Copper', 'तांबा', 'HG',  copperPerKg, 'per kg'),
  ];

  // ── Persist today's prices as tomorrow's "previous" ───────────────
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      gold:   goldPer10g,
      silver: silverPerKg,
      copper: copperPerKg,
    }));
  } catch (_) {
    // Ignore localStorage errors
  }

  return prices;
}

// ── Optional: fetch price history (10 req/hour on free plan) ──────────
// Usage: fetchPriceHistory('XAU', '1D') → array of { price, timestamp }
export async function fetchPriceHistory(
  symbol: string,
  period: '1D' | '1W' | '1M' | '1Y' = '1W'
): Promise<{ price: number; timestamp: string }[]> {
  const res = await fetch(
    `https://api.gold-api.com/price/${symbol}/history?period=${period}`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Gold-API history error ${res.status}`);
  }

  const data = await res.json();

  // Fetch live exchange rate
  const usdInr = await fetchUSDtoINR();

  // Convert to INR and return
  const toINR = symbol === 'HG'
    ? (usd: number) => Math.round((usd / LB_TO_KG) * usdInr * COPPER_INDIA_FACTOR)
    : symbol === 'XAG'
    ? (usd: number) => Math.round((usd / TROY_OZ_TO_G) * 1000 * usdInr * SILVER_INDIA_FACTOR)
    : (usd: number) => Math.round((usd / TROY_OZ_TO_G) * 10   * usdInr * GOLD_INDIA_FACTOR);

  return (data.items ?? data ?? []).map((item: any) => ({
    price:     toINR(item.price ?? item.close ?? 0),
    timestamp: item.timestamp ?? item.date ?? '',
  }));
}
