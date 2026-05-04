export function generateMockHistory(
  basePrice: number,
  days: number,
  volatility: number = 0.008
): { date: string; price: number }[] {
  const data = [];
  let price = basePrice;
  const now = Date.now();
  
  // To make the current price match the base price, we iterate backwards and calculate past prices
  // But for a simple sparkline, we can just generate a series ending at the basePrice
  const results = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(now - (days - i) * 24 * 60 * 60 * 1000);
    // Simple random walk
    if (i > 0) {
      currentPrice = Math.round(currentPrice * (1 + (Math.random() - 0.48) * volatility));
    }
    results.push({
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      price: currentPrice,
    });
  }
  
  return results;
}
