import axios from "axios";
import { mockNews } from "../data/mockData.js";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * GET /api/news
 * Fetches latest gold/silver market news.
 * Fallback to mock data if API fails or no key.
 */
export async function getNews(req, res) {
  const query = req.query.q || "gold silver india price";

  // ---- Development mode or No Key ----
  if (IS_DEV || !NEWS_API_KEY) {
    console.log("🛠️  [NEWS] Returning mock news headlines");
    return res.json({
      success: true,
      mode: "development",
      isMock: true,
      data: mockNews,
    });
  }

  // ---- Production mode ----
  try {
    // Example using GNews API
    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: query,
        token: NEWS_API_KEY,
        lang: "en",
        country: "in",
        max: 10,
      },
      timeout: 5000,
    });

    // Transform GNews shape to our app's NewsItem shape
    const articles = response.data.articles.map((article, idx) => ({
      id: `live-${idx}`,
      headline: article.title,
      source: article.source.name,
      time: article.publishedAt,
      description: article.description,
      metal: article.title.toLowerCase().includes("gold") ? "gold" : 
             article.title.toLowerCase().includes("silver") ? "silver" : 
             article.title.toLowerCase().includes("copper") ? "copper" : "all",
      url: article.url,
    }));

    return res.json({
      success: true,
      mode: "production",
      isMock: false,
      data: articles,
    });
  } catch (error) {
    console.error("❌  NewsAPI fetch failed, returning mock fallback:", error.message);
    
    return res.json({
      success: true,
      mode: "development",
      isMock: true,
      data: mockNews,
    });
  }
}
