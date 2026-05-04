import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "@/data/mockData";

export interface UseNewsReturn {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  isDemo: boolean;
  refetch: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Fetches latest market news from the Express backend.
 */
export function useNews(query: string = "gold silver india"): UseNewsReturn {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/news?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.data) {
        setNews(json.data);
        setIsDemo(json.isMock);
      } else {
        throw new Error(json.error || "Failed to fetch news");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("useNews fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchNews();
    
    // Refresh news every 30 minutes
    const interval = setInterval(fetchNews, 1800000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return { news, loading, error, isDemo, refetch: fetchNews };
}
