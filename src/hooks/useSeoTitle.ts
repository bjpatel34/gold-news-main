import { useEffect } from 'react';
import { MetalPrice } from '@/data/mockData';

export function useSeoTitle(prices: MetalPrice[]) {
useEffect(() => {
if (!prices || prices.length === 0) return;
const gold = prices.find(p => p.id === 'gold');
const silver = prices.find(p => p.id === 'silver');
if (!gold || !silver) return;

const gFmt = gold.todayPrice.toLocaleString('en-IN');
const sFmt = silver.todayPrice.toLocaleString('en-IN');
const sym = gold.change >= 0 ? '▲' : '▼';
const today = new Date().toLocaleDateString('en-IN', {
  day: 'numeric', month: 'short', year: 'numeric',
});

// Dynamic title — shows live prices in Google search results
document.title =
  `Gold Rate ₹${gFmt}/10g ${sym} | Silver ₹${sFmt}/kg | ${today} — Assetory`;

// Update meta description
const desc = document.querySelector('meta[name="description"]');
if (desc) {
  desc.setAttribute('content',
    `Today's live 24K gold rate in India is ₹${gFmt} per 10 grams. ` +
    `Silver rate is ₹${sFmt} per kg. ` +
    `Real-time MCX & IBJA prices. Free gold calculator with making charges & GST.`
  );
}

// Update OG title
const ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) {
  ogTitle.setAttribute('content',
    `Gold Rate ₹${gFmt}/10g | Silver ₹${sFmt}/kg | Live India Rate — Assetory`
  );
}

// Update OG description
const ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc) {
  ogDesc.setAttribute('content',
    `Live 24K gold rate ₹${gFmt}/10g. Silver ₹${sFmt}/kg. ` +
    `Real-time India prices, karat calculator & gold market news.`
  );
}

// Update Twitter title
const twTitle = document.querySelector('meta[name="twitter:title"]');
if (twTitle) {
  twTitle.setAttribute('content',
    `Gold Rate ₹${gFmt}/10g | Silver ₹${sFmt}/kg | Assetory India`
  );
}
}, [prices]);
}
