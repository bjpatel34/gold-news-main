import { useState, useEffect, useCallback } from "react";
import { MetalPrice } from "@/data/mockData";

// ---------------------------------------------------------
//  Types — raw GoldAPI.io response shape from our backend
// ---------------------------------------------------------

/** Single metal object returned by /api/metals */
interface GoldApiMetal {
  timestamp: number;
  metal: string;
  currency: string;
  exchange: string;
  symbol: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  open_time: number;
  price: number;
  ch: number;
  chp: number;
  ask: number;
  bid: number;
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_21k: number;
  price_gram_18k: number;
}

/** Combined response from GET /api/metals */
interface MetalsApiResponse {
  success: boolean;
  mode: string;
  isMock: boolean;
  data: {
    gold: GoldApiMetal;
    silver: GoldApiMetal;
    copper: GoldApiMetal;
  };
  error?: string;
}

/** Return type of the hook — easy to destructure */
export interface UseMetalPricesReturn {
  data: MetalPrice[] | null;
  loading: boolean;
  error: string | null;
  mode: 'production' | 'development' | null;
  lastUpdated: number | null;
  refetch: () => void;
}

// ---------------------------------------------------------
//  Config
// ---------------------------------------------------------
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ---------------------------------------------------------
//  Transformer
//  Converts the raw GoldAPI shape into the MetalPrice
//  format that our existing UI components expect.
// ---------------------------------------------------------
function transformToMetalPrice(
  raw: GoldApiMetal,
  id: string,
  name: string,
  nameHindi: string,
  unit: string,
  isMock: boolean
): MetalPrice {
  const TROY_OUNCE_TO_GRAMS = 31.1035;
  
  let todayPrice = 0;
  
  if (isMock) {
    // Mock data is already localized (Gold per 10g, Silver per kg)
    todayPrice = Math.round(raw.price);
  } else {
    // Live data is typically per Troy Ounce (precious metals)
    if (id === "gold") {
      todayPrice = Math.round((raw.price / TROY_OUNCE_TO_GRAMS) * 10);
    } else if (id === "silver") {
      todayPrice = Math.round((raw.price / TROY_OUNCE_TO_GRAMS) * 1000);
    } else {
      // Base metals (Copper etc.) or already localized API values
      todayPrice = Math.round(raw.price);
    }
  }

  const yesterdayPrice = Math.round(todayPrice - (todayPrice * raw.chp) / 100);

  return {
    id,
    name,
    nameHindi,
    symbol: raw.metal,
    todayPrice,
    yesterdayPrice,
    change: Math.round(todayPrice - yesterdayPrice),
    changePercent: Number(raw.chp.toFixed(2)),
    unit,
    updated: new Date(raw.timestamp * 1000).toISOString(),
  };
}

// ---------------------------------------------------------
//  Hook
// ---------------------------------------------------------

/**
 * Fetches Gold & Silver prices from our Express backend
 * and transforms the data into the MetalPrice[] shape that
 * the existing UI components (MetalPriceCards, PriceReason,
 * etc.) already consume.
 *
 * @example
 * const { data, loading, error, refetch } = useMetalPrices();
 */
export function useMetalPrices(): UseMetalPricesReturn {
  const [data, setData] = useState<MetalPrice[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'production' | 'development' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/metals`);

      // Handle non-2xx responses
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ||
            `Server responded with ${response.status}: ${response.statusText}`
        );
      }

      const json: MetalsApiResponse = await response.json();

      if (!json.success || !json.data) {
        throw new Error(json.error || "Unexpected response format from server.");
      }

      // Safety check: ensure all required metals exist in the response
      if (!json.data.gold || !json.data.silver || !json.data.copper) {
        console.error("Partial data received from server:", json.data);
        throw new Error("Market data for one or more metals is currently unavailable.");
      }

      // Transform the raw API data into MetalPrice[] for the UI
      const prices: MetalPrice[] = [
        transformToMetalPrice(
          json.data.gold,
          "gold",
          "Gold",
          "सोना",
          "10 grams (24K)",
          json.isMock
        ),
        transformToMetalPrice(
          json.data.silver,
          "silver",
          "Silver",
          "चांदी",
          "per kg",
          json.isMock
        ),
        transformToMetalPrice(
          json.data.copper,
          "copper",
          "Copper",
          "तांबा",
          "per kg",
          json.isMock
        ),
      ];

      setData(prices);
      setMode(json.mode === 'production' ? 'production' : 'development');
      setLastUpdated(Date.now());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message);
      console.error("useMetalPrices fetch failed:", message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount + Polling (every 8 hours)
  useEffect(() => {
    fetchPrices();

    const intervalId = setInterval(() => {
      fetchPrices();
    }, 28800000); // 8 hours = 28,800,000 ms

    return () => clearInterval(intervalId);
  }, [fetchPrices]);

  // Expose a manual refetch for retry / refresh buttons
  const refetch = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  return { data, loading, error, mode, lastUpdated, refetch };
}
