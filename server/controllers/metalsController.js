// =========================================================
//  Metals Controller
//  Returns Gold (XAU), Silver (XAG) and Copper (XCU) prices.
//  Currently in MOCK ONLY mode as requested.
// =========================================================

import { mockGold, mockSilver, mockCopper } from "../data/mockData.js";

// ---------------------------------------------------------
//  GET /api/metals
//  Returns Gold & Silver prices in a unified response.
// ---------------------------------------------------------
export async function getMetals(_req, res) {
  console.log("🛠️  Returning mock metal prices");
  return res.json({
    success: true,
    mode: "development",
    isMock: true,
    data: {
      gold: mockGold,
      silver: mockSilver,
      copper: mockCopper,
    },
  });
}

// ---------------------------------------------------------
//  GET /api/metals/:symbol
//  Returns a single metal's price (e.g. /api/metals/XAU).
// ---------------------------------------------------------
export async function getMetalBySymbol(req, res) {
  const symbol = req.params.symbol?.toUpperCase();

  // Validate symbol
  const ALLOWED = ["XAU", "XAG", "XCU"];
  if (!ALLOWED.includes(symbol)) {
    return res.status(400).json({
      success: false,
      error: `Invalid symbol "${symbol}". Allowed: ${ALLOWED.join(", ")}`,
    });
  }

  let mock;
  if (symbol === "XAU") mock = mockGold;
  else if (symbol === "XAG") mock = mockSilver;
  else mock = mockCopper;
  
  console.log(`🛠️  Returning mock ${symbol} price`);
  return res.json({ success: true, mode: "development", isMock: true, data: mock });
}
