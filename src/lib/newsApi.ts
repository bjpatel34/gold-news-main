import { NewsItem } from '@/data/mockData';

/** Shape of a single article returned by NewsData.io API */
interface NewsDataArticle {
  article_id?: string;
  title?: string;
  link?: string;
  source_name?: string;
  source_id?: string;
  pubDate?: string;
  description?: string;
  content?: string;
}

const BASE_URL = 'https://newsdata.io/api/1/news';

export function isNewsdataConfigured(): boolean {
  return !!import.meta.env.VITE_NEWSDATA_API_KEY;
}

export async function fetchCommodityNews(): Promise<NewsItem[]> {
  const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY;
  if (!apiKey) throw new Error('VITE_NEWSDATA_API_KEY not set');

  // Search for gold/silver/copper news from India, business category
  const params = new URLSearchParams({
    apikey: apiKey,
    q: 'gold OR silver OR copper OR sona OR chandi',
    country: 'in',          // India
    category: 'business',
    language: 'en',
    size: '10',             // 10 articles per call = 1 credit
  });

  const res = await fetch(`${BASE_URL}?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`NewsData API error: ${res.status}`);

  const data = await res.json();
  if (data.status !== 'success') throw new Error('NewsData returned error');

  return (data.results ?? []).slice(0, 8).map((item: NewsDataArticle): NewsItem => {
    // Detect which metal the article is about
    const text = (item.title + ' ' + (item.description ?? '')).toLowerCase();
    const metal: NewsItem['metal'] =
      text.includes('silver') || text.includes('chandi') ? 'silver'
      : text.includes('copper') ? 'copper'
      : text.includes('gold') || text.includes('sona') ? 'gold'
      : 'all';

    return {
      id: item.article_id ?? item.link,
      headline: item.title ?? 'No title',
      source: item.source_name ?? item.source_id ?? 'NewsData',
      time: item.pubDate ?? new Date().toISOString(),
      description: item.description ?? item.content ?? '',
      metal,
      url: item.link ?? '#',
    };
  });
}
