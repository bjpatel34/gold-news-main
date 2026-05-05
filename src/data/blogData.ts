export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML string
  category: 'gold' | 'silver' | 'copper' | 'general';
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number; // minutes
  featured: boolean;
  coverEmoji: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
}

export const blogPosts: BlogPost[] = [
  // ─── GOLD ARTICLES ───────────────────────────────────
  {
    id: '1',
    slug: 'why-gold-price-rises-india',
    title: 'Why Does Gold Price Rise? 7 Key Factors Every Indian Investor Must Know',
    excerpt: 'Gold prices in India are influenced by global and local factors. From US dollar strength to wedding season demand — here is everything that moves the gold market.',
    category: 'gold',
    tags: ['gold price', 'gold investment', 'mcx gold', 'gold factors'],
    author: 'GoldPolice Research',
    publishedAt: '2026-05-01',
    readTime: 6,
    featured: true,
    coverEmoji: '',
    coverImage: '/images/blog/why-gold-price-rises.png',
    metaTitle: 'Why Does Gold Price Rise in India? 7 Key Factors — GoldPolice',
    metaDescription: 'Learn why gold prices rise and fall in India. Understand the 7 key factors — US dollar, inflation, RBI policy, import duty, wedding demand, global tensions and ETF flows.',
    content: `
      <h2>Why Does Gold Price Move Every Day?</h2>
      <p>Gold is one of the most traded commodities in the world. In India, it holds special cultural and financial significance. But why does the price change daily — sometimes by thousands of rupees per 10 grams? Here are the 7 key factors that drive gold prices in India.</p>

      <h2>1. US Dollar Strength (Most Important Factor)</h2>
      <p>Gold is priced internationally in US Dollars (USD). When the dollar gets stronger, gold becomes more expensive for countries like India that buy it in USD. This directly raises the gold price in INR even if the international price stays the same.</p>
      <p><strong>Example:</strong> If gold is $3,000/oz and USD-INR rate moves from ₹83 to ₹95, the price in India jumps from ₹80,000 to ₹91,800 per 10 grams — a ₹11,800 increase with zero change in international price.</p>

      <h2>2. Inflation and Interest Rates</h2>
      <p>Gold is called an "inflation hedge." When inflation rises, the purchasing power of cash falls. Investors move money into gold to protect their wealth. Higher inflation = higher gold demand = higher gold price.</p>
      <p>When central banks (like the US Federal Reserve or RBI) raise interest rates, gold prices usually fall because investors can now earn returns from deposits and bonds instead.</p>

      <h2>3. Geopolitical Tensions and War</h2>
      <p>Gold is a "safe haven" asset. Whenever there is war, political uncertainty, or global crisis — investors worldwide rush to buy gold as protection. The Russia-Ukraine war in 2022 pushed gold to record highs. Any global instability pushes Indian gold prices up.</p>

      <h2>4. India's Import Duty and GST</h2>
      <p>India imports over 90% of its gold. The government charges 6% customs duty + 3% GST on imported gold. If the government raises or lowers import duty, gold prices in India change immediately — even if international prices are flat.</p>
      <p><strong>Key insight:</strong> India's retail gold price = International price × USD-INR rate + 6% duty + 3% GST + jeweller margin.</p>

      <h2>5. Wedding and Festival Season Demand</h2>
      <p>India is the world's second-largest gold consumer. Wedding seasons (October-December and April-May) and festivals like Akshaya Tritiya, Diwali, and Dhanteras drive massive demand. Higher demand → higher prices.</p>
      <p>Jewellers stock up before these seasons, which can push local prices 1-3% higher than international benchmarks.</p>

      <h2>6. Central Bank Gold Purchases</h2>
      <p>The Reserve Bank of India (RBI) and other central banks buy gold to diversify their reserves away from the US dollar. When central banks buy large quantities of gold, it reduces global supply and pushes prices up. RBI has been consistently buying gold since 2023.</p>

      <h2>7. Gold ETF Flows</h2>
      <p>Large institutional investors buy gold through ETFs (Exchange Traded Funds). When ETF inflows are high, demand increases. Platforms like Gold BeES on NSE track domestic demand trends. You can use this as a sentiment indicator for near-term price direction.</p>

      <h2>How to Use This Knowledge</h2>
      <p>Watch the USD-INR rate daily — it is the single most impactful factor for Indian gold buyers. If the rupee is weakening, gold is likely to rise even if international prices are flat. Monitor the GoldPolice live rate tracker to stay ahead of price movements.</p>

      <p><em>Disclaimer: This article is for educational purposes only. Gold prices are subject to market risks. Consult a SEBI-registered advisor before investing.</em></p>
    `,
  },

  {
    id: '2',
    slug: '24k-vs-22k-vs-18k-gold-difference',
    title: '24K vs 22K vs 18K Gold — Which Should You Buy in India?',
    excerpt: 'Confused between 24K, 22K and 18K gold? This complete guide explains purity, price difference, best use case and what to buy for jewellery vs investment in India.',
    category: 'gold',
    tags: ['24k gold', '22k gold', '18k gold', 'gold purity', 'gold jewellery'],
    author: 'GoldPolice Research',
    publishedAt: '2026-04-28',
    readTime: 5,
    featured: true,
    coverEmoji: '💎',
    coverImage: '/images/blog/gold-purity.png',
    metaTitle: '24K vs 22K vs 18K Gold Difference India — Which to Buy? GoldPolice',
    metaDescription: 'Complete guide to 24K, 22K and 18K gold in India. Learn the purity difference, price gap, and which karat is best for jewellery vs investment.',
    content: `
      <h2>Understanding Gold Purity — What Does "K" Mean?</h2>
      <p>The "K" in gold stands for Karat — a measure of gold purity out of 24 parts. 24K means 24 out of 24 parts are pure gold (99.9% pure). 22K means 22 out of 24 parts are gold (91.6% pure). The remaining parts are other metals like silver, copper, or zinc.</p>

      <h2>24K Gold — Pure Gold</h2>
      <p><strong>Purity:</strong> 99.9% pure gold<br/>
      <strong>Best for:</strong> Investment, gold coins, gold bars, digital gold, Sovereign Gold Bonds<br/>
      <strong>Not suitable for:</strong> Daily wear jewellery (too soft, bends easily)<br/>
      <strong>Price:</strong> Highest — this is the base reference price</p>
      <p>24K gold is the purest form and holds maximum resale value. If you are buying gold purely as an investment, 24K coins or bars are the best option. Gold ETFs and Sovereign Gold Bonds also track 24K price.</p>

      <h2>22K Gold — Jewellery Gold</h2>
      <p><strong>Purity:</strong> 91.6% pure gold<br/>
      <strong>Best for:</strong> Traditional Indian jewellery — necklaces, bangles, chains<br/>
      <strong>Price:</strong> 91.6% of 24K price<br/>
      <strong>Example:</strong> If 24K is ₹1,50,000 per 10g, 22K is ₹1,37,400 per 10g</p>
      <p>22K is the most popular gold for jewellery in India. It is hard enough to hold shape but pure enough to retain high resale value. Most traditional jewellers in India work with 22K gold.</p>

      <h2>18K Gold — Studded Jewellery Gold</h2>
      <p><strong>Purity:</strong> 75% pure gold<br/>
      <strong>Best for:</strong> Diamond-studded jewellery, western-style jewellery, rings<br/>
      <strong>Price:</strong> 75% of 24K price<br/>
      <strong>Example:</strong> If 24K is ₹1,50,000 per 10g, 18K is ₹1,12,500 per 10g</p>
      <p>18K is harder and more durable than 22K, making it ideal for intricate designs and diamond settings. Most branded jewellers like Tanishq and CaratLane sell 18K jewellery for contemporary designs.</p>

      <h2>Quick Comparison Table</h2>
      <table>
        <tr><th>Karat</th><th>Purity</th><th>Best Use</th><th>Resale Value</th></tr>
        <tr><td>24K</td><td>99.9%</td><td>Investment</td><td>Highest</td></tr>
        <tr><td>22K</td><td>91.6%</td><td>Traditional jewellery</td><td>High</td></tr>
        <tr><td>18K</td><td>75.0%</td><td>Studded jewellery</td><td>Medium</td></tr>
        <tr><td>14K</td><td>58.5%</td><td>Fashion jewellery</td><td>Lower</td></tr>
      </table>

      <h2>Which Should You Buy?</h2>
      <p><strong>For investment:</strong> Buy 24K coins/bars or Sovereign Gold Bonds. Zero making charges, highest purity, best resale.<br/>
      <strong>For traditional jewellery:</strong> Buy 22K. Best balance of purity and durability.<br/>
      <strong>For diamond/studded jewellery:</strong> Buy 18K. Harder metal holds stones better.</p>

      <h2>Always Check the Hallmark</h2>
      <p>Since 2021, hallmarking is mandatory in India. Look for the BIS hallmark stamp on all gold jewellery. The stamp shows: BIS logo + Karat purity (24K/22K/18K) + HUID (unique 6-digit alphanumeric code). Never buy gold without a hallmark — it protects you from fraud.</p>

      <p><em>Disclaimer: For educational purposes only. Prices vary by jeweller and location. Always verify with your local jeweller.</em></p>
    `,
  },

  // ─── SILVER ARTICLES ─────────────────────────────────
  {
    id: '3',
    slug: 'silver-price-india-why-it-moves',
    title: 'Silver Price in India — Why It Moves More Than Gold (And How to Profit)',
    excerpt: 'Silver is more volatile than gold because it has industrial uses. Learn what drives silver prices in India, the Gold-Silver ratio strategy and when to buy silver.',
    category: 'silver',
    tags: ['silver price india', 'silver investment', 'gold silver ratio', 'mcx silver'],
    author: 'GoldPolice Research',
    publishedAt: '2026-04-25',
    readTime: 7,
    featured: true,
    coverEmoji: '',
    coverImage: '/images/blog/silver-price.png',
    metaTitle: 'Silver Price India — Why It Moves & When to Buy | GoldPolice',
    metaDescription: 'Learn why silver prices in India are more volatile than gold. Understand industrial demand, Gold-Silver ratio, solar panel boom and when to invest in silver.',
    content: `
      <h2>Why Silver Is the "Poor Man's Gold" — But Smarter</h2>
      <p>Silver is often dismissed as a cheaper alternative to gold. But experienced commodity investors know that silver can outperform gold by 3-5x during a bull market. Here is why silver moves so dramatically and how Indian investors can take advantage.</p>

      <h2>Silver Has Two Roles — Metal and Industrial Material</h2>
      <p>Unlike gold which is mostly held as jewellery or investment, over 50% of silver demand is industrial. Silver is used in:</p>
      <ul>
        <li><strong>Solar panels</strong> — Each solar panel uses ~20 grams of silver</li>
        <li><strong>Electronics</strong> — Smartphones, laptops, circuit boards</li>
        <li><strong>Electric vehicles</strong> — EV batteries and charging systems</li>
        <li><strong>Medical equipment</strong> — Silver has natural antibacterial properties</li>
        <li><strong>Photography and mirrors</strong> — Traditional uses still active</li>
      </ul>
      <p>This industrial demand makes silver price sensitive to economic cycles. When the economy booms, silver rises faster than gold. When recession hits, silver falls harder.</p>

      <h2>The Solar Panel Boom — Silver's Biggest Tailwind</h2>
      <p>India's solar energy target is 500 GW by 2030. Each GW of solar capacity requires approximately 80 tonnes of silver. This is creating massive long-term industrial demand for silver that did not exist 10 years ago. As India and China expand renewable energy, silver demand from solar alone will double by 2030.</p>

      <h2>The Gold-Silver Ratio — Your Best Buying Signal</h2>
      <p>The Gold-Silver ratio tells you how many ounces of silver it takes to buy one ounce of gold. Currently the ratio is around 80-90, meaning silver is historically cheap vs gold.</p>
      <p><strong>Historical averages:</strong></p>
      <ul>
        <li>Ancient times: 15:1 ratio</li>
        <li>20th century average: 47:1</li>
        <li>Current: ~85:1</li>
      </ul>
      <p>When the ratio is above 80, silver is considered undervalued relative to gold. Historically, buying silver when the ratio is high and switching to gold when low has been a profitable strategy. GoldPolice shows you this ratio in real-time on the Market Signals section.</p>

      <h2>What Drives Silver Price in India Specifically?</h2>
      <p><strong>1. USD-INR Rate:</strong> Like gold, silver is priced in USD internationally. A weaker rupee means higher silver prices in India.</p>
      <p><strong>2. MCX Futures:</strong> Silver futures on MCX are the benchmark for Indian silver prices. Institutional traders and jewellers use MCX rates.</p>
      <p><strong>3. Import Duty:</strong> India charges 10% import duty + 3% GST on silver, which adds a significant premium over international prices.</p>
      <p><strong>4. Silverware and Religious Demand:</strong> India has strong demand for silver utensils, idols, and coins during festivals like Diwali and Dhanteras.</p>

      <h2>When Should You Buy Silver in India?</h2>
      <p>Silver is best bought when the Gold-Silver ratio is above 80 (silver is cheap), during economic slowdowns when prices dip, and before festival season when demand picks up. Use the GoldPolice live silver tracker to monitor daily price movements and use the Market Signals section for buy/hold signals.</p>

      <p><em>Disclaimer: For educational purposes only. Silver investment carries market risk. Consult a financial advisor before investing.</em></p>
    `,
  },

  // ─── COPPER ARTICLES ─────────────────────────────────
  {
    id: '4',
    slug: 'copper-price-india-economic-indicator',
    title: 'Copper Price in India — Why "Dr. Copper" Predicts the Economy',
    excerpt: 'Copper is called "Dr. Copper" because its price predicts economic health. Learn how copper prices work in India, MCX copper trading and what rising copper prices mean for the economy.',
    category: 'copper',
    tags: ['copper price india', 'mcx copper', 'copper investment', 'commodity price'],
    author: 'GoldPolice Research',
    publishedAt: '2026-04-20',
    readTime: 5,
    featured: false,
    coverEmoji: '',
    coverImage: '/images/blog/copper-economy.png',
    metaTitle: 'Copper Price India — Dr. Copper Economic Indicator | GoldPolice',
    metaDescription: 'Learn why copper price predicts the economy. Understand MCX copper rates, India copper demand from EVs and infrastructure, and how to read copper price signals.',
    content: `
      <h2>Why Copper Is Called "Dr. Copper"</h2>
      <p>Economists and traders call copper "Dr. Copper" because its price has a PhD in predicting economic health. Unlike gold (fear) or silver (industrial+investment), copper is almost purely industrial. When economies grow, copper demand rises. When they slow, copper falls. It is one of the most reliable leading economic indicators in the world.</p>

      <h2>Where Is Copper Used?</h2>
      <p>Copper is essential in virtually every aspect of modern infrastructure:</p>
      <ul>
        <li><strong>Construction:</strong> Electrical wiring in every building</li>
        <li><strong>Electric Vehicles:</strong> Each EV uses 4x more copper than a petrol car</li>
        <li><strong>Power grids:</strong> Transmission lines and transformers</li>
        <li><strong>Electronics:</strong> Every circuit board, smartphone, and computer</li>
        <li><strong>Plumbing:</strong> Water pipes and fittings</li>
        <li><strong>Renewable energy:</strong> Wind turbines and solar installations</li>
      </ul>

      <h2>India's Copper Market</h2>
      <p>India is one of the largest copper consumers in Asia. The country's infrastructure push under programs like PM Gati Shakti and Smart Cities Mission is driving massive copper demand. India's copper consumption is expected to double by 2030 driven by EVs, renewable energy and urbanization.</p>
      <p>MCX (Multi Commodity Exchange) is where copper futures are traded in India. The standard contract is 1 MT (metric tonne). Retail copper prices in India are quoted per kilogram.</p>

      <h2>How to Read Copper Price Signals</h2>
      <p><strong>Rising copper price signals:</strong></p>
      <ul>
        <li>Economic expansion and growth</li>
        <li>Increased infrastructure spending</li>
        <li>Strong manufacturing activity</li>
        <li>Bullish signal for stock markets</li>
      </ul>
      <p><strong>Falling copper price signals:</strong></p>
      <ul>
        <li>Economic slowdown or recession risk</li>
        <li>Reduced industrial activity</li>
        <li>Bearish signal — be cautious</li>
      </ul>

      <h2>Copper vs Gold — Using Both as Signals</h2>
      <p>Experienced investors watch the Copper-to-Gold ratio. When copper rises relative to gold, it signals economic optimism (risk-on environment). When gold rises relative to copper, it signals fear and risk-off. Monitoring both on GoldPolice gives you a complete picture of market sentiment.</p>

      <p><em>Disclaimer: For educational purposes only. Commodity investments carry market risk.</em></p>
    `,
  },

  // ─── GENERAL ARTICLES ────────────────────────────────
  {
    id: '5',
    slug: 'gold-vs-silver-investment-india-2026',
    title: 'Gold vs Silver Investment in India 2026 — Which Gives Better Returns?',
    excerpt: 'Comparing gold and silver as investments for Indian investors in 2026. Returns analysis, risk comparison, liquidity, storage costs and expert view on which metal to choose.',
    category: 'general',
    tags: ['gold vs silver', 'metal investment india', 'gold returns', 'silver returns'],
    author: 'GoldPolice Research',
    publishedAt: '2026-05-03',
    readTime: 8,
    featured: true,
    coverEmoji: '⚖️',
    coverImage: '/images/blog/gold-vs-silver.png',
    metaTitle: 'Gold vs Silver Investment India 2026 — Which is Better? GoldPolice',
    metaDescription: 'Detailed comparison of gold vs silver as investments for Indians in 2026. Returns, risk, storage, liquidity and the Gold-Silver ratio strategy explained.',
    content: `
      <h2>Gold vs Silver — The Classic Investment Debate</h2>
      <p>Every Indian investor faces this question: Should I buy gold or silver? Both are precious metals, both hedge against inflation, but they behave very differently. Here is a complete 2026 comparison to help you decide.</p>

      <h2>Historical Returns Comparison (India)</h2>
      <p><strong>Gold returns (INR):</strong></p>
      <ul>
        <li>1 year (2025-2026): +18%</li>
        <li>5 years (2021-2026): +72%</li>
        <li>10 years (2016-2026): +145%</li>
      </ul>
      <p><strong>Silver returns (INR):</strong></p>
      <ul>
        <li>1 year (2025-2026): +22%</li>
        <li>5 years (2021-2026): +58%</li>
        <li>10 years (2016-2026): +110%</li>
      </ul>
      <p>Silver outperforms gold in the short term during bull markets but has higher volatility. Gold wins on consistency over very long periods.</p>

      <h2>Risk Comparison</h2>
      <p><strong>Gold risk: LOW</strong> — Gold prices are relatively stable. Daily movements are usually 0.1-0.5%. Gold rarely falls more than 2% in a single day.</p>
      <p><strong>Silver risk: MEDIUM-HIGH</strong> — Silver can move 3-5% in a single day. Industrial demand fluctuations make it more volatile. In 2020, silver crashed 30% in March then rallied 140% by August.</p>

      <h2>Liquidity</h2>
      <p><strong>Gold:</strong> Extremely liquid. Any jeweller in India buys gold immediately. Gold ETFs and Sovereign Gold Bonds can be sold on NSE instantly.</p>
      <p><strong>Silver:</strong> Less liquid than gold. Fewer buyers for large silver quantities. Silver ETFs are available but less popular. Selling physical silver in smaller cities can be difficult.</p>

      <h2>Storage and Safety</h2>
      <p><strong>Gold:</strong> High value per gram means less storage space needed. ₹10 lakh of gold fits in your palm.</p>
      <p><strong>Silver:</strong> ₹10 lakh of silver weighs about 3.7 kg and takes significant space. Bank locker costs become a factor for large silver holdings.</p>

      <h2>The Smart Strategy — Own Both</h2>
      <p>Most experienced commodity investors in India recommend a 70-30 split: 70% gold, 30% silver. Use the Gold-Silver ratio (visible on GoldPolice) to rebalance. When ratio exceeds 85, buy more silver. When it drops below 60, shift to gold.</p>

      <h2>Best Ways to Invest in India (2026)</h2>
      <p><strong>For Gold:</strong> Sovereign Gold Bonds (SGBs) are the best option — no storage cost, 2.5% annual interest, capital gains tax exempt if held 8 years, tracks 24K price.</p>
      <p><strong>For Silver:</strong> Physical silver coins from banks or certified dealers, Silver ETFs on NSE (SILVERBEES), or MCX silver futures for traders.</p>

      <p><em>Disclaimer: Past returns do not guarantee future performance. Consult a SEBI-registered advisor before investing.</em></p>
    `,
  },

  {
    id: '6',
    slug: 'how-to-calculate-gold-price-making-charges',
    title: 'How to Calculate Gold Jewellery Price With Making Charges & GST in India',
    excerpt: 'Step-by-step guide to calculate the exact price of gold jewellery in India including making charges, GST, hallmark premium and how to avoid getting cheated at the jeweller.',
    category: 'gold',
    tags: ['gold calculator', 'making charges', 'gold jewellery price', 'gst on gold'],
    author: 'GoldPolice Research',
    publishedAt: '2026-04-15',
    readTime: 4,
    featured: false,
    coverEmoji: '🧮',
    coverImage: '/images/blog/gold-calculator.png',
    metaTitle: 'How to Calculate Gold Price With Making Charges & GST India — GoldPolice',
    metaDescription: 'Step-by-step formula to calculate gold jewellery price in India. Learn making charges (5-25%), GST calculation, hallmark premium and use our free gold calculator.',
    content: `
      <h2>The Complete Gold Jewellery Price Formula</h2>
      <p>Every time you buy gold jewellery in India, the price has multiple components. Understanding each one helps you negotiate better and avoid being overcharged.</p>

      <h2>The Formula</h2>
      <p><strong>Gold Jewellery Price = (Weight in grams × Gold rate per gram) + Making Charges + GST on (Metal Value + Making Charges)</strong></p>

      <h2>Step-by-Step Example</h2>
      <p>Let us say you are buying a 10 gram gold chain in 22K gold when the 22K rate is ₹6,800 per gram:</p>
      <ol>
        <li><strong>Metal value:</strong> 10g × ₹6,800 = ₹68,000</li>
        <li><strong>Making charges (12%):</strong> 12% × ₹68,000 = ₹8,160</li>
        <li><strong>Subtotal:</strong> ₹68,000 + ₹8,160 = ₹76,160</li>
        <li><strong>GST (3%):</strong> 3% × ₹76,160 = ₹2,285</li>
        <li><strong>Total price:</strong> ₹76,160 + ₹2,285 = ₹78,445</li>
      </ol>

      <h2>Making Charges — How Much is Normal?</h2>
      <p>Making charges vary widely in India:</p>
      <ul>
        <li><strong>Machine-made chains and bangles:</strong> 5-8%</li>
        <li><strong>Standard handmade jewellery:</strong> 10-15%</li>
        <li><strong>Intricate handcrafted designs:</strong> 15-25%</li>
        <li><strong>Branded jewellers (Tanishq, Malabar):</strong> 12-18%</li>
        <li><strong>Local jewellers:</strong> 8-20%</li>
      </ul>
      <p>Always ask the jeweller to show making charges as a percentage, not a fixed amount. Compare making charges across 2-3 jewellers before buying.</p>

      <h2>Use the GoldPolice Calculator</h2>
      <p>Our free Gold Rate Calculator (available in the Calculator section) lets you instantly calculate the value of any amount of gold at current live prices. Adjust the making charges slider to match what your jeweller is charging and see if you are getting a fair deal.</p>

      <h2>Red Flags — How to Avoid Being Cheated</h2>
      <ul>
        <li>Jeweller refuses to give making charges as a percentage <span class="text-destructive font-bold">[!]</span></li>
        <li>No BIS hallmark on the jewellery <span class="text-destructive font-bold">[!]</span></li>
        <li>Gold rate shown is significantly higher than MCX or GoldPolice rate <span class="text-destructive font-bold">[!]</span></li>
        <li>Jeweller claims "special gold" that justifies a higher rate <span class="text-destructive font-bold">[!]</span></li>
        <li>No written receipt with breakdown of metal value + making charges + GST <span class="text-destructive font-bold">[!]</span></li>
      </ul>

      <p><em>Disclaimer: Gold rates vary by location. Always verify current rates on GoldPolice before visiting a jeweller.</em></p>
    `,
  },
];

export const blogCategories = [
  { id: 'all', label: 'All Articles', icon: 'Library' },
  { id: 'gold', label: 'Gold', icon: 'Coins' },
  { id: 'silver', label: 'Silver', icon: 'CircleDashed' },
  { id: 'copper', label: 'Copper', icon: 'Box' },
  { id: 'general', label: 'Market Guide', icon: 'BarChart3' },
];
